window.onload = () => {
	'use strict';

	if ('serviceWorker' in navigator) {
		navigator.serviceWorker
			.register('./sw.js');
	}
	camStart();
}

// Override the function with all the posibilities
navigator.getUserMedia ||
	(navigator.getUserMedia = navigator.mozGetUserMedia ||
		navigator.webkitGetUserMedia || navigator.msGetUserMedia);

var canvas, context,
	centerX, centerY, grad,
	mouse,
	bounds,
	points,
	lightning,
	gui, control;
var col = '#0b5693';

var touches = []; // add this for multitouch
var touchCount = 0;
var mouseX = -1.0;
var mouseY = 0.5;
var mouseX1 = -1.0;
var mouseY1 = 0.0;
var keyState1 = 0;
var keyState2 = 0;
var keyState3 = 0;
var keyState4 = 0;

var index = 0;

var currentColour = 0;
var currentBlur = 0;
var currentAmp = 0;
var currentChildren = 0;



function Action(i) {
	sound1.play();
	window.setTimeout(function () {
		sound1.stop();
	}, 1000); // stop sound after .5s
	switch (i) {
		case 2: // change colour leftmost button
			currentColour++;
			if (currentColour > 6)
				currentColour = 0;
			switch (currentColour) {
				case 0:
					lightning.color = '#ffffff';
					col = '#0b5693';
					break;
				case 1:
					lightning.color = '#FFFF00';
					col = '#404000';
					break;
				case 2:
					lightning.color = '#00FFFF';
					col = '#004040';
					break;
				case 3:
					lightning.color = '#FF00FF';
					col = '#400040';
					break;
				case 4:
					lightning.color = '#00FF00';
					col = '#004000';
					break;
				case 5:
					lightning.color = '#8080FF';
					col = '#000040';
					break;
				case 6:
					lightning.color = '#FF0000';
					col = '#400000';
					break;
			}
			resize();
			break;
		case 1: // second left button
			currentBlur++;
			if (currentBlur > 2)
				currentBlur = 0;
			switch (currentBlur) {
				case 0:
					lightning.blur = 50;
					break;
				case 1:
					lightning.blur = 8;
					break;
				case 2:
					lightning.blur = 20;
					break;
			}
			break;
		case 3: // rightmost button
			currentAmp++;
			if (currentAmp > 2)
				currentAmp = 0;
			switch (currentAmp) {
				case 0:
					lightning.amplitude = 1;
					lightning.speed = 0.025;
					break;
				case 1:
					lightning.amplitude = 2.5;
					lightning.speed = 0.05;
					break;
				case 2:
					lightning.amplitude = .5;
					lightning.speed = 0.025;
					break;
			}
			break;
		case 4: // second rightmost button
			currentChildren++;
			if (currentChildren > 2)
				currentChildren = 0;
			switch (currentChildren) {
				case 0:
					lightning.setChildNum(3);
					break;
				case 1:
					lightning.setChildNum(10);
					break;
				case 2:
					lightning.setChildNum(0);
					break;
			}
			break;
			break;
	}
}
function toggleButtons() {
	var button = document.querySelector('button');
	var button1 = document.querySelector('button1');
	var button2 = document.querySelector('button2');
	var button3 = document.querySelector('button3');
	button.hidden = !button.hidden;
	button1.hidden = !button1.hidden;
	button2.hidden = !button2.hidden;
	button3.hidden = !button3.hidden;
}

function MonitorKeyDown(e) { // stop autorepeat of keys with KeyState1-4 flags
	if (!e) e = window.event;
	if (e.keyCode == 32 || e.keyCode == 49) {
		if (keyState1 == 0)
			Action(1);
		keyState1 = 1;
	} else if (e.keyCode == 50) {
		if (keyState2 == 0)
			Action(2);
		keyState2 = 1;
	} else if (e.keyCode == 51 || e.keyCode == 13) {
		if (keyState3 == 0)
			Action(4);
		keyState3 = 1;
	} else if (e.keyCode == 52) {
		if (keyState4 == 0)
			Action(3);
		keyState4 = 1;
	}
	else if (e.keyCode == 53) {
		toggleButtons();
	}
	return false;
}

function MonitorKeyUp(e) {
	if (!e) e = window.event;
	if (e.keyCode == 32 || e.keyCode == 49) {
		keyState1 = 0;
	} else if (e.keyCode == 50) {
		keyState2 = 0;
	} else if (e.keyCode == 51 || e.keyCode == 13) {
		keyState3 = 0;
	} else if (e.keyCode == 52) {
		keyState4 = 0;
	}
	return false;
}


