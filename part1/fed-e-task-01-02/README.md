# Part1-2 作业

( 请在当前文件直接作答 )

## 简答题

### 1. 请说出下列最终执行结果，并解释为什么?

```javascript
var a = [];
for(var i = 0; i < 10; i++) {
  a[i] = function() {
    console.log(i)
  }
}
a[6]()
```
a[6]()结果是10
var i = 0; var关键词会进行变量提升, i是在全局作用域中
a[0]一直到a[9],调用的都是:
```
function() {
  console.log(i)
}
```
a[6]()调用,等价于:
```
function() {
  console.log(i)
}()
```
上述匿名函数的执行上下文是全局上下文, 找到的i, 是循环过后, 最后赋值的10,所以结果是10
　
### 2. 请说出此案例最终执行结果，并解释为什么?

```javascript
var tmp = 123;
if (true) {
  console.log(tmp);
  let tmp;
}
```
结果是 语法错误,
1、块级作用域
2、暂存性死区
```
console.log(tmp);
let tmp;
```
上述两行代码处于块级作用域中, 由于let关键词声明了tmp变量, 导致`console.log(tmp);`这行代码, 处于暂存性死区中, 全局作用域中的 tmp变量拿不到, 块级作用域中的变量也拿不到

### 3. 结合ES6语法，用最简单的方式找出数组中的最小值

```javascript
var arr = [12, 34, 32, 89, 4]
```
```
var arr = [12, 34, 32, 89, 4]
function findMin(arr) {
	let min = +Infinity
	for(let num of arr) {
		if(min > num) {
			min = num
		}
	}
	return min;
}
console.log('findMin(arr)', findMin(arr))
```
### 4. 请详细说明var、let、const三种声明变量的方式之间的具体差别
var和let、const差别:
1. var 定义变量会进行**变量提升**, let、const不会进行变量提升
2. let、const 只生效于**块级作用域**中, 在循环操作()内, {} 花括号内, 都有单独的作用域
3. let、const定义的变量在块级作用域中, 会有**暂存性死区域**即: 所在作用域,定义这个变量之前的区域不能使用这个变量或者上一层作用域的相同命名的变量
4. let、const**不允许重复声明**, 重复声明会报语法错误,var不会
let、const差别:
1.const定义的变量是只读的常量,不可修改, 如果定义的是引用类型的变量, const 保存的引用类型的内存地址不能改, 但是引用地址内部的属性可以更改
　

### 5. 请说出下列代码最终输出结果，并解释为什么？

```javascript
var a = 10;
var obj = {
  a: 20,
  fn() {
      setTimeout(() => {
        console.log(this.a)
      })
  }
}
obj.fn()
```
结果是obj.a = 20
两块知识点:
1. this:
* this是函数调用的主体, 谁调用了this? obj, this就是obj
  
2. 箭头函数
* 箭头函数的this不是函数调用时的this,而是函数定义时主体即函数定义时所在的对象
* 箭头函数不能做为构造函数
* 箭头函数没有arguments对象,但是可以用rest参数即剩余参数(...<变量名>)是个真正的数组
* 箭头函数不能做为Generator函数
　

### 6. 简述Symbol类型的用途

Symbol类型是ES6新增的一个基础数据类型, 可以定义一个独一无二的值, 可以用于:
* 在多人协作开发中, 避免变量的重命名
* 可以作为一个对象的属性
* 定义一些没有意义的又是唯一的值 

### 7. 说说什么是浅拷贝，什么是深拷贝？

浅拷贝:
对象浅拷贝只会把当前对象的基本类型的属性和引用类型的内存地址做一层拷贝. 当修改引用类型的属性时, 还是会改变原对象的值

常用的浅拷贝方法(只针对有引用类型的对象举例子): 
* Object.assign({}, obj)
* {...obj}
* 遍历obj的本身的所有属性
  ```
  function shallowClone(source) {
			let result = {}
			for(const key in source) { // 遍历一个对象的除Symbol以外的可枚举属性，包括继承的可枚举属性。
				if(source.propertyIsEnumerable(key)) { // propertyIsEnumerable 这个方法有种特殊情况, 如果判断的属性是原型链上的属性, 原型链上的属性是enumerable的, 但是还是false, 所以要过滤掉
					result[key] = source[key]
				}
			}
			return result;
	}
  ```
深拷贝:
当前对象的基本类型的属性和引用类型的属性都重新做拷贝, 无限层级拷贝 引用类型的属性会重新开辟内存.
* 递归, 一层一层下钻
  * set, map, weakset, weakmap这些类型和兼容数组类型类似, 没有处理
  * 递归容易爆栈
    * 循环引用变量
    * 数据量太大
  ```
  	function isObject(v) {
			return Object.prototype.toString.call(v) === '[object Object]';
		}
		function isArray(v) {
			return Array.isArray(v)
		}
		function clone(source) {
			let result = null
			if(isObject(source)) {
				result = {}
			} else if(isArray(source)) {
				result = []
			} else {
				return source;
			}
			for(const key in source) { // 遍历一个对象的除Symbol以外的可枚举属性，包括继承的可枚举属性。
				if(source.propertyIsEnumerable(key)) { // propertyIsEnumerable 这个方法有种特殊情况, 如果判断的属性是原型链上的属性, 原型链上的属性是enumerable的, 但是还是false, 所以要过滤掉
					if(isObject(source[key]) || isArray(source[key])) {
						result[key] = clone(source[key])
					} else {
						result[key] = source[key]
					}
				}
			}
			return result;
		}
  ```
