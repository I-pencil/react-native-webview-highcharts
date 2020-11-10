import Highcharts from './highcharts';
export interface ConfigOptions extends Highcharts.Options {
    xAxisPrecision?: number;
    yAxisPrecision?: number;
    debug?: boolean;
}
declare global {
    interface Window {
        [key: string]: any;
        create: (options: ConfigOptions) => void;
        update: (options: ConfigOptions) => void;
    }
}
export declare function create(options: ConfigOptions): string;
export declare function update(options: ConfigOptions): string;
