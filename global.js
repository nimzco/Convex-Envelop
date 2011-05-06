/************************************************************************************ Some global method
*/

/*
 * Add event being careful to not override existing onload methods 
 */
function addOnLoadEvent (func) {
  var oldonload = window.onload;
  if (typeof window.onload != 'function') {
    window.onload = func;
  } else {
    window.onload = function() {
      if (oldonload) {
        oldonload();
      }
      func();
    }
  }
}
  
/*
 * Returns a random value between [_min, _max]
 */
Math.randomValue = function (_max, _min) {
	var min = _min || 0, max = (_max + 1) || 101;
	return Math.floor((Math.random() * (max - min)) + min);
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
	 * Returns the next index regarding the index parameter and the array length
	 */
Array.prototype.nextIndex = function (index) {
	return (index + 1) % this.length;
};

/*
	 * Returns the previous index regarding the index parameter and the array length
	 */	
Array.prototype.previousIndex = function (index) {
	return (index - 1 + this.length)  % this.length;
};

/*
	 * Returns the index of the point having the greatest abscissa
	 */
Array.prototype.maxX = function () {
	var iMax = 0, i;
	for (i = 1; i < this.length; i+= 1) {
		if (this[i].x > this[iMax].x) {
			iMax = i;
		}
	}
	return iMax;
};

/*
	 * Returns the index of the point having the smallest abscissa
	 */
Array.prototype.minX = function () {
	var iMin = 0, i;
	for (i = 1; i < this.length; i+= 1) {
		if (this[i].x < this[iMin].x) {
			iMin = i;
		}
	}
	return iMin;
};


/*
 * Returns the dom element object
 */
var $ = function (divName) {
	return document.getElementById(divName);
};

