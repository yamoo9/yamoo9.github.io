;(function(global) {
	'use strict'

	var mouse = {
		_x: 0,
		_y: 0,
		x: 0,
		y: 0,
		updatePosition: function(e) {
			this.x = e.clientX - this._x
			this.y = (e.clientY - this._y) * -1
		},
		setOrigin: function(e) {
			this._x = e.offsetLeft + Math.floor(e.offsetWidth / 2)
			this._y = e.offsetTop + Math.floor(e.offsetHeight / 2)
		},
		show: function() {
			return '(' + this.x + ', ' + this.y + ')'
		},
	}

	// class
	var Perspective3DText = function(container, innerSelector, perspective) {
		this._container = container
		this._perspective = perspective || 15
		this._innerSelector = innerSelector || 'span'
		this._init()
	}

	// staic members
	Perspective3DText.counter = 0
	Perspective3DText.updateRate = 10
	Perspective3DText.isTimeToUpdate = function() {
		return Perspective3DText.counter++ % Perspective3DText.updateRate === 0
	}

	// instance members
	Perspective3DText.prototype._init = function() {
		var container = this._container
		container.style.perspective = this._perspective + 'px'
		container.innerHTML =
			'<' +
			this._innerSelector +
			' class="Perspective3DText_inner">' +
			container.innerHTML +
			'</' +
			this._innerSelector +
			'>'
		this._inner = container.querySelector('.Perspective3DText_inner')
		mouse.setOrigin(this._container)
		this._bind()
	}
	Perspective3DText.prototype._bind = function() {
		var container = this._container

		container.onmouseenter = this._onMouseEnterHandler.bind(this)
		container.onmouseleave = this._onMouseLeaveHandler.bind(this)
		container.onmousemove = this._onMouseMoveHandler.bind(this)
	}
	Perspective3DText.prototype._onMouseEnterHandler = function(e) {
		this._update(e)
	}
	Perspective3DText.prototype._onMouseLeaveHandler = function() {
		this._inner.style = ''
	}
	Perspective3DText.prototype._onMouseMoveHandler = function(e) {
		if (Perspective3DText.isTimeToUpdate()) {
			this._update(e)
		}
	}
	Perspective3DText.prototype._update = function(e) {
		mouse.updatePosition(e)
		this._updateTransformStyle(
			(mouse.y / this._inner.offsetHeight / 2).toFixed(2),
			(mouse.x / this._inner.offsetWidth / 2).toFixed(2)
		)
	}
	Perspective3DText.prototype._updateTransformStyle = function(x, y) {
		var inner = this._inner

		inner.style.transform = inner.style.webkitTransform = inner.style.mozTransform = inner.style.msTransform = inner.style.oTransform =
			'rotateX(' + x + 'deg) rotateY(' + y + 'deg)'
	}

	global.Perspective3DText = Perspective3DText
})(window)
