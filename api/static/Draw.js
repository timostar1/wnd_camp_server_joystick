class Draw{
	constructor(){
		let canv = document.getElementById("canv");
		this.can = canv.getContext("2d");
		this.joy = new Image;
		this.joy.src = "joy.png";
		this.green = new Image;
		this.green.src = "green.png";
		this.back = new Image;
		this.back.src = "back.png";
	}
	
	entity(ent){
		/*this.can.fillStyle = "red";
		this.can.beginPath(ent.x, ent.y + ent.hitbox.y1);
		this.can.arc(ent.x, ent.y, (ent.hitbox.x2 - ent.hitbox.x1) / 2, 0, Math.PI * 2);
		this.can.fill();*/
		this.can.drawImage(this.back, ent.x + ent.map.xshift() + ent.hitbox.x1, ent.y + ent.map.yshift() + ent.hitbox.y1, ent.hitbox.x2 - ent.hitbox.x1, ent.hitbox.y2 - ent.hitbox.y1);
		this.modifyContextMatrix((1 * ent.backlink.turnVector.right - 1 * ent.backlink.turnVector.left) * Math.PI * 0.5, ent.x, ent.y);
		this.can.drawImage(this.green, ent.map.xshift() + ent.hitbox.x1, ent.map.yshift() + ent.hitbox.y1, ent.hitbox.x2 - ent.hitbox.x1, ent.hitbox.y2 - ent.hitbox.y1);
		/*this.can.beginPath();
		this.can.moveTo(0, 40);
		this.can.lineTo(0, -40);
		this.can.lineTo(-10, -30);
		this.can.moveTo(0, -40);
		this.can.lineTo(10, -30);
		this.can.strokeStyle = "yellow";
		this.can.stroke();*/
		this.can.restore();
	}
	
	background1(field){
		//this.can.drawImage(this.murasama, 0, 0, field.size, field.size);
		this.can.strokeStyle = "red";
		this.can.beginPath(field.size / 2, field.size / 2 - joystick.radius);
		this.can.arc(field.size / 2, field.size / 2, joystick.radius, 0, Math.PI * 2);
		this.can.stroke();
	}

	backgroundDrg(field){
		this.can.fillStyle = "lightgrey";
		this.can.fillRect(0, 0, field.size, field.size);
		/*this.can.strokeStyle = "red";
		this.can.beginPath(300, 100);
		this.can.arc(300, 300, 200, 0, Math.PI * 2);
		this.can.stroke();*/
		this.can.drawImage(this.joy, 0, 0, field.size, field.size);
	}

	modifyContextMatrix(angle, xShift, yShift, xTurn = 1, yTurn = 1){
		this.can.save();
		this.can.setTransform(xTurn, 0, 0, yTurn, xShift, yShift);
		this.can.rotate(angle);
	}
}