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
	var Point = m.point;
	var Vector = m.vector;
	var pointCrossProduct = m.pointCrossProduct;
	var crossProduct = m.crossProduct;
	var printPoints = m.printPoints;
	var _divideAndConquer, _randomizedAlgorithm, _segmentCrossing, _lozengeOptimization;
	
	_segmentCrossing = function(p1, p2, p3, p4) {
		var a1, a2, b1, b2, xCommon;
		//Slope of lien (p1,p2)
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
		var a, randA, b, randB, c, randC, d, p, barycentre;
		
		randA = Math.randomValue(0, pointsArray.length -1);
		a = pointsArray[randA];
		pointsArray.splice(randA, 1);
		
		randB = Math.randomValue(0, pointsArray.length -1);
		b = pointsArray[randB];
		pointsArray.splice(randB, 1);
		
		randC = Math.randomValue(0, pointsArray.length -1);
		c = pointsArray[randC];
		pointsArray.splice(randC, 1);

		barycentre = new Point({x: (a.x + b.x + c.x) / 3, y:(a.y + b.y + c.y) / 3});

		array = [];
		array.push(a);
		array.push(b);
		array.push(c);
/*


		while(pointsArray.length >= 0) {
			var randP = Math.randomValue(0, pointsArray.length);
			//alert(randP);
			p = pointsArray[randP];
			//alert(p.toString());
			var inside = true;
			var finished = false;
			var i = 0;
			var p1,p2;
			while(!finished && i < array.length) {
				p1 = array[i];
				p2 = array[(i + 1) % array.length];
				if(_segmentCrossing(p, barycentre, p1, p2 )) {
					finished = true;
					inside = false;
				}
				i += 1;
			}
			
			v1 = new Vector({p1: p, p2: barycentre}));
			v2 = new Vector({p1: p, p2: p1}));
			c1 = crossProduct(v1, v2);
			alert(c1);
			if (!inside) {
				if() {
					
				}
			}
			pointsArray.splice(randP, 1);
		}
*/
		
		return array;
	};
	that.randomizedAlgorithm = _randomizedAlgorithm;

	_lozengeOptimization = function(array) {
		var minX, maxX, minY, maxY, barycentre, i, point, toDelete = [];
		
		// Min and Max values to define a lozenges
		minX = array[array.minX()];
		maxX = array[array.maxX()];
		minY = array[array.minY()];
		maxY = array[array.maxY()];

		// Temporary removal all the mins and the maxs to prevent a definitive deletion
		array.splice(array.minX(), 1);
		array.splice(array.maxX(), 1);
		array.splice(array.minY(), 1);
		array.splice(array.maxY(), 1);

		// Calculating the centroid of the lozenge
		barycentre = new m.Point({x: ((minX.x + maxX.x + minY.x + maxY.x) / 4), y:((minX.y + maxX.y + minY.y + maxY.y) / 4)});
		
		for(i = 0; i < array.length; i += 1) {
			point = array[i];
			
			// if the point belongs to the lozenge, we add it to the deletion list
			if(!_segmentCrossing(barycentre, point, minX, minY) && 
			   !_segmentCrossing(barycentre, point, minY, maxX) && 
			   !_segmentCrossing(barycentre, point, maxX, maxY) && 
			   !_segmentCrossing(barycentre, point, maxY, minX)) {
				toDelete.push(i);
			}
		}
		
		// Deletion of the elements from the array
		for (i=0; i < toDelete.length; i += 1) {
			array.splice(toDelete[i] - i, 1);
		}
		
		// Add back all the mins and the maxs 
		array.push(minX);
		array.push(minY);
		array.push(maxX);
		array.push(maxY);
		return array;
	};
	that.lozengeOptimization = _lozengeOptimization;
	
	addOnLoadEvent(function () {
		canvas = new window.convlexEnvelop.Viewer($('exemple'));
	})
	
	return that;
};