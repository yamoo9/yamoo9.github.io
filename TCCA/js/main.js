/**
 * main.js
 *  
 * Copyright 2019, Front-End Masters League
 * http://yamoo9.github.io
 */

function init(){
	pageTransitonAndKeyboardNavigation()
	customCursor()
}

function pageTransitonAndKeyboardNavigation(){
	'use strcit'

	// 로컬 변수
	let body = document.body
	let transitionTime = 350
	let globalNavigation = null
	let globalNavLinks = null
	let activeClass = 'is-active'
	let total = null
	let current = null

	/**
	 * @function bootstrap
	 * @summary  부트스트랩
	 */
	const bootstrap = () => {
		settingBodyTransition()
		settingGlobaNavigation()
		bindEvents()
		keyboardNavigate()
	}

	/**
	 * @function settingBodyTransition
	 * @summary  body 객체의 장면전환 class 속성 컨트롤
	 */
	const settingBodyTransition = () => {
		window.setTimeout(() => body.classList.add('render'), transitionTime)
	}

	/**
	 * @function settingGlobaNavigation
	 * @summary  글로벌 내비게이션 객체의 총 개수 및 활성화 인덱스 설정
	 */
	const settingGlobaNavigation = () => {
		// 글로벌 내비게이션 문서 객체 참조
		globalNavigation = document.querySelector('.demo__navigation')
		// 글로벌 내비게이션 링크 수집 후, 배열 데이터로 변경
		// IE 미지원
		// IE 지원이 필요한 경우, 폴리필(lib/arrayFrom.min.js) 파일 로드
		globalNavLinks = Array.from(globalNavigation.querySelectorAll('a'))
		// 글로벌 내비게이션 링크 총 개수
		total = globalNavLinks.length
		// 현재 활성화 상태의 내비게이션 링크 인덱스
		current = globalNavLinks.findIndex((link) =>
			link.classList.contains(activeClass)
		)
	}

	const bindEvents = () => {
		globalNavigation.addEventListener('click', (e) => {
			const el = e.target
			switch (el.localName) {
				case 'a':
					e.preventDefault()
					let isSamePage =
						el.getAttribute('href') ===
						globalNavLinks[current].getAttribute('href')
					!isSamePage && navigate(el)
					break
				case 'li':
					console.log('li')
					break
				default:
					console.log('ul')
			}
		})
	}

	const navigate = (linkEl) => {
		body.classList.remove('render')
		// IE 미지원
		// IE 10+ 지원이 필요한 경우,
		// https://github.com/EvandroLG/transitionEnd/
		if (!transitionEnd(body).whichTransitionEnd()) {
			transitionEnd(body).bind(() => {
				window.location.assign(linkEl.getAttribute('href'))
			})
			return
		}
		body.addEventListener('transitionend', () => {
			window.location.assign(linkEl.getAttribute('href'))
		})
	}

	const keyboardNavigate = () => {
		body.addEventListener('keyup', (e) => {
			const key = parseKey(e)
			let linkEl = null
			switch (key) {
				case 'ArrowLeft':
					linkEl =
						current > 0
							? globalNavLinks[current - 1]
							: globalNavLinks[total - 1]
					break
				case 'ArrowRight':
					linkEl =
						current < total - 1
							? globalNavLinks[current + 1]
							: globalNavLinks[0]
					break
				default:
					return false
			}
			navigate(linkEl)
		})
	}

	const parseKey = (e) => {
		/**
		 * e.code | e.key [ ArrowLeft, ArrowRight ] - (표준 권장) IE, Edge 미지원
		 * e.keyCode | e.which [37, 39] - (비표준 비권장) IE, Edge 포함 모든 브라우저 지원
		 */
		if (e.key || e.code) {
			return e.key || e.code
		}
		switch (e.keyCode) {
			case 37:
				return 'ArrowLeft'
			case 39:
				return 'ArrowRight'
		}
	}

	bootstrap()
}

function customCursor(){
	'use strict'

	const demo = document.querySelector('.demo')

	const mouse = {
		x: 0,
		y: 0,
	}

	let cursor
	let size = 10
	let scaleRatio = 3

	// 커스텀 커서
	const customCursorOptions = {
		className: 'custom-cursor',
		size,
		styles: `
			opacity: 0.7;
			position: absolute;
			z-index: -1;
			top: 0;
			left: 0;
			width: ${size}px;
			height: ${size}px;
			background: #fff;
			border-radius: 50%;
			transition: none;
		`,
	}
	const customCursor = `
		<figure
			class=${customCursorOptions.className}
			style="${customCursorOptions.styles}" 
			role="presentation" 
		/>
	`

	const bootstrap = () => {
		setting()
		bindEvents()
	}

	const setting = () => {
		demo.style.cursor = 'none'
		demo.classList.add('mode-custom-cursor')
		demo.insertAdjacentHTML('afterbegin', customCursor)
		cursor = demo.querySelector('.custom-cursor')
	}

	const bindEvents = () => {
		demo.addEventListener('mousemove', updateMousePosition)
		demo.addEventListener('mousedown', drawDownCursor)
		demo.addEventListener('mouseup', drawUpCursor)
	}

	const updateMousePosition = (e) => {
		mouse.x = e.clientX
		mouse.y = e.clientY
		render()
	}

	const render = (xGap, yGap) => {
		const x = mouse.x - (xGap || 5)
		const y = mouse.y - (yGap || 5)
		cursor.style.transform = `translate(${x}px, ${y}px)`
	}

	const drawDownCursor = (e) => {
		cursor.style.opacity = 0.4
		const updateSize = size * scaleRatio
		cursor.style.width = `${updateSize}px`
		cursor.style.height = `${updateSize}px`
		render(updateSize / 2, updateSize / 2)
	}
	const drawUpCursor = (e) => {
		cursor.style.opacity = 1
		cursor.style.width = `${size}px`
		cursor.style.height = `${size}px`
		render(size / 2, size / 2)
	}

	bootstrap()
}

init()
