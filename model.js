/**
 * Authors:	Nima Izadi - Nicolas Dupont 
 * Mail: nim.izadi@gmail.com - npg.dupont@gmail.com
 *
 * Some objects
 */

if (typeof window.convlexEnvelop === "undefined") {
	window.convlexEnvelop = {};
}
window.convlexEnvelop.models = {
	
	/*
	 * Computes the cross product between three point
	 */
	pointCrossProduct: function (p1, p2, p3) {
		return (p2.x - p1.x)*(p3.y - p1.y) - (p3.x - p1.x)*(p2.y - p1.y);
	},
	
	/*
	 * Computes the cross product between two vector
	 */
	crossProduct: function (v1, v2) {
		return v1.x * v2.y - v1.y * v2.x;
	},

	/**
	 *
	 */
	printPoints: function (pointsArray) {
		var div = $("output"), i;
		for (i = 0; i < pointsArray.length; i+= 1) {
			div.innerHTML +=  pointsArray[i];
		}
		div.innerHTML += "<br />";
	},

  /************************************************************************************ Defining some objects
  */
  
	/*
	 * Point object
	 * Parameter:
	 *	spec{		-  Hash
	 *		x, 		- number
	 *		y  		- number 
	 *	}
	 */
	Point: (function () {
		function Point(spec) {
			this.x = spec.x;
			this.y = spec.y;
		}
		Point.prototype.toString = function() {
			return "(" + this.x + "," + this.y + ") ";
		};
		return Point;
	})(),
	
	
	/*
	 * Vector object
	 * Parameter:
	 *	spec{		-  Hash
	 *		x, 		- number
	 *		y  		- number 
	 *	}
	 */
	Vector: (function() {
		function Vector(spec) {
			this.x = spec.p2.x - spec.p1.x;
			this.y = spec.p2.y - spec.p1.y;
		}
		Vector.prototype.toString = function () {
			return "[" + this.x + "," + this.y + "]";
		};
		return Vector;
	})()
};