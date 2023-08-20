let map = new Map(document.getElementById("canv").width, 10, 10);
let draw = new Draw;
let player = {xshift: 0, yshift: 0};
let magicConstant1 = -5;
map.drawEverything();
let joystick = new Joystick();
draw.can.lineWidth = 3;
setInterval(() => {
    map.tick();
}, map.framerate);