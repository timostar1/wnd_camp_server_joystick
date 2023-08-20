function projections(a, b, hypothesis){//a, b - расстояния до цели, hyp. - длина шага, возвращает объект с проекциями шага
    if (a === 0 && b === 0){
        return {x: 0, y: 0};
    }
    if (a === 0){
        return {x: 0, y: hypothesis * Math.sign(b)};
    }
    if (b === 0){
        return {y: 0, x: hypothesis * Math.sign(a)};
    }
	y = hypothesis * Math.sign(b) / Math.sqrt(a ** 2 / b ** 2 + 1);
    return {
		x: y * a / b,
		y: y
	}
}   


function defenceCount(dmg, defence){
	return dmg * 200 / (defence + 200);
}


function spreadCounter(x, y, spread){
    if (x === 0){return spreadCounter(0.001, y, spread);}
    if (y === 0){return spreadCounter(x, 0.001, spread);}
    let angle = Math.atan(y/x);
    let random = Math.floor(Math.random() * spread - spread / 2) / 180 * Math.PI;
    let angle2 = ((angle + random) + (Math.PI * 2)) % (Math.PI * 2);
    let x2 = x;
    let y2 = Math.abs(Math.tan(angle2)) * y / Math.abs(y/x);
    return {x: x2, y: y2};
}


function turn(x, y){
    return {angle: Math.atan(y/x) * Math.sign(x), side: Math.sign(x + 0.0001), sidey: Math.sign(y + 0.0001)};
}


function euclidianDistance(x1, y1, x2, y2){
    return (Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2));
}