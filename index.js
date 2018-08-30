// @flow
export type HTTPMethods = 'GET'
  | 'POST'
  | 'PATCH'
  | 'DELETE'
  | 'PUT'
  | 'CONNECT'
  | 'OPTIONS'
  | 'TRACE'
  | 'HEAD'

export type FetchOptions = {
  json?: boolean,
  headers?: Object,
  stringify?: boolean,
  body?: Object | string,
  method?: HTTPMethods,
  XHR?: typeof XMLHttpRequest
}

type PatchHeaders = {
  headers: Object,
  json?: boolean,
  xhr?: typeof XMLHttpRequest
}

type ResponseConstructor = {
  url: string,
  headers: Object
}

export type Response = {
  ok: boolean,
  url: string,
  headers: Object,
  status: number,
  statusText: string,
  type: string,
  json(): Promise<Object>
}

function _Response ({ url, headers }: ResponseConstructor): Response {
  let _bodyUsed = false;
  return {
    headers,
    ok: xhr.status >= 200 && xhr.status <= 300,
    url: url,
    bodyUsed: _bodyUsed,
    status: xhr.status,
    statusText: xhr.statusText,
    type: xhr.responseType,
    _bodyText: xhr.responseText,
    json (): Promise<Object> {
      return new Promise(resolve => {
        _bodyUsed = true;
        resolve(JSON.parse(xhr.responseText))
      });
    }
  }
}

function applyHeaders ({ headers: customHeaders = {}, json, xhr }: PatchHeaders): Object {
  const headers = { ...customHeaders };

  if (json && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  Object.entries(headers).map(([header, value]) => {
    xhr.setRequestHeader(header, value)
  });

  return headers;
}

export default async function fetch (url: string, {
  json = true,
  headers = {},
  stringify = true,
  body: rawBody,
  method = 'GET',
  XHR
}: FetchOptions = {}): Promise<*> {
  return new Promise((resolve, reject) => {
    const xhr: typeof XMLHttpRequest = XHR || new XMLHttpRequest();
    const body: string = (stringify && rawBody) ? JSON.stringify(rawBody) : rawBody;

    xhr.open(method, url);

    const _headers = {
      ...applyHeaders({ headers, json, xhr })
    };

    xhr.send(body);

    xhr.onload = (): void => {
      resolve(new _Response({ url, headers: _headers }));
    };

    xhr.onerror = (): void => {
      reject(new Error(`Failed to fetch. \n { uri: ${url}, method: ${method} } \n`));
    };
  });
}
