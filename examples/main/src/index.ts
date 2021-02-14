import { initStore } from '@alt-sdk/sdk'

const store = initStore({
  plugins: []
})
const title = document.createElement('h1')
title.innerText = 'alt loader example'
document.body.append(title)