* 遍历 + 栈
  * 不容易爆栈
  * 暴力破解循环引用 (这些代码也可以不加)
  ```
  	// 循环方式写, 栈结构+深度优先
		function clone2(source) {
			let result = null
			if(isObject(source)) {
				result = {}
			} else if(isArray(source)) {
				result = []
			} else {
				return source;
			}
			const uniqueList = []; // 用来去重
			const stack = [{
				parent: result,
				key: undefined,
				value: source
			}]
			while (stack.length) {
				const node = stack.pop();
				const parent = node.parent;
				const key = node.key;
				const source = node.value;

				// 初始化赋值目标，key为undefined则拷贝到父元素，否则拷贝到子元素, 这里很精妙
				let res = parent;
				if (typeof key !== 'undefined') {
					if(isObject(source)) {
						res = {}
					} else if(isArray(source)) {
						res = []
					}
					parent[key] = res;
				}

				 // =============
				// 数据已经存在
				let uniqueData = find(uniqueList, source);
				if (uniqueData) {
					parent[key] = uniqueData.target;
					break; // 中断本次循环
				}
				// 数据不存在
				// 保存源数据，在拷贝数据中对应的引用
				uniqueList.push({
					source,
					target: res,
				});

				for(const item in source) { // 遍历一个对象的除Symbol以外的可枚举属性，包括继承的可枚举属性。
					if(source.propertyIsEnumerable(item)) { // propertyIsEnumerable 这个方法有种特殊情况, 如果判断的属性是原型链上的属性, 原型链上的属性是enumerable的, 但是还是false, 所以要过滤掉
						if(isObject(source[item]) || isArray(source[item])) {
							stack.push({
								parent: res,
								key: item,
								value: source[item]
							})
						} else {
							res[item] = source[item]
						}
					}
				}
			}
			return result;
		}
		function find(arr, item) { // 找到相同的对象
			for(let i = 0; i < arr.length; i++) {
				if (arr[i].source === item) {
					return arr[i];
				}
			}
			return null;
		}
  ```
* JSON.parse(JSON.stringify(obj))
  * 如果json里面有时间对象，则序列化结果：时间对象=>字符串的形式；
  * json里有RegExp、Error对象，则序列化的结果将只得到空对象 RegExp、Error => {}；
  * json里有 function,undefined，则序列化的结果会把 function,undefined 丢失；
  * json里有NaN、Infinity和-Infinity，则序列化的结果会变成null；
  * json里有对象是由构造函数生成的，则序列化的结果会丢弃对象的 constructor；
  * 数据量太大, 也会出现爆栈的情况
  * 循环引用不会, JSON.stringify内部做了循环引用的检测

### 8. 请简述TypeScript与JavaScript之间的关系？

TypeScript是JavaScript的超集, 可以编译成纯javascript代码
* TypeScript可以做很多类型校验, 让代码的健壮性更好
* TypeScript提供了js最新和不断发展的新特性, 并且能编译成低版本的js代码,保持兼容性

　

### 9. 请谈谈你所认为的typescript优缺点
优点: 
* 适合构建和维护大型项目, 有很好的类型检查机制
* 可以使用最新和不断发展的的ES语法, 并能直接转成兼容性很好的js代码
* 可以渐进式使用TS, 支持js的写法

缺点: 
* 多了很多概念, 相对js, 还是有一定学习成本
* 老js项目迁移到TS上, 比较吃力
* 小型、短周期项目,会增加一些开发成本

### 10. 描述引用计数的工作原理和优缺点
工作原理: 
设置引用数, 判断引用数是否是0
优点:
* 发现垃圾时,立即回收
* 最大限度减少程序暂停
缺点:
* 无法回收循环引用的对象
* 时间开销大, 时刻去监控, 引用树设置的越多, 时间也越长

### 11. 描述标记整理算法的工作流程

　分两个阶段, 一个标记阶段、一个整理阶段
  1.首先会遍历所有对象去标记活动对象
  2.遍历所有对象,把没有标记的对象进行清除
  3.回收相应的空间

　

### 12.描述V8中新生代存储区垃圾回收的流程

　1. 把新生代内存区域分为二个等大小的空间, 一个From, 一个To
　2. 先把所有的变量对象都分配到From空间
　3. From空间分配到一定程度, 就会触发GC操作, 进行标记整理,把活动对象去标记
　4. 把活动对象拷贝到To里面
　5. From与To交换空间去完成释放

　

### 13. 描述增量标记算法在何时使用及工作原理
  何时使用:
  进行垃圾回收的时候
　工作原理: 
  将整段垃圾回收, 分为很多个小段去执行, 去分散垃圾回收的时间
　