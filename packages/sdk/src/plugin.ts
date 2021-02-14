
import { Plugin } from './types'
import { DEFAULT_STORE } from './const'
import { StoreEvent, getStore, Store } from './store'

class StorePlugin extends StoreEvent {
  public readonly pluginId: string
  public readonly scope: string
  private store: Store
  constructor({
    pluginId,
    store
  }: {
    pluginId: string
    store: Store
  }) {
    super({
      defaultScope: pluginId,
      events: store.events
    })
    this.pluginId = pluginId
    this.store = store
    this.scope = store.name
  }

  registerPlugin(plugin: Plugin) {
    this.store.resolvePlugin(this.pluginId, plugin)
  }
}

export function initPlugin(pluginId: string, scope: string = DEFAULT_STORE) {
  const store = getStore(scope)
  if (!store) {
    console.error(`Cannot find scope: ${scope}. Did you initStore first?`)
  }
  const plugin = new StorePlugin({
    pluginId,
    store: store || new Store({ plugins: [], scope: '' + Date.now() })
  })

  const fns = [
    'on', 'once', 'off', 'emit', 'emitSync',
    'handle', 'handleOnce', 'removeHandler',
    'invoke', 'registerPlugin'
  ]
  const exportVar = {
    scope,
    pluginId,
    isRunInStore: !!store
  } as Pick<
    StorePlugin,
    'scope' | 'pluginId' | 'on' | 'once' | 
    'off' | 'emit' | 'emitSync' | 'handle' | 
    'handleOnce' | 'removeHandler' | 'invoke' |
    'registerPlugin'
  > & { isRunInStore: boolean }
  fns.forEach(key => {
    (exportVar as any)[key] = (plugin as any)[key].bind(plugin)
  })
  return exportVar
}
