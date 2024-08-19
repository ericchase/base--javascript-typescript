export type SubscriptionCallback = () => { abort: boolean } | void;

export interface WebRequest {
  bodyDetails?: chrome.webRequest.WebRequestBodyDetails;
  headersDetails?: chrome.webRequest.WebRequestHeadersDetails;
}

export class WebRequestCache {
  static RequestIdToRequestMap = new Map<string, WebRequest>();
  static TabIdToRequestMap = new Map<number, WebRequest>();
  static AddBody(details: chrome.webRequest.WebRequestBodyDetails) {
    const webRequest = this.RequestIdToRequestMap.get(details.requestId);
    if (webRequest) {
      webRequest.bodyDetails = details;
    } else {
      const webRequest: WebRequest = { bodyDetails: details };
      this.RequestIdToRequestMap.set(details.requestId, webRequest);
      this.TabIdToRequestMap.set(details.tabId, webRequest);
    }
  }
  static AddHeaders(details: chrome.webRequest.WebRequestHeadersDetails) {
    const webRequest = this.RequestIdToRequestMap.get(details.requestId);
    if (webRequest) {
      webRequest.headersDetails = details;
    } else {
      const webRequest: WebRequest = { headersDetails: details };
      this.RequestIdToRequestMap.set(details.requestId, webRequest);
      this.TabIdToRequestMap.set(details.tabId, webRequest);
    }
    this.Notify();
  }
  static SubscriptionSet = new Set<SubscriptionCallback>();
  static Subscribe(callback: SubscriptionCallback): () => void {
    this.SubscriptionSet.add(callback);
    if (callback()?.abort === true) {
      this.SubscriptionSet.delete(callback);
      return () => {};
    }
    return () => {
      this.SubscriptionSet.delete(callback);
    };
  }
  static Notify() {
    for (const callback of this.SubscriptionSet) {
      if (callback()?.abort === true) {
        this.SubscriptionSet.delete(callback);
      }
    }
  }
}

export async function RebuildAndSendRequest(webRequest: WebRequest) {
  const { bodyDetails, headersDetails } = webRequest;
  const requestUrl = bodyDetails?.url ?? headersDetails?.url;
  if (requestUrl) {
    const requestInit: { body?: BodyInit; headers?: HeadersInit } & unknown = {};
    if (bodyDetails?.requestBody?.formData) {
      const formData = new FormData();
      for (const [name, values] of Object.entries(bodyDetails.requestBody.formData)) {
        for (const value of values) {
          formData.append(name, value);
        }
      }
      requestInit.body = formData;
    } else if (bodyDetails?.requestBody?.raw) {
      // TODO: add handling for `bodyDetails.requestBody.raw.file`
      requestInit.body = new Blob(bodyDetails.requestBody.raw.map((_) => _.bytes).filter((_) => _ !== undefined));
    }
    if (headersDetails?.requestHeaders) {
      const headers = new Headers();
      for (const { name, value } of headersDetails.requestHeaders) {
        if (value) {
          headers.append(name, value);
        }
      }
      requestInit.headers = headers;
    }
    return fetch(requestUrl, requestInit);
  }
}

export async function AnalyzeRequestBody(req: Request) {
  const clone = req.clone();
  try {
    return { type: 'json', data: await clone.json() };
  } catch (_) {}
  try {
    return { type: 'text', data: await clone.text() };
  } catch (_) {}
  return { type: undefined, data: undefined };
}
export async function AnalyzeResponseBody(res: Response) {
  const clone = res.clone();
  try {
    return { type: 'json', data: await clone.json() };
  } catch (_) {}
  try {
    return { type: 'text', data: await clone.text() };
  } catch (_) {}
  return { type: undefined, data: undefined };
}