var mouseState = 0;

var c = document.getElementById("body");
var sound;
var sound1;

function electricSound() {
	var s = "electric.mp3";
	var s1 = "electric1.mp3";
	sound = new Howl({
		src: [s],
		loop: true,
		volume: 1,
	});
	sound1 = new Howl({
		src: [s1],
		loop: false,
		volume: 1,
	});
}

function resize() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	bounds = new Rect(0, 0, canvas.width, canvas.height);
	centerX = canvas.width * 0.5;
	centerY = canvas.height * 0.5;
	context = canvas.getContext('2d');
	grad = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.sqrt(centerX * centerX + centerY * centerY));
	grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
	grad.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
}

function camStart() {
	var splash = document.querySelector('splash');
	var button = document.querySelector('button');
	var button1 = document.querySelector('button1');
	var button2 = document.querySelector('button2');
	var button3 = document.querySelector('button3');
	canvas = document.getElementById('c');
	crosshairs = document.querySelector('crosshairs');
	crosshairs.hidden = true;
	splash.onclick = function (e) {
		if (document.body.requestFullscreen) {
			document.body.requestFullscreen();
		} else if (document.body.msRequestFullscreen) {
			document.body.msRequestFullscreen();
		} else if (document.body.mozRequestFullScreen) {
			document.body.mozRequestFullScreen();
		} else if (document.body.webkitRequestFullscreen) {
			document.body.webkitRequestFullscreen();
		}
		splash.hidden = true;
		electricSound();
	}

	window.setTimeout(function () {
		if (!splash.hidden) {
			if (document.body.requestFullscreen) {
				document.body.requestFullscreen();
			} else if (document.body.msRequestFullscreen) {
				document.body.msRequestFullscreen();
			} else if (document.body.mozRequestFullScreen) {
				document.body.mozRequestFullScreen();
			} else if (document.body.webkitRequestFullscreen) {
				document.body.webkitRequestFullscreen();
			}
		}
		splash.hidden = true;
		electricSound();
	}, 2000); // hide Splash screen after 2 seconds

	button.onclick = function (e) {
		Action(2);
	}
	button1.onclick = function (e) {
		Action(1);
	}
	button2.onclick = function (e) {
		Action(4);
	}
	button3.onclick = function (e) {
		Action(3);
	}
	document.onkeyup = MonitorKeyUp;
	document.onkeydown = MonitorKeyDown;

	canvas.addEventListener('touchmove', function (event) {
		event.preventDefault();
		touches = event.touches;
	}, false);
	canvas.addEventListener('touchstart', function (event) {
		event.preventDefault();
		touches = event.touches;
	}, false);
	canvas.addEventListener('touchend', function (event) {
		event.preventDefault();
		touches = event.touches;
	}, false);

	function mouseMove(e) {
		mouse.set(e.clientX, e.clientY);

		var i, hit = false;
		for (i = 0; i < 2; i++) {
			if ((!hit && points[i].hitTest(mouse)) || points[i].dragging)
				hit = true;
		}
		document.body.style.cursor = hit ? 'pointer' : 'default';
	}

	function mouseDown(e) {
		var d1 = Math.hypot(mouse.x - points[0].x, mouse.y - points[0].y);
		var d2 = Math.hypot(mouse.x - points[1].x, mouse.y - points[1].y);
		if (touchCount == 2) {
			points[1].startDrag();
		}
		else {
			if (d1 > d2)
				points[1].startDrag();
			else
				points[0].startDrag(); // set to one if want one end fixed
		}
		if (sound.playing)
			sound.stop();
		sound.play();
		sound.volume = 1;
		/*	for (var i = 0; i < 2; i++) {
				if (points[i].hitTest(mouse)) {
					points[i].startDrag();
					return;
				}
			} */
	}

	function mouseUp(e) {
		sound.stop();
		for (var i = 0; i < 2; i++) {
			if (points[i].dragging) {
				points[i].endDrag();
			}
		}
	}

	function MoveMouse(xm, ym) {
		crosshairs.hidden = false;
		try {
			mouseX = crosshairs.offsetLeft + (crosshairs.offsetWidth) / 2;
			mouseY = crosshairs.offsetTop + (crosshairs.offsetHeight) / 2;
			mouseX += xm;
			mouseY += ym;
			if (mouseX < 10)
				mouseX = 10;
			if (mouseY < 10)
				mouseY = 10;
			if (mouseX >= window.innerWidth - 10)
				mouseX = window.innerWidth - 10;
			if (mouseY >= window.innerHeight - 10)
				mouseY = window.innerHeight - 10;
			console.log('MoveTo: ', mouseX, mouseY);
			mouse.x = mouseX;
			mouse.y = mouseY
			crosshairs.style.left = mouseX - crosshairs.offsetWidth / 2 + "px";
			crosshairs.style.top = mouseY - crosshairs.offsetHeight / 2 + "px";
			mouseX /= canvas.width;
			mouseY /= canvas.height;
		} catch (e) { }
	}

	function JoystickMoveTo(jy, jx) {
		if (splash.hidden) {
			crosshairs.hidden = false;
			if (Math.abs(jx) < .1 && Math.abs(jy) < .1) {
				try {
					if (gpad.getButton(14).value > 0) // dpad left
						MoveMouse(-7, 0);
					if (gpad.getButton(12).value > 0) // dup
						MoveMouse(0, -5);
					if (gpad.getButton(13).value > 0) // ddown
						MoveMouse(0, 5);
					if (gpad.getButton(15).value > 0) // dright
						MoveMouse(7, 0);
				} catch (e) { }
				return;
			}
			if (Math.abs(jx) < .1)
				jx = 0;
			if (Math.abs(jy) < .1)
				jy = 0;
			if (jx == 0 && jy == 0)
				return;
			MoveMouse(jx * 30, jy * 30);
		}
	}

	var currentButton = 0;

	function Highlight() { }
	buttonDown = false;

	function showPressedButton(index) {
		console.log("Press: ", index);
		if (!splash.hidden) { // splash screen
			splash.hidden = true;
			electricSound();
		} else {
			crosshairs.hidden = false;
			switch (index) {
				case 0: // A
				case 9:
					buttonDown = !buttonDown;
					if (buttonDown)
						mouseDown(0);
					else
						mouseUp(0);
					break;
				case 1: // B - 
					Action(2);
					break;
				case 2: // X
					Action(1);
					break;
				case 3: // Y
					Action(3);
					break;
				case 8: // View Button new 14/9/20
					toggleButtons(); // new 14/9/20
					break; // new 14/9/20
				case 10: // XBox
					break;
				case 12: // dpad handled by timer elsewhere
				case 13:
				case 14:
				case 15:
					break;
				default:
			}
		}
	}

	function removePressedButton(index) {
		console.log("Releasd: ", index);
	}

	function moveJoystick(values, isLeft) {
		if (splash.hidden)
			JoystickMoveTo(values[1], values[0]);
	}

	var gpad;

	function getAxes() {
		//       console.log('Axis', gpad.getAxis(0), gpad.getAxis(1), gpad.getButton(14).value);

		if (splash.hidden) {
			JoystickMoveTo(gpad.getAxis(1), gpad.getAxis(0));
			JoystickMoveTo(gpad.getAxis(3), gpad.getAxis(2));
		}
		setTimeout(function () {
			getAxes();
		}, 50);
	}

	gamepads.addEventListener('connect', e => {
		//        crosshairs.hidden = false;
		console.log('Gamepad connected:');
		console.log(e.gamepad);
		Highlight()
		gpad = e.gamepad;
		e.gamepad.addEventListener('buttonpress', e => showPressedButton(e.index));
		e.gamepad.addEventListener('buttonrelease', e => removePressedButton(e.index));
		//       e.gamepad.addEventListener('joystickmove', e => moveJoystick(e.values, true),
		//            StandardMapping.Axis.JOYSTICK_LEFT);
		//        e.gamepad.addEventListener('joystickmove', e => moveJoystick(e.values, false),
		//            StandardMapping.Axis.JOYSTICK_RIGHT);
		setTimeout(function () {
			getAxes();
		}, 50);
	});

	gamepads.addEventListener('disconnect', e => {
		console.log('Gamepad disconnected:');
		console.log(e.gamepad);
	});

	gamepads.start();

	window.addEventListener('resize', resize, false);
	resize(null);

	bounds = new Rect(0, 0, canvas.width, canvas.height);
	mouse = new Vector();

	lightning = new Lightning();

	points = [
		new Point(centerX - 200, centerY, lightning.lineWidth * 1.25),
		new Point(centerX + 200, centerY, lightning.lineWidth * 1.25)
	];

	lightning.startPoint.set(points[0]);
	lightning.endPoint.set(points[1]);
	lightning.setChildNum(3);

	canvas.addEventListener('mousemove', mouseMove, false);
	canvas.addEventListener('mousedown', mouseDown, false);
	canvas.addEventListener('mouseup', mouseUp, false);


	// Start Update

	var loop = function () {
		context.save();
		context.fillStyle = col; // background color
		context.fillRect(0, 0, canvas.width, canvas.height);
		context.fillStyle = grad;
		context.fillRect(0, 0, canvas.width, canvas.height);
		context.restore();


		// fixed point at top
		//		points[0].x = canvas.width/2;;
		//		points[0].y = 0;


		if (touches.length == 0) {
			if (mouseState == 0) // nothing touching
				mouseX = -1.0;
			if (touchCount > 0) // ie just released
				mouseUp(0);
		} else if (touches.length == 1) {
			mouseX = touches[0].clientX;
			mouseY = touches[0].clientY;
			mouseX1 = -1.0;
			mouse.x = mouseX;
			mouse.y = mouseY;
			if (touchCount == 0) { // ie just touched
				mouseDown(0);
			}
		} else if (touchCount > 1) {
			mouseX = touches[0].clientX;
			mouseY = touches[0].clientY;
			mouseX1 = touches[1].clientX;
			mouseY1 = touches[1].clientY;
			mouse.x = mouseX;
			mouse.y = mouseY;
			points[0].x = mouseX1;
			points[0].y = mouseY1;
			points[1].x = mouseX;
			points[1].y = mouseY;
			if (touchCount == 0) { // ie just touched
				mouseDown(0);
			}
		}
		touchCount = touches.length;

		lightning.startPoint.set(points[0]);
		lightning.endPoint.set(points[1]);
		lightning.step = Math.ceil(lightning.length() / 10);
		if (lightning.step < 5) lightning.step = 5;

		lightning.update();
		lightning.draw(context);
		//      lightning.color = 'rgba(255, 255, 0, 1)';
		var i, p;

		for (i = 0; i < 2; i++) {
			p = points[i];
			if (p.dragging) p.drag(mouse);
			p.update(points, bounds);
			p.draw(context);
		}

		requestAnimationFrame(loop);
	};
	loop();

}

