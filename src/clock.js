import TWEEN from '@tweenjs/tween.js';

class Clock {

    constructor(two, x, y, hour, minute) {
        this.x = x * 165;
        this.y = y * 165;
        this.two = two;
        this.hour = hour;
        this.minute = minute;

        this.group = two.makeGroup();
    }

    getRatio(intervals, val) {
        return ((2 * Math.PI) / intervals) * val;
    }

    getHandPos(intervals, val, length) {
        var ratio = this.getRatio(intervals, val);
        var multiplierX = Math.sin(ratio);
        var multiplierY = Math.cos(ratio);

        return {
            x: (multiplierX * length + this.x),
            y: (multiplierY * -length + this.y)
        };
    }

    getMinuteHandPos() {
        return this.getHandPos(60, this.minute, 65);
    }

    getHourHandPos() {
        var hour = this.hour + (this.minute / 60);

        return this.getHandPos(12, hour, 40);
    }

    renderHand(posFunc) {
        var handDimensions = posFunc();
        var hand = this.two.makeLine(
            this.x, this.y,
            handDimensions.x, handDimensions.y
        );
        hand.stroke = '#fff';
        hand.linewidth = 5;
        hand.cap = 'round';

        return hand;
    }

    renderPips() {
        for (var i = 0; i < 12; i++) {
            var hourRatio = this.getRatio(12, i);
            var multiplierX = Math.sin(hourRatio);
            var multiplierY = Math.cos(hourRatio);

            var pip = this.two.makeLine(
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
        var outer = this.two.makeCircle(this.x, this.y, 90);
        this.group.add(outer);

        var inner = this.two.makeCircle(this.x, this.y, 85);
        this.group.add(inner);
        inner.fill = '#000';

        var minuteHand = this.renderHand(this.getMinuteHandPos.bind(this));
        this.group.add(minuteHand);

        var hourHand = this.renderHand(this.getHourHandPos.bind(this));
        this.group.add(hourHand);

        this.renderPips();

        this.group.opacity = 0.3;
        this.group.center();
        this.group.translation.set(this.x, this.y);
        this.group.scale = 0.35;
    }

}

export default Clock;
