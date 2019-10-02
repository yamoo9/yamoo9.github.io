// Utils
var each = function(list, callback) {
	Array.prototype.forEach.call(list, function(item, index) {
		callback(item, index)
	})
}

// Play Links Tick Sound
;(function(SoundControl) {
	'use strict'
	if (!SoundControl) return

	var btnOverSound = new SoundControl('./sound/btn-over-sound.mp3', 0.45)
	var moduleLinks = document.querySelectorAll('.module-link')
	Array.prototype.forEach.call(moduleLinks, function(link) {
		link.addEventListener('mouseenter', function() {
			btnOverSound.play()
		})
	})

	var trackpadButtonSound = new SoundControl('./sound/btn-over-sound.mp3', 0.45)
	var lecturers = document.querySelectorAll('.lecturer > a')
	Array.prototype.forEach.call(lecturers, function(lecture) {
		lecture.addEventListener('mouseenter', function() {
			trackpadButtonSound.play()
		})
	})

	var woodyBeepSound = new SoundControl('./sound/woody-beep.mp3', 0.6)
	var lectureScheduleLink = document.querySelector('.lecture-schedule')
	lectureScheduleLink.addEventListener('mouseenter', function() {
		woodyBeepSound.play()
	})

	var burstsSound = new SoundControl('./sound/btn-over-sound.mp3', 0.45)
	var blendedLearningButton = document.querySelector('.is-blended-learning button')
	blendedLearningButton.addEventListener('mouseenter', function() {
		burstsSound.play()
	})
})(SoundControl)

// Random Video
;(function() {
	'use strict'

	var videoList = [
		'music-note',
		'notebook',
		'typing',
		'running',
	]

	var randomVideo = function() {
		return './video/' + videoList[Math.floor(Math.random() * videoList.length)] + '.mp4'
	}
	var video = document.querySelector('#bg-video-wrapper video')
	video.setAttribute('src', randomVideo())
})()

// Dim Video
;(function() {
	'use strict'

	// button-dim-close
	var blendedLearningButton = document.querySelector('.is-blended-learning button')
	var dim = document.querySelector('.dim')
	var blendedLearningVideo = dim.querySelector('video')
	var dimCloseButton = dim.querySelector('.button-dim-close')

	var showDim = function() {
		dim.classList.add('is-active')
		blendedLearningVideo.focus()
		setTimeout(function() {
			blendedLearningVideo.play()
		}, 400)
	}

	var hideDim = function() {
		dim.classList.remove('is-active')
		blendedLearningVideo.pause()
		blendedLearningButton.focus()
	}

	blendedLearningButton.addEventListener('click', showDim)

	// A11Y
	blendedLearningButton.addEventListener('keyup', function(e) {
		// Tab Key === 9
		if (e.keyCode === 9 && e.shiftKey) dimCloseButton.focus()
	})
	dimCloseButton.addEventListener('keyup', function(e) {
		if (e.keyCode === 9) blendedLearningVideo.focus()
	})

	dim.addEventListener('click', function(e) {
		switch (e.target.localName) {
			case 'div':
			case 'button':
				hideDim()
		}
	})
})()

// Lecturer Event Control:
// 1. Mouse Enter/Leave
// 2. Keyboards Focus/Blur
;(function() {
	'use strict'

	var lecturers = document.querySelector('.lecturers')
	var lecturerDeresaLink = lecturers.querySelector('.lecturer:first-child a')
	var lecturerY9Link = lecturers.querySelector('.lecturer:last-child a')

	var lectureWith = document.querySelector('.lecture-with')
	var allTextInLectureWith = lectureWith.querySelectorAll('span')
	var withY9Text = lectureWith.querySelector('.with-lecturer')
	var withDeresaText = lectureWith.querySelector('.with-lecturer:last-child')

	var bringOut = function(moduleType) {
		each(allTextInLectureWith, function(text) {
			text.style.opacity = 0.5
		})
		if (moduleType === 'a') {
			withDeresaText.style.opacity = 1
		} else {
			withY9Text.style.opacity = 1
		}
	}

	var bringIn = function(e) {
		each(allTextInLectureWith, function(text) {
			text.style.opacity = 1
		})
	}

	lecturerDeresaLink.addEventListener('mouseenter', bringOut.bind(lecturerDeresaLink, 'a'))
	lecturerDeresaLink.addEventListener('mouseleave', bringIn)
	lecturerDeresaLink.addEventListener('focus', bringOut.bind(lecturerDeresaLink, 'a'))
	lecturerDeresaLink.addEventListener('blur', bringIn)

	lecturerY9Link.addEventListener('mouseenter', bringOut.bind(lecturerY9Link, 'b,c'))
	lecturerY9Link.addEventListener('mouseleave', bringIn)
	lecturerY9Link.addEventListener('focus', bringOut.bind(lecturerY9Link, 'b,c'))
	lecturerY9Link.addEventListener('blur', bringIn)
})()

// Shuffle Text
;(function($, SoundControl) {
	'use strcit'
	if (!$) return

	var shuffleSound = new SoundControl('./sound/shuffle.mp3')
	var tags = document.querySelectorAll('.tag')
	var delay = 300
	Array.prototype.forEach.call(tags, function(tag, i) {
		var shuffleText = new $(tag)
		shuffleText.duration = 400
		shuffleText.emptyCharacter = ' '
		shuffleText.sourceRandomCharacter = 'yamoo9'
		setTimeout(function() {
			shuffleText.start()
			if (i === 1) shuffleSound.play()
		}, 50 * ++i + delay)
	})
})(ShuffleText, SoundControl)

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
