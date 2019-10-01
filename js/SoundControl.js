;(function(global) {
	'use strict'

	var SoundControl = function(source, volume) {
		volume = volume && volume !== 0 ? volume : volume === 0 ? 0 : 1
		this.audio = document.createElement('audio')
		this.audio.setAttribute('src', source)
		this.audio.setAttribute('preload', 'auto')
		this.audio.volume = volume
	}

	SoundControl.prototype.play = function() {
		this.audio.pause()
		this.audio.currentTime = 0
		var promise = this.audio.play()
		if (promise !== undefined) {
			promise.then(function(_) {}).catch(function(error) {})
		}
	}

	global.SoundControl = SoundControl
})(window)
