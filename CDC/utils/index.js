// OOJS 상속 유티리티 함수
export const inherit = (SubClass, SuperClass) => {
	SubClass.prototype = Object.create(SuperClass.prototype)
	SubClass.prototype.constructor = SubClass
}

// 믹스인 패턴 유틸리티 함수
export const mixins = (...objects) => {
	return Object.assign({}, ...objects)
}

// IE 8+ 호환성을 위한 유틸리티 함수
export const makeArray = (likArray) => [].slice.call(likArray)

export default {
	inherit,
	mixins,
	makeArray,
}