/* Copyright (c) 2020 by Akimitsu Hamamuro (https://codepen.io/akm2/pen/Aatbf)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
// Modifications by SAH 2020

window.requestAnimationFrame = (function () {
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function (callback) {
			window.setTimeout(callback, 1000 / 60);
		};
})();


/**
 * Vector
 */
function Vector(x, y) {
	this.x = x || 0;
	this.y = y || 0;
}

Vector.add = function (a, b) {
	return new Vector(a.x + b.x, a.y + b.y);
};

Vector.sub = function (a, b) {
	return new Vector(a.x - b.x, a.y - b.y);
};

Vector.prototype = {
	set: function (x, y) {
		if (typeof x === 'object') {
			y = x.y;
			x = x.x;
		}
		this.x = x || 0;
		this.y = y || 0;
		return this;
	},

	add: function (v) {
		this.x += v.x;
		this.y += v.y;
		return this;
	},

	sub: function (v) {
		this.x -= v.x;
		this.y -= v.y;
		return this;
	},

	scale: function (s) {
		this.x *= s;
		this.y *= s;
		return this;
	},

	length: function () {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	},

	normalize: function () {
		var len = Math.sqrt(this.x * this.x + this.y * this.y);
		if (len) {
			this.x /= len;
			this.y /= len;
		}
		return this;
	},

	angle: function () {
		return Math.atan2(this.y, this.x);
	},

	distanceTo: function (v) {
		var dx = v.x - this.x,
			dy = v.y - this.y;
		return Math.sqrt(dx * dx + dy * dy);
	},

	distanceToSq: function (v) {
		var dx = v.x - this.x,
			dy = v.y - this.y;
		return dx * dx + dy * dy;
	},

	clone: function () {
		return new Vector(this.x, this.y);
	}
};


