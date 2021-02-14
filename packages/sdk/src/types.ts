
export interface Plugin {
  mount: (...props: any) => void
  unmount: (...props: any) => void
  [key: string]: any
}

export interface PluginConfig {
  id: string
  files: string[]
}

export interface ResolvePluginConfig {
  (pluginId: string): PluginConfig | Promise<PluginConfig | null> | null
}

export interface StoreInitProps {
  scope?: string
  plugins: PluginConfig[]
  resolvePluginConfig?: ResolvePluginConfig
  retry?: number
}