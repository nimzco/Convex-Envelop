/**
 * Authors:	Nima Izadi - Nicolas Dupont 
 * Mail: nim.izadi@gmail.com - npg.dupont@gmail.com
 *
 * Some objects
 */

if (typeof window.convlexEnvelop === "undefined") {
	window.convlexEnvelop = {};
}
window.convlexEnvelop.models = function () {
	var that = {}

	/*
	 * Computes the cross product between three point
	 */
	that.pointCrossProduct = function (p1, p2, p3) {
		return (p2.x - p1.x)*(p3.y - p1.y) - (p3.x - p1.x)*(p2.y - p1.y);
	};
	
	/*
	 * Computes the cross product between two vector
	 */
	that.crossProduct = function (v1, v2) {
		return v1.x * v2.y - v1.y * v2.x;
	};
	
	/**
	 *
	 */
	that.printPoints = function (pointsArray) {
		var div = $("output"), i;
		for (i = 0; i < pointsArray.length; i+= 1) {
			div.innerHTML +=  pointsArray[i];
		}
		div.innerHTML += "<br />";
	};

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
	that.point = function (spec) {
		var that = {};
		var x = spec.x || 0, y = spec.y || 0;
		that.x = x;
		that.y = y;
		that.toString = function() {
			return "(" + x + "," + y + ") ";
		};
		return that;
	};
	
	/*
	 * Vector object
	 * Parameter:
	 *	spec{		-  Hash
	 *		x, 		- number
	 *		y  		- number 
	 *	}
	 */
	that.vector = function(spec) {
		var that = {};
		that.x = spec.p2.x - spec.p1.x;
		that.y = spec.p2.y - spec.p1.y;
		that.toString = function() {
			return "[" + p1 + "," + p2 + "]";
		};
		return that;
	};
	
	return that;
}