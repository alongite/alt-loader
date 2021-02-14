/**
 * @file 插件加载器
 */
import { AxiosInstance } from 'axios';
import { PluginLifeCycle } from './types';
import { Event } from './events';
export declare class PluginLoader extends Event {
    baseURL: string;
    request: AxiosInstance;
    loadByRequest: (args_0: string, args_1?: {
        ignoreCache?: boolean;
    }) => Promise<any>;
    private plugins;
    private pending;
    constructor({ baseURL }?: {
        baseURL: string;
    });
    setLoadBaseURL(baseURL?: string): void;
    loadPluginConfig(pluginId: string): Promise<any>;
    loadPlugin(pluginId: string, page?: string): Promise<PluginLifeCycle>;
    registryPlugin(key: string, plugin: PluginLifeCycle): void;
}
