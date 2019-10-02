// Utils
;(function(global){
	'use strict'

	var getElementBySelector = function(selector, context) {
		return (context || document).querySelector(selector)
	}
	var getElementBySelectorAll = function(selector, context) {
		return (context || document).querySelectorAll(selector)
	}
	var eachElementsCallback = function(list, callback) {
		Array.prototype.forEach.call(list, function(item, index) {
			callback(item, index)
		})
	}

	global.y9 = {
		el: getElementBySelector,
		elList: getElementBySelectorAll,
		each: eachElementsCallback,
  }
  
})(window)