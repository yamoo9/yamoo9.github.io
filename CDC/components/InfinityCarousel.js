import { inherit, mixins } from '../utils'
import Carousel from './Carousel'

/**
 * @extends Carousel
 * @class InfinityCarousel
 * @param {String} selector 캐러셀을 적용할 문서 객체 선택자
 * @param {Object} options  캐러셀 설정 옵션
 * @example
 * // 객체 생성 (기본 옵션 사용)
 * new InfinityCarousel('#carousel-1')
 *
 * // 숨겨진 슬라이딩 영역 표시 옵션 설정
 * new InfinityCarousel('#carousel-1', { look: true })
 *
 * // 캐러셀 작동 모드를 '세로'로 옵션 설정
 * new InfinityCarousel('#carousel-1', { mode: 'vertical' })
 *
 * // 인피니티 모드 OFF 옵션 설정
 * new InfinityCarousel('#carousel-1', { infinity: false })
 *
 * // 인디케이터, 탐색 버튼 화면에 표시 OFF 옵션 설정
 * new InfinityCarousel('#carousel-1', { indicators: false, buttons: false })
 */
function InfinityCarousel(selector, options){
	// 믹스인 패턴을 사용해 옵션 객체 합성
	this._options = mixins({}, InfinityCarousel.defaultOptions, options)
	// 슈퍼 클래스 실행
	Carousel.call(this, selector, this._options)
}

/**
 * @memberof InfinityCarousel
 * @static
 * InfinityCarousel의 기본 옵션
 */
InfinityCarousel.defaultOptions = {
	infinity: true,
}

// 클래스 상속
// 서브 클래스 ← 슈퍼 클래스
inherit(InfinityCarousel, Carousel)

/**
 * @protected
 * @override
 * 메서드 오버라이딩(Overriding, 재정의)
 * 1. 부모 메서드를 덮어쓸 경우 (자식 메서드만 실행)
 * 2. 부모 메서드를 확장하고 싶을 경우 (부모, 자식 메서드 모두 실행)
 */
InfinityCarousel.prototype._init = function(){
	Carousel.prototype._init.call(this) /* 2 */

	// 이전, 다음 인덱스 설정
	this._prevIndex = this._total - 1
	this._nextIndex = this._current + 1

	// 이동 방향 설정
	this._direction = -1 // next

	// 인피니티 모드일 경우,
	// this._settingInfinity() 실행
	this._isInfinityMode && this._settingInfinity()
}

/**
 * @protected
 * @override
 */
InfinityCarousel.prototype._bindEvents = function(){
	Carousel.prototype._bindEvents.call(this) /* 2 */

	const slides = this._slides

	// 인피니티 모드 설정 참고 속성 설정
	this._isInfinityMode = this._options.infinity

	// 인피니티 모드일 경우만, 설정
	if (this._isInfinityMode) {
		slides.addEventListener('transitionend', () => {
			this._updateSlidePosition()
			slides.style.transition = 'none'
			slides.style.transform = 'translate(0)'
			window.setTimeout(() => (slides.style.transition = 'all 0.4s ease-out'))
		})
	}
}

/**
 * @protected
 */
InfinityCarousel.prototype._settingInfinity = function(){
	const slides = this._slides
	// 슬라이드 컨테이너 스타일
	let slidesStyles = null
	// 슬라이드 스타일
	let slideStyles = null

	// 가로 모드 & 인피니티 모드일 경우
	if (!this._isVerticalMode && this._isInfinityMode) {
		slidesStyles = `
			position: absolute;
			left: -100%;
			width: 300%;
			height: 100%;
		`
		slideStyles = `
			position: absolute;
			left: -50%;
			width: 33.3333%;
			height: 100%;
		`
	}
	else {
		slidesStyles = `
			position: absolute;
			top: -100%;
			left: 0;
			width: 100%;
			height: 300%;
		`
		slideStyles = `
			position: absolute;
			top: -100%;
			left: 0%;
			width: 100%;
			height: 33.3333%;
		`
	}

	// 슬라이드 컨테이너 스타일 설정
	slides.style.cssText = slidesStyles

	// 개별 슬라이드 스타일 설정
	Array.from(slides.children).forEach((slide) => {
		slide.style.cssText = slideStyles
	})

	// 슬라이드 포지션 업데이트
	this._updateSlidePosition()
}

/**
 * @protected
 */
InfinityCarousel.prototype._updateIndex = function(activeIndex){
	// 활성 인덱스 값을 현재 인덱스 값으로 설정
	this._current = activeIndex
	// 이전 인덱스 설정
	this._prevIndex = this._current - 1
	this._prevIndex = this._prevIndex < 0 ? this._total - 1 : this._prevIndex
	// 다음 인덱스 설정
	this._nextIndex = this._current + 1
	this._nextIndex = this._nextIndex > this._total - 1 ? 0 : this._nextIndex
}

/**
 * @protected
 */
InfinityCarousel.prototype._updateSlidePosition = function(){
	const slides = this._slides
	// 이전, 현재, 다음 인덱스 참조
	const prevIndex = this._prevIndex
	const current = this._current
	const nextIndex = this._nextIndex
	// 가로 또는 세로 모드에 따라 포지션 방향 속성 변경
	const positionDirection =
		this._isVerticalMode && this._isInfinityMode ? 'top' : 'left'

	// 이전, 현재, 다음 슬라이드 위치 변경
	Array.from(slides.children).forEach((slide, i) => {
		switch (i) {
			case prevIndex:
				slide.style[positionDirection] = '0%'
				break
			case current:
				slide.style[positionDirection] = '33.3333%'
				break
			case nextIndex:
				slide.style[positionDirection] = '66.6666%'
				break
			default:
				slide.style[positionDirection] = '-100%'
		}
	})
}

/**
 * @public
 * @override
 */
InfinityCarousel.prototype.prevSlide = function(){
	// 무빙 디렉션(이동 방향) 변경
	this._direction = 1
	// 슈퍼 클래스의 메서드 실행
	Carousel.prototype.prevSlide.call(this)
}

/**
 * @public
 * @override
 */
InfinityCarousel.prototype.nextSlide = function(){
	// 무빙 디렉션(이동 방향) 변경
	this._direction = -1
	// 슈퍼 클래스의 메서드 실행
	Carousel.prototype.nextSlide.call(this)
}

/**
 * @public
 * @override 조건에 따라 오버라이딩 처리
 */
InfinityCarousel.prototype.gotoSlide = function(activeIndex, isInidicator){
	// 인피니티 모드 여부에 따라 코드 분기
	// 인피니트 모드일 경우, 슈퍼 클래스 메서드 오버라이딩
	if (this._isInfinityMode) {
		// 인디케이터를 표시 할 경우 처리 할 코드
		if (isInidicator) {
			this._direction = activeIndex > this._current ? -1 : 1
			this._updateSlidePosition()
		}
		this._updateIndex(activeIndex)
		this._slides.style.transform = `translate${this._axis}(${this._direction *
			33.3333}%)`
		this._activeIndicator(activeIndex)
	}
	else {
		Carousel.prototype.gotoSlide.call(this, activeIndex)
	}
}

// 모듈 내보내기
export default InfinityCarousel
