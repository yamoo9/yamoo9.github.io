/**
 * main.js
 *  
 * Copyright 2019, Front-End Masters League
 * http://yamoo9.github.io
 */

;(function FOVA(){
	'use strict'

	// 컨트롤 할 문서 객체 각 변수에 참조
	const actionWrapper = document.querySelector('.action__wrapper')
	const actionPlayButton = actionWrapper.querySelector('.action--play')
	const actionCloseButton = actionWrapper.querySelector('.action--close')
	const videoOuter = actionWrapper.querySelector('.video__outer')
	const videoPlayer = videoOuter.querySelector('.video')

	/**
	 * @function bootstrap
	 * @summary  앱 구동
	 */
	function bootstrap(){
		bindEvents()
	}

	/**
	 * @function bindEvents
	 * @summary  이벤트 연결 관리
	 */
	function bindEvents(){
		// 미디어 서버에서 비디오가 불러와서 재생 가능해지면
		// videoPlayer.addEventListener('canplaythrough', canPlaying)
		// 비동기 처리 시뮬레이션
		window.setTimeout(canPlaying, 3000)
		// video가 모두 재생되어 종료되면
		videoPlayer.addEventListener('ended', hideVideo)
		// 액션 플레이 버튼을 사용자가 클릭하면
		actionPlayButton.addEventListener('click', showVideo)
		// 액션 닫기 버튼을 사용자가 클릭하면
		actionCloseButton.addEventListener('click', hideVideo)
	}

	/**
	 * @function canPlaying
	 * @summary  비디오 재생이 준비되면 실행
	 */
	function canPlaying(){
		actionWrapper.classList.add('video--loaded')
	}

	/**
	 * @function showVideo
	 * @summary  비디오 상태(보임) 변경, 플레이 버튼 zIndex 인라인 스타일 설정 추가, 비디오 재생(시작부터)
	 */
	function showVideo(){
		videoOuter.classList.remove('video--hide')
		videoOuter.classList.add('video--show')
		actionPlayButton.style.zIndex = 10
		videoPlayer.currentTime = 0
		videoPlayer.play()
	}

	/**
	 * @function hideVideo
	 * @summary  비디오 상태(감춤) 변경, 플레이 버튼 zIndex 인라인 스타일 설정 제거, 비디오 일시정지
	 */
	function hideVideo(){
		videoOuter.classList.remove('video--show')
		videoOuter.classList.add('video--hide')
		actionPlayButton.removeAttribute('style')
		videoPlayer.pause()
	}

	bootstrap()
})()
