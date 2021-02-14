/**
 * @file SDK全局属性
 */
import { PluginLifeCycle } from './types';
import { Event, Callback, Handler } from './events';
import { PluginLoader } from './plugin-loader';
declare class SDKEvent {
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
    handle(name: string, fn: Handler): void;
    handleOnce(name: string, fn: Handler): void;
    removeHandler(name: string): void;
    invoke(name: string, ...value: any): Promise<any>;
}
interface AppHistory {
    push?(path: string): void;
    replace?(path: string): void;
}
export declare class JSSDK extends SDKEvent {
    readonly name: string;
    /**
     * 路由，需要在主应用设置
     */
    router: {
        basename: string;
        history: AppHistory;
    };
    /**
     * 根节点，用于判断是否在主应用，主应用需要设置一个非Javascript false的值
     */
    root: any;
    pluginLoader: PluginLoader;
    constructor({ name }?: {
        name: string;
    });
    setRoot(root: any, force?: boolean): void;
    getRoot(): any;
    setBasename(basename: string): void;
    getBasename(): string;
    setLoaderBaseURL(baseURL: string): void;
    getLoaderBaseURL(): string;
    setHistory(history: AppHistory): void;
    getHistory(): AppHistory | null;
    isInMainApp(): boolean;
}
export declare const create: (scope?: string) => JSSDK;
export declare class SDKPlugin extends SDKEvent {
    private sdk;
    pluginId: string;
    readonly scope: string;
    constructor({ sdk, pluginId, }: {
        sdk: JSSDK;
        pluginId: string;
    });
    getBasename(): string;
    getLoaderBaseURL(): string;
    isInMainApp(): boolean;
    registryPlugin(pageId: string, plugin: PluginLifeCycle): void;
    getHistory(): AppHistory;
}
export {};
