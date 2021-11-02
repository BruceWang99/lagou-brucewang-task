class Container {
	static of(value){
		return new Container(value)
	}
	constructor(value){
		this._value = value;
	}
	map(fn) {
		return Container.of(fn(this._value))
	}
}
// 解决fn的参数为空, 可能会报错的问题
class Maybe {
	static of(value){
		return new Maybe(value)
	}
	constructor(value){
		this._value = value;
	}
	isNothing() {
		return this._value === null || this._value === undefined
	}
	map(fn) {
		return this.isNothing() ? this : Maybe.of(fn(this._value))
	}
}
let a = new Maybe();
let b = a.map(item=>{
	if(item === undefined) throw new Error('出错了')
})
module.exports = { Maybe, Container }