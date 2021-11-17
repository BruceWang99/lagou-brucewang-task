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
a[6]()结果是9
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
上述匿名函数的执行上下文是全局上下文, 找到的i, 是循环过后, 最后赋值的9,所以结果是9
　
### 2. 请说出此案列最终执行结果，并解释为什么?

```javascript
var tmp = 123;
if (true) {
  console.log(tmp);
  let tmp;
}
```
结果是 123,
```
console.log(tmp);
```
上述代码取的tmp, 在执行到这一行时, 当前作用域内, 没有找到tmp ,就往上一层的作用域找, 找到了123.
```
let tmp;
```
这行代码, let关键字,定义的变量, 不会进行变量提升, 不会影响上一行代码的执行
　

　

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
1. var 定义变量会进行变量提升, let、const不会进行变量提升
2. let、const 存在块级作用域, 在循环操作()内, {} 花括号内, 都有单独的作用域
let、const差别:
1.const定义的变量是只读的, 如果定义的是引用类型的变量, const 保存的引用类型的内存地址不能改, 但是引用地址内部的属性可以更改

　

　

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
* 箭头函数没有this
* 箭头函数没有原型
　

　

### 6. 简述Symbol类型的用途

Symbol类型可以定义一个唯一的值, 可以用于:
* 在多人协作开发中, 避免变量的重命名
* 可以作为一个对象的属性

　

### 7. 说说什么是浅拷贝，什么是深拷贝？

浅拷贝:
对象浅拷贝只会把当前对象的基本类型的属性和引用类型的内存地址做一层拷贝. 当修改引用类型的属性时, 还是会改变原对象的值
常用的浅拷贝方法 Object.assign({}, obj), 展开运算符{...obj}
深拷贝:
当前对象的基本类型的属性和引用类型的属性都重新做拷贝, 引用类型的属性会重新开辟内存.
常用的深拷贝方法 JSON.parse(JSON.stringify(obj))
这个方法有一些问题:

　

### 8. 请简述TypeScript与JavaScript之间的关系？

TypeScript是JavaScript的超集
* TypeScript可以做很多类型校验, 让代码的健壮性更好
* TypeScript提供了js没有的新语法和功能

　

### 9. 请谈谈你所认为的typescript优缺点
优点: 
* 适合构建和维护大型项目, 有很好的类型检查机制
* 能直接转成兼容性很好的js代码
* 可以渐进式使用TS, 支持js的写法

缺点: 
* 相对js, 还是有一定学习成本
* 老js项目迁移到TS上, 比较吃力

　

### 10. 描述引用计数的工作原理和优缺点

　

　

### 11. 描述标记整理算法的工作流程

　

　

### 12.描述V8中新生代存储区垃圾回收的流程

　

　

### 13. 描述增量标记算法在何时使用及工作原理

　

　