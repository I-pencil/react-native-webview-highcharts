import Highcharts from 'highcharts';
import _ from 'lodash';

import { ConfigOptions } from '../public/src';


function parseJSON(str: string) {
  return JSON.parse(str, function (k, v) {
    if (!k || typeof v !== 'string') return v;
    if (v.indexOf && v.indexOf('function') > -1) {
      return new Function(`return ${v}`)();
      // return eval(v);
    }
    return v;
  });
}

let vconsole

class WebViewHighcharts {
  private chartRef: Highcharts.Chart | null = null;
  private xAxisPrecision: number | null = null;
  private yAxisPrecision: number | null = null;
  private debug: boolean = false

  constructor() {
    window.create = this.create.bind(this);
    window.update = this.update.bind(this);
  }

  public create(options: ConfigOptions) {
    // alert(typeof options);
    const ops = parseJSON(JSON.stringify(options));

    console.log('create options', ops);

    const _options = this.getOptions(ops);

    console.log('create _options', _options)

    this.chartRef = Highcharts.chart('app', _options);
    this.postMessage(JSON.stringify({ event: 'created' }));
  }

  public update(options: ConfigOptions) {
    if (!this.chartRef) return;
    const ops = parseJSON(JSON.stringify(options));

    console.log('update options', ops);

    const _options = this.getOptions(ops);

    console.log('update _options', _options);

    this.chartRef.update(_options);
    this.postMessage(JSON.stringify({ event: 'updated' }));
  }

  private getOptions(ops: ConfigOptions): Highcharts.Options {

    const {
      xAxisPrecision = null,
      yAxisPrecision = null,
      debug = false,
      ...rest
    } = ops;

    this.xAxisPrecision = _.hasIn(ops, 'xAxisPrecision')
      ? xAxisPrecision
      : this.xAxisPrecision;
    this.yAxisPrecision = _.hasIn(ops, 'yAxisPrecision')
      ? yAxisPrecision
      : this.yAxisPrecision;

    this.debug = _.hasIn(ops, 'debug') ? debug : this.debug

    if (this.debug) {
      const VConsole = require('vconsole');
      vconsole = new VConsole();
    } else {
      vconsole = null;
    }

    const aliasPrecisionY = this.yAxisPrecision;
    const aliasPrecisionX = this.xAxisPrecision;

    let options: Highcharts.Options;
    let result: Highcharts.Options;

    if (
      !_.hasIn(rest, 'yAxis.labels.formatter') &&
      _.isNumber(aliasPrecisionY)
    ) {
      options = _.merge<Highcharts.Options, Highcharts.Options>(rest, {
        yAxis: {
          labels: {
            formatter: function () {
              return _.isNumber(this.value)
                ? this.value.toFixed(aliasPrecisionY)
                : this.value;
            },
          },
        },
      });
    } else {
      options = rest;
    }

    if (
      !_.hasIn(rest, 'xAxis.labels.formatter') &&
      _.isNumber(aliasPrecisionX)
    ) {
      result = _.merge<Highcharts.Options, Highcharts.Options>(options, {
        xAxis: {
          labels: {
            formatter: function () {
              return _.isNumber(this.value)
                ? this.value.toFixed(aliasPrecisionX)
                : this.value;
            },
          },
        },
      });
    } else {
      result = options;
    }

    return result;
  }

  public postMessage(message: string) {
    let info = message;
    if (typeof message !== 'string') {
      info = JSON.stringify(message);
    }

    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(info);
    }
  }
}

export default new WebViewHighcharts()
