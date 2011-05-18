/**
 * Authors:	Nima Izadi - Nicolas Dupont 
 * Mail: nim.izadi@gmail.com - npg.dupont@gmail.com
 *
 * Main controller
 */
 
/**
 * Protecting global namespace
 */
(function() {
	var m = window.convlexEnvelop.models;
	var algo = window.convlexEnvelop.algorithms();
	var sizeOfCanvas = window.convlexEnvelop.sizeOfCanvas;
	/* Functions */
	var pointCrossProduct = m.pointCrossProduct;
	var crossProduct = m.crossProduct;
	var printPoints = m.printPoints;
	var populate, exportPoints, joinTop, divide, populateFromJson, exportToJson, calculateTime;
	/* Variables */
	var canvas, _points = [], points = [], envelop = [];
	var allPoints = [];
	var generateAllPoints;
	var stats = {}, returnStats;
	stats.divide = {};
	stats.divideOptimized = {};
	stats.randomized = {};
	stats.randomizedOptimized = {};
	
/*	generateAllPoints = function (_allPoints, _width, _height) {
		var height, width, i, j;
		width = _width || sizeOfCanvas;
		height = _height || width;
		_allPoints.splice(0, _allPoints.length);
		for (i = 0; i < width; i += 1) {
			for (j = 0; j < height; j += 1) {
				_allPoints.push(new m.Point({x:i, y:j}));
			}
		}
	};
	generateAllPoints(allPoints, sizeOfCanvas);
*/
	populate = function (n, pointsArray) {
		var i = 0;
		while(i < n) {
			var p, randX, randY;
			do {
				randX = Math.randomValue(sizeOfCanvas);
				randY = Math.randomValue(sizeOfCanvas);
				p = new m.Point({x: randX, y:randY});
			} while(pointsArray.contains(p));
			pointsArray.push(p);
			i += 1;
		}
	};

	/**
	 * Parses the input to get Json and 
	 */
	populateFromJson = function () {
		var myJsonText, myObject, i;
		myJsonText = $("input_json").value;
		if (myJsonText !== "") {
			try {
				myObject = eval('(' + myJsonText + ')');
				if (typeof myObject.points !== "undefined") {
					for (i = 0; i < myObject.points.length; i++) {
						points.push(new m.Point({
							x: myObject.points[i].x,
							y: myObject.points[i].y
						}));
					}
				}	
				if (typeof myObject.envelop !== "undefined") {
					for (i = 0; i < myObject.envelop.length; i++) {
						envelop.push(new m.Point({
							x: myObject.envelop[i].x,
							y: myObject.envelop[i].y
						}));
					}
				}
			} catch (e) {
				$("error").className = ""
				$("error").innerHTML = "Your JSON Input is malformatted. Error: "  + e;
			}
		}	
	};
	
	/**
	 * Returns points and envelop into Json format for the parser
   */
	exportToJson = function (pointsArray, envelop) {
		var json, i;
		json = "{";
		if (pointsArray.length > 0) {
			json += "\n\t'points': [\n";
			for(i = 0; i < pointsArray.length; i++) {
				json += "\t\t{'x': " + pointsArray[i].x + ", 'y':" + pointsArray[i].y + '}';
				json += (i < (pointsArray.length - 1) ? ",\n" : "");
			}
			json += "\n\t]\n";
		}
		json += (pointsArray.length > 0 && envelop.length > 0) ? "," : "";
		if (envelop.length > 0) {
			json += "\n\t'envelop': [\n";
			for(i = 0; i < envelop.length; i++) {
				json += "\t\t{'x': " + envelop[i].x + ", 'y':" + envelop[i].y + '}';
				json += (i < (envelop.length - 1) ? ",\n" : "");
			}
			json += "\n\t]\n";
		}
		json += "}";
		return json || "";
	};
	
	/**
	 * Returns the time of execution of an algorithm
   */
	calculateTime = function(func) {
			var date, t1, t2, args;
			var __slice = Array.prototype.slice;

			date = new Date();
			t1 = date.getTime();

			args = 2 <= arguments.length ? __slice.call(arguments, 1) : [] // manque pas un ; par hasard ???
			func(args);
			
			date = new Date();
			t2 = date.getTime();
			return t2-t1;
	};

	returnStats = function () {
		var i, statsStr;
		statsStr = "<h4>Divide and Conquer</h4>"
		for (i in stats.divide) {
			statsStr +=  i + " points: " + (stats.divide[i].time / stats.divide[i].i).toFixed(2) + "ms  - (" + stats.divide[i].i + ")<br />";
		}
		statsStr += "<h4>Divide and Conquer - Optimized</h4>"
		for (i in stats.divideOptimized) {
			statsStr +=  i + " points: " + (stats.divideOptimized[i].time / stats.divideOptimized[i].i).toFixed(2) + "ms  - (" + stats.divideOptimized[i].i + ")<br />";
		}
		statsStr += "<h4>Randomized</h4>"
		for (i in stats.randomized) {
			statsStr +=  i + " points: " + (stats.randomized[i].time / stats.randomized[i].i).toFixed(2) + "ms  - (" + stats.randomized[i].i + ")<br />";
		}
		statsStr += "<h4>Randomized - Optimized</h4>"
		for (i in stats.randomizedOptimized) {
			statsStr +=  i + " points: " + (stats.randomizedOptimized[i].time / stats.randomizedOptimized[i].i).toFixed(2) + "ms  - (" + stats.randomizedOptimized[i].i + ")<br />";
		}
		return statsStr;
	};
	/**
	 * Affecting onclick function to the execute button
	 */
	addOnLoadEvent(function () {
		canvas = new window.convlexEnvelop.Viewer($('canvas'));
		canvas.width = sizeOfCanvas;
		canvas.height = sizeOfCanvas;

		$('execute_button').onclick = function (e) {
			
			var p1, p2, p3, p4;
			
/*
			p1 = new m.Point({x: 100, y: 100});
			p2 = new m.Point({x: 100, y: 200});
			p3 = new m.Point({x: 100, y: 200});
			p4 = new m.Point({x: 100, y: 400});
*/
			
			p1 = new m.Point({x: 100, y: 100});
			p2 = new m.Point({x: 100, y: 300});
			p3 = new m.Point({x: 100, y: 250});
			p4 = new m.Point({x: 200, y: 250});

	/*
		p1 = new m.Point({x: 100, y: 100});
			p2 = new m.Point({x: 300, y: 300});
			p3 = new m.Point({x: 200, y: 150});
			p4 = new m.Point({x: 400, y: 350});
*/

			
/*
			canvas.displayLine(p1,p2);
			canvas.displayLine(p3,p4);

			alert(algo.segmentCrossing(p1,p2,p3,p4));
			alert(algo.segmentCrossing(p2,p1,p4,p3));
 			alert(algo.intersect(p1,p2,p3,p4));
						
			canvas.displayPoint(p1, "#FF0000");
			canvas.displayPoint(p2, "#FF0000");
			canvas.displayPoint(p3, "#00FF00");
			canvas.displayPoint(p4, "#00FF00");
*/
			
		
	
			var k;
			for(k = 0; k < 1; k += 1) {
				var algorithm, optimization, calculTime, executeAlgo, tempPoints, i;
				tempPoints = _points.slice(0, _points.length);
				if ($("divide").checked) {
					algorithm = algo.divideAndConquer;
				} else {
					algorithm = algo.randomizedAlgorithm;
				};
				if ($("optimized").checked) {
					optimization = algo.lozengeOptimization;
	
				} else {
					optimization = function(pointsArray) { return pointsArray; };
				};
				executeAlgo = function () {
				
					tempPoints = optimization(tempPoints);
					if($("divide").checked){
						tempPoints = tempPoints.sort(function(a,b) {
							var tmp = a.x - b.x;
							if (tmp === 0) {
								tmp = a.y - b.y;
							}
							return tmp;
						});
					}
					envelop = algorithm(tempPoints);
				};
				if (tempPoints.length > 0) {
					calculTime = calculateTime(executeAlgo);
				//	$('time').innerHTML += ($("select_algo").value === "divide" ? "Divide and conquer " : "Randomized Algorithm") + ($("optimized").checked ? " (optimized)" : "" ) + ' - (' + points.length + ' points) -  Time of execution ' + calculTime + 'ms<br />';
					canvas.displayPolygon(envelop, "#00A");
					//canvas.displayAllPoints(points);

					// Getting stats
					if ($("divide").checked) {
						if ($("optimized").checked) {
							if (typeof stats.divideOptimized[points.length] !==  "undefined") {
								stats.divideOptimized[points.length].i += 1;
								stats.divideOptimized[points.length].time += calculTime;
							} else {
								stats.divideOptimized[points.length] = {};
								stats.divideOptimized[points.length].i = 1;
								stats.divideOptimized[points.length].time = calculTime;
							}
						} else {
							if (typeof stats.divide[points.length] !==  "undefined") {
								stats.divide[points.length].i += 1;
								stats.divide[points.length].time += calculTime;
							} else {
								stats.divide[points.length] = {};
								stats.divide[points.length].i = 1;
								stats.divide[points.length].time = calculTime;
							}
						}
					} else {
						if ($("optimized").checked) {
							if (typeof stats.randomizedOptimized[points.length] !==  "undefined") {
								stats.randomizedOptimized[points.length].i += 1;
								stats.randomizedOptimized[points.length].time += calculTime;
							} else {
								stats.randomizedOptimized[points.length] = {};
								stats.randomizedOptimized[points.length].i = 1;
								stats.randomizedOptimized[points.length].time = calculTime;
							}
						} else {
							if (typeof stats.randomized[points.length] !==  "undefined") {
								stats.randomized[points.length].i += 1;
								stats.randomized[points.length].time += calculTime;
							} else {
								stats.randomized[points.length] = {};
								stats.randomized[points.length].i = 1;
								stats.randomized[points.length].time = calculTime;
							}
						}
					}
					$('time').innerHTML = returnStats();
				}
			}


		};
		
		
		$('populate_button').onclick = function (e) {
			populate($('input').value, points, allPoints);
			_points = points.slice(0, points.length);
			canvas.displayAllPoints(points);
			$("nbPoints").innerHTML = "" + _points.length + " points";
		};	
		
		$("parse_button").onclick =  function () {
			_points = points = [];
			populateFromJson();
			_points = points.slice(0, points.length);
			canvas.displayAllPoints(points);
			canvas.displayPolygon(envelop);
		};
		
		$("export_button").onclick = function () {
			$('input_json').value = exportToJson(_points, envelop);
		};
		
		$("clear_button").onclick = function () {
//			generateAllPoints(allPoints, sizeOfCanvas);
			canvas.clear();
			points = [];
			_points = [];
			envelop = [];
			$('output').innerHTML = "";
//			$('time').innerHTML = "";
		};
	});
})();