function Point(x, y, radius) {
	Vector.call(this, x, y);

	this.radius = radius || 7;

	this.vec = new Vector(random(1, -1), random(1, -1)).normalize();
	this._easeRadius = this.radius;
	this._currentRadius = this.radius;

}

Point.prototype = (function (o) {
	var s = new Vector(0, 0),
		p;
	for (p in o) {
		s[p] = o[p];
	}
	return s;
})({
	color: 'rgb(255, 255, 255)',
	dragging: false,
	_latestDrag: null,

	update: function (points, bounds) {
		this._currentRadius = random(this._easeRadius, this._easeRadius * 0.35);
		this._easeRadius += (this.radius - this._easeRadius) * 0.1;

		if (this.dragging) return;

		var vec = this.vec,
			i, len, p, d;

		for (i = 0, len = points.length; i < len; i++) {
			p = points[i];
			if (p !== this) {
				d = this.distanceToSq(p);
				if (d < 90000) {
					vec.add(Vector.sub(this, p).normalize().scale(0.03));
				} else if (d > 250000) {
					vec.add(Vector.sub(p, this).normalize().scale(0.015));
				}
			}
		}

		if (vec.length() > 3) vec.normalize().scale(3);

		this.add(vec);

		if (this.x < bounds.x) {
			this.x = bounds.x;
			if (vec.x < 0) vec.x *= -1;

		} else if (this.x > bounds.right) {
			this.x = bounds.right;
			if (vec.x > 0) vec.x *= -1;
		}

		if (this.y < bounds.y) {
			this.y = bounds.y;
			if (vec.y < 0) vec.y *= -1;

		} else if (this.y > bounds.bottom) {
			this.y = bounds.bottom;
			if (vec.y > 0) vec.y *= -1;
		}
	},

	hitTest: function (p) {
		if (this.distanceToSq(p) < 900) {
			this._easeRadius = this.radius * 2.5;
			return true;
		}
		return false;
	},

	startDrag: function () {
		this.dragging = true;
		this.vec.set(0, 0);
		this._latestDrag = new Vector().set(this);
	},

	drag: function (p) {
		this._latestDrag.set(this);
		this.set(p);
	},

	endDrag: function () {
		this.vec = Vector.sub(this, this._latestDrag);
		this.dragging = false;
	},

	draw: function (ctx) {
		ctx.save();
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.x, this.y, 5, 0, Math.PI * 2, false);
		//     ctx.arc(this.x, this.y, this._currentRadius, 0, Math.PI * 2, false);
		ctx.fill();
		ctx.shadowBlur = 20;
		ctx.shadowColor = this.color;
		ctx.fillStyle = 'rgba(0, 0, 255, 1)';
		ctx.globalCompositeOperation = 'lighter';
		ctx.beginPath();
		//      ctx.arc(this.x, this.y, this._currentRadius, 0, Math.PI * 2, false);
		ctx.arc(this.x, this.y, 10, 0, Math.PI * 2, false);

		ctx.fill();
		ctx.restore();
	}
});


