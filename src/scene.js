import Two from 'two.js';
import TWEEN from '@tweenjs/tween.js';
import _ from 'lodash';

import Clock from './clock';

var Scene = function (el) {
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
};

Scene.prototype.centerOnClock = function (clock) {
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
};

Scene.prototype.updateTime = function () {
    var currentDate = new Date();
    
    this.setTime((currentDate.getHours() % 12), currentDate.getMinutes());
};

Scene.prototype.setTime = function (hour, minutes) {
    var clock = this.timeMap[hour + ':' + minutes];

    if (clock !== this.currentClock) {
        this.centerOnClock(clock);
    }
}

Scene.prototype.render = function () {
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
};

export default Scene;
