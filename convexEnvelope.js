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

	populate = function (n, array) {
		var i = 0;
		while(i < n) {
			var randX = Math.floor(Math.random() * 600);
			var randY = Math.floor(Math.random() * 600);
			i += 1;
			var p = new m.Point({
					x: randX,
					y: randY
				});
			while (array.contains(p)) {
				randX = Math.floor(Math.random() * 600);
				randY = Math.floor(Math.random() * 600);
				p = new m.Point({
					x: randX,
					y: randY
				});
			}
			array.push(p);
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
		if (points.length > 0) {
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
	}
	
	/**
	 * Returns the time of execution of an algorithm
   */
	calculateTime = function(algo, array) {
			var result = {};
			var date = new Date();
			var t1 = date.getTime();
			envelop = algo(array);
			date = new Date();
			var t2 = date.getTime();
			result.time = t2-t1;
			result.envelop = envelop; 
			return result;
	}

	/**
	 * Affecting onclick function to the execute button
	 */
	addOnLoadEvent(function () {
		$('execute_button').onclick = function (e) {
			var algorithm, optimization;
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

			points = optimization(points);
			points = points.sort(function(a,b) {
				var tmp = a.x - b.x;
				if (tmp === 0) {
					tmp = a.y - b.y;
				}
				return tmp;
			});
			var calcul = calculateTime(algorithm, points);
			$('time').innerHTML += ($("select_algo").value === "divide" ? "Divide and conquer " : "Randomized Algorithm") + ($("optimized").checked ? " (optimized)" : "" ) + ': Time of execution ' + calcul.time + 'ms<br />';
			envelop = calcul.envelop;
			canvas.displayPolygon(envelop, canvas.randomColor());
		};
		
		$('populate_button').onclick = function (e) {
			populate($('input').value, points);
			_points = points.slice(0, points.length);
			canvas.displayAllPoints(points);
		};	
		
		$("parse_button").onclick =  function () {
			_points = points = []
			populateFromJson();
			_points = points.slice(0, points.length);			
			canvas.displayAllPoints(points);
		};
		
		$("export_button").onclick = function () {
			$('input_json').value = exportToJson(points, envelop);
		};
		
		canvas = new window.convlexEnvelop.Viewer($('exemple'));
		$("clear_button").onclick = function () {
			canvas.clear();
			points = [];
			_points = [];
			envelop = [];
			$('output').innerHTML = "";
		};	
	});
})();