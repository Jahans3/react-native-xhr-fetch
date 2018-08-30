# React Native XHR Fetch

A simple replacement for the `fetch` API in React Native that allows far greater control via the `XMLHttpRequest` API.

### Why?

React Native ships with a limited version `fetch`, which means we lose crucial functionality such as the ability to abort a request. This small library provides a simple API that wraps `XMLHttpRequest` and mimics `fetch` closely.

### Usage

By allowing you to pass in your own instance of `XMLHttpRequest`, you get full access to the API.

For example, aborting a request:

```
import xhrFetch from 'react-native-xhr-fetch';

class MyComponent extends React.Component {
    state = {
        data: undefined
    };

    _xhr;

    async makeRequestWithOwnXHR () {
        this._xhr = new XMLHttpRequest();

        const response = await responsePromise: xhrFetch('https://my-api.mysite.com', {
            method: 'GET',
            XHR: myXhr // Pass your instance - this is completely optional, will create own instance if none if passed
        })

        this.setState({
            data: await response.json() // Parse the response
        })
    }

    componentWillUnmount () {
        this._xhr && this._xhr.abort(); // Abort the request!
    }

    render () {
        return (
            <SomeComponent data={this.state.data} />
        );
    }
}
```

### Caveats

* `Response.redirected` - unavailable, doesn't exist for `XMLHttpRequest`.
* `Response.type` - returns the values as returned by `XMLHttpRequest.responseType`, instead of `Response.type`.
    * See the following for a list of possible values: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType

### Flow
Helpful type defs for `Flow` users:

```
import type { HTTPMethods, FetchOptions, Response } from 'react-native-xhr-fetch';

type HTTPMethods = 'GET'
  | 'POST'
  | 'PATCH'
  | 'DELETE'
  | 'PUT'
  | 'CONNECT'
  | 'OPTIONS'
  | 'TRACE'
  | 'HEAD'

type FetchOptions = {
  json?: boolean,
  headers?: Object,
  stringify?: boolean,
  body?: Object | string,
  method?: HTTPMethods,
  XHR?: typeof XMLHttpRequest
}

type Response = {
  ok: boolean,
  url: string,
  headers: Object,
  status: number,
  statusText: string,
  type: string,
  json(): Promise<Object>
}
```