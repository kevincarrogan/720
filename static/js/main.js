var Clock = function (two, x, y, hour, minute) {
    this.x = x * 500 + 250;
    this.y = y * 500 + 250;
    this.two = two;
    this.hour = hour;
    this.minute = minute;

    this.group = two.makeGroup();
};

Clock.prototype.getRatio = function (intervals, val) {
    return ((2 * Math.PI) / intervals) * val;
};

Clock.prototype.getMinuteHandPos = function () {
    var minuteRatio = this.getRatio(60, this.minute);
    var multiplierX = Math.sin(minuteRatio);
    var multiplierY = Math.cos(minuteRatio);

    return {
        x: (multiplierX * 150 + this.x),
        y: (multiplierY * -150 + this.y)
    };
};

Clock.prototype.getHourHandPos = function () {
    var hourRatio = this.getRatio(12, this.hour);
    var multiplierX = Math.sin(hourRatio);
    var multiplierY = Math.cos(hourRatio);

    return {
        x: (multiplierX * 100 + this.x),
        y: (multiplierY * -100 + this.y)
    };
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

Clock.prototype.setCurrent = function () {
    this.group.opacity = 1;
};

Clock.prototype.render = function () {
    var outer = this.two.makeCircle(this.x, this.y, 200);
    this.group.add(outer);

    var inner = this.two.makeCircle(this.x, this.y, 180);
    this.group.add(inner);
    inner.fill = '#1f1f1f';

    var minuteHand = this.renderHand(this.getMinuteHandPos.bind(this));
    this.group.add(minuteHand);

    var hourHand = this.renderHand(this.getHourHandPos.bind(this));
    this.group.add(hourHand);

    this.group.opacity = 0.2;
};

var Scene = function (el) {
    var currentDate = new Date();

    this.el = el;

    this.two = new Two({
        height: 700,
        width: 1200
    });

    this.clocks = [];
    for (var hour = 0; hour < 12; hour++) {
        for (var minute = 0; minute < 60; minute++) {
            var clock = new Clock(this.two, minute, hour, hour, minute)
            this.clocks.push(clock);
            if (currentDate.getHours() === hour && currentDate.getMinutes() === minute) {
                this.currentClock = clock;
            }
        }
    }
};

Scene.prototype.centerOnClock = function (clock) {
    var centerX = this.two.width / 2;
    var centerY = this.two.height / 2;

    this.two.scene.translation.x = centerX - clock.x;
    this.two.scene.translation.y = centerY - clock.y;

    clock.setCurrent();

    this.two.update();
};

Scene.prototype.render = function () {
    this.two.appendTo(this.el);

    for (var i = 0; i < this.clocks.length; i++) {
        this.clocks[i].render();
    }

    this.centerOnClock(this.currentClock);

    this.two.update();
};
