/**
 * @file 应用间通讯
 */

export interface EventInfo {
  sender: string
  returnValue?: any
}

export interface Callback {
  (event: EventInfo, ...args: any): void
  fn?: Callback
}

export interface Handler {
  (event: EventInfo, ...args: any): any | Promise<any>
}

export class Event {
  public _events: { [key: string]: Callback[] | null } = {}
  public _actions: { [key: string]: Handler | null } = {}

  on(name: string, fn: Callback) {
    const cbs = this._events[name] = this._events[name] || [] as Callback[]
    cbs.push(fn)
  }

  off(name: string, fn?: Callback) {
    if (!fn) {
      this._events[name] = null
      return
    }
    const cbs = this._events[name] || []
    let i = cbs.length
    while(i--) {
      const cb = cbs[i]
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1)
        break
      }
    }
  }

  once(name: string, fn: Callback) {
    const _fn = (event: EventInfo, ...args: any) => {
      fn(event, ...args)
      this.off(name, _fn)
    }
    _fn.fn = fn
    this.on(name, _fn)
  }

  emit(name: string, event: EventInfo, ...value: any) {
    (this._events[name] || []).forEach(fn => {
      fn.call(null, event, ...value)
    })
  }

  emitSync(name: string, event: EventInfo, ...value: any): any {
    this.emit(name, event, ...value)
    return event.returnValue
  }

  handle(name: string, fn: Handler) {
    this._actions[name] = fn
  }

  handleOnce(name: string, fn: Handler) {
    const _fn = (event: EventInfo, ...value: any) => new Promise((resolve) => {
      this._actions[name] = null
      resolve(fn.call(null, event, ...value))
    })
    this._actions[name] = _fn
  }

  removeHandler(name: string) {
    this._actions[name] = null
  }

  invoke(name: string, event: EventInfo, ...value: any) {
    const fn = this._actions[name]
    if (!fn) {
      return Promise.reject(`没有注册「${name}」对应的的事件处理函数。`)
    }
    return Promise.resolve(fn.call(null, event, ...value))
  }
}

