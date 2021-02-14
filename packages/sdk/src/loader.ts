

export function load(func: (url: string) => Promise<void>) {
  const cache: { [key: string]: boolean | Promise<any> } = {}
  function fn(url: string, { ignoreCache }: { ignoreCache?: boolean } = { ignoreCache: false }): Promise<any> {
    if (!ignoreCache && cache[url]) {
      return cache[url] as Promise<any>
    }
    let _url = url
    if (ignoreCache) {
      _url = `${url}${url.includes('?') ? '&' : '?'}${Date.now()}`
    }
    const p = Promise.resolve(func(_url))
    cache[url] = p
    p.catch(e => {
      cache[url] = false
      throw e
    })
    return p
  }
  return fn
}

export function retry(_fn: (...props: any) => Promise<any>, times: number = 3) {
  const fn = (time: number, ...args: any): Promise<any> => {
    return _fn(...args).catch(e => {
      if (time < times) {
        return fn(time + 1, ...args)
      } else {
        throw e
      }
    })
  }
  return (...args: any) => {
    return fn(0, ...args)
  }
}

export const loadStyle = load((url: string) => {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link')
    link.type = 'text/css'
    link.rel = 'stylesheet'
    link.href = url
    link.onload = () => {
      resolve()
    }
    link.onerror = (e) => {
      reject(e)
      document.head.removeChild(link)
    }
    document.head.appendChild(link)
  })
})

export const loadScript = load((url: string) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.async = false
    script.src = url
    script.onload = () => {
      resolve()
    }
    script.onerror = (e) => {
      reject(e)
      document.head.removeChild(script)
    }
    document.head.appendChild(script)
  })
})