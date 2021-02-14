
import axios from 'axios'
import { DEFAULT_STORE } from './const'
import { Event, Callback, Handler } from './events'
import { retry, loadScript, loadStyle } from './loader'
import { defer, Deferred } from './utils'
import { Plugin, PluginConfig, ResolvePluginConfig, StoreInitProps } from './types'

export class StoreEvent {
  public defaultScope: string = ''
  public events: Event

  constructor({
    defaultScope,
    events
  }: {
    defaultScope: string
    events?: Event
  }) {
    this.defaultScope = defaultScope
    this.events = events || new Event()
  }

  _getEventName(name: string) {
    const hasScope = name.includes(':')
    return hasScope ? name : `${this.defaultScope}:${name}`
  }

  on(name: string, fn: Callback) {
    const eventName = this._getEventName(name)
    this.events.on(eventName, fn)
  }

  off(name: string, fn: Callback) {
    const eventName = this._getEventName(name)
    this.events.off(eventName, fn)
  }

  once(name: string, fn: Callback) {
    const eventName = this._getEventName(name)
    this.events.once(eventName, fn)
  }

  emit(name: string, ...value: any) {
    const eventName = this._getEventName(name)
    this.events.emit(eventName, {
      sender: this.defaultScope
    }, ...value)
  }

  emitSync(name: string, ...value: any): any {
    const eventName = this._getEventName(name)
    return this.events.emitSync(eventName, {
      sender: this.defaultScope
    }, ...value)
  }

  handle(name: string, fn: Handler) {
    const eventName = this._getEventName(name)
    this.events.handle(eventName, fn)
  }

  handleOnce(name: string, fn: Handler) {
    const eventName = this._getEventName(name)
    this.events.handleOnce(eventName, fn)
  }

  removeHandler(name: string) {
    const eventName = this._getEventName(name)
    this.events.removeHandler(eventName)
  }

  invoke(name: string, ...value: any) {
    const eventName = this._getEventName(name)
    return this.events.invoke(eventName, {
      sender: this.defaultScope
    }, ...value)
  }
}

export class Store extends StoreEvent {
  public name: string = DEFAULT_STORE
  private retry: number = 0
  private plugins: Map<string, PluginConfig> = new Map()
  public resolvePluginConfig: ResolvePluginConfig
  private request = axios.create()
  private loaded: Map<string, Deferred<Plugin>> = new Map()

  constructor({
    scope = DEFAULT_STORE,
    plugins,
    resolvePluginConfig,
    retry = 0
  }: StoreInitProps) {
    super({
      defaultScope: 'main'
    })
    this.name = scope
    this.retry = retry
    this.resolvePluginConfig = resolvePluginConfig || this._resolvePluginConfig.bind(this)
    this.addPlugins(plugins)
  }

  private _resolvePluginConfig(pluginId: string) {
    return this.plugins.get(pluginId)
  }

  addPlugin(plugin: PluginConfig) {
    this.plugins.set(plugin.id, plugin)
  }

  addPlugins(plugins: PluginConfig[]) {
    plugins.forEach(plugin => this.addPlugin(plugin))
  }

  removePlugin(pluginId: string) {
    this.plugins.delete(pluginId)
  }

  loadPlugin(pluginId: string, config?: { retry?: number }) {
    if (this.loaded.has(pluginId)) {
      return this.loaded.get(pluginId).promise
    }

    const times = config?.retry || this.retry || 0

    const deferred = defer<Plugin>()
    this.loaded.set(pluginId, deferred)

    Promise.resolve(this.resolvePluginConfig(pluginId)).then((pluginConfig) => {
      const files = pluginConfig?.files || []

      return Promise.all(files.map(filePath => {
        const file = filePath.split('.')
        const ext = file[file.length - 1].toLocaleLowerCase()
        if (ext.startsWith('js')) {
          return retry(() => loadScript(filePath), times)()
        } else if (ext.startsWith('css')) {
          return retry(() => loadStyle(filePath), times)()
        } else {
          return retry(() => this.request.get(filePath).then(ret => ret.data), times)()
        }
      }))
    }).catch((e) => {
      deferred.reject(e)
      this.loaded.delete(pluginId)
    })

    return deferred.promise
  }

  resolvePlugin(pluginId: string, plugin: Plugin) {
    if (!this.loaded.has(pluginId)) {
      this.loaded.set(pluginId, defer<Plugin>())
    }
    this.loaded.get(pluginId).resolve(plugin)
  }
}

interface StoreGlobal {
  [key: string]: Store
}

const _window = window as unknown as StoreGlobal

export function initStore({
  scope = DEFAULT_STORE,
  ...rest
}: StoreInitProps) {
  _window[scope] = _window[scope] || new Store({ scope, ...rest })
  return _window[scope]
}

export function getStore(scope: string = DEFAULT_STORE) {
  return _window[scope]
}