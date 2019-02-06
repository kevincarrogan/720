// @flow

import TWEEN from '@tweenjs/tween.js';

type Coordinates = {
    x: number,
    y: number,
};

class Clock {

    two: any;
    x: number;
    y: number;
    hour: number;
    minute: number;
    group: any;

    constructor(two: any, x: number, y: number, hour: number, minute: number) {
        this.x = x * 165;
        this.y = y * 165;
        this.two = two;
        this.hour = hour;
        this.minute = minute;

        this.group = two.makeGroup();
    }

    getRatio(intervals: number, val: number): number {
        return ((2 * Math.PI) / intervals) * val;
    }

    getHandPos(intervals: number, val: number, length: number): Coordinates {
        let ratio = this.getRatio(intervals, val);
        let multiplierX = Math.sin(ratio);
        let multiplierY = Math.cos(ratio);

        return {
            x: (multiplierX * length + this.x),
            y: (multiplierY * -length + this.y)
        };
    }

    getMinuteHandPos(): Coordinates {
        return this.getHandPos(60, this.minute, 65);
    }

    getHourHandPos(): Coordinates {
        let hour = this.hour + (this.minute / 60);

        return this.getHandPos(12, hour, 40);
    }

    renderHand(posFunc: () => Coordinates): any {
        let handDimensions = posFunc();
        let hand = this.two.makeLine(
            this.x, this.y,
            handDimensions.x, handDimensions.y
        );
        hand.stroke = '#fff';
        hand.linewidth = 5;
        hand.cap = 'round';

        return hand;
    }

    renderPips() {
        for (let i = 0; i < 12; i++) {
            let hourRatio = this.getRatio(12, i);
            let multiplierX = Math.sin(hourRatio);
            let multiplierY = Math.cos(hourRatio);

            let pip = this.two.makeLine(
                this.x - 80 * multiplierX, this.y - 80 * multiplierY,
                this.x - 75 * multiplierX, this.y - 75 * multiplierY
            );
            pip.stroke = '#fff';
            pip.linewidth = 5;
            pip.cap = 'round';
            this.group.add(pip);
        }
    }

    unsetCurrent() {
        new TWEEN.Tween(this.group).to({opacity: 0.3, scale: 0.35}, 400).start();
    }

    setCurrent() {
        new TWEEN.Tween(this.group).to({opacity: 1, scale: 1}, 400).start();
    }

    render() {
        let outer = this.two.makeCircle(this.x, this.y, 90);
        this.group.add(outer);

        let inner = this.two.makeCircle(this.x, this.y, 85);
        this.group.add(inner);
        inner.fill = '#000';

        let minuteHand = this.renderHand(this.getMinuteHandPos.bind(this));
        this.group.add(minuteHand);

        let hourHand = this.renderHand(this.getHourHandPos.bind(this));
        this.group.add(hourHand);

        this.renderPips();

        this.group.opacity = 0.3;
        this.group.center();
        this.group.translation.set(this.x, this.y);
        this.group.scale = 0.35;
    }

}

export default Clock;
