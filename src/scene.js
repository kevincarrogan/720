// @flow

import Two from 'two.js';
import TWEEN from '@tweenjs/tween.js';
import _ from 'lodash';

import Clock from './clock';

class Scene {

    el: Element;
    two: any;
    clocks: Array<Clock[]>;
    currentClock: Clock;

    constructor(el: Element) {
        let currentDate = new Date();

        this.el = el;

        this.two = new Two({
            height: el.clientHeight,
            width: el.clientWidth
        });

        this.clocks = [];
        for (let hour = 0; hour < 12; hour++) {
            let clocksByMinute = [];
            for (let minute = 0; minute < 60; minute++) {
                let clock = new Clock(this.two, minute, hour, hour, minute)
                clocksByMinute.push(clock);
            }
            this.clocks.push(clocksByMinute);
        }

        this.updateTime();

        setInterval(this.updateTime.bind(this), 500);        
    }

    centerOnClock(clock: Clock) {
        let centerX = this.two.width / 2;
        let centerY = this.two.height / 2;
        let scene = this.two.scene;

        if (this.currentClock) {
            this.currentClock.unsetCurrent();
        }

        clock.setCurrent();

        new TWEEN.Tween(scene.translation)
                .to({x: centerX - clock.x, y: centerY - clock.y}, 400)
                .start();

        this.currentClock = clock;
    }

    updateTime() {
        let currentDate = new Date();
        
        this.setTime((currentDate.getHours() % 12), currentDate.getMinutes());
    }

    setTime(hour: number, minutes: number) {
        let clock = this.clocks[hour][minutes];

        if (clock !== this.currentClock) {
            this.centerOnClock(clock);
        }
    }

    render() {
        this.two.appendTo(this.el);

        this.clocks.forEach(clocksByHour => {
            clocksByHour.forEach(clock => {
                clock.render();
            });
        });

        this.two.bind('update', () => { TWEEN.update(); }).play();

        let resize = _.debounce(() => {
            this.two.height = this.el.clientHeight;
            this.two.width = this.el.clientWidth;
            if (this.currentClock) {
                this.centerOnClock(this.currentClock);
            }
        }, 100);

        window.addEventListener('resize', resize);
    }

}

export default Scene;
