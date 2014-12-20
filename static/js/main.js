var Clock = function (two, hour, minute) {
    this.two = two;
    this.hour = hour;
    this.minute = minute;
};

Clock.prototype.render = function () {
    var outer = this.two.makeCircle(100, 100, 50);

    var inner = this.two.makeCircle(100, 100, 45);
    inner.fill = '#1f1f1f';

    var hourHand = this.two.makeLine(100, 100, 70, 100);
    hourHand.stroke = '#fff';

    var minuteHand = this.two.makeLine(100, 100, 100, 60);
    minuteHand.stroke = '#fff';
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
