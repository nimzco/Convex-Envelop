/**
 * Authors:	Nima Izadi - Nicolas Dupont 
 * Mail: nim.izadi@gmail.com - npg.dupont@gmail.com
 *
 * An implementation of the Convex hull algorithms (divide and conquer) 
 */
 

if (typeof window.convlexEnvelop === "undefined") {
	window.convlexEnvelop = {};
}
window.convlexEnvelop.algorithms = function () {
	var that = {};
	var m = window.convlexEnvelop.models;
	/* Getting shortcut name for method within window.convlexEnvelop.models */
	var pointCrossProduct = m.pointCrossProduct;
	var crossProduct = m.crossProduct;
	var printPoints = m.printPoints;
	var _divideAndConquer, _randomizedAlgorithm, _segmentCrossing__old, _lozengeOptimization, _intersect, _segmentCrossing ,_newIntersect, _centroid, turnClockwise;
	var isInsidePolygon, pointInPolygon;
	
	/*
	 * Turns a triangle clockwise
	 */
	turnClockwise = function (triangle){
		if(pointCrossProduct(triangle[0], triangle[1], triangle[2]) >= 0) {
			triangle.swap(1,2);
		}
	};
	
	/*
	 * Turns a triangle counter clockwise
	 */
	turnCounterClockwise = function (triangle){
		if(pointCrossProduct(triangle[0], triangle[1], triangle[2]) <= 0) {
			triangle.swap(1,2);
		}
	};
	
	/*
	 * Returns the centroid of points passed in parameters
	 */
	_centroid = function () {
		var i, centroidX = 0, centroidY = 0;
		for (i = 0; i < arguments.length; i += 1) {
			centroidX += arguments[i].x;
			centroidY += arguments[i].y;
		}
		centroidX = (centroidX / i);
		centroidY = (centroidY / i);
		return new m.Point({x: centroidX, y: centroidY});
	};
	that.centroid = _centroid;
	
	/**
	 * /!\ Do not work /!\
	 * Checks if the segment [p1, p2] and [p3, p4] crosses 
	 */
	_segmentCrossing__old = function(p1, p2, p3, p4) {
		var a1, a2, b1, b2, xCommon;
		//Slope of line (p1,p2)
		a1 = (p2.y - p1.y) / (p2.x - p1.x);
		
		//Slope of line (p3,p4)
		a2 = (p4.y - p3.y) / (p4.x - p3.x);
		// Y-intercept of line (p1,p2)
		b1 = p1.y - (a1 * p1.x);

		// Y-intercept of line (p3,p4)
		b2 = p3.y - (a2 * p3.x);
		// If the lines have the same slope, they are parallel, and they do not intersect.			
		if((a2 === Infinity) || (a2 === -Infinity)) {
			xCommon = p3.x;
			if ((xCommon >= Math.min(p1.x, p2.x)) && (xCommon <= Math.max(p1.x, p2.x))) {
				return true;
			}
		} 
		else if((a1 == Infinity) || (a1 == -Infinity)) {
			xCommon = p1.x;
			if ((xCommon >= Math.min(p3.x, p4.x)) && (xCommon <= Math.max(p3.x, p4.x))) {
				return true;
			}
		}
		else {
			xCommon = (b2 - b1) / (a1 - a2); // abscissa of intersection
		}		
		// If xCommon is between the first segment and the second, the two segments intersect.
		if ((xCommon >= Math.min(p1.x, p2.x)) && 
			(xCommon <= Math.max(p1.x, p2.x)) && 
			(xCommon >= Math.min(p3.x, p4.x)) && 
			(xCommon <= Math.max(p3.x, p4.x))) {
			return true;
		}
		return false;
	};
	
	pointInPolygon = function(envelop, p) {
		var i, j, oddNodes = false;
		j = envelop.length - 1;

		for (i = 0; i < envelop.length; i += 1) {
	    	if (envelop[i].y < p.y && envelop[j].y >= p.y || 
	    	 	envelop[j].y < p.y && envelop[i].y >= p.y) {
 			     if (envelop[i].x + (p.y - envelop[i].y) / (envelop[j].y - envelop[i].y) * (envelop[j].x - envelop[i].x) < p.x) {
			        oddNodes = !oddNodes; 
			     }
			 }
    		j = i;
    	}
	  	return oddNodes;
	}

	
	
	/**
	 * /!\ Too long /!\
	 */
	_intersect = function (p1, p2, p3, p4) {
		return (((pointCrossProduct(p1, p2, p3) * pointCrossProduct(p1, p2, p4)) <= 0) && 
	 			((pointCrossProduct(p3, p4, p1) * pointCrossProduct(p3, p4, p2)) <= 0));
	};
	//that.intersect = _intersect;

	/**
	 * Checks if the segment [p1, p2] and [p3, p4] crosses 
	 */
	_segmentCrossing = function (p1, p2, p3, p4) {
		var Sx, Sy, pCD, pAB, oCD, oAB;
 		
		if(p1.x === p2.x) {
			if(p3.x === p4.x) {
				return false;
			} else {
				pCD = (p3.y - p4.y) / (p3.x - p4.x);
				Sx = p1.x;
				Sy = pCD * (p1.x - p3.x) + p3.y;
			}
		} else {
			if(p3.x === p4.x) {
				pAB = (p1.y - p2.y) / (p1.x - p2.x);
				Sx = p3.x;
				Sy = pAB * (p3.x - p1.x) + p1.y;
			} else {
				pCD = (p3.y - p4.y) / (p3.x - p4.x);
				pAB = (p1.y - p2.y) / (p1.x - p2.x);
				oCD = p3.y - pCD * p3.x;
				oAB = p1.y - pAB * p1.x;
				Sx = (oAB - oCD) / (pCD - pAB);
				Sy = pCD * Sx + oCD;
			}
		}
		if((Sx < p1.x && Sx < p2.x) 
		|| (Sx > p1.x && Sx > p2.x) 
		|| (Sx < p3.x && Sx < p4.x) 
		|| (Sx > p3.x && Sx > p4.x)
		|| (Sy < p1.y && Sy < p2.y)
		|| (Sy > p1.y && Sy > p2.y) 
		|| (Sy < p3.y && Sy < p4.y)
		|| (Sy > p3.y && Sy > p4.y)
		) {
			return false;
		} 
		return true;
	};
	that.segmentCrossing = _segmentCrossing;
	
	/*
	 * Divide And Conquer Algorithm
	 */
	_divideAndConquer = function (pointsArray) {
		if (pointsArray.length < 4) {
			if(pointsArray.length > 2) {
				// When we have an array of size 3, we sort its elements in counterclockwise by swapping two elements
				turnCounterClockwise(pointsArray);
			}
			return pointsArray;
		} else {
			var median, leftPointsArray, rightPointsArray, leftEnv, rightEnv, leftIndex, rightIndex, firstRightIndex, firstLeftIndex, finished = false, i, iGH, iDH, envelop = [], envelopIndex = 0;
			median = pointsArray.length / 2;
			leftPointsArray = pointsArray.slice(0, median);
			rightPointsArray = pointsArray.slice(median, pointsArray.length);

			leftEnv = _divideAndConquer(leftPointsArray);
			rightEnv = _divideAndConquer(rightPointsArray);
			rightEnv.reverse();//reverse the sub-envelope right
			
			leftIndex = leftEnv.maxXminY(); //index of the point having the largest abscissa
			rightIndex = rightEnv.minXmaxY(); //index of the point having the smallest abscissa 
			firstRightIndex = rightIndex;
			firstLeftIndex = leftIndex;
			
			/* Computing vector top */
			while (!finished) {
				var v1, v2, v3, c1, c2, comparator;
				v1 = new m.Vector({p1: leftEnv[leftIndex], p2: rightEnv[rightIndex]});
				v2 = new m.Vector({p1: leftEnv[leftIndex], p2: rightEnv[rightEnv.nextIndex(rightIndex)]});
				v3 = new m.Vector({p1: leftEnv[leftEnv.nextIndex(leftIndex)], p2: rightEnv[rightIndex]});
				comparator = function (x, y) { return x > y; };
				finished = true;
				
				// Cross product between v1 and v2
				c1 = crossProduct(v1, v2);
				if((c1 == 0 && rightEnv.betterNextRight(rightIndex, comparator)) || (comparator(c1, 0))) {
					finished = false;
					rightIndex = rightEnv.nextIndex(rightIndex);
				}
				
				// Cross product between v3 and v4
				c2 = crossProduct(v3, v1);
				if((c2 == 0 && leftEnv.betterNextLeft(leftIndex, comparator)) || (comparator(c2, 0))) {
					finished = false;
					leftIndex = leftEnv.nextIndex(leftIndex);
				}
			}
			
			iGH = leftIndex;
			iDH = rightIndex;

			envelop[envelopIndex] = rightEnv[iDH];
			envelopIndex += 1;
			
			finished = false;
			
			leftIndex = leftEnv.maxXminY(); 
			rightIndex = rightEnv.minXmaxY(); 
			firstRightIndex = rightIndex;
			firstLeftIndex = leftIndex;

			/* Computing vector bottom */
			while (!finished) {
				var v1, v2, v3, c1, c2, comparator;
				v1 = new m.Vector({p1: leftEnv[leftIndex], p2: rightEnv[rightIndex]});
				v2 = new m.Vector({p1: leftEnv[leftIndex], p2: rightEnv[rightEnv.previousIndex(rightIndex)]});
				v3 = new m.Vector({p1: leftEnv[leftEnv.previousIndex(leftIndex)], p2: rightEnv[rightIndex]});
				comparator = function (x, y) { return x < y; };
				finished = true;
				
				// Cross product between v1 and v2
				c1 = crossProduct(v1, v2);
				
				if((c1 == 0 && rightEnv.betterPreviousRight(rightIndex, comparator)) || (comparator(c1, 0))) {
					finished = false;
					rightIndex = rightEnv.previousIndex(rightIndex);
				}
				
				// Cross product between v3 and v4
				c2 = crossProduct(v3, v1);
				if((c2 == 0 && leftEnv.betterPreviousLeft(leftIndex, comparator)) || (comparator(c2, 0))) {
					finished = false;
					leftIndex = leftEnv.previousIndex(leftIndex);
				}
			}

			i = iGH;
			while (i != leftIndex) {
				envelop[envelopIndex] = leftEnv[i];
				envelopIndex += 1;
				i = leftEnv.nextIndex(i); 
			}
			envelop[envelopIndex] = leftEnv[leftIndex];
			envelopIndex += 1;
			
			i = rightIndex;
			while (i != iDH) {
				envelop[envelopIndex] = rightEnv[i];
				envelopIndex += 1;
				i = rightEnv.previousIndex(i); 
			}
			//envelop.reverse();
			return envelop;
		}
	};
	that.divideAndConquer = _divideAndConquer;

	/*
	 * Randomized algorithm
	 */
	_randomizedAlgorithm = function(pointsArray) {
		var a, randA, b, randB, c, randC, centroid, envelop = [], k;
		
		// Taking the three first point of the array to make the first triangle of the envelop and removing it from pointsArray 
		// We do not take the points randomly because the array is already unordered.
		// Adding points of the triangle in the envelop
		envelop[0] = pointsArray[0];		
		envelop[1] = pointsArray[1];
		envelop[2] = pointsArray[2];
		// Taking the centroid of this triangle
		centroid = _centroid(envelop[0], envelop[1], envelop[2]);


		// Put the triangle in clockwise direction
		turnClockwise(envelop);
		// Running through all points
		for (k = 3; k < pointsArray.length; k += 1) {
			var c1, c2, v1, v2, v3, v4, distance, temp = [];
			var randP, p, isOutside = false, finished = false, i, topLimitIndex, bottomLimitIndex;

			// Getting a random point and removing it from the set
			p = pointsArray[k];
			
			// Checking if the point is in the current envelop
			var i = 0;
			for (i = 0; i < envelop.length; i += 1) {
				if (_segmentCrossing(p, centroid, envelop[i], envelop[envelop.nextIndex(i)])) {
					isOutside = true;
					bottomLimitIndex = i;
					topLimitIndex = envelop.nextIndex(i);
					break;
				}
			}

			// -- If the point is outside the current envelop
			if (isOutside) {

				var c1;
				while (crossProduct(
						new m.Vector({p1: p, p2: envelop[topLimitIndex]}),
						new m.Vector({p1: p, p2: envelop[envelop.nextIndex(topLimitIndex)]})) > 0) {
					topLimitIndex = envelop.nextIndex(topLimitIndex);
				}

				while (crossProduct(
						new m.Vector({p1: p, p2: envelop[bottomLimitIndex]}), 
						new m.Vector({p1: p, p2: envelop[envelop.previousIndex(bottomLimitIndex)]})) < 0) {
					bottomLimitIndex = envelop.previousIndex(bottomLimitIndex);
				}
				
				i = 0;
				while(topLimitIndex != bottomLimitIndex) {
					temp[i] = envelop[topLimitIndex];
					topLimitIndex = envelop.nextIndex(topLimitIndex);
					i += 1;
				}
				temp[i] = envelop[bottomLimitIndex];
				temp[i + 1] = p;
				envelop = temp;
			}
					
		}
		return envelop;
	};
	that.randomizedAlgorithm = _randomizedAlgorithm;

	/*
	 * Lozenge optimization
	 */
	_lozengeOptimization = function(pointsArray, bool) {
		var minX, minXIndex, maxX, maxXIndex, minY, minYIndex, maxY, maxYIndex, centroid, i, result = [];

		// Min and Max values to define a lozenges
		minXIndex = pointsArray.minXmaxY();
		minX = pointsArray[minXIndex];
		
		maxXIndex = pointsArray.maxXminY();
		maxX = pointsArray[maxXIndex];
			
		minYIndex = pointsArray.minYminX();
		minY = pointsArray[minYIndex];
		
		maxYIndex = pointsArray.maxYmaxX();
		maxY = pointsArray[maxYIndex];
		
		// Calculating the centroid of the lozenge
		centroid = _centroid(minX, maxX, minY, maxY);

		result.push(minX);
		result.push(maxX);
		result.push(minY);
		result.push(maxY);
		for(i = 0; i < pointsArray.length; i += 1) {
			if (i != minXIndex && i != maxXIndex && i != minYIndex && i != maxYIndex) {
				// if the point belongs to the lozenge, we add it to the deletion list
				if(_segmentCrossing(centroid, pointsArray[i], minX, minY) || 
				   _segmentCrossing(centroid, pointsArray[i], minY, maxX) || 
				   _segmentCrossing(centroid, pointsArray[i], maxX, maxY) || 
				   _segmentCrossing(centroid, pointsArray[i], maxY, minX)) {
   					result.push(pointsArray[i]);
				}
			}
		}
		return result;
	};
	that.lozengeOptimization = _lozengeOptimization;
	
	addOnLoadEvent(function () {
		canvas = new window.convlexEnvelop.Viewer($('canvas'));
	})

	return that;
};