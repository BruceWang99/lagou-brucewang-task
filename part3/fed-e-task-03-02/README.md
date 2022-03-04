## Vue.js 源码剖析-响应式原理、虚拟 DOM、模板编译和组件化

### 简答题

#### 1、请简述 Vue 首次渲染的过程。
1. 初始化了实例生命周期、Vue事件、渲染的一些属性
2. 执行创建前钩子(beforeCreate)
3. 初始化了实例依赖注入的逻辑和响应式相关的属性, 比如data watch computed methods等
4. 执行了创建的钩子(created)
5. 准备render函数, 没有render函数把template编译成render函数, 有render优先使用render函数
6. 执行加载完成前钩子(beforeMounted)
7. 把vdom和dom创建出来, 并且插入到el标签内
8. 执行加载完成钩子(mounted)

代码调试过程:
搞清楚Vue 首次渲染的过程?

1. 断点直接打在new Vue这里, 进入

   ![image-20220304094658528](https://bluenote.oss-cn-shanghai.aliyuncs.com/img/20220304094658.png)

2. 进入/src/core/instance/index.js, 在Vue的构造函数中, 调用了_init方法

   ![image-20220304094843008](https://bluenote.oss-cn-shanghai.aliyuncs.com/img/20220304094843.png)

3. 进入/src/core/instance/init.js, 查看_init逻辑

   ![image-20220304095141385](https://bluenote.oss-cn-shanghai.aliyuncs.com/img/20220304095141.png)

这个方法重要啊, initLifecycle initEvents initRender callHook(vm, 'beforeCreate') initInjections initState initProvide   callHook(vm, 'created'), 这几个方法, 我进入看完具体内容, 直接说了, 不贴图了.   
**initLifecycle** 就把实例中生命周期用的一些私有变量初始化一个值, 把实例上一些组件信息先初始化或者存下来, 比如 $parent(父实例) $root(根 Vue 实例) $children(当前实例的直接子组件) $refs (所有 DOM 元素和组件实例) 
**initEvents** 初始化实例的事件相关的私有属性 _events _hasHookEvent_
**_ initRender** 实例上初始化$slots $scopedSlots, 把vm._c vm.$createElement, 挂载两个创建元素的函数, 响应式初始化了$attrs $listeners
**callHook(vm, 'beforeCreate')** 调用了beforeCreate的钩子函数
**initInjections** 初始化依赖注入中注入的逻辑
**initState** 初始化实例的一些状态, props methods data computed watch
**initProvide** 初始化依赖注入中接收的逻辑
**callHook(vm, 'created')** 调用了created钩子函数
以上为Vue实例创建的阶段,  这里我们知道, 我们在使用created钩子的时候, props methods data computed watch 这些属性, 都是可以使用的, 也能执行ajax请求, 不过不要在这个方法里面做dom相关的操作, 因为此时vdom和正式dom都没有, 会报错的.
**vm.$mount(vm.$options.el)** 这一步就是往el上把dom挂载上去, 下一步具体调试

4. 进入src/platforms/web/entry-runtime-with-compiler.js, 查看$mount方法
   ![image-20220304110950916](https://bluenote.oss-cn-shanghai.aliyuncs.com/img/20220304110951.png)

entry-runtime-with-compiler中的$mount主要做了: 如果只有template, 把template转化为render函数, 如果有render函数优先使用render函数, 再接着往后走

5. 走到/src/platforms/web/runtime/index.js中的$mounted

   ![image-20220304111458449](https://bluenote.oss-cn-shanghai.aliyuncs.com/img/20220304111458.png)

runtime中的$mount主要是返回了mountComponent方法, 接着往后走

6. 进入/src/core/instance/lifecycle.js, 看mountComponent

   ![image-20220304111755428](https://bluenote.oss-cn-shanghai.aliyuncs.com/img/20220304111755.png)

主要是先调用了beforeMount的钩子, 在new了一个观察者, 是渲染watcher, 立即执行的, 再调用beforeUpdate钩子, 再执行了vm._update私有方法, 把dom渲染出来, 最后执行mounted钩子函数

#### 2、请简述 Vue 响应式原理。
Vue2的响应式原理, 主要从响应式数据绑定、依赖收集、触发更新这三个方面来阐述:
* 响应式数据绑定的话, 基于javascript的Object.defineProperty, 用它来实现响应式的代理对象, 设置可枚举和可配置属性, 用get和set方法来监听对象属性的变化
在说依赖收集和触发更新前, 要先补充一个前置的执行点, 观察者模式(设计模式中的一种), 指的是一种有两种角色, 观察者和接收者, 观察者,把要反馈通知的信息收集整理好,在适当的时机通知接受者. 这里有一个要区分的设计模式, 发布订阅模式, 这种模式的话, 有一点不同, 中间多了个调度中心, 发布者先把信息发给调度中心, 调度中心再把信息发给订阅者. 调度中心在中间做了一层把控
* 依赖收集, 当读取属性时, 来收集依赖.
这里需要结合监听器一起来做, 没有监听器(Watcher)就没有收集的值了
在创建一个监听器(Wather)的时候, 会把当前这个watcher实例放到Dep类的静态属性target上, 然后触发会触发这个监听属性的get方法, 由于这个属性是响应式对象, 再会到Observer类中, 添加这个依赖(Dep.target)添加到依赖列表中, 再会在Watcher中, 执行方法, 把Dep.target 这个值从栈中清空

* 触发更新, 当设置属性时, 去触发更新. 
每一个响应式属性都会创建一个Dep的实例, 用来只存储这个属性的依赖, 触发set方法时, 就会调用dep实例的通知方法, 把收集的所有依赖(Watcher实例)去通知, 调用相应的回调函数

　

#### 3、请简述虚拟 DOM 中 Key 的作用和好处。
key的作用用在vue 虚拟dom算法中, 用来新旧vnode节点比较时辨识VNode
使用key的好处:
* 它可以强制替换元素或组件而不是重复使用它
* 如果需要触发组件的完整生命周期钩子, 可以改变key
* 如果需要触发过渡动画, 可以改变key

#### 4、请简述 Vue 中模板编译的过程。
总的来说, 就是把vue模版转化为返回VNode的render函数的过程.
中间主要是两大步骤:
1. 把template转化成AST语法树
2. 把AST语法树转化为可执行的js代码(render函数内部的代码)

在实际的项目中, 开发vue项目时, 一般会使用webpack打包器, 默认生成项目使用的没有编译器版本的vue(体积比较小), 这个时候的编译工作就交给了vue-loader
vue-loader把单文件组件中的template script style 分开处理, 再加上webpack会其他文件的处理, 把template转成render函数的代码, script生成Vue实例组件, style与当前组件关联和其他组件隔离
   
代码调试过程:
1. 这次我们把调试的第一个断点设置在created钩子之后, /src/platforms/web/entry-runtime-with-compiler.js中, compileToFunctions方法上:

   ![image-20220304130839689](https://bluenote.oss-cn-shanghai.aliyuncs.com/img/20220304130839.png)

2. 进入/src/compiler/to-function.js中, 查看createCompileToFunctionFn方法

   ![image-20220304142812404](https://bluenote.oss-cn-shanghai.aliyuncs.com/img/20220304142812.png)

里面调用了compile这个方法, 这是个关键, 返回了template的ast语法树和render函数的内部代码, 我们接着钻进compile

3. 进入/src/compiler/create-compiler.js, 看到createCompilerCreator方法
   ![image-20220304143456873](https://bluenote.oss-cn-shanghai.aliyuncs.com/img/20220304143457.png)

核心代码就一句话, 调用了baseCompile, 我们接着看baseCompile



4. 进入/src/compiler/index.js, 看baseCompile方法
   ![image-20220304143637959](https://bluenote.oss-cn-shanghai.aliyuncs.com/img/20220304143638.png)

这个方法做了两个事情: 1.是把template解析成AST语法树 2. 是把AST语法树生成render函数的内部代码, 这里用到了一点编译原理的东西, 第一步实际上做了词法和语法分析并生成抽象语法树的事, 第二步做了代码生成的事, 这两个功能不深入看了, 但是是Vue编译器的核心, 精髓所在.

5. 回到/src/compiler/to-function.js, 看createFunction方法
   ![image-20220304145011593](https://bluenote.oss-cn-shanghai.aliyuncs.com/img/20220304145011.png)

createFunction这个方法是把编译出来的渲染内部代码, 包成一个函数, 以便被调用

6. 再回到/src/platforms/web/entry-runtime-with-compiler.js中, 现在render函数有了, 进入mount方法做渲染操作
   ![image-20220304145337859](https://bluenote.oss-cn-shanghai.aliyuncs.com/img/20220304145338.png)

7. 进入/src/platforms/web/runtime/index.js, 找到mountComponent方法

   ![image-20220304145515854](https://bluenote.oss-cn-shanghai.aliyuncs.com/img/20220304145516.png)

8. 进入/src/core/instance/lifecycle.js, 找到mountComponent方法
   ![image-20220304145641688](https://bluenote.oss-cn-shanghai.aliyuncs.com/img/20220304145641.png)

这个方法new Watcher会执行updateComponent这个回调方法, 这个方法会更新组件, _update方法的第一个参数是调用render函数, 生成vnode, 我们进去看看

9. 进入/src/core/instance/lifecycle.js, 看_update
   ![image-20220304150329114](https://bluenote.oss-cn-shanghai.aliyuncs.com/img/20220304150329.png)

这个方法的核心功能是调用__patch__方法, 对比新旧vnode, 返回最新的真实dom, __patch__方法里面是v node核心内容, 使用diff算法做优化, 这次调试的目标不在这, 先过了.

10. 又回到了/src/core/instance/lifecycle.js中, 在到执行完mounted钩子, 一次完整的初次渲染就结束了
    ![image-20220304150923441](https://bluenote.oss-cn-shanghai.aliyuncs.com/img/20220304150923.png)






　

　