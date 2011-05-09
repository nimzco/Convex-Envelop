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
	var _divideAndConquer, _randomizedAlgorithm, _segmentCrossing, _lozengeOptimization, _centroid;
	_centroid = function () {
		var i, centroidX = 0, centroidY = 0;
		for (i = 0; i < arguments.length; i += 1) {
			centroidX += arguments[i].x;
			centroidY += arguments[i].y;
		}
		centroidX = Math.floor(centroidX / i);
		centroidY = Math.floor(centroidY / i);
		return new m.Point({x: centroidX, y: centroidY});
	};
	
	/**
	 * Checks if the segment [p1, p2] and [p3, p4] crosses
	 */
	_segmentCrossing = function(p1, p2, p3, p4) {
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
		if(a1 === a2) {
			return false;
		} else {
			xCommon = (b2 - b1) / (a1 - a2); // abscissa of intersection
			
			// If xCommon is between the first segment and the second, the two segments intersect.
			if ((xCommon > Math.min(p1.x, p2.x)) && 
				(xCommon < Math.max(p1.x, p2.x)) && 
				(xCommon > Math.min(p3.x, p4.x)) && 
				(xCommon < Math.max(p3.x, p4.x))) {
				return true;
			}
		}
		return false;
	};
	that.segmentCrossing = _segmentCrossing;
	
	_divideAndConquer = function (pointsArray) {
		if (pointsArray.length < 4) {
			if(pointsArray.length > 2) {
				// When we have an array of size 3, we sort its elements in counterclockwise by swapping two elements
				if(pointCrossProduct(pointsArray[0], pointsArray[1], pointsArray[2]) <= 0) {
					pointsArray.swap(1,2);
				}
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
			
			leftIndex = leftEnv.maxX(); //index of the point having the largest abscissa
			rightIndex = rightEnv.minX(); //index of the point having the smallest abscissa 
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
			
			leftIndex = leftEnv.maxX(); 
			rightIndex = rightEnv.minX(); 
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
	
	_randomizedAlgorithm = function(pointsArray) {
		var a, randA, b, randB, c, randC, centroid, envelop = [];
		
		// Taking three random point to make the first triangle of the envelop and removing it from pointsArray 
		randA = Math.randomValue(0, pointsArray.length);
		a = pointsArray[randA];
		pointsArray.splice(randA, 1);
		randB = Math.randomValue(0, pointsArray.length);
		b = pointsArray[randB];
		pointsArray.splice(randB, 1);
		randC = Math.randomValue(0, pointsArray.length);
		c = pointsArray[randC];
		pointsArray.splice(randC, 1);
		// Taking the centroid of this triangle
		centroid = _centroid(a, b, c);
		// Adding points of the triangle in the envelop
		envelop.push(a);
		envelop.push(b);
		envelop.push(c);

		// Put the triangle in clockwise direction
		if(pointCrossProduct(envelop[0], envelop[1], envelop[2]) >= 0) { // ça ça va dans une fonction, que vous devriez déjà avoir pour le premier algo
			envelop.swap(1,2);
		}
			
		// Drawing the first triangle
//		canvas.displayPolygon([envelop[0], envelop[1], envelop[2]], "#000");
		
		// Running through all points
		while(pointsArray.length > 0) {
			var c1, c2, v1, v2, v3, v4, distance;
			var randP, p, isOutside = false, finished = false, i, topLimitIndex, bottomLimitIndex, lastBottomIndex, lastTopIndex;
			// Getting a random point and removing it from the set
			randP = Math.randomValue(0, pointsArray.length - 1);
			p = pointsArray[randP];
			pointsArray.splice(randP, 1);

			// Checking if the point is in the current envelop
			for (i = 0; i < envelop.length; i += 1) {;
				if (_segmentCrossing(p, centroid, envelop[i], envelop[envelop.nextIndex(i)])) {
					isOutside = true;
					break;
				}
			} 
			if (!isOutside) {
				continue;
			}

			lastBottomIndex = i;
			lastTopIndex = envelop.nextIndex(i);
			
			// -- If the point is outside
			topLimitIndex = envelop.nextIndex(i);
			bottomLimitIndex = i;
			while (crossProduct(
					new m.Vector({p1: p, p2: envelop[topLimitIndex]}),
					new m.Vector({p1: p, p2: envelop[envelop.nextIndex(topLimitIndex)]})) > 0) {
//				envelop.splice(topLimitIndex, 1);
				topLimitIndex = envelop.nextIndex(topLimitIndex);
			}
			while (crossProduct(
					new m.Vector({p1: p, p2: envelop[bottomLimitIndex]}), 
					new m.Vector({p1: p, p2: envelop[envelop.previousIndex(bottomLimitIndex)]})) < 0) {
//				envelop.splice(bottomLimitIndex, 1);
				bottomLimitIndex = envelop.previousIndex(bottomLimitIndex);
			}

			// If top and Bottom are 
			distance = Math.abs(topLimitIndex - bottomLimitIndex);
			if ((distance > 1) && distance < (envelop.length - 1)) {
				if (bottomLimitIndex < topLimitIndex) {
					envelop.splice(bottomLimitIndex + 1, (topLimitIndex - bottomLimitIndex) - 1);
					envelop.splice(bottomLimitIndex + 1, 0, p);
				} else {
					envelop.splice(bottomLimitIndex + 1, envelop.length);
					envelop.splice(0, topLimitIndex);
					envelop.splice(0, 0, p);
				}
			} else {
				if (lastBottomIndex != bottomLimitIndex) { 
					envelop[envelop.previousIndex(topLimitIndex)] = p;
				} else if (lastTopIndex != topLimitIndex) {
					envelop[envelop.nextIndex(bottomLimitIndex)] = p;
				} else {
					// Inserts p after botttomIndex
					envelop.splice(bottomLimitIndex + 1, 0, p);
				}
			}
		}

		
		return envelop;
	};
	that.randomizedAlgorithm = _randomizedAlgorithm;

	_lozengeOptimization = function(pointsArray, bool) {
		var minX, maxX, minY, maxY, centroid, i, point, toDelete = [];
		
		// Min and Max values to define a lozenges
		minX = pointsArray[pointsArray.minX()];
		maxX = pointsArray[pointsArray.maxX()];
		minY = pointsArray[pointsArray.minY()];
		maxY = pointsArray[pointsArray.maxY()];

/*
		bool = true;
		if (bool) {
			canvas.displayLine(minX,minY);
			canvas.displayLine(minY,maxX);
			canvas.displayLine(maxX,maxY);
			canvas.displayLine(maxY,minX);
		}
*/
		
		// Temporary removal all the mins and the maxs to prevent a definitive deletion
		pointsArray.splice(pointsArray.minX(), 1);
		pointsArray.splice(pointsArray.maxX(), 1);
		pointsArray.splice(pointsArray.minY(), 1);
		pointsArray.splice(pointsArray.maxY(), 1);

		// Calculating the centroid of the lozenge
		centroid = _centroid(minX, maxX, minY, maxY);
		
		for(i = 0; i < pointsArray.length; i += 1) {
			point = pointsArray[i];
			
			// if the point belongs to the lozenge, we add it to the deletion list
			if(!_segmentCrossing(centroid, point, minX, minY) && 
			   !_segmentCrossing(centroid, point, minY, maxX) && 
			   !_segmentCrossing(centroid, point, maxX, maxY) && 
			   !_segmentCrossing(centroid, point, maxY, minX)) {
				toDelete.push(i);
			}
		}
		
		// Deletion of the elements from the pointsArray
		for (i=0; i < toDelete.length; i += 1) {
			pointsArray.splice(toDelete[i] - i, 1);
		}
		
		// Add back all the mins and the maxs 
		pointsArray.push(minX);
		pointsArray.push(minY);
		pointsArray.push(maxX);
		pointsArray.push(maxY);
		return pointsArray;
	};
	that.lozengeOptimization = _lozengeOptimization;
	
	addOnLoadEvent(function () {
		canvas = new window.convlexEnvelop.Viewer($('canvas'));
	})
	
	return that;
};