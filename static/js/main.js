var Clock = function (two, x, y, hour, minute) {
    this.x = x * 500 + 250;
    this.y = y * 500 + 250;
    this.two = two;
    this.hour = hour;
    this.minute = minute;
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
};

Clock.prototype.render = function () {
    var outer = this.two.makeCircle(this.x, this.y, 200);

    var inner = this.two.makeCircle(this.x, this.y, 180);
    inner.fill = '#1f1f1f';

    this.renderHand(this.getMinuteHandPos.bind(this));
    this.renderHand(this.getHourHandPos.bind(this));
};

var Scene = function (el) {
    this.el = el;

    this.two = new Two({
        height: 500,
        width: 500
    });

    this.clock = new Clock(this.two, 0, 0, 10, 10);

    window.two = this.two;
};

Scene.prototype.render = function () {
    this.two.appendTo(this.el);

    this.clock.render();

    this.two.update();
};
