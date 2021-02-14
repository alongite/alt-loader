import { Plugin } from './types';
import { StoreEvent, Store } from './store';
declare class StorePlugin extends StoreEvent {
    readonly pluginId: string;
    readonly scope: string;
    private store;
    constructor({ pluginId, store }: {
        pluginId: string;
        store: Store;
    });
    registerPlugin(plugin: Plugin): void;
}
export declare function initPlugin(pluginId: string, scope?: string): Pick<StorePlugin, "scope" | "pluginId" | "on" | "once" | "off" | "emit" | "emitSync" | "handle" | "handleOnce" | "removeHandler" | "invoke" | "registerPlugin"> & {
    isRunInStore: boolean;
};
export {};
