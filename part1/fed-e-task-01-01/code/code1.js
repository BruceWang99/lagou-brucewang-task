/*
  将下面异步代码使用 Promise 的方法改进
  尽量用看上去像同步代码的方式
  setTimeout(function () {
    var a = 'hello'
    setTimeout(function () {
      var b = 'lagou'
      setTimeout(function () {
        var c = 'I ♥ U'
        console.log(a + b +c)
      }, 10)
    }, 10)
  }, 10)
*/

// 改进1 (还是有地狱回调)
Promise.resolve('hello ').then(a=>{
	Promise.resolve('lagou ').then(b=>{
		Promise.resolve('I lova U').then(c=>{
			console.log(a + b + c);
		})
	})
})

// 改进2 链式调用
Promise.resolve('hello ')
.then(a=>{
	let  b = 'lagou ';
	return {a, b};
}).then(({a, b})=>{
	let c = 'I lova U'
	console.log(a + b + c);
})
