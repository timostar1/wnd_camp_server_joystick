class Joystick{
	constructor(maP = map){
		let scale = maP.size;
		this.radius = scale / 3;
		this.x = scale / 2;
		this.y = scale / 2;
		this.isActive = false;
		this.pin = new Entity(this.x, this.y, -1000, 10000, {x1: -scale / 6, x2: scale / 6, y1: -scale / 6, y2: scale / 6});
		this.pin.backlink = this;
		this.pin.draw = function(){};
		this.pin2 = new Entity(this.x, this.y, -1000, 10000, {x1: -scale / 6, x2: scale / 6, y1: -scale / 6, y2: scale / 6});
		this.pin2.other = this.pin;
		this.pin2.tickPlaceholderMain = function(){
			this.moveToGoal(this.other.x, this.other.y, euclidianDistance(this.x, this.y, this.other.x, this.other.y) ** 2 / 1000 * (scale / 600) + scale / 75 * (euclidianDistance(this.x, this.y, this.other.x, this.other.y) > scale / 120));
		}
		this.pin2.backlink = this;
		this.pin.tickPlaceholderMain = function(){
			this.backlink.log();
		}
		this.turnVector = {left: false, right: false};
		this.pos = {x: scale / 2, y: scale / 2};
		this.wheels = [
		    document.getElementById("frontLeft"),
		    document.getElementById("frontRight"),
		    document.getElementById("backLeft"),
		    document.getElementById("backRight")
		];
		this.distanceOutputFront = document.getElementById("distance1");
		this.distanceOutputBack = document.getElementById("distance2");
		this.input = document.getElementById("input");
		this.input.value = "100";
	}
	
	move(x, y){
		this.pos.x = x;
		this.pos.y = y;
		if (this.isActive){
			let a = projections(this.x - this.pin.x, this.y - this.pin.y, this.radius * 3 / 600);
			for (let b = 0; b < 1000; b++){
				if (this.touch(x, y)){
					this.pin.tp(x, y);
					break;
				} else {
					x += a.x;
					y += a.y;
				}
			}
		} else {
			this.pin.tp(this.x, this.y);
		}
	}
	
	click1(x, y){
		if (this.touch(this.pos.x, this.pos.y) && !this.isActive){
			this.isActive = true;
		}
	}
	
	click2(){
		this.isActive = false;
	}
	
	turn(num){
		let a = [
		function(){
			this[4].turnVector.right = true;
		}, 
		function(){
			this[4].turnVector.left = true;
		}, 
		function(){
			this[4].turnVector.right = false;
		},
		function(){
			this[4].turnVector.left = false;
		},
		this
		];
		a[num]();
	}

	getX() {
	    return Math.round((this.pin.x - this.x) / this.radius * 100);
	}

	getY() {
	    return Math.round((this.pin.y - this.y) / this.radius * 100);
	}

	getTurn() {
	    let a = parseInt(this.input.value);
	    if (a > 255){
	        a = 255;
	    } else if (a < 80 || a === undefined || isNaN(a)){
	        a = 80;
	    }
	    return a * this.turnVector.right - a * this.turnVector.left;
	}

    setWheels(params) {
        this.wheels[0].innerHTML = "" + params.frontLeft;
        this.wheels[1].innerHTML = "" + params.frontRight;
        this.wheels[2].innerHTML = "" + params.backLeft;
        this.wheels[3].innerHTML = "" + params.backRight;
        this.distanceOutputFront.innerHTML = "" + params.distFront;
        this.distanceOutputBack.innerHTML = "" + params.distBack;
    }

    log(){
		console.log("x: " + this.getX() + "; y: " + this.getY() + "; turn: " + this.getTurn());
	}

	touch(x, y){
		if (euclidianDistance(x, y, this.x, this.y) < this.radius){
			return true;
		} else {
			return false;
		}
	}
}