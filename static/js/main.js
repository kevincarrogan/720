var Clock = function (two, hour, minute) {
    this.two = two;
    this.hour = hour;
    this.minute = minute;
};

Clock.prototype.render = function () {
    var outer = this.two.makeCircle(250, 250, 200);

    var inner = this.two.makeCircle(250, 250, 180);
    inner.fill = '#1f1f1f';

    var hourHand = this.two.makeLine(250, 250, 250, 100);
    hourHand.stroke = '#fff';
    hourHand.linewidth = 10;
    hourHand.cap = 'round';

    var minuteHand = this.two.makeLine(250, 250, 150, 250);
    minuteHand.stroke = '#fff';
    minuteHand.linewidth = 10;
    minuteHand.cap = 'round';
};

var Scene = function (el) {
    this.el = el;

    this.two = new Two({
        height: 500,
        width: 500
    });

    this.clock = new Clock(this.two, 10, 20);
};

Scene.prototype.render = function () {
    this.two.appendTo(this.el);

    this.clock.render();

    this.two.update();
};
