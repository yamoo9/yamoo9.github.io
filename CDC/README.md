## Cross Direction Carousel

FEML 모듈 B 3주차는 크로스 디렉션 캐러셀 컴포넌트 클래스를 만들어 가는 과정을 학습합니다.

### HTML 마크업

CDC 컴포넌트를 적용할 HTML 구조는 다음과 같이 작성합니다. 
각 사이드 캐러셀 그룹 내부의 슬라이더 영역에 화면에 표시할 콘텐츠를 추가할 수 있습니다.
버튼 컨트롤의 콘텐츠에 아이콘 등 식별 가능한 콘텐츠를 커스터마이징 할 수 있습니다.

```xml
<div class="CDC" role="application">
  <!-- 사이드 캐러셀 01 그룹 -->
  <div class="CDC__carousel--one" role="group">
    <figure class="CDC__slider">
      <div class="CDC__slide">
        <!-- 콘텐츠 -->
      </div>
      <div class="CDC__slide">
        <!-- 콘텐츠 -->
      </div>
      <!-- ... -->
    </figure>
  </div>
  <!-- 사이드 캐러셀 02 그룹 -->
  <div class="CDC__carousel--two">
    <figure class="CDC__slider">
      <div class="CDC__slide">
        <!-- 콘텐츠 -->
      </div>
      <div class="CDC__slide">
        <!-- 콘텐츠 -->
      </div>
      <!-- ... -->
    </figure>
  </div>
  <!-- 캐러셀 버튼 컨트롤 그룹 -->
  <div class="CDC__controls" role="group">
    <button type="button" class="CDC__controls--prev"> prev </button>
    <button type="button" class="CDC__controls--next"> next </button>
  </div>
</div>
```

### CSS 스타일링

CDC 컴포넌트 사용자 기호에 맞게 스타일을 커스터마이징 하여 사용할 수 있습니다.

```css
/* Cross Direction Carousel */
.CDC {
	display: flex;
	position: relative;
	width: 100%;
	height: 100%;
}

/* carousel */
.CDC [class*="CDC__carousel--"] {
	overflow: hidden;
	flex: 1 1 50%;
	position: relative;
	/* JavaScript를 사용해 이미지 가로 대비 세로 높이를 동적으로 계산해야 함 */
	/* height: 614.5px; */
}

/* slider */
.CDC__slider {
	display: flex;
	display: flex;
	flex-flow: column;
	position: absolute;
}
.CDC__carousel--one .CDC__slider {
	top: 0;
	/* JavaScript를 사용해 계산: 100% / 섹션의 개수(4) * -1 = -25% */
	/* transform: translateY(-25%); */
}
.CDC__carousel--two .CDC__slider {
	display: flex;
	flex-flow: column-reverse;
	bottom: 0;
	/* JavaScript를 사용해 계산: 100% / 섹션의 개수(4) = 25% */
	/* transform: translateY(25%); */
}

/* img */
.CDC img {
	width: 100%;
	height: auto;
}

/* controls */
.CDC__controls button[type="button"] {
	cursor: pointer;
	position: absolute;
	top: 50%;
	width: 50px;
	height: 50px;
	border: 0;
	padding: 0;
	background: none;
	transform: translateY(-50%);
	outline: none;
	transition: none;
}
.CDC__controls button[type="button"] svg {
	width: 100%;
	height: 100%;
}
.CDC__controls button[type="button"]:hover svg {
	transform: scale(1.1);
}
.CDC__controls button[type="button"]:focus {
	border-radius: 50%;
	box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.5);
}
.CDC__controls--prev {
	left: -25px;
}
.CDC__controls--next {
	right: -25px;
}

/** ----------------------------
 * SVG Buttons 스타일
 */
.has-red [id*="button-"] path {
	fill: #962d3b;
}
.has-black [id*="button-"] path {
	fill: #272528;
}
.has-green [id*="button-"] path {
	fill: #143f34;
}
.has-blue [id*="button-"] path {
	fill: #5ca1af;
}
```

### JS 스크립팅

CDC 컴포넌트 클래스를 통해 인스턴스를 생성합니다.

```javascript
;(() => {
  'use strict'
  
  // CDC 인스턴스 생성
  new CrossDirectionCarousel('.CDC')

  // CDC 인피니티 캐러셀 설정
  new CrossDirectionCarousel('.CDC', '.demo', true)
  
})()

```

---

## JSDOC 가이드

JSDOC 사용법은 [jsdoc.app](https://jsdoc.app/index.html) 문서를 참고하세요.

---

## JSDOC 템플릿

JSDOC 템플릿 [docstrap](https://github.com/docstrap/docstrap)을 사용해 문서의 테마를 설정합니다.