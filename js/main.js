// Play Links Tick Sound
;(function() {
	'use strict'

	var audio = new Audio()
	audio.src = './sound/btn-over-sound.mp3'
	audio.volume = 0

	var playSound = function() {
		audio.volume = 0.5
		var promise = audio.play()
		if (promise !== undefined) {
			promise
				.then(function(_) {
					// audio.currentTime = 0
				})
				.catch(function(error) {
					// console.error(error.message)
				})
		}
	}

	var moduleLinks = document.querySelectorAll('.module-link')

	Array.prototype.forEach.call(moduleLinks, function(link) {
		link.addEventListener('mouseenter', playSound)
	})
})()
;(function() {
	'use strict'

	var audio = new Audio()
	audio.src = './sound/trackpad-button-click.mp3'
	audio.volume = 0

	var playSound = function() {
		audio.pause()
		audio.currentTime = 0
		audio.volume = 0.9
		var promise = audio.play()
		if (promise !== undefined) {
			promise
				.then(function(_) {
					// audio.currentTime = 0
				})
				.catch(function(error) {
					// console.error(error.message)
				})
		}
	}

	var lecturers = document.querySelectorAll('.lecturer > a')

	Array.prototype.forEach.call(lecturers, function(lecture) {
		lecture.addEventListener('mouseenter', playSound)
	})
})()

// Shuffle Text
;(function($) {
	'use strcit'
	var tags = document.querySelectorAll('.tag')
	var delay = 300
	Array.prototype.forEach.call(tags, function(tag, i) {
		var shuffleText = new $(tag)
		shuffleText.duration = 400
		shuffleText.emptyCharacter = ' '
		shuffleText.sourceRandomCharacter = 'yamoo9'
		setTimeout(function() {
			shuffleText.start()
		}, 50 * ++i + delay)
	})
})(ShuffleText)

// Mouse Move Effect - 3D Perspective Text
;(function() {
	var container = document.querySelector('.catchprize')
	container.innerHTML = '<span>' + container.innerHTML + '</span>'
	var inner = container.querySelector('span')
	var mouse = {
		_x: 0,
		_y: 0,
		x: 0,
		y: 0,
		updatePosition: function(event) {
			var e = event || window.event
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

	mouse.setOrigin(container)

	//-----------------------------------------

	var counter = 0
	var updateRate = 10
	var isTimeToUpdate = function() {
		return counter++ % updateRate === 0
	}

	//-----------------------------------------

	var onMouseEnterHandler = function(event) {
		update(event)
	}

	var onMouseLeaveHandler = function() {
		inner.style = ''
	}

	var onMouseMoveHandler = function(event) {
		if (isTimeToUpdate()) {
			update(event)
		}
	}

	//-----------------------------------------

	var update = function(event) {
		mouse.updatePosition(event)
		updateTransformStyle((mouse.y / inner.offsetHeight / 2).toFixed(2), (mouse.x / inner.offsetWidth / 2).toFixed(2))
	}

	var updateTransformStyle = function(x, y) {
		var style = 'rotateX(' + x + 'deg) rotateY(' + y + 'deg)'
		inner.style.transform = style
		inner.style.webkitTransform = style
		inner.style.mozTransform = style
		inner.style.msTransform = style
		inner.style.oTransform = style
	}

	//-----------------------------------------

	container.onmouseenter = onMouseEnterHandler
	container.onmouseleave = onMouseLeaveHandler
	container.onmousemove = onMouseMoveHandler
})()
