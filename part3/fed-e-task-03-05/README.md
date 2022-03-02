## 简答题

（请直接在本文件中作答）

#### 1、Vue 3.0 性能提升主要是通过哪几方面体现的？
* 响应式系统实现上, 使用Proxy替代了Object.defineProperty, 减少了设置响应式数据的遍历操作也可以监听对象和数组的操作
* 编译优化:
  * vue2中通过标记静态根节点, 优化diff的算法, vue3中还提升了所有的静态根节点,diff的时候只需要对比动态节点
  * vue3中增加了Fragments标签, 使其在单文件组件中,不需要强制根节点, 不需要增加无用的标签
  * 给动态节点增加了 patch flag标记, 标记节点的类型和属性范围等
  * 增加了缓存事件处理函数, 首次渲染时, 会生成一个缓存函数, 当调用时间时, 有缓存函数就执行缓存函数, 没有就增加缓存, 这个缓存函数是用箭头函数做了一层封装, 元素的绑定不会变, 每次都会调用最新的函数内容
* 优化了代码的打包体积: 
  * 移除了一些不常用的API, 例如: filter、inline-template等
  * Vue3对Tree-shaking的支持更好, Tree-shaking依赖ES module(export, import),通过编译时的静态分析, 找到没有引入的模块, 打包的时候, 直接过滤掉, 很多按需引入的组件和功能


#### 2、Vue 3.0 所采用的 Composition Api 与 Vue 2.x使用的Options Api 有什么区别？

　* Composition Api, 把相同功能的代码组织在一起, 在构建大型项目时 提高了代码的可重用性和可维护性
　* Composition Api, 使用函数式编程的思想, 更好的利用了js 函数是第一公民的特性, 书写更加灵活和易读
　* Composition Api, 把各个功能的方法单独封装, 根据自身需求, 自由调用


#### 3、Proxy 相对于 Object.defineProperty 有哪些优点？

* 一个Proxy实例就可以代理一个普通js对象, 而Object.defineProperty则需要把每一个对象的属性, 都重新遍历, 去做代理.
* Proxy 可以监听到对象属性的添加、修改(handler -> set)、删除(handler -> deleteProperty)等设置, Object.defineProperty不能
* Proxy 可以监听到数组的push和unshift等操作方法还有长度变化, Object.defineProperty不能　

#### 4、Vue 3.0 在编译方面有哪些优化？
* 把静态节点提升, 在diff的过程中, 只需要对比动态节点就好了
* 增加了fragment标签, 可以在组件中没有唯一根节点时, 作为根节点, 减少了无用的标签
* 动态节点增加了 patch flag,用来标记节点的类型和属性等, diff的过程中, 可以缩小范围
* 增加了事件的缓存, 在首次编译中, 缓存函数缓存绑定的方法, 后面可以直接从缓存中调用事件
　


#### 5、Vue.js 3.0 响应式系统的实现原理？
Vue.js 3.0的响应式系统分为响应式数据绑定、依赖收集、触发更新这三大块.
响应式数据绑定中, 主要基于JavaScript的Proxy(代理)这个实现的, 相对于vue2使用的Object.defineProperty来说, 可以直接对对象的添加删除修改的监听, 也可以对数组的各类操作方法监听和数组长度进行监听, 基于不同数据类型, vue3实现了reactive方法对对象进行监听, refs方法对基本数据类型进行监听, toRefs把reactive方法创建的实例ref化

依赖收集中(track), 和vue2一样, 也是在读取属性时, 进行收集. vue3使用了三层数据来做, targetMap作为最顶层的map来存储整个响应式目标的依赖, 使用的是WeakMap数据结构(key是对对象的弱应用, 容易被垃圾回收), targetMap里的值是depsMap, 用来存储很多个不同依赖的空间, 再后面depsMap的值是一个Set	结构, 用来存储相同依赖的不同位置, 都是一个独一不二的值

触发更新中(trigger), 和vue2一样, 也是在设置属性时, 触发更新, 找到对应的targetMap中的depsMap, 然后遍历所有的回调函数

在依赖收集和触发更新的过程中, 有衍生了 computed effect这样的方法, 用来监听响应式数据的变化,然后不同的数据或者执行相应的回调函数


　

　