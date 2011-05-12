/**
 * Authors:	Nima Izadi - Nicolas Dupont 
 * Mail: nim.izadi@gmail.com - npg.dupont@gmail.com
 *
 * View
 */

if (typeof window.convlexEnvelop === "undefined") {
	window.convlexEnvelop = {};
}
window.convlexEnvelop.sizeOfCanvas = 600;
window.convlexEnvelop.Viewer = (function (){
	function Viewer(canvasDiv) {
		this.canvas = canvasDiv || document.getElementById("canvas");
	}
	
	/*
 	 * Returns a random color
 	 */
	Viewer.prototype.randomColor =  function () {
		return "rgba(" + Math.randomValue(200) + "," + Math.randomValue(200) + "," + Math.randomValue(200) + ",1)";
	};
	
	/*
 	 * Returns a random color
 	 */
	Viewer.prototype.randomDarkColor =  function () {
		return "rgba(" + Math.randomValue(100) + "," + Math.randomValue(100) + "," + Math.randomValue(100) + ",1)";
	};

	/*
 	 * Display a colored line between the point a and the point b
 	 */
	Viewer.prototype.displayLine = function (a, b, color) {
		var context = this.canvas.getContext('2d');
	 	context.lineWidth=1;
		context.lineCap='round'; 
		context.moveTo(a.x, window.convlexEnvelop.sizeOfCanvas - a.y);
		context.lineTo(b.x, window.convlexEnvelop.sizeOfCanvas - b.y);
		context.strokeStyle = color || "rgba(0,0,0,1)";;
		context.stroke();
	};
	
	/*
 	 * Display a colored point
 	 */
	Viewer.prototype.displayPoint = function (point, color) {
		var context = this.canvas.getContext('2d');
		context.fillStyle = color || "rgba(0,0,0,1)";
		context.beginPath();
		context.arc(point.x, window.convlexEnvelop.sizeOfCanvas - point.y, 3, 0, Math.PI * 2,true);
		context.closePath();
		context.fill();
	};

	/*
	 * Display all points within the array passed in parameter
	 */
	Viewer.prototype.displayAllPoints = function (array) {
		var i;
		for(i = 0; i < array.length; i += 1) {
			this.displayPoint(array[i], this.randomColor());
		}
	};
	
	/*
 	 * Clears the canvas 
 	 */
	Viewer.prototype.clear = function () {
		var context = this.canvas.getContext('2d');
		this.canvas.width = this.canvas.width;
		context.clearRect(0, 0, canvas.width, canvas.height);
	};

	/*
 	 * Displays the closed path of a polygon with the array of polygon's vertices
 	 */
	Viewer.prototype.displayPolygon = function (pointsArray, color) {
		var k, color = color || "rgba(0,0,0,1)";
		if (pointsArray.length > 0) {
			for (k = 0; k < pointsArray.length - 1; k+= 1) {
				this.displayLine(pointsArray[k], pointsArray[k + 1], color);
			}
			this.displayLine(pointsArray[0], pointsArray[pointsArray.length - 1], color);
		}
	};
	return Viewer;
})();
