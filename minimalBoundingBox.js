/**
 * An implementation of the Minimum Bounding Box Algorithm 
 *
 * Authors:	Nima Izadi - Nicolas Dupont
 */

/**
 * Protecting namespace
 */
(function() {

	/*
	 * Adding the beget method to Object which instanciate an object
	 * Code took from "Javascript - The Good Parts" by Douglas Crockford.
	 */
	if (typeof Object.beget !== 'function') { 
		Object.beget = function (o) {
			var F = function () {};
			F.prototype = o; 
			return new F();
		}
	};
	
	/*
	 * Adding the swap method to the Array object prototype
	 */
	Array.prototype.swap = function (a, b) {
	  var tmp = this[b];
	  this[b] = this[a];
	  this[a] = tmp;
	};
	
	
	/*
	 * Return the dom element object
	 */
	var $ = function (divName) {
		return document.getElementById(divName);
	};
	
	/*
	 * Compute the cross product between three point
	 */
	var pointCrossProduct = function (p1, p2, p3) {
		return (p2.x - p1.x)*(p3.y - p1.y) - (p3.x - p1.x)*(p2.y - p1.y);
	};
	
	/*
	 * Compute the cross product between two vector
	 */
	var crossProduct = function (v1, v2) {
		return v1.x * v2.y - v1.y * v2.x;
	};
	
	
	var printPoints = function (pointsArray) {
		var div = $("output"), i;
		for (i = 0; i < pointsArray.length; i+= 1) {
			div.innerHTML +=  pointsArray[i].print();
		}
		div.innerHTML += "<br />";
	};
	
	/*
	 * Point object
	 * Parameter:
	 *	Hash - spec{ 
	 *					x,
	 *					y
	 *				}
	 */
	var point = function (spec) {
		var that = {};
		var x = spec.x, y = spec.y;
		that.x = x;
		that.y = y;
		that.print = function() {
			return "(" + x + "," + y + ") ";
		};
		return that;
	};
	/*
	 * Vector object
	 * Parameter:
	 *	Hash - spec{ 
	 *					p1,
	 *					p2
	 *				}
	 */
	var vector = function(spec) {
		var that = {};
		that.x = spec.p2.x - spec.p1.x;
		that.y = spec.p2.y - spec.p1.y;
		return that;
	};
	
	var populate = function (n, array) {
		var i = 0;
		while(i < n) {
			var randX = Math.floor(Math.random() * 600);
			var randY = Math.floor(Math.random() * 600);
			i += 1;
			array.push(Object.beget(point({
				x: randX,
				y: randY
			})));
		}
	}
	/**
	 * Affecting onclick function to the execute button
	 */
	window.onload = function () {
		$('execute_button').onclick = function (e) {
			return execute();
		};
	};
	
	var execute = function () {
		var points = [];
		populate($('input').value, points);
		
		points.print = function (outputDiv) {
			var div = $(outputDiv), i;
			div.innerHTML = "";
			for (i = 0; i < points.length; i+= 1) {
				div.innerHTML +=  points[i].print();
			}
		};
		
		
		function divide(pointsArray) {
			//pointsArray.print("output");
			if (pointsArray.length < 4) {
				//alert("< 4 :" + pointsArray.length);
				if (pointsArray.length < 3) {
							//alert("< 3 : " + pointsArray.length);
						//displayLine(pointsArray[0],pointsArray[1], "#999");
						displayPoint(pointsArray[0], "rgb(255,0,0)");
						displayPoint(pointsArray[1], "rgb(0,255,0)");
				}
				else {
					var i;
					if(pointCrossProduct(pointsArray[0], pointsArray[1], pointsArray[2]) <= 0) {
						pointsArray.swap(1,2);
					}
	/*
					for (i = 0; i < pointsArray.length - 1; i+= 1) {
						displayLine(pointsArray[i],pointsArray[i+1], "#999");
					}
	*/
					//displayLine(pointsArray[0],pointsArray[pointsArray.length-1], "#999");		
					displayPoint(pointsArray[0], "rgb(255,0,0)");
					displayPoint(pointsArray[1], "rgb(0,255,0)");
					displayPoint(pointsArray[2], "rgb(0,0,255)");
				}
				return pointsArray;
			} else {
				var median = pointsArray.length / 2;
				var leftPointsArray = pointsArray.slice(0, median);
				var rightPointsArray = pointsArray.slice(median, pointsArray.length);
	/*
							var div = $("output");
				div.innerHTML += "left : ";
				printPoints(leftPointsArray);
				div.innerHTML += "right : ";
				printPoints(rightPointsArray);
	*/
				var leftEnv = divide(leftPointsArray);
				var rightEnv = divide(rightPointsArray);
				rightEnv.reverse();
				var iGauche = maxX(leftEnv); 
				var iDroite = minX(rightEnv); 
	/*
				var iGauche = leftEnv.length-1; 
				var iDroite = 0;
	*/
			/*
		alert("ig : " + iGauche);
				alert("iDr : " + iDroite);
	*/
				var finished = false;
				var envelop = [];
	
				while (!finished) {
					finished = true;
					var v1 = Object.beget(vector({p1: leftEnv[iGauche], p2: rightEnv[iDroite]}));
					var v2 = Object.beget(vector({p1: leftEnv[iGauche], p2: rightEnv[(iDroite + 1) % rightEnv.length]}));
					var v3 = Object.beget(vector({p1: rightEnv[iDroite], p2: leftEnv[(iGauche + 1) % leftEnv.length]}));
					var v4 = Object.beget(vector({p1: rightEnv[iDroite], p2: leftEnv[iGauche]}));
					
					if (crossProduct(v1, v2) > 0) {
						finished = false;
						iDroite = (iDroite + 1) % rightEnv.length;
					}
					
					if (crossProduct(v3, v4) > 0) {
						finished = false;
						iGauche = (iGauche + 1)  % leftEnv.length;
					}
				}
	/* 			displayLine(leftEnv[iGauche], rightEnv[iDroite], "#999"); */
				
				var iGH = iGauche;
				var iDH = iDroite;
				
				envelop.push(leftEnv[iGH]);
				var finished2 = false;
				iGauche = maxX(leftEnv); 
				iDroite = minX(rightEnv); 
	/*
				var iGauche = leftEnv.length-1; 
				var iDroite = 0;
	*/
				while (!finished2) {
					var v1 = Object.beget(vector({p1: leftEnv[iGauche], p2: rightEnv[iDroite]}));
					var v2 = Object.beget(vector({p1: leftEnv[iGauche], p2: rightEnv[(iDroite - 1 + rightEnv.length) % rightEnv.length]}));
					var v3 = Object.beget(vector({p1: rightEnv[iDroite], p2: leftEnv[(iGauche - 1 + leftEnv.length) % leftEnv.length]}));
					var v4 = Object.beget(vector({p1: rightEnv[iDroite], p2: leftEnv[iGauche]}));
					
					finished2 = true;
					if (crossProduct(v1, v2) < 0) {
						finished2 = false;
						iDroite = (iDroite - 1 + rightEnv.length) % rightEnv.length;
					}
					if (crossProduct(v3, v4) < 0) {
						finished2 = false;
						iGauche = (iGauche - 1 + leftEnv.length)  % leftEnv.length;
					}
				}
				//displayLine(leftEnv[iGauche], rightEnv[iDroite], "#999");
				
				var i = iDH;
				while (i != iDroite) {
					envelop.push(rightEnv[i]);
					i = (i + 1 + rightEnv.length) % rightEnv.length; 
				}
				envelop.push(rightEnv[iDroite]);			
				var j = iGauche;
				while (j != iGH) {
					envelop.push(leftEnv[j]);
					j = (j - 1 + leftEnv.length) % leftEnv.length; 
				}
				envelop.reverse();
							return envelop;
			}
		}
		
		var env = divide(points.sort(function(a,b) { return a.x - b.x;}));
		var k;
		for (k = 0; k < env.length - 1; k+= 1) {
			displayLine(env[k], env[k+1], "#AA0000");
		}
		displayLine(env[0], env[env.length - 1], "#AA0000");
	
	
	/*
		var p1 = new Point(400,0);
		var p2 = new Point(500,300);
		var p3 = new Point(273,500);
		var p4 = new Point(700,140);
		displayLine(p1,p2);
		displayLine(p1,p3);
		var v1 = new Vector(p1, p2);
		var v2 = new Vector(p1, p3);
		displayPoint(p1, randomColor());
		displayPoint(p2, randomColor());
		displayPoint(p3, randomColor());
		displayPoint(p4, randomColor());
		alert(crossProduct(v1,v2));
	*/
	
		function maxX(lapatate) {
			var iMax = 0, i;
			for (i = 1; i < lapatate.length; i+= 1) {
				if (lapatate[i].x > lapatate[iMax].x) {
					iMax = i;
				}
			}
			return iMax;
		}
		
		function minX(maPlaque) {
			var iMin = 0, i;
			for (i = 1; i < maPlaque.length; i+= 1) {
				if (maPlaque[i].x < maPlaque[iMin].x) {
					iMin = i;
				}
			}
			return iMin;
		}
		
		function displayPoint(name, color) {
			var exemple = $('exemple');
			var context = exemple.getContext('2d');
			context.fillStyle = color;
			context.beginPath();
			context.arc(name.x,600 - name.y, 2, 0, Math.PI * 2,true);
			context.closePath();
			context.fill();
		}
		
		function displayLine(a, b, color) {
			var exemple = $('exemple');
			var context = exemple.getContext('2d');
		//	context.clearRect(0, 0, exemple.width, exemple.height);
			context.moveTo(a.x,600 - a.y);
			context.lineTo(b.x,600 - b.y);
			context.strokeStyle = color;
			context.stroke();
		}
		
		function randomColor() {
			return "rgba(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ",1)";
		}
	};
})();