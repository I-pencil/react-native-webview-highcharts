import { ConfigOptions } from '.';
declare class WebViewHighcharts {
    private chartRef;
    private xAxisPrecision;
    private yAxisPrecision;
    private debug;
    constructor();
    create(options: ConfigOptions): void;
    update(options: ConfigOptions): void;
    private getOptions;
    postMessage(message: string): void;
}
declare const _default: WebViewHighcharts;
export default _default;
