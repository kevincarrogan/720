import Two from 'two.js';
import TWEEN from '@tweenjs/tween.js';
import _ from 'lodash';

import Clock from './clock';

class Scene {

    constructor(el) {
        var currentDate = new Date();

        this.el = el;

        this.two = new Two({
            height: el.clientHeight,
            width: el.clientWidth
        });

        this.timeMap = {};

        this.clocks = [];
        for (var hour = 0; hour < 12; hour++) {
            for (var minute = 0; minute < 60; minute++) {
                var clock = new Clock(this.two, minute, hour, hour, minute)
                this.clocks.push(clock);
                this.timeMap[(hour % 12) + ':' + minute] = clock;
            }
        }

        this.updateTime();

        setInterval(this.updateTime.bind(this), 500);        
    }

    centerOnClock(clock) {
        var centerX = this.two.width / 2;
        var centerY = this.two.height / 2;
        var scene = this.two.scene;

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
        var currentDate = new Date();
        
        this.setTime((currentDate.getHours() % 12), currentDate.getMinutes());
    }

    setTime(hour, minutes) {
        var clock = this.timeMap[hour + ':' + minutes];

        if (clock !== this.currentClock) {
            this.centerOnClock(clock);
        }
    }

    render() {
        var self = this;

        this.two.appendTo(this.el);

        for (var i = 0; i < this.clocks.length; i++) {
            this.clocks[i].render();
        }

        this.two.bind('update', function () { TWEEN.update(); }).play();

        var resize = _.debounce(function () {
            self.two.height = self.el.clientHeight;
            self.two.width = self.el.clientWidth;
            if (self.currentClock) {
                self.centerOnClock(self.currentClock);
            }
        }, 100);

        window.addEventListener('resize', resize);
    }

}

export default Scene;