/**
 * Lightning
 */
function Lightning(startPoint, endPoint, step) {
	this.startPoint = startPoint || new Vector();
	this.endPoint = endPoint || new Vector();
	this.step = step || 45;

	this.children = [];
}

Lightning.prototype = {
	color: 'rgba(255, 255, 255, 1)',
	speed: 0.025,
	amplitude: 1,
	lineWidth: 7,
	blur: 50,
	blurColor: 'rgba(255, 255, 255, 0.5)',
	points: null,
	off: 0,
	_simplexNoise: new SimplexNoise(),
	// Case by child
	parent: null,
	startStep: 0,
	endStep: 0,

	length: function () {
		return this.startPoint.distanceTo(this.endPoint);
	},

	getChildNum: function () {
		return children.length;
	},

	setChildNum: function (num) {
		var children = this.children,
			child,
			i, len;

		len = this.children.length;

		if (len > num) {
			for (i = num; i < len; i++) {
				children[i].dispose();
			}
			children.splice(num, len - num);

		} else {
			for (i = len; i < num; i++) {
				child = new Lightning();
				child._setAsChild(this);
				children.push(child);
			}
		}
	},

	update: function () {
		var startPoint = this.startPoint,
			endPoint = this.endPoint,
			length, normal, radian, sinv, cosv,
			points, off, waveWidth, n, av, ax, ay, bv, bx, by, m, x, y,
			children, child,
			i, len;

		if (this.parent) {
			if (this.endStep > this.parent.step) {
				this._updateStepsByParent();
			}

			startPoint.set(this.parent.points[this.startStep]);
			endPoint.set(this.parent.points[this.endStep]);
		}

		length = this.length();
		normal = Vector.sub(endPoint, startPoint).normalize().scale(length / this.step);
		radian = normal.angle();
		sinv = Math.sin(radian);
		cosv = Math.cos(radian);

		points = this.points = [];
		off = this.off += random(this.speed, this.speed * 0.2);
		waveWidth = (this.parent ? length * 1.5 : length) * this.amplitude;
		if (waveWidth > 750) waveWidth = 750;

		for (i = 0, len = this.step + 1; i < len; i++) {
			n = i / 60;
			av = waveWidth * this._noise(n - off, 0) * 0.5;
			ax = sinv * av;
			ay = cosv * av;

			bv = waveWidth * this._noise(n + off, 0) * 0.5;
			bx = sinv * bv;
			by = cosv * bv;

			m = Math.sin((Math.PI * (i / (len - 1))));

			x = startPoint.x + normal.x * i + (ax - bx) * m;
			y = startPoint.y + normal.y * i - (ay - by) * m;

			points.push(new Vector(x, y));
		}

		children = this.children;

		for (i = 0, len = children.length; i < len; i++) {
			child = children[i];
			child.color = this.color;
			child.speed = this.speed * 1.35;
			child.amplitude = this.amplitude;
			child.lineWidth = this.lineWidth * 0.75;
			child.blur = this.blur;
			child.blurColor = this.blurColor;
			children[i].update();
		}
	},

	draw: function (ctx) {
		var points = this.points,
			children = this.children,
			i, len, p, d;

		// Blur
		if (this.blur) {
			ctx.save();
			ctx.globalCompositeOperation = 'lighter';
			ctx.fillStyle = 'rgba(0, 0, 0, 1)';
			ctx.shadowBlur = this.blur;
			ctx.shadowColor = this.blurColor;
			ctx.beginPath();
			for (i = 0, len = points.length; i < len; i++) {
				p = points[i];
				d = len > 1 ? p.distanceTo(points[i === len - 1 ? i - 1 : i + 1]) : 0;
				ctx.moveTo(p.x + d, p.y);
				ctx.arc(p.x, p.y, d, 0, Math.PI * 2, false);
			}
			ctx.fill();
			ctx.restore();
		}

		ctx.save();
		ctx.lineWidth = random(this.lineWidth, 0.5);
		ctx.strokeStyle = this.color;
		ctx.beginPath();
		for (i = 0, len = points.length; i < len; i++) {
			p = points[i];
			ctx[i === 0 ? 'moveTo' : 'lineTo'](p.x, p.y);
		}
		ctx.stroke();
		ctx.restore();

		// Draw children
		for (i = 0, len = this.children.length; i < len; i++) {
			children[i].draw(ctx);
		}
	},

	dispose: function () {
		if (this._timeoutId) {
			clearTimeout(this._timeoutId);
		}
		this._simplexNoise = null;
	},

	_noise: function (v) {
		var octaves = 6,
			fallout = 0.5,
			amp = 1,
			f = 1,
			sum = 0,
			i;

		for (i = 0; i < octaves; ++i) {
			amp *= fallout;
			sum += amp * (this._simplexNoise.noise2D(v * f, 0) + 1) * 0.5;
			f *= 2;
		}

		return sum;
	},

	_setAsChild: function (lightning) {
		if (!(lightning instanceof Lightning)) return;
		this.parent = lightning;

		var self = this,
			setTimer = function () {
				self._updateStepsByParent();
				self._timeoutId = setTimeout(setTimer, randint(1500));
			};

		self._timeoutId = setTimeout(setTimer, randint(1500));
	},

	_updateStepsByParent: function () {
		if (!this.parent) return;
		var parentStep = this.parent.step;
		this.startStep = randint(parentStep - 2);
		this.endStep = this.startStep + randint(parentStep - this.startStep - 2) + 2;
		this.step = this.endStep - this.startStep;
	}
};


/**
 * Rect
 */
function Rect(x, y, width, height) {
	this.x = x || 0;
	this.y = y || 0;
	this.width = width || 0;
	this.height = height || 0;
	this.right = this.x + this.width;
	this.bottom = this.y + this.height;
}


// Helpers

function random(max, min) {
	if (typeof max !== 'number') {
		return Math.random();
	} else if (typeof min !== 'number') {
		min = 0;
	}
	return Math.random() * (max - min) + min;
}


function randint(max, min) {
	if (!max) return 0;
	return random(max + 1, min) | 0;
}
