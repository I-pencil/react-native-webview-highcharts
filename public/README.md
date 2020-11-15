# React Native Webview Highcharts

**React Native Webview Highcharts** is a chart library based on [Highcharts](https://www.highcharts.com.cn/) for React Native.

**Note:**

React Native Webview Highcharts needs to be used with [react-native-webview](https://github.com/react-native-webview/react-native-webview).

## Install

use npm:

```shell
npm install react-native-webview-highcharts
```

If you haven't installed [react-native-webview](https://github.com/react-native-webview/react-native-webview) yet, please install it.

## Usage

```tsx
import React, { Component, useRef } from 'react';
import {Platform} from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { create, update } from 'react-native-webview-highcharts';

function Demo() {
  const chartRef = useRef<WebView>(null);

  const onMessage = ({nativeEvent}: WebViewMessageEvent) => {
    const {event} = JSON.parse(nativeEvent.data);
    if (event === 'created') {
      doSomething();
    }
  };

  const onLoad = () => {
    const js = create(configOptions); // init the chart
    chartRef.current?.injectJavaScript(js);
  };

  const doSomething = () => {
    /*
     * do something
     * ....
     */

    const js = update(configOptions); // update the chart
    chartRef.current?.injectJavaScript(js);
  }

  let source
  if (Platform.OS === 'ios') {
    source = require("react-native-webview-highcharts/dist/index.html")
  } else {
    const prefix = 'file:///android_asset/raw/';
    const path = 'node_modules_reactnativewebviewhighcharts_dist_index.html';
    source = {uri: `${prefix}${path}`}
  }
  render() {
    return (
      <WebView
        ref={chartRef}
        source={source}
        originWhitelist={['*']}
        onMessage={onMessage}
        onLoad={onLoad}
        scrollEnabled={false}
      />
    );
  }
}
```
## API

There are two methods in React Native Webview Highcharts:

### 1. create(configOptions)

The `create` method creates a chart by calling the initialization function [`Highcharts.chart`](https://api.highcharts.com.cn/highcharts#Highcharts.chart). When the chart is created, `window.ReactNativeWebView.postMessage(data)` is called so that React Native can know that the chart has been created. Among them, the parameter data of `postMessage` is `JSON.stringify({event:'created'})`.

### 2. update(configOptions)

When you want to update the chart, you need to use the ` update ` method at this time.

The ` update ` method will call [Highcharts' update method](https://api.highcharts.com.cn/highcharts#Chart.update) to update the chart, and then call ` window.ReactNativeWebView.postMessage(data) ` to send a message to tell React Native that the chart is updated. Among them, the parameter data of ` postMessage ` is ` JSON.stringify({event:'updated'}) `.

###  configOptions

` configOptions ` is the parameter of ` create ` and ` update ` methods, it inherits [the chart configuration of Highcharts](https://api.highcharts.com.cn/highcharts), and it can also have the following three attributes:

name | type | required | description
-- | -- | -- | -- |
xAxisPrecision | number | no  | x-axis label formatting precision
yAxisPrecision | number | no  | y-axis label formatting precision
debug | boolean | no | debug mode

When the X-axis or Y-axis label is a number, we often need to format the number according to the precision. At this time, we can configure ` xAxisPrecision ` or ` yAxisPrecision `. Of course, we can also customize the formatting function in the configuration, that is, configure the [` xAxis.labels.formatter `](https://api.highcharts.com.cn/highcharts#xAxis.labels.formatter) method.
