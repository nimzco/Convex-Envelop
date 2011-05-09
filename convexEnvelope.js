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
	/* Functions */
	var pointCrossProduct = m.pointCrossProduct;
	var crossProduct = m.crossProduct;
	var printPoints = m.printPoints;
	var populate, exportPoints, joinTop, divide, populateFromJson, exportToJson, calculateTime;
	/* Variables */
	var canvas, _points = [], points = [], envelop = [];
	var allPoints = [];
	var generateAllPoints;
	
	generateAllPoints = function (_allPoints, _width, _height) {
		var height, width, i, j;
		width = _width || 600;
		height = _height || width;
		_allPoints.splice(0, _allPoints.length);
		for (i = 0; i < width; i += 1) {
			for (j = 0; j < height; j += 1) {
				_allPoints.push(new m.Point({x:i, y:j}));
			}
		}
	};
	generateAllPoints(allPoints, 600);
	populate = function (n, array) {
		var i = 0;
		while(i < n) {
			var rand = Math.floor(Math.random() * allPoints.length);
			i += 1;
			array.push(allPoints[rand]);
			allPoints.splice(rand, 1);
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

			args = 2 <= arguments.length ? __slice.call(arguments, 1) : []
			func(args);
			
			date = new Date();
			t2 = date.getTime();
			return t2-t1;
	};

	/**
	 * Affecting onclick function to the execute button
	 */
	addOnLoadEvent(function () {
		$('execute_button').onclick = function (e) {
			var algorithm, optimization, calculTime, executeAlgo;
			if ($("select_algo").value === "divide") {
				algorithm = algo.divideAndConquer;
			} else {
				algorithm = algo.randomizedAlgorithm;
			};
			if ($("optimized").checked) {
				optimization = algo.lozengeOptimization;
			} else {
				points = _points.slice(0, _points.length);
				optimization = function(points) { return points; };
			};
			executeAlgo = function () {
				points = optimization(points);
				points = points.sort(function(a,b) {
					var tmp = a.x - b.x;
					if (tmp === 0) {
						tmp = a.y - b.y;
					}
					return tmp;
				});
				envelop = algorithm(points);
			};
			if (points.length > 0) {
				calculTime = calculateTime(executeAlgo);
				$('time').innerHTML += ($("select_algo").value === "divide" ? "Divide and conquer " : "Randomized Algorithm") + ($("optimized").checked ? " (optimized)" : "" ) + ': Time of execution ' + calculTime + 'ms<br />';
				canvas.displayPolygon(envelop, canvas.randomColor());
			}
		};
		
		$('populate_button').onclick = function (e) {
			populate($('input').value, points, allPoints);
			_points = points.slice(0, points.length);
			canvas.displayAllPoints(points);
		};	
		
		$("parse_button").onclick =  function () {
			_points = points = []
			populateFromJson();
			_points = points.slice(0, points.length);			
			canvas.displayAllPoints(points);
			canvas.displayPolygon(envelop);
		};
		
		$("export_button").onclick = function () {
			$('input_json').value = exportToJson(_points, envelop);
		};
		
		canvas = new window.convlexEnvelop.Viewer($('exemple'));
		$("clear_button").onclick = function () {
			generateAllPoints(allPoints, 600);
			canvas.clear();
			points = [];
			_points = [];
			envelop = [];
			$('output').innerHTML = "";
		};	
	});
})();