/**
 * An implementation of the Convex hull algorithms (divide and conquer) 
 *
 * Authors:	Nima Izadi - Nicolas Dupont
 */

/**
 * Protecting global namespace
 */
(function() {	
	/* 'Objects' */
	var point, vector;
	/* Functions */
	var pointCrossProduct, crossProduct, printPoints, populate;
	/* Variables */
	var canvas;
	/*
	 * Computes the cross product between three point
	 */
	pointCrossProduct = function (p1, p2, p3) {
		return (p2.x - p1.x)*(p3.y - p1.y) - (p3.x - p1.x)*(p2.y - p1.y);
	};
	
	/*
	 * Computes the cross product between two vector
	 */
	crossProduct = function (v1, v2) {
		return v1.x * v2.y - v1.y * v2.x;
	};
	
	/**
	 *
	 */
	printPoints = function (pointsArray) {
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
	point = function (spec) {
		var that = {};
		var x = spec.x || 0, y = spec.y || 0;
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
	vector = function(spec) {
		var that = {};
		that.x = spec.p2.x - spec.p1.x;
		that.y = spec.p2.y - spec.p1.y;
		that.toString = function() {
			return "[" + p1 + "," + p2 + "]";
		};
		return that;
	};
	
	populate = function (n, array) {
		var i = 0;
		while(i < n) {
			var randX = Math.floor(Math.random() * 600);
			var randY = Math.floor(Math.random() * 600);
			i += 1;
			array.push(Object.create(point({
				x: randX,
				y: randY
			})));
		}
	}

	var populateFromJson = function () {
		var myJsonText, myObject, i;
		myJsonText = document.getElementById("xml_input").value;
		if (myJsonText !== "") {
			myObject = eval('(' + myJsonText + ')');
			for (i = 0; i < myObject.points.length; i++) {
				points.push(Object.create(point({
					x: myObject.points[i].x,
					y: myObject.points[i].y
				})));
			}
		}	
	};

	/**
	 * Affecting onclick function to the execute button
	 */
	addOnLoadEvent(function () {
		$('execute_button').onclick = function (e) {
			return execute();
		};
		$('populate_button').onclick = function (e) {
			populate($('input').value, points);
			canvas.displayAllPoints(points);
		};
		canvas = Object.create(window.convlexEnvelop.viewer($('exemple')));
	
		$("parse_button").onclick =  function () {
			populateFromJson();
			canvas.displayAllPoints(points);
		};
	});
	

	
	var points = [];
	var execute = function () {
	
		points.print = function (outputDiv) {
			var div = $(outputDiv), i;
			div.innerHTML = "";
			for (i = 0; i < points.length; i+= 1) {
				div.innerHTML +=  points[i];
			}
		};
				
		//canvas.clearCanvas();
		
		var p1 = point({x: 0, y: 0});
		var p2 = point({x: 0, y: 200});
		var p3 = point({x: 100, y: 200});  
		var p4 = point({x: 200, y: 400});		
		
		//cas limite : points alignŽs
		
		var p = [];
		p.push(p2);
		p.push(p3);
		p.push(p4);
		p.push(p1);
				
		var divide = function (pointsArray) {
			if (pointsArray.length < 4) {
				if(pointsArray.length > 2) {
					//When we have an array of size 3, we sort its elements in counterclockwise by swapping two elements
					if(pointCrossProduct(pointsArray[0], pointsArray[1], pointsArray[2]) <= 0) {
						pointsArray.swap(1,2);
					}
				}
				return pointsArray;
			} else {
				var median = pointsArray.length / 2;
				var leftPointsArray = pointsArray.slice(0, median);
				var rightPointsArray = pointsArray.slice(median, pointsArray.length);

				var leftEnv = divide(leftPointsArray);
				var rightEnv = divide(rightPointsArray);
				rightEnv.reverse();//reverse the sub-envelope right
				
				var iGauche = leftEnv.maxX(); //index of the point having the largest abscissa
				var iDroite = rightEnv.minX(); //index of the point having the smallest abscissa 
				var iDroiteFirst = iDroite;
				var iGaucheFirst = iGauche;
				
				var finished = false;
			//	joinTop(finished, leftEnv, rightEnv, iGauche, iDroite)
				while (!finished) {
					var v1 = Object.create(vector({p1: leftEnv[iGauche], p2: rightEnv[iDroite]}));
					var v2 = Object.create(vector({p1: leftEnv[iGauche], p2: rightEnv[rightEnv.nextIndex(iDroite)]}));
					var v3 = Object.create(vector({p1: rightEnv[iDroite], p2: leftEnv[leftEnv.nextIndex(iGauche)]}));
					var v4 = Object.create(vector({p1: rightEnv[iDroite], p2: leftEnv[iGauche]}));
					
					finished = true;
					
					// Cross product between v1 and v2
					var c1 = crossProduct(v1, v2);
					if(c1 == 0 && (rightEnv[iDroite].x < rightEnv[rightEnv.nextIndex(iDroite)].x)) {
						finished = false;
						iDroite = rightEnv.nextIndex(iDroite);
					}
					if (c1 > 0) {
						finished = false;
						iDroite = rightEnv.nextIndex(iDroite);
					}
					
					// Cross product between v3 and v4
					var c2 = crossProduct(v3, v4);
					if(c2 == 0 && (leftEnv[iGauche].x > leftEnv[leftEnv.nextIndex(iGauche)].x)) {
						finished = false;
						iGauche = leftEnv.nextIndex(iGauche);
					}
					if (c2 > 0) {
						finished = false;
						iGauche = leftEnv.nextIndex(iGauche);
					}
				}
				
				var iGH = iGauche;
				var iDH = iDroite;

				var envelop = [];
				envelop.push(leftEnv[iGH]);
				var finished = false;
				
				iGauche = leftEnv.maxX(); 
				iDroite = rightEnv.minX(); 
				iDroiteFirst = iDroite;
				iGaucheFirst = iGauche;

				while (!finished) {
					var v1 = Object.create(vector({p1: leftEnv[iGauche], p2: rightEnv[iDroite]}));
					var v2 = Object.create(vector({p1: leftEnv[iGauche], p2: rightEnv[rightEnv.previousIndex(iDroite)]}));
					var v3 = Object.create(vector({p1: rightEnv[iDroite], p2: leftEnv[leftEnv.previousIndex(iGauche)]}));
					var v4 = Object.create(vector({p1: rightEnv[iDroite], p2: leftEnv[iGauche]}));
					
					finished = true;
					
					// Cross product between v1 and v2
					c1 = crossProduct(v1, v2);
					if(c1 == 0 && (rightEnv[iDroite].x < rightEnv[rightEnv.previousIndex(iDroite)].x)) {
						finished = false;
						iDroite = rightEnv.previousIndex(iDroite);
					}
					if (c1 < 0) {
						finished = false;
						iDroite = rightEnv.previousIndex(iDroite);
					}
					
					// Cross product between v3 and v4
					c2 = crossProduct(v3, v4);
					if(c2 == 0 && (leftEnv[iGauche].x > leftEnv[leftEnv.previousIndex(iGauche)].x)) {
						finished = false;
						iGauche = leftEnv.previousIndex(iGauche);
					}
					if (c2 < 0) {
						finished = false;
						iGauche = leftEnv.previousIndex(iGauche);
					}
				}
				
				var i = iDH;
				while (i != iDroite) {
					envelop.push(rightEnv[i]);
					i = rightEnv.nextIndex(i); 
				}
				envelop.push(rightEnv[iDroite]);	
						
				i = iGauche;
				while (i != iGH) {
					envelop.push(leftEnv[i]);
					i = leftEnv.previousIndex(i); 
				}
				envelop.reverse();
				return envelop;
			}
		}
		var joinTop = function (finished, leftEnv, rightEnv, iGauche, iDroite) {
			while (!finished) {
				finished = true;
				var v1 = Object.create(vector({p1: leftEnv[iGauche], p2: rightEnv[iDroite]}));
				var v2 = Object.create(vector({p1: leftEnv[iGauche], p2: rightEnv[rightEnv.nextIndex(iDroite)]}));
				var v3 = Object.create(vector({p1: rightEnv[iDroite], p2: leftEnv[leftEnv.nextIndex(iGauche)]}));
				var v4 = Object.create(vector({p1: rightEnv[iDroite], p2: leftEnv[iGauche]}));
			
				if (crossProduct(v1, v2) >= 0) {
					finished = false;
					iDroite = (iDroite + 1) % rightEnv.length;
				}
				
				if (crossProduct(v3, v2) >= 0) {
					finished = false;
					iGauche = (iGauche + 1)  % leftEnv.length;
				}
			}
		};

		var env = divide(points.sort(function(a,b) { return a.x - b.x;}));
		canvas.displayPolygon(env, canvas.randomColor());
		
		printPoints(env);
		//canvas.displayAllPoints(p);
		canvas.displayAllPoints(env);

	};
})();