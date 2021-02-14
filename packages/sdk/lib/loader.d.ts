export declare function load(func: (url: string) => Promise<void>): (url: string, { ignoreCache }?: {
    ignoreCache?: boolean;
}) => Promise<any>;
export declare function retry(_fn: (...props: any) => Promise<any>, times?: number): (...args: any) => Promise<any>;
export declare const loadStyle: (url: string, { ignoreCache }?: {
    ignoreCache?: boolean;
}) => Promise<any>;
export declare const loadScript: (url: string, { ignoreCache }?: {
    ignoreCache?: boolean;
}) => Promise<any>;
