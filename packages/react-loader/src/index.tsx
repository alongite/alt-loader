
import React from 'react'

import { Store, Plugin } from '@alt-sdk/sdk'

/**
 * 获取插件
 * @param pluginLoader 插件加载器
 * @param pluginId 插件Id
 * @param page 插件页面，默认main，主要针对多应用
 */
export const usePlugin = (store: Store, pluginId: string, page?: string) => {
  const [loading, setLoading] = React.useState(false)
  const [plugin, setPlugin] = React.useState<Plugin | null>(null)
  const [error, setError] = React.useState<Error>()

  React.useEffect(() => {
    setLoading(true)
    setError(undefined)
    store.loadPlugin(pluginId).then(p => {
      setPlugin(p)
    }).catch(e => {
      setError(e)
    }).finally(() => {
      setLoading(false)
    })
  }, [pluginId, page])

  return {
    plugin,
    loading,
    error
  }
}

export const ReactPluginRoot: React.FC<{
  store: Store
  pluginId: string
  loadingTip?: React.FC
  errorTip?: React.FC<{error?: Error}>
  pluginProps?: { [key: string]: any }
  className?: string
  style?: React.CSSProperties
}> = ({
  store,
  pluginId,
  loadingTip = () => <p>loading</p>,
  errorTip = () => <p>failed to load</p>,
  pluginProps,
  className,
  style
}) => {
  const Loading = loadingTip
  const ErrorTip = errorTip
  const ref = React.useRef<HTMLDivElement>(null)

  const { plugin, loading, error } = usePlugin(store, pluginId)

  const root = React.useMemo(() => document.createElement('div'), [])

  React.useEffect(() => {
    plugin?.mount?.({
      container: root,
      ...pluginProps
    })
    return () => {
      plugin?.unmount?.({
        container: root
      })
    }
  }, [plugin, pluginProps])

  React.useEffect(() => {
    ref.current?.appendChild(root)
    return () => {
      ref.current?.removeChild(root)
    }
  }, [ref.current])

  return (
    <div
      ref={ref}
      className={className}
      style={style}
    >
      {loading ? <Loading /> : null}
      {error ?  <ErrorTip error={error} /> : null}
    </div>
  )
}