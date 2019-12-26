/*! CrossDirectionCarousel/index.js | 2019, yamoo9@naver.com */
class CrossDirectionCarousel {
	/**
	 * @class CrossDirectionCarousel
	 * @summary 크로스 디렉션 캐러셀 컴포넌트 클래스
	 * 
	 * @param {String} selector 문서 객체의 CSS 선택자
	 * @param {String} [colorControlSelector="body"] 컬러 컨트롤 문서 객체(옵션)
	 * @param {Boolean|Object} [options=false] 인피니티 스크롤 옵션 값
	 * 
	 * @todo 자동 슬라이딩 기능 추가
	 * @todo 접근성 향상<br>
	 * 
	 * @example
	 * // 캐러셀을 적용 할 문서 객체 전달인자(1번째 인자: 필수)
	 * new CrossDirectionCarousel('#carousel')
	 * // 컬러를 변경 할 문서 객체 선택자 전달(2번째 인자: 옵션)
	 * new CrossDirectionCarousel('#carousel'. '.demo')
	 * // 인피니티 슬라이딩 설정 옵션(3번째 인자: 옵션, 기본 값: false)
	 * new CrossDirectionCarousel('#carousel'. '.demo', true)
	 * new CrossDirectionCarousel('#carousel'. '.demo', {infinity: true})
	 * 
	 * @license
	 * Copyright (c) 2019 yamoo9.github.io
	 */
	constructor(selector, colorControlSelector = 'body', options = false) {
		// 옵션 설정
		/** 
		 * @protected 
		 * @summary 캐러셀 옵션 객체
		*/
		this._options =
			typeof options === 'boolean' && options === true
				? { infinity: true }
				: options
		// DOM 문서 객체
		/** 
		 * @protected 
		 * @summary 캐러셀 적용 문서 객체 */
		this._cdc = document.querySelector(selector)
		/** 
		 * @protected 
		 * @summary 컬러 변경 문서 객체 */
		this._colorControl = document.querySelector(colorControlSelector)
		/** 
		 * @protected 
		 * @summary 슬라이더 문서 객체 */
		this._sliders = this._cdc.querySelectorAll('.CDC__slider')
		/** 
		 * @protected 
		 * @summary 캐러셀 컨트롤 문서 객체 */
		this._controls = this._cdc.querySelector('.CDC__controls')
		/** 
		 * @protected 
		 * @summary 현재 활성화 인덱스 */
		this._current = 0
		/** 
		 * @protected 
		 * @summary 슬라이드 총 개수 */
		this._total = 0
		/** 
		 * @protected 
		 * @summary 슬라이드 이동 거리(%) */
		this._distanceY = 0
		/** 
		 * @protected 
		 * @summary 컬러 리스트(배열) */
		this._colors = 'red black green blue'.split(' ')
		/** 
		 * @protected 
		 * @summary 이전 활성화 클래스 속성 이름 */
		this._previousClass = 'has-red'
		/** 
		 * @protected 
		 * @summary 애니메이션 상태 속성 */
		this._isAnimating = false
		/** 
		 * @protected 
		 * @summary 버튼 클릭 상태 속성 */
		this._buttonState = null
		// 초기화
		this._init()
	}

	/**
	 * @protected
	 * @summary 컴포넌트 초기화 메서드
	 */
	_init() {
		this._settingColorControl()
		this.update()
	}

	/**
	 * @protected
	 * @summary 컬러 컨트롤 문서 객체에 트랜지션 스타일 설정
	 */
	_settingColorControl() {
		this._colorControl.style.transition = 'all 0.3s ease-out'
	}

	/**
	 * @protected
	 * @summary 슬라이드 총 개수, 이동 거리 설정(업데이트)
	 */
	_updateCurrentTotal() {
		this._total = this._sliders[0].children.length
		this._distanceY = 100 / this._total
	}

	/**
	 * @protected
	 * @summary 슬라이드 콘텐츠 높이를 계산
	 * @returns {number} 계산된 콘텐츠 높이 값
	 */
	_getSliderContentHeight() {
		const content = this._sliders[0].querySelector('.CDC__slide img')
		return content.getBoundingClientRect().height
	}

	/**
	 * @protected
	 * @summary 슬라이드 첫번째 자식 문서 객체의 높이 값을 캐러셀 요소의 높이로 설정
	 */
	_updateSlideContentHeight() {
		Array.from(
			this._cdc.querySelectorAll('[class*="CDC__carousel--"]')
		).forEach(
			(carousel) =>
				(carousel.style.height = `${this._getSliderContentHeight()}px`)
		)
	}

	/**
	 * @protected
	 * @summary 컴포넌트 이벤트 추가 메서드
	 */
	_addEvents() {
		// 이벤트 제거
		this._removeEvents()
		// 클릭 이벤트
		Array.from(this._controls.querySelectorAll('button')).forEach((button) => {
			button.addEventListener('click', this._click.bind(this))
		})
		// 리사이즈 이벤트
		window.addEventListener('resize', () =>
			window.setTimeout(() => this._updateSlideContentHeight(), 400)
		)
	}

