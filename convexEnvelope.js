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
	var pointCrossProduct, crossProduct, printPoints, populate, exportPoints, joinTop, divide, populateFromJson, exportToJson;
	/* Variables */
	var canvas, points = [], envelop = [];

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

	/**
	 * Parses the input to get Json and 
   */
	populateFromJson = function () {
		var myJsonText, myObject, i;
		myJsonText = $("input_json").value;
		if (myJsonText !== "") {
			try {
				myObject = eval('(' + myJsonText + ')');
				for (i = 0; i < myObject.points.length; i++) {
					points.push(Object.create(point({
						x: myObject.points[i].x,
						y: myObject.points[i].y
					})));
				}
				if (typeof myObject.envelop !== "undefined") {
					for (i = 0; i < myObject.envelop.length; i++) {
						envelop.push(Object.create(point({
							x: myObject.envelop[i].x,
							y: myObject.envelop[i].y
						})));
					}
				}
			} catch (e) {
				$("error").innerHTML = "Your JSON Input is malformatted. Error: "  + e;
			}
		}	
	};
	
	/**
	 * Returns points and envelop into Json format for the parser
   */
	exportToJson = function (pointsArray, envelop) {
		var json, i;
		if (points.length > 0) {
			json = "{ 'points': [";
			for(i = 0; i < pointsArray.length; i++) {
				json += "{ 'x': " + pointsArray[i].x + ", 'y':" + pointsArray[i].y + '}';
				json += (i < (pointsArray.length - 1) ? "," : "");
			}
			json += "]";
			if (envelop.length > 0) {
				json += ", 'envelop':";
				json += " [";
				for(i = 0; i < envelop.length; i++) {
					json += "{ 'x': " + envelop[i].x + ", 'y':" + envelop[i].y + '}';
					json += (i < (envelop.length - 1) ? "," : "");
				}
				json += "]";
			}
			json += "}";
		}
		return json || "";
	}

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
		$("parse_button").onclick =  function () {
			populateFromJson();
			canvas.displayAllPoints(points);
			canvas.displayPolygon(envelop);
		};
		$("export_button").onclick = function () {
			$('export_div').innerHTML = exportToJson(points, envelop);
		};
		canvas = Object.create(window.convlexEnvelop.viewer($('exemple')));
		$("clear_button").onclick = function () {
			canvas.clear();
			points = [];
		};	
	});
	
	
	

	var execute = function () {				
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
				
		divide = function (pointsArray) {
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
		joinTop = function (finished, leftEnv, rightEnv, iGauche, iDroite) {
			var v1, v2, v3, v4;
			while (!finished) {
				finished = true;
				v1 = Object.create(vector({p1: leftEnv[iGauche], p2: rightEnv[iDroite]}));
				v2 = Object.create(vector({p1: leftEnv[iGauche], p2: rightEnv[rightEnv.nextIndex(iDroite)]}));
				v3 = Object.create(vector({p1: rightEnv[iDroite], p2: leftEnv[leftEnv.nextIndex(iGauche)]}));
				v4 = Object.create(vector({p1: rightEnv[iDroite], p2: leftEnv[iGauche]}));
			
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

		envelop = divide(points.sort(function(a,b) { return a.x - b.x;}));
		canvas.displayPolygon(envelop, canvas.randomColor());
		
		printPoints(envelop);
		//canvas.displayAllPoints(p);
		canvas.displayAllPoints(envelop);

	};
})();