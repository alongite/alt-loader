import { initPlugin } from '@alt-sdk/sdk'

const plugin = initPlugin('js-plugin')

plugin.registerPlugin({
  mount(container) {
    const p = document.createElement('p')
    plugin.invoke('main:getName').then((name: string) => {
      p.innerText = name
    })
    container.appendChild(p)
  },
  unmount(container) {
    container.innerHTML = ''
  }
})

if (!plugin.isRunInStore) {
  const d = document.createElement('div')
  d.innerText = 'js plugin'
  document.body.appendChild(d)
}
