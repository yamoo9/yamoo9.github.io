// 사운트 컨트롤
;(function(_, SoundControl) {
	'use strict'

	var btnOverSound = new SoundControl('./sound/btn-over-sound.mp3', 0.45)
	var moduleLinks = _.elList('.module-link')
	_.each(moduleLinks, function(link) {
		link.addEventListener('mouseenter', btnOverSound.play.bind(btnOverSound))
	})

	var lecturers = _.elList('.lecturer > a')
	_.each(lecturers, function(lecture) {
		lecture.addEventListener('mouseenter', btnOverSound.play.bind(btnOverSound))
	})

	var woodyBeepSound = new SoundControl('./sound/woody-beep.mp3', 0.6)
	var lectureScheduleLink = _.el('.lecture-schedule')
	lectureScheduleLink.addEventListener('mouseenter', woodyBeepSound.play.bind(woodyBeepSound))

	var blendedLearningButton = _.el('.is-blended-learning button')
	blendedLearningButton.addEventListener('mouseenter', btnOverSound.play.bind(btnOverSound))
})(y9, SoundControl)

// 랜덤 배경 비디오
;(function(_) {
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

	var video = _.el('#bg-video-wrapper video')
	video.setAttribute('src', randomVideo())
})(y9)

// 블렌디드 러닝 비디오 + 딤(dim)
;(function(_) {
	'use strict'

	var blendedLearningButton = _.el('.is-blended-learning button')
	var dim = _.el('.dim')
	var blendedLearningVideo = _.el('video', dim)
	var dimCloseButton = _.el('.button-dim-close', dim)

	var showDim = function() {
		blendedLearningButton.setAttribute('aria-pressed', true)
		dim.classList.add('is-active')
		dim.focus()
		setTimeout(function() {
			blendedLearningVideo.play()
		}, 600)
	}

	var hideDim = function() {
		blendedLearningButton.setAttribute('aria-pressed', false)
		dim.classList.remove('is-active')
		blendedLearningVideo.pause()
		blendedLearningButton.focus()
	}

	blendedLearningButton.addEventListener('click', showDim)

	// A11Y
	dim.addEventListener('keyup', function(e) {
		if (e.shiftKey && e.keyCode === 9) {
			dimCloseButton.focus()
		}
	})
	dimCloseButton.addEventListener('blur', function(e) {
		blendedLearningVideo.focus()
	})

	dim.addEventListener('click', function(e) {
		switch (e.target.localName) {
			case 'div':
			case 'button':
				hideDim()
		}
	})
})(y9)

// 강사 이벤트 컨트롤
// - 1. 마우스 이벤트: Enter/Leave
// - 2. 키 이벤트: Focus/Blur
;(function(_) {
	'use strict'

	var lecturers = _.el('.lecturers')
	var lecturerDeresaLink = _.el('.lecturer:first-child a', lecturers)
	var lecturerY9Link = _.el('.lecturer:last-child a', lecturers)

	var lectureWith = _.el('.lecture-with')
	var allTextInLectureWith = _.elList('span', lectureWith)
	var withY9Text = _.el('.with-lecturer', lectureWith)
	var withDeresaText = _.el('.with-lecturer:last-child', lectureWith)

	var bringOut = function(moduleType) {
		_.each(allTextInLectureWith, function(text) {
			text.style.opacity = 0.5
		})
		if (moduleType === 'a') withDeresaText.style.opacity = 1
		else withY9Text.style.opacity = 1
	}

	var bringIn = function(e) {
		_.each(allTextInLectureWith, function(text) {
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
})(y9)

// 셔플 텍스트
;(function(_, $, SoundControl) {
	'use strcit'

	var shuffleSound = new SoundControl('./sound/shuffle.mp3')
	var tags = _.elList('.tag')
	var delay = 300

	_.each(tags, function(tag, i) {
		var shuffleText = new $(tag)
		shuffleText.duration = 400
		shuffleText.emptyCharacter = ' '
		shuffleText.sourceRandomCharacter = 'yamoo9'
		setTimeout(function() {
			shuffleText.start()
			if (i === 1) shuffleSound.play()
		}, 50 * ++i + delay)
	})
})(y9, ShuffleText, SoundControl)

// 3D 퍼스펙티브 텍스트
;(function(_, Perspective3DText) {
	'use strict'

	new Perspective3DText(_.el('.catchprize'))
})(y9, Perspective3DText)
