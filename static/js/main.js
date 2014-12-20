var Clock = function (two, hour, minute) {
    this.two = two;
    this.hour = hour;
    this.minute = minute;
};

Clock.prototype.getMinuteHandPos = function () {
    var minuteRatio =  ((2 * Math.PI) / 60) * this.minute;
    var multiplierX = Math.sin(minuteRatio);
    var multiplierY = Math.cos(minuteRatio);

    return {
        x: (multiplierX * 150 + 250),
        y: (multiplierY * -150 + 250)
    };
};

Clock.prototype.getHourHandPos = function () {
    var hourRatio = ((2 * Math.PI) / 12) * this.hour;
    var multiplierX = Math.sin(hourRatio);
    var multiplierY = Math.cos(hourRatio);

    return {
        x: (multiplierX * 100 + 250),
        y: (multiplierY * -100 + 250)
    };
};

Clock.prototype.render = function () {
    var outer = this.two.makeCircle(250, 250, 200);

    var inner = this.two.makeCircle(250, 250, 180);
    inner.fill = '#1f1f1f';

    var minuteHandDimensions = this.getMinuteHandPos();
    var minuteHand = this.two.makeLine(
        250, 250,
        minuteHandDimensions.x, minuteHandDimensions.y
    );
    minuteHand.stroke = '#fff';
    minuteHand.linewidth = 10;
    minuteHand.cap = 'round';

    var hourHandDimensions = this.getHourHandPos();
    var hourHand = this.two.makeLine(
        250, 250,
        hourHandDimensions.x, hourHandDimensions.y);
    hourHand.stroke = '#fff';
    hourHand.linewidth = 10;
    hourHand.cap = 'round';
};

var Scene = function (el) {
    this.el = el;

    this.two = new Two({
        height: 500,
        width: 500
    });

    this.clock = new Clock(this.two, 10, 10);
};

Scene.prototype.render = function () {
    this.two.appendTo(this.el);

    this.clock.render();

    this.two.update();
};
