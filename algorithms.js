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
		if(a1 === a2 && b1 === b2) {
			if((a1 == Infinity) || (a1 == -Infinity)) {
				if (p1.x != p3.x) {
					return false;
				}
				if ((Math.min(p3.y,p4.y) >= Math.min(p1.y, p2.y)) && 
					(Math.min(p3.y,p4.y) <= Math.max(p1.y, p2.y))
				) {
					return true;
				} else {
					return false;
				}	
			} else {
				if (a1 === 0 && a2 === 0 && p1.y != p3.y) {
					return false;
				}
				if ((Math.min(p3.x,p4.x) >= Math.min(p1.x, p2.x)) && 
					(Math.min(p3.x,p4.x) <= Math.max(p1.x, p2.x))
				) {
					return true;
				} else {
					return false;
				}	
			}
		}
			
		if(a1 === 0 && a2 === 0) {
			if(p1.y === p3.y) {
				return true;
			}
		}		
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
		var Sx, Sy;
 		var Ax, Ay, Bx, By, Cx, Cy, Dx, Dy;
 		Ax = p1.x;
 		Ay = p1.y;
 		Bx = p2.x;
 		By = p2.y;
 		Cx = p3.x;
 		Cy = p3.y;
 		Dx = p4.x;
 		Dy = p4.y;
 		
		if(Ax === Bx) {
			if(Cx === Dx) {
				return false;
			} else {
				var pCD = (Cy - Dy) / (Cx - Dx);
				Sx = Ax;
				Sy = pCD * (Ax - Cx) + Cy;
			}
		} else {
			if(Cx === Dx) {
				var pAB = (Ay - By) / (Ax - Bx);
				Sx = Cx;
				Sy = pAB * (Cx - Ax) + Ay;
			} else {
				var pCD, pAB, oCD, oAB;
				pCD = (Cy - Dy) / (Cx - Dx);
				pAB = (Ay - By) / (Ax - Bx);
				oCD = Cy - pCD * Cx;
				oAB = Ay - pAB * Ax;
				Sx = (oAB - oCD) / (pCD - pAB);
				Sy = pCD * Sx + oCD;
			}
		}
		if((Sx < Ax && Sx < Bx) 
		|| (Sx > Ax && Sx > Bx) 
		|| (Sx < Cx && Sx < Dx) 
		|| (Sx > Cx && Sx > Dx)
		|| (Sy < Ay && Sy < By)
		|| (Sy > Ay && Sy > By) 
		|| (Sy < Cy && Sy < Dy)
		|| (Sy > Cy && Sy > Dy)
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
			var median, leftPointsArray, rightPointsArray, leftEnv, rightEnv, leftIndex, rightIndex, firstRightIndex, firstLeftIndex, finished = false, i, iGH, iDH, envelop = [];
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

			envelop.push(leftEnv[iGH]);
			
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

			i = iDH;
			while (i != rightIndex) {
				envelop.push(rightEnv[i]);
				i = rightEnv.nextIndex(i); 
			}
			envelop.push(rightEnv[rightIndex]);	
					
			i = leftIndex;
			while (i != iGH) {
				envelop.push(leftEnv[i]);
				i = leftEnv.previousIndex(i); 
			}
			envelop.reverse();
			return envelop;
		}
	};
	that.divideAndConquer = _divideAndConquer;

	/*
	 * Randomized algorithm
	 */
	_randomizedAlgorithm = function(pointsArray) {
		var a, randA, b, randB, c, randC, centroid, envelop = [];
		
		// Taking three random point to make the first triangle of the envelop and removing it from pointsArray 
		randA = Math.randomValue(pointsArray.length - 1);
		a = pointsArray[randA];
		pointsArray.splice(randA, 1);
		randB = Math.randomValue(pointsArray.length - 1);
		b = pointsArray[randB];
		pointsArray.splice(randB, 1);
		randC = Math.randomValue(pointsArray.length - 1);
		c = pointsArray[randC];
		pointsArray.splice(randC, 1);
		
		// Taking the centroid of this triangle
		centroid = _centroid(a, b, c);

		// Adding points of the triangle in the envelop
		envelop.push(a);
		envelop.push(b);
		envelop.push(c);

		// Put the triangle in clockwise direction
		turnClockwise(envelop);
		// Running through all points
		while(pointsArray.length > 0) {
			var c1, c2, v1, v2, v3, v4, distance, temp = [];
			var randP, p, isOutside = false, finished = false, i, topLimitIndex, bottomLimitIndex;
			// Getting a random point and removing it from the set
			randP = Math.randomValue(pointsArray.length - 1);

			p = pointsArray[randP];
			pointsArray.splice(randP, 1);
			isOutside = false;
			// Checking if the point is in the current envelop
			for (i = 0; i < envelop.length; i += 1) {;
				if (_segmentCrossing(p, centroid, envelop[i], envelop[envelop.nextIndex(i)])) {
					isOutside = true;
					break;
				}
			} 
			
			// -- If the point is outside the current envelop
			if (isOutside) {
				topLimitIndex = envelop.nextIndex(i);
				bottomLimitIndex = i;

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
	
				while(topLimitIndex != bottomLimitIndex) {
					temp.push(envelop[topLimitIndex]);
					topLimitIndex = envelop.nextIndex(topLimitIndex);
				}
				temp.push(envelop[bottomLimitIndex]);
				temp.push(p);
				envelop = temp.slice(0, temp.length);
			}
		}
		return envelop;
	};
	that.randomizedAlgorithm = _randomizedAlgorithm;

	/*
	 * Lozenge optimization
	 */
	_lozengeOptimization = function(pointsArray, bool) {
		var minX, minXIndex, maxX, maxXIndex, minY, minYIndex, maxY, maxYIndex, centroid, i, point, toDelete = [];

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

		for(i = 0; i < pointsArray.length; i += 1) {
			point = pointsArray[i];
			if (i != minXIndex && i != maxXIndex && i != minYIndex && i != maxYIndex) {
				// if the point belongs to the lozenge, we add it to the deletion list
<<<<<<< HEAD
				if(!_intersect(centroid, point, minX, minY) && 
				   !_intersect(centroid, point, minY, maxX) && 
				   !_intersect(centroid, point, maxX, maxY) && 
				   !_intersect(centroid, point, maxY, minX)) {
=======
				if(!_segmentCrossing(centroid, point, minX, minY) && 
				   !_segmentCrossing(centroid, point, minY, maxX) && 
				   !_segmentCrossing(centroid, point, maxX, maxY) && 
				   !_segmentCrossing(centroid, point, maxY, minX)) {
>>>>>>> 74633235187e759a8fe9770cc87dc25b8da0bd83
					toDelete.push(i);
				}
			}
		}
		// Deletion of the elements from the pointsArray
		for (i = 0; i < toDelete.length; i += 1) {
			pointsArray.splice(toDelete[i] - i, 1);
		}
		return pointsArray;
	};
	that.lozengeOptimization = _lozengeOptimization;
	
	addOnLoadEvent(function () {
		canvas = new window.convlexEnvelop.Viewer($('canvas'));
	})

	return that;
};