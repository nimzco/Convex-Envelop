/*
 * Returns a random value between [_min, _max].
 */
Math.randomValue = function (_max, _min) {
	var min = _min || 0, max = (_max + 1) || 101;
	return Math.floor((Math.random() * (max - min)) + min);
}

window.convlexEnvelop = {};
window.convlexEnvelop.viewer = function (canvasDiv){
	var that = {};
	/**
	 * Private
	 */
	var canvas = canvasDiv || document.getElementById("canvas");
	/*
 	 * Returns a random color
 	 */
 	var _randomColor = function () {
		return "rgba(" + Math.randomValue(200) + "," + Math.randomValue(200) + "," + Math.randomValue(200) + ",1)";
	};

	/*
 	 * Display a colored point
 	 */
	var _displayPoint = function (point, color) {
		var context = canvas.getContext('2d');
		context.fillStyle = color || "rgba(0,0,0,1)";
		context.beginPath();
		context.arc(point.x,600 - point.y, 3, 0, Math.PI * 2,true);
		context.closePath();
		context.fill();
	};
	/*
 	 * display a colored line between the point a and the point b
 	 */
	var _displayLine = function (a, b, color) {
		var context = canvas.getContext('2d');
	 	context.lineWidth=2;
	  context.lineCap='round'; 
		context.moveTo(a.x,600 - a.y);
		context.lineTo(b.x,600 - b.y);
		context.strokeStyle = color || "rgba(0,0,0,1)";;
		context.stroke();
	}
	
	/**
	 * Public
	 */
	that.randomColor = _randomColor;
	that.displayPoint = _displayPoint;
	that.displayLine = _displayLine;
	/*
 	 * Display a colored point
 	 */
	that.displayPoint = function (point, color) {
		var context = canvas.getContext('2d');
		context.fillStyle = color || "rgba(0,0,0,1)";
		context.beginPath();
		context.arc(point.x,600 - point.y, 3, 0, Math.PI * 2,true);
		context.closePath();
		context.fill();
	}

	/*
	 * Display all points within the array passed in parameter
	 */
	that.displayAllPoints = function (array) {
		var i;
		for(i = 0; i < array.length; i += 1) {
			_displayPoint(array[i], _randomColor());
		}
	};

	/*
	 * /!\ Does not work /!\
 	 * Clears the canvas 
 	 * TODO 
 	 */
	that.clearCanvas = function () {
		var context = canvas.getContext('2d');
	}

	/*
 	 * Displays the closed path of a polygon with the array of polygon's vertices
 	 */
	that.displayPolygon = function (pointsArray, _color) {
		var k, color = _color || "rgba(0,0,0,1)";
		for (k = 0; k < pointsArray.length - 1; k+= 1) {
			_displayLine(pointsArray[k], pointsArray[k + 1], color);
		}
		_displayLine(pointsArray[0], pointsArray[pointsArray.length - 1], color);
	}

	return that;
};