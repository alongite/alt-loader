import { Event, Callback, Handler } from './events';
import { Plugin, PluginConfig, ResolvePluginConfig, StoreInitProps } from './types';
export declare class StoreEvent {
    defaultScope: string;
    events: Event;
    constructor({ defaultScope, events }: {
        defaultScope: string;
        events?: Event;
    });
    _getEventName(name: string): string;
    on(name: string, fn: Callback): void;
    off(name: string, fn: Callback): void;
    once(name: string, fn: Callback): void;
    emit(name: string, ...value: any): void;
    emitSync(name: string, ...value: any): any;
    handle(name: string, fn: Handler): void;
    handleOnce(name: string, fn: Handler): void;
    removeHandler(name: string): void;
    invoke(name: string, ...value: any): Promise<any>;
}
export declare class Store extends StoreEvent {
    name: string;
    private retry;
    private plugins;
    resolvePluginConfig: ResolvePluginConfig;
    private request;
    private loaded;
    constructor({ scope, plugins, resolvePluginConfig, retry }: StoreInitProps);
    private _resolvePluginConfig;
    addPlugin(plugin: PluginConfig): void;
    addPlugins(plugins: PluginConfig[]): void;
    removePlugin(pluginId: string): void;
    loadPlugin(pluginId: string, config?: {
        retry?: number;
    }): Promise<Plugin>;
    resolvePlugin(pluginId: string, plugin: Plugin): void;
}
export declare function initStore({ scope, ...rest }: StoreInitProps): Store;
export declare function getStore(scope?: string): Store;
