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

function stringifyJSON(obj: object) {
  let result = JSON.stringify(obj, function (key, val) {
    if (typeof val === 'function') {
      return val + '';
    }
    return val;
  });
  return result;
}

 
export function create(options: ConfigOptions) {
  return `window.create(${stringifyJSON(options)});`;
}

export function update(options: ConfigOptions) {
  return `window.update(${stringifyJSON(options)});`;
}
