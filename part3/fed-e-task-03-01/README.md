## 一、简答题

### 1、当我们点击按钮的时候动态给 data 增加的成员是否是响应式数据，如果不是的话，如何把新增成员设置成响应式数据，它的内部原理是什么。

```js
let vm = new Vue({
 el: '#el'
 data: {
  o: 'object',
  dog: {}
 },
 method: {
  clickHandler () {
   // 该 name 属性是否是响应式的
   this.dog.name = 'Trump'
  }
 }
})
```
不是响应式数据
可以使用Vue.set(target, props, value) 这个方法把name设置成响应式数据
内部原理: 
set原理: 使用Object.defineProperty的getter和setter, 对数据进行劫持, 形成响应式数据
详细解释: data对象的数据被数据代理到vue的实例上, data对象上的数据又通过observer做了数据劫持, 在初始化的时候, dog是个空对象, 所以无法劫持不存在属性的响应式, 这是不是响应式数据的原因. 使用Vue.set 会使用Object.defineProperty手动对name属性进行响应式的转化, 从而更新到视图

### 2、请简述 Diff 算法的执行过程
1. 创建一个虚拟dom对象
2. 当有状态变化时, 再创建一个新的虚拟dom对象
3. 对比新旧虚拟dom的差异, 更新有差异部分的节点
4. 渲染到真实的dom

## 二、编程题

### 1、模拟 VueRouter 的 hash 模式的实现，实现思路和 History 模式类似，把 URL 中的 # 后面的内容作为路由的地址，可以通过 hashchange 事件监听路由地址的变化。
代码地址: https://github.com/BruceWang99/my-vue-router/blob/master/src/vue-router/index.js

### 2、在模拟 Vue.js 响应式源码的基础上实现 v-html 指令，以及 v-on 指令。
代码地址: https://github.com/BruceWang99/my-vue-responsive/blob/main/js/compiler.js
