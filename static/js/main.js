var Clock = function (two, x, y, hour, minute) {
    this.x = x * 350;
    this.y = y * 350;
    this.two = two;
    this.hour = hour;
    this.minute = minute;

    this.group = two.makeGroup();
};

Clock.prototype.getRatio = function (intervals, val) {
    return ((2 * Math.PI) / intervals) * val;
};

Clock.prototype.getHandPos = function (intervals, val, length) {
    var ratio = this.getRatio(intervals, val);
    var multiplierX = Math.sin(ratio);
    var multiplierY = Math.cos(ratio);

    return {
        x: (multiplierX * length + this.x),
        y: (multiplierY * -length + this.y)
    };
};

Clock.prototype.getMinuteHandPos = function () {
    return this.getHandPos(60, this.minute, 100);
};

Clock.prototype.getHourHandPos = function () {
    var hour = this.hour + (this.minute / 60);

    return this.getHandPos(12, hour, 70);
};

Clock.prototype.renderHand = function (posFunc) {
    var handDimensions = posFunc();
    var hand = this.two.makeLine(
        this.x, this.y,
        handDimensions.x, handDimensions.y
    );
    hand.stroke = '#fff';
    hand.linewidth = 10;
    hand.cap = 'round';

    return hand;
};

Clock.prototype.renderPips = function () {
    for (var i = 0; i < 12; i++) {
        var hourRatio = this.getRatio(12, i);
        var multiplierX = Math.sin(hourRatio);
        var multiplierY = Math.cos(hourRatio);

        var pip = this.two.makeLine(
            this.x - 130 * multiplierX, this.y - 130 * multiplierY,
            this.x - 120 * multiplierX, this.y - 120 * multiplierY
        );
        pip.stroke = '#fff';
        pip.linewidth = 10;
        pip.cap = 'round';
        this.group.add(pip);
    }
};

Clock.prototype.unsetCurrent = function () {
    new TWEEN.Tween(this.group).to({opacity: 0.2, scale: 0.35}, 400).start();
};

Clock.prototype.setCurrent = function () {
    new TWEEN.Tween(this.group).to({opacity: 1, scale: 1}, 400).start();
};

Clock.prototype.render = function () {
    var outer = this.two.makeCircle(this.x, this.y, 150);
    this.group.add(outer);

    var inner = this.two.makeCircle(this.x, this.y, 140);
    this.group.add(inner);
    inner.fill = '#1f1f1f';

    var minuteHand = this.renderHand(this.getMinuteHandPos.bind(this));
    this.group.add(minuteHand);

    var hourHand = this.renderHand(this.getHourHandPos.bind(this));
    this.group.add(hourHand);

    this.renderPips();

    this.group.opacity = 0.2;
    this.group.center();
    this.group.translation.set(this.x, this.y);
    this.group.scale = 0.35;
};

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
