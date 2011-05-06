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
	var m = window.convlexEnvelop.models();
	/* 'Objects' */
	var point = m.point, vector = m.vector;
	/* Functions */
	var pointCrossProduct = m.pointCrossProduct;
	var crossProduct = m.crossProduct;
	var printPoints = m.printPoints;
	var populate, exportPoints, joinTop, divide, populateFromJson, exportToJson;
	/* Variables */
	var canvas, points = [], envelop = [];

	populate = function (n, array) {
		var i = 0;
		while(i < n) {
			var randX = Math.floor(Math.random() * 600);
			var randY = Math.floor(Math.random() * 600);
			i += 1;
			var p = Object.create(point({
					x: randX,
					y: randY
				}));
			while (array.contains(p)) {
				randX = Math.floor(Math.random() * 600);
				randY = Math.floor(Math.random() * 600);
				p = Object.create(point({
					x: randX,
					y: randY
				}));
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
						points.push(Object.create(point({
							x: myObject.points[i].x,
							y: myObject.points[i].y
						})));
					}
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
	 * Affecting onclick function to the execute button
	 */
	addOnLoadEvent(function () {
		$('execute_button').onclick = function (e) {
			points = points.sort(function(a,b) {
				var tmp = a.x - b.x;
				if (tmp === 0) {
					tmp = a.y - b.y;
				}
				return tmp;
			});
			envelop = execute(points);
			canvas.displayPolygon(envelop, canvas.randomColor());	
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
	/*
		points= points.slice(points.length/4, points.length/2);
			points= points.slice(points.length/2, points.length);
			points= points.slice(points.length/2, points.length);
*/
			
			$('input_json').value = exportToJson(points, envelop);
		};
		canvas = Object.create(window.convlexEnvelop.viewer($('exemple')));
		$("clear_button").onclick = function () {
			canvas.clear();
			points = [];
			envelop = [];
			$('output').innerHTML = "";
		};	
	});
})();