	/**
	 * @protected
	 * @summary 컴포넌트 이벤트 제거 메서드
	 * @see http://bit.ly/36YIeEU
	 */
	_removeEvents() {
		Array.from(this._controls.querySelectorAll('button')).forEach((button) => {
			// 노드를 복제하면 연결된 이벤트가 모두 제거 됨
			const clonseButon = button.cloneNode(true)
			// 기존 노드를 제거하고, 복제된 노드를 추가
			this._controls.removeChild(button)
			this._controls.appendChild(clonseButon)
		})
	}

	/**
	 * @protected
	 * @summary 캐러셀 버튼 컨트롤 클릭 이벤트 리스너
	 */
	_click(e) {
		e.currentTarget.classList.contains('CDC__controls--prev')
			? this.prev()
			: this.next()
	}

	/**
	 * @protected
	 * @summary 개별 슬라이드 문서 객체를 슬라이딩 컨트롤
	 */
	_slideControl(activeIndex) {
		// 애니메이션 중일 경우, 메서드 종료
		if (this._isAnimating) return
		// 애니메이션 상태 활성화
		this._isAnimating = true

		let distanceY = this._distanceY * activeIndex
		Array.from(this._sliders).forEach((slider, index) => {
			const direction = index === 0 ? -1 : 1
			slider.style.transform = `translateY(${direction * distanceY}%)`
		})

		// 애니메이션 상태: 멈춤
		this._isAnimating = false
	}

	/**
	 * @protected
	 * @summary 개별 슬라이드 문서 객체 인피니티 슬라이딩 컨트롤
	 */
	_slideInfinityControl() {
		// infinity 모드일 경우, activeIndex를 사용하지 않음
		let distanceY = this._distanceY

		switch (this._buttonState) {
			// 1. 슬라이더 트랜지션 속성 none
			// 2. 마지막 슬라이드 콘텐츠를 슬라이더의 첫번째 자식으로 추가
			//		ref. https://developer.mozilla.org/ko/docs/Web/API/ParentNode/prepend
			// 3. 슬라이더 트랜지션 속성 해제 제거
			case 'prev':
				Array.from(this._sliders).forEach((slider, index) => {
					const disY = (index === 0 ? -1 : 1) * distanceY
					slider.style.transition = 'none'
					slider.prepend(slider.lastElementChild)
					slider.style.transform = `translateY(${disY}%)`
					window.setTimeout(() => {
						slider.style.transition = null
						slider.style.transform = 'translateY(0%)'
					}, 30)
				})
				break
			// 1. 슬라이더 트랜지션
			// 2. 첫번째 슬라이드 콘텐츠를 슬라이더의 마지막 자식으로 추가
			// 3. 슬라이더 트랜지션 속성 none
			// 4. 특정 시간 지난 후, 슬라이더 트랜지션 속성 해제 제거
			case 'next':
				Array.from(this._sliders).forEach((slider, index) => {
					const disY = (index === 0 ? -1 : 1) * distanceY
					slider.style.transform = `translateY(${disY}%)`
					// transitionend 이벤트를 반복해서 연결할 경우,
					// 중복 이벤트 발생 문제로 타임아웃 활용
					window.setTimeout(() => {
						slider.appendChild(slider.firstElementChild)
						slider.style.transform = 'translateY(0%)'
						slider.style.transition = 'none'
						window.setTimeout(() => (slider.style.transition = null), 200)
					}, 200)
				})
				break
		}

		// 애니메이션 상태: 멈춤
		this._isAnimating = false
	}

	/**
	 * @protected
	 * @summary 컬러 컨트롤 문서 객체의 색상 변경
	 */
	_hasColorControl(index) {
		const colors = this._colors
		const colorControl = this._colorControl
		colorControl.classList.remove(this._previousClass)
		this._previousClass = `has-${colors[index]}`
		colorControl.classList.add(this._previousClass)
	}

	/**
	 * @protected
	 * @summary 전달 받은 활성화 인덱스 값을 토대로 슬라이드 이동
	 */
	_goto(activeIndex) {
		!this._options.infinity
			? this._slideControl(activeIndex)
			: this._slideInfinityControl()
		this._hasColorControl(activeIndex)
	}

	/**
	 * @public
	 * @summary 컴포넌트 업데이트 메서드 (비동기 통신 결과로 슬라이드 개수가 늘어난 경우)
	 * @example
	 *   cdcInstance.update()
	 */
	update() {
		this._updateCurrentTotal()
		this._updateSlideContentHeight()
		this._addEvents()
	}

	/**
	 * @public
	 * @summary 이전 활성화 인덱스 - 1 값을 토대로 슬라이드 이동
	 * @example
	 *   cdcInstance.prev()
	 */
	prev() {
		// 버튼 상태: prev
		this._buttonState = 'prev'
		// 활성화 인덱스 계산
		this._current = --this._current < 0 ? this._total - 1 : this._current
		this._goto(this._current)
	}

	/**
	 * @public
	 * @summary 이전 활성화 인덱스 + 1 값을 토대로 슬라이드 이동
	 * @example
	 *   cdcInstance.next()
	 */
	next() {
		// 버튼 상태: next
		this._buttonState = 'next'
		this._current = ++this._current > this._total - 1 ? 0 : this._current
		this._goto(this._current)
	}
}
