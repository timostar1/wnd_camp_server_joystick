function keyDownHandler(){
	if (event.keyCode === 68){
		joystick.turn(0);
	} else if (event.keyCode === 65){
		joystick.turn(1);
	} else if (event.keyCode === 87){  // W

	} else if (event.keyCode === 83){  // S

	} else if (event.keyCode === 81){  // Q

	} else if (event.keyCode === 69){  // E

	}
}


function keyUpHandler(){
	if (event.keyCode === 68){
		joystick.turn(2);
	} else if (event.keyCode === 65){
		joystick.turn(3);
	} else if (event.keyCode === 87){  // W

	} else if (event.keyCode === 83){  // S

	} else if (event.keyCode === 81){  // Q

	} else if (event.keyCode === 69){  // E

	}
}


function mouseMoveHandler(){
    joystick.move(Math.floor(event.offsetX * 10) / 10, Math.floor(event.offsetY * 10) / 10);
}


function clickHandler(){
    map.manageClick();
	joystick.click1();
	joystick.move(joystick.pos.x, joystick.pos.y);
}

function outClickHandler(){
	joystick.click2();
}