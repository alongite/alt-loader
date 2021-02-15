# alt-sdk
前端模块加载系统。可以基于该模块制作“微前端”，或者制作JSSDK用于模块间通讯。

## Examples

https://github.com/alongite/alt-sdk/tree/master/examples

## 如何使用
在主应用中
```
import { initStore } from '@alt-sdk/sdk'

const store = initStore({
  plugins: [
    {
      id: 'plugin1',
      files: [
        'http://localhost:8081/index.js'
      ]
    }
  ]
})

store.loadPlugin('plugin1').then(plugin => {
  plugin?.mount()
})
```
在子应用中
```
import { initPlugin } from '@alt-sdk/sdk'

const plugin = initPlugin('plugin1')
plugin.register({
  mount() {
    console.log('mount')
  }
  unmount() {
    console.log('unmount')
  }
})
```
## 事件通讯
提供了`on`,`once`,`off`,`emit`,`emitSync`,`handle`,`handleOnce`,`removeHandler`,`invoke`。

事件名称分为两部分`事件范围:事件名称`，例如`main:getName`表示触发`main`中的`getName`事件。

默认store中的事件范围为`main`，plugin中的事件范围为pluginId

可以同步触发事件调用返回结果，例如
```
import {initStore, initPlugin} from '@alt-store/sdk'
const store = initStore({
  plugins: [
    {
      id: 'plugin1',
      files: []
    }
  ]
})
store.on('getName', (event) => {
  e.returnValue = 'from:' + event.sender
})
const plugin1 = initPlugin('plugin1')
const ret = plugin1.emitSync('main:getName')
console.log(ret) // form: plugin1
```