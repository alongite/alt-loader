import { initStore } from '@alt-sdk/sdk'

const store = initStore({
  plugins: [
    {
      id: 'react-plugin',
      files: [
        'http://localhost:8081/react-plugin.js',
        'http://localhost:8081/vendors~main.react-plugin.js',
        'http://localhost:8081/main.react-plugin.js'
      ]
    },
    {
      id: 'vue-plugin',
      files: [
        'http://localhost:8082/js/chunk-vendors.js',
        'http://localhost:8082/vue-plugin.js'
      ]
    },
    {
      id: 'js-plugin',
      files: [
        'http://localhost:8083/js-plugin.js'
      ]
    }
  ]
})

store.handle('getName', (event) => {
  return 'from: ' + event.sender
})
const title = document.createElement('h1')
title.innerText = 'alt loader example'
document.body.append(title)

const ul = document.createElement('ul')
ul.innerHTML = `
<li>react-plugin</li>
<li>vue-plugin</li>
<li>js-plugin</li>
`
let unmount = Function.prototype
ul.addEventListener('click', (e) => {
  unmount?.()
  const type = (e.target as HTMLLIElement).innerText
  if(type === 'react-plugin') {
    store.loadPlugin('react-plugin').then(plugin => {
      const wrapper = document.createElement('div')
      document.body.appendChild(wrapper)
      console.log('react-plugin', plugin)
      plugin?.mount(wrapper)
      unmount = () => {
        plugin.unmount(wrapper)
        try{
          document.body.removeChild(wrapper)
        } catch(e) {
          console.error(e)
        }
      }
    })
  } else if (type === 'vue-plugin') {
    store.loadPlugin('vue-plugin').then(plugin => {
      const wrapper = document.createElement('div')
      const app = document.createElement('div')
      wrapper.appendChild(app)
      document.body.appendChild(wrapper)
      plugin?.mount(app)
      unmount = () => {
        plugin.unmount(wrapper)
        try{
          document.body.removeChild(wrapper)
        } catch(e) {
          console.error(e)
        }
        
      }
    })
  } else if (type === 'js-plugin') {
    store.loadPlugin('js-plugin').then(plugin => {
      const wrapper = document.createElement('div')
      document.body.appendChild(wrapper)
      plugin?.mount(wrapper)
      unmount = () => {
        plugin.unmount(wrapper)
        try{
          document.body.removeChild(wrapper)
        } catch(e) {
          console.error(e)
        }
        
      }
    })
  }
})
document.body.appendChild(ul)
