/**
 * @file 应用间通讯
 */
export interface EventInfo {
    sender: string;
    returnValue?: any;
}
export interface Callback {
    (event: EventInfo, ...args: any): void;
    fn?: Callback;
}
export interface Handler {
    (event: EventInfo, ...args: any): any | Promise<any>;
}
export declare class Event {
    _events: {
        [key: string]: Callback[] | null;
    };
    _actions: {
        [key: string]: Handler | null;
    };
    on(name: string, fn: Callback): void;
    off(name: string, fn?: Callback): void;
    once(name: string, fn: Callback): void;
    emit(name: string, event: EventInfo, ...value: any): void;
    emitSync(name: string, event: EventInfo, ...value: any): any;
    handle(name: string, fn: Handler): void;
    handleOnce(name: string, fn: Handler): void;
    removeHandler(name: string): void;
    invoke(name: string, event: EventInfo, ...value: any): Promise<any>;
}
