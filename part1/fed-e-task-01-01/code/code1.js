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
const MyPromise = require('./MyPromise.js')
new MyPromise((resolve)=>{
  setTimeout(function () {
    var a = 'hello'
    resolve(a);
  }, 10)
}).then(a => {
  return new MyPromise((resolve, reject)=>{
    setTimeout(function () {
      var b = 'lagou'
      resolve({a, b});
    }, 10)
  })
}).then(({a, b})=>{
  setTimeout(function () {
    var c = 'I ♥ U'
    console.log(a + b + c)
  }, 10)
})
