// import gsap from 'gsap'
import { mixins, makeArray } from '../utils'

/**
 * Carousel 클래스 생성 과정에서 전달된 인자의 유효성 검사 함수
 * @private
 */
const validateArgs = (selector, options = {}) => {
	if (typeof selector !== 'string')
		throw new Error('첫번째 인자인 선택자(selector)는 문자 값을 전달해야 합니다.')
	if (!options || Array.isArray(options) || typeof options !== 'object') {
		throw new Error('두번째 인자인 옵션(options)는 객체 값을 전달해야 합니다.')
	}
}

/**
 * 캐러셀 컴포넌트 클래스
 * @class Carousel
 * @param {String} selector 캐러셀로 설정 할 문서 객체 선택자
 * @param {Object} options 캐러셀 설정 옵션
 * 
 * @example
* // 객체 생성 (기본 옵션 사용)
 * new Carousel('#carousel-1')
 *
 * // 숨겨진 슬라이딩 영역 표시 옵션 설정
 * new Carousel('#carousel-1', { look: true })
 *
 * // 캐러셀 작동 모드를 '세로'로 옵션 설정
 * new Carousel('#carousel-1', { mode: 'vertical' })
 *
 * // 인디케이터, 탐색 버튼 화면에 표시 OFF 옵션 설정
 * new Carousel('#carousel-1', { indicators: false, buttons: false })
 * 
 * @license
 * Copyright (c) 2019 yamoo9.github.io
 */
function Carousel(selector, options){
	'use strict'
	// 전달인자 데이터 유형 검사
	validateArgs(selector, options)
	// 캐러셀을 적용할 문서 객체 참조
	this._carousel = document.querySelector(selector)
	// 문서 객체 유효성 검사
	if (this._carousel === null) {
		// 사용자에게 경고 메시지 출력
		console.warn(`캐러셀을 적용할 ${selector} 문서 객체가 존재하지 않습니다.`)
		return // 종료
	}
	// 믹스인 패턴을 사용해 옵션 객체 합성
	this._options = mixins({}, Carousel.defaultOptions, options)
	this._init()
}

/**
 * 캐러셀 컴포넌트 기본 옵션
 * @static
 * @memberof Carousel
 */
Carousel.defaultOptions = {
	// 감춰진 슬라이드 컨테이너 overflow 영역 표시 설정
	look: false,
	// 가로 또는 세로 모드 설정
	mode: 'horizontal',
	// 내비게이션 버튼 컨트롤 표시 설정
	buttons: true,
	// 인디케이터 컨트롤 표시 설정
	indicators: false,
}

/**
 * 초기화 메서드
 * @protected
 */
Carousel.prototype._init = function(){
	const options = this._options

	// 캐러셀 컴포넌트 각 컨트롤 변수 참조
	const carousel = this._carousel
	this._buttons = carousel.querySelectorAll('.carousel__button')
	this._indicators = carousel.querySelector('.carousel__indicators')
	this._slides = carousel.querySelector('.carousel__slides')

	// 현재 활성 인덱스
	this._current = 0
	// 슬라이드 총 개수
	this._total = this._slides.children.length
	// 내비게이션 버튼 컨트롤 표시 모드
	this._isVisibleButtons = options.buttons
	// 인디케이터 표시 모드
	this._isVisibleIndicatorsMode = options.indicators
	// 캐러셀 수직 모드
	this._isVerticalMode = options.mode === 'vertical'
	// 수평(X) 또는 수직(Y) 모드에 따라 축 방향 설정
	this._axis = !this._isVerticalMode ? 'X' : 'Y'

	this._settingSlides()
	this._bindEvents()
}

/**
 * 슬라이드 설정 메서드 - 인디케이터 표시 여부
 * @protected
 */
Carousel.prototype._settingSlides = function(){
	const buttons = this._buttons
	const indicators = this._indicators

	// 인디케이터 초기 표시 설정
	indicators.style.display = 'none'

	// 내비게이션 버튼 컨트롤 표시 설정
	if (!this._isVisibleButtons) {
		makeArray(buttons).forEach((button) => (button.style.display = 'none'))
	}

	// 인디케이터 표시 설정
	// 표시 설정 값이 true인 경우 화면에 표시
	if (this._isVisibleIndicatorsMode) indicators.style.display = 'flex'

	// 수직 모드 설정
	if (this._isVerticalMode) this._carousel.setAttribute('data-vertical', true)

	// 감춰진 슬라이딩 영역 표시 설정
	if (this._options.look) this._carousel.setAttribute('data-look', true)
}

/**
 * 이벤트 연결 메서드 - 탐색 버튼, 인디케이터 클릭 이벤트
 * @protected
 */
Carousel.prototype._bindEvents = function(){
	const buttons = this._buttons
	const indicators = this._indicators

	makeArray(buttons).forEach((button) =>
		button.addEventListener('click', this._slidingHandler.bind(this))
	)
	makeArray(indicators.children).forEach((indicator, i) =>
		indicator.addEventListener('click', this.gotoSlide.bind(this, i))
	)
}

/**
 * 이전,다음 탐색 버튼 클릭 이벤트 리스너 (메서드)
 * @protected
 */
Carousel.prototype._slidingHandler = function(e){
	const el = e.target
	if (el.className.includes('--prev')) {
		this.prevSlide()
	}
	else {
		this.nextSlide()
	}
}

/**
 * 이전 탐색 메서드
 * @public
 */
Carousel.prototype.prevSlide = function(){
	this._current = --this._current < 0 ? this._total - 1 : this._current
	this.gotoSlide(this._current)
}

/**
 * 다음 탐색 메서드
 * @public
 */
Carousel.prototype.nextSlide = function(){
	this._current = ++this._current > this._total - 1 ? 0 : this._current
	this.gotoSlide(this._current)
}

/**
 * 탐색 메서드 - 전달 받은 인덱스를 토대로 슬라이드 컨테이너 이동
 * @public
 * @param {Number} activeIndex 활성 인덱스
 */
Carousel.prototype.gotoSlide = function(activeIndex){
	const slides = this._slides
	const axis = this._axis
	const total = this._total

	if (!gsap) {
		// CSS3 Transform & Transiton
		slides.style.transform = `translate${axis}(${-1 *
			100 /
			total *
			activeIndex}%)`
	}
	else {
		// GSAP, IE 8+
		slides.style.transition = 'none'
		gsap.to(slides, {
			duration: 0.2,
			[axis.toLowerCase()]: `${-1 * 100 / total * activeIndex}%`,
		})
	}
	this._activeIndicator(activeIndex)
}

/**
 * 상태 업데이트 메서드 - 인디케이터 활성화 표시, 클릭 비활성화
 * @protected
 * @param {Number} activeIndex 활성 인덱스
 */
Carousel.prototype._activeIndicator = function(activeIndex){
	const indicators = this._indicators

	// 이전 활성화 인디케이터
	const prevActivatedIndicator = indicators.querySelector('.is-active')
	prevActivatedIndicator.classList.remove('is-active')
	prevActivatedIndicator.removeAttribute('disabled')
	// 현재 활성화 인디케이터
	const currentActivateIndicator = indicators.children[activeIndex]
	currentActivateIndicator.classList.add('is-active')
	currentActivateIndicator.setAttribute('disabled', true)
}

export default Carousel
