var __create = Object.create;
var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __commonJS = (callback, module2) => () => {
  if (!module2) {
    module2 = {exports: {}};
    callback(module2.exports, module2);
  }
  return module2.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {get: all[name], enumerable: true});
};
var __exportStar = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, {get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable});
  }
  return target;
};
var __toModule = (module2) => {
  if (module2 && module2.__esModule)
    return module2;
  return __exportStar(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", {value: module2, enumerable: true})), module2);
};

// node_modules/node-fetch/lib/index.mjs
var require_lib = __commonJS((exports2) => {
  __markAsModule(exports2);
  __export(exports2, {
    FetchError: () => FetchError,
    Headers: () => Headers,
    Request: () => Request,
    Response: () => Response,
    default: () => lib_default
  });
  var import_stream = __toModule(require("stream"));
  var import_http = __toModule(require("http"));
  var import_url = __toModule(require("url"));
  var import_https = __toModule(require("https"));
  var import_zlib = __toModule(require("zlib"));
  var Readable = import_stream.default.Readable;
  var BUFFER = Symbol("buffer");
  var TYPE = Symbol("type");
  var Blob = class {
    constructor() {
      this[TYPE] = "";
      const blobParts = arguments[0];
      const options = arguments[1];
      const buffers = [];
      let size = 0;
      if (blobParts) {
        const a = blobParts;
        const length = Number(a.length);
        for (let i = 0; i < length; i++) {
          const element = a[i];
          let buffer;
          if (element instanceof Buffer) {
            buffer = element;
          } else if (ArrayBuffer.isView(element)) {
            buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
          } else if (element instanceof ArrayBuffer) {
            buffer = Buffer.from(element);
          } else if (element instanceof Blob) {
            buffer = element[BUFFER];
          } else {
            buffer = Buffer.from(typeof element === "string" ? element : String(element));
          }
          size += buffer.length;
          buffers.push(buffer);
        }
      }
      this[BUFFER] = Buffer.concat(buffers);
      let type = options && options.type !== void 0 && String(options.type).toLowerCase();
      if (type && !/[^\u0020-\u007E]/.test(type)) {
        this[TYPE] = type;
      }
    }
    get size() {
      return this[BUFFER].length;
    }
    get type() {
      return this[TYPE];
    }
    text() {
      return Promise.resolve(this[BUFFER].toString());
    }
    arrayBuffer() {
      const buf = this[BUFFER];
      const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
      return Promise.resolve(ab);
    }
    stream() {
      const readable = new Readable();
      readable._read = function() {
      };
      readable.push(this[BUFFER]);
      readable.push(null);
      return readable;
    }
    toString() {
      return "[object Blob]";
    }
    slice() {
      const size = this.size;
      const start = arguments[0];
      const end = arguments[1];
      let relativeStart, relativeEnd;
      if (start === void 0) {
        relativeStart = 0;
      } else if (start < 0) {
        relativeStart = Math.max(size + start, 0);
      } else {
        relativeStart = Math.min(start, size);
      }
      if (end === void 0) {
        relativeEnd = size;
      } else if (end < 0) {
        relativeEnd = Math.max(size + end, 0);
      } else {
        relativeEnd = Math.min(end, size);
      }
      const span = Math.max(relativeEnd - relativeStart, 0);
      const buffer = this[BUFFER];
      const slicedBuffer = buffer.slice(relativeStart, relativeStart + span);
      const blob = new Blob([], {type: arguments[2]});
      blob[BUFFER] = slicedBuffer;
      return blob;
    }
  };
  Object.defineProperties(Blob.prototype, {
    size: {enumerable: true},
    type: {enumerable: true},
    slice: {enumerable: true}
  });
  Object.defineProperty(Blob.prototype, Symbol.toStringTag, {
    value: "Blob",
    writable: false,
    enumerable: false,
    configurable: true
  });
  function FetchError(message, type, systemError) {
    Error.call(this, message);
    this.message = message;
    this.type = type;
    if (systemError) {
      this.code = this.errno = systemError.code;
    }
    Error.captureStackTrace(this, this.constructor);
  }
  FetchError.prototype = Object.create(Error.prototype);
  FetchError.prototype.constructor = FetchError;
  FetchError.prototype.name = "FetchError";
  var convert;
  try {
    convert = require("encoding").convert;
  } catch (e) {
  }
  var INTERNALS = Symbol("Body internals");
  var PassThrough = import_stream.default.PassThrough;
  function Body(body) {
    var _this = this;
    var _ref = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, _ref$size = _ref.size;
    let size = _ref$size === void 0 ? 0 : _ref$size;
    var _ref$timeout = _ref.timeout;
    let timeout = _ref$timeout === void 0 ? 0 : _ref$timeout;
    if (body == null) {
      body = null;
    } else if (isURLSearchParams(body)) {
      body = Buffer.from(body.toString());
    } else if (isBlob(body))
      ;
    else if (Buffer.isBuffer(body))
      ;
    else if (Object.prototype.toString.call(body) === "[object ArrayBuffer]") {
      body = Buffer.from(body);
    } else if (ArrayBuffer.isView(body)) {
      body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
    } else if (body instanceof import_stream.default)
      ;
    else {
      body = Buffer.from(String(body));
    }
    this[INTERNALS] = {
      body,
      disturbed: false,
      error: null
    };
    this.size = size;
    this.timeout = timeout;
    if (body instanceof import_stream.default) {
      body.on("error", function(err) {
        const error = err.name === "AbortError" ? err : new FetchError(`Invalid response body while trying to fetch ${_this.url}: ${err.message}`, "system", err);
        _this[INTERNALS].error = error;
      });
    }
  }
  Body.prototype = {
    get body() {
      return this[INTERNALS].body;
    },
    get bodyUsed() {
      return this[INTERNALS].disturbed;
    },
    arrayBuffer() {
      return consumeBody.call(this).then(function(buf) {
        return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
      });
    },
    blob() {
      let ct = this.headers && this.headers.get("content-type") || "";
      return consumeBody.call(this).then(function(buf) {
        return Object.assign(new Blob([], {
          type: ct.toLowerCase()
        }), {
          [BUFFER]: buf
        });
      });
    },
    json() {
      var _this2 = this;
      return consumeBody.call(this).then(function(buffer) {
        try {
          return JSON.parse(buffer.toString());
        } catch (err) {
          return Body.Promise.reject(new FetchError(`invalid json response body at ${_this2.url} reason: ${err.message}`, "invalid-json"));
        }
      });
    },
    text() {
      return consumeBody.call(this).then(function(buffer) {
        return buffer.toString();
      });
    },
    buffer() {
      return consumeBody.call(this);
    },
    textConverted() {
      var _this3 = this;
      return consumeBody.call(this).then(function(buffer) {
        return convertBody(buffer, _this3.headers);
      });
    }
  };
  Object.defineProperties(Body.prototype, {
    body: {enumerable: true},
    bodyUsed: {enumerable: true},
    arrayBuffer: {enumerable: true},
    blob: {enumerable: true},
    json: {enumerable: true},
    text: {enumerable: true}
  });
  Body.mixIn = function(proto) {
    for (const name of Object.getOwnPropertyNames(Body.prototype)) {
      if (!(name in proto)) {
        const desc = Object.getOwnPropertyDescriptor(Body.prototype, name);
        Object.defineProperty(proto, name, desc);
      }
    }
  };
  function consumeBody() {
    var _this4 = this;
    if (this[INTERNALS].disturbed) {
      return Body.Promise.reject(new TypeError(`body used already for: ${this.url}`));
    }
    this[INTERNALS].disturbed = true;
    if (this[INTERNALS].error) {
      return Body.Promise.reject(this[INTERNALS].error);
    }
    let body = this.body;
    if (body === null) {
      return Body.Promise.resolve(Buffer.alloc(0));
    }
    if (isBlob(body)) {
      body = body.stream();
    }
    if (Buffer.isBuffer(body)) {
      return Body.Promise.resolve(body);
    }
    if (!(body instanceof import_stream.default)) {
      return Body.Promise.resolve(Buffer.alloc(0));
    }
    let accum = [];
    let accumBytes = 0;
    let abort = false;
    return new Body.Promise(function(resolve, reject) {
      let resTimeout;
      if (_this4.timeout) {
        resTimeout = setTimeout(function() {
          abort = true;
          reject(new FetchError(`Response timeout while trying to fetch ${_this4.url} (over ${_this4.timeout}ms)`, "body-timeout"));
        }, _this4.timeout);
      }
      body.on("error", function(err) {
        if (err.name === "AbortError") {
          abort = true;
          reject(err);
        } else {
          reject(new FetchError(`Invalid response body while trying to fetch ${_this4.url}: ${err.message}`, "system", err));
        }
      });
      body.on("data", function(chunk) {
        if (abort || chunk === null) {
          return;
        }
        if (_this4.size && accumBytes + chunk.length > _this4.size) {
          abort = true;
          reject(new FetchError(`content size at ${_this4.url} over limit: ${_this4.size}`, "max-size"));
          return;
        }
        accumBytes += chunk.length;
        accum.push(chunk);
      });
      body.on("end", function() {
        if (abort) {
          return;
        }
        clearTimeout(resTimeout);
        try {
          resolve(Buffer.concat(accum, accumBytes));
        } catch (err) {
          reject(new FetchError(`Could not create Buffer from response body for ${_this4.url}: ${err.message}`, "system", err));
        }
      });
    });
  }
  function convertBody(buffer, headers) {
    if (typeof convert !== "function") {
      throw new Error("The package `encoding` must be installed to use the textConverted() function");
    }
    const ct = headers.get("content-type");
    let charset = "utf-8";
    let res, str;
    if (ct) {
      res = /charset=([^;]*)/i.exec(ct);
    }
    str = buffer.slice(0, 1024).toString();
    if (!res && str) {
      res = /<meta.+?charset=(['"])(.+?)\1/i.exec(str);
    }
    if (!res && str) {
      res = /<meta[\s]+?http-equiv=(['"])content-type\1[\s]+?content=(['"])(.+?)\2/i.exec(str);
      if (!res) {
        res = /<meta[\s]+?content=(['"])(.+?)\1[\s]+?http-equiv=(['"])content-type\3/i.exec(str);
        if (res) {
          res.pop();
        }
      }
      if (res) {
        res = /charset=(.*)/i.exec(res.pop());
      }
    }
    if (!res && str) {
      res = /<\?xml.+?encoding=(['"])(.+?)\1/i.exec(str);
    }
    if (res) {
      charset = res.pop();
      if (charset === "gb2312" || charset === "gbk") {
        charset = "gb18030";
      }
    }
    return convert(buffer, "UTF-8", charset).toString();
  }
  function isURLSearchParams(obj) {
    if (typeof obj !== "object" || typeof obj.append !== "function" || typeof obj.delete !== "function" || typeof obj.get !== "function" || typeof obj.getAll !== "function" || typeof obj.has !== "function" || typeof obj.set !== "function") {
      return false;
    }
    return obj.constructor.name === "URLSearchParams" || Object.prototype.toString.call(obj) === "[object URLSearchParams]" || typeof obj.sort === "function";
  }
  function isBlob(obj) {
    return typeof obj === "object" && typeof obj.arrayBuffer === "function" && typeof obj.type === "string" && typeof obj.stream === "function" && typeof obj.constructor === "function" && typeof obj.constructor.name === "string" && /^(Blob|File)$/.test(obj.constructor.name) && /^(Blob|File)$/.test(obj[Symbol.toStringTag]);
  }
  function clone(instance) {
    let p1, p2;
    let body = instance.body;
    if (instance.bodyUsed) {
      throw new Error("cannot clone body after it is used");
    }
    if (body instanceof import_stream.default && typeof body.getBoundary !== "function") {
      p1 = new PassThrough();
      p2 = new PassThrough();
      body.pipe(p1);
      body.pipe(p2);
      instance[INTERNALS].body = p1;
      body = p2;
    }
    return body;
  }
  function extractContentType(body) {
    if (body === null) {
      return null;
    } else if (typeof body === "string") {
      return "text/plain;charset=UTF-8";
    } else if (isURLSearchParams(body)) {
      return "application/x-www-form-urlencoded;charset=UTF-8";
    } else if (isBlob(body)) {
      return body.type || null;
    } else if (Buffer.isBuffer(body)) {
      return null;
    } else if (Object.prototype.toString.call(body) === "[object ArrayBuffer]") {
      return null;
    } else if (ArrayBuffer.isView(body)) {
      return null;
    } else if (typeof body.getBoundary === "function") {
      return `multipart/form-data;boundary=${body.getBoundary()}`;
    } else if (body instanceof import_stream.default) {
      return null;
    } else {
      return "text/plain;charset=UTF-8";
    }
  }
  function getTotalBytes(instance) {
    const body = instance.body;
    if (body === null) {
      return 0;
    } else if (isBlob(body)) {
      return body.size;
    } else if (Buffer.isBuffer(body)) {
      return body.length;
    } else if (body && typeof body.getLengthSync === "function") {
      if (body._lengthRetrievers && body._lengthRetrievers.length == 0 || body.hasKnownLength && body.hasKnownLength()) {
        return body.getLengthSync();
      }
      return null;
    } else {
      return null;
    }
  }
  function writeToStream(dest, instance) {
    const body = instance.body;
    if (body === null) {
      dest.end();
    } else if (isBlob(body)) {
      body.stream().pipe(dest);
    } else if (Buffer.isBuffer(body)) {
      dest.write(body);
      dest.end();
    } else {
      body.pipe(dest);
    }
  }
  Body.Promise = global.Promise;
  var invalidTokenRegex = /[^\^_`a-zA-Z\-0-9!#$%&'*+.|~]/;
  var invalidHeaderCharRegex = /[^\t\x20-\x7e\x80-\xff]/;
  function validateName(name) {
    name = `${name}`;
    if (invalidTokenRegex.test(name) || name === "") {
      throw new TypeError(`${name} is not a legal HTTP header name`);
    }
  }
  function validateValue(value) {
    value = `${value}`;
    if (invalidHeaderCharRegex.test(value)) {
      throw new TypeError(`${value} is not a legal HTTP header value`);
    }
  }
  function find(map, name) {
    name = name.toLowerCase();
    for (const key in map) {
      if (key.toLowerCase() === name) {
        return key;
      }
    }
    return void 0;
  }
  var MAP = Symbol("map");
  var Headers = class {
    constructor() {
      let init = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : void 0;
      this[MAP] = Object.create(null);
      if (init instanceof Headers) {
        const rawHeaders = init.raw();
        const headerNames = Object.keys(rawHeaders);
        for (const headerName of headerNames) {
          for (const value of rawHeaders[headerName]) {
            this.append(headerName, value);
          }
        }
        return;
      }
      if (init == null)
        ;
      else if (typeof init === "object") {
        const method = init[Symbol.iterator];
        if (method != null) {
          if (typeof method !== "function") {
            throw new TypeError("Header pairs must be iterable");
          }
          const pairs = [];
          for (const pair of init) {
            if (typeof pair !== "object" || typeof pair[Symbol.iterator] !== "function") {
              throw new TypeError("Each header pair must be iterable");
            }
            pairs.push(Array.from(pair));
          }
          for (const pair of pairs) {
            if (pair.length !== 2) {
              throw new TypeError("Each header pair must be a name/value tuple");
            }
            this.append(pair[0], pair[1]);
          }
        } else {
          for (const key of Object.keys(init)) {
            const value = init[key];
            this.append(key, value);
          }
        }
      } else {
        throw new TypeError("Provided initializer must be an object");
      }
    }
    get(name) {
      name = `${name}`;
      validateName(name);
      const key = find(this[MAP], name);
      if (key === void 0) {
        return null;
      }
      return this[MAP][key].join(", ");
    }
    forEach(callback) {
      let thisArg = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : void 0;
      let pairs = getHeaders(this);
      let i = 0;
      while (i < pairs.length) {
        var _pairs$i = pairs[i];
        const name = _pairs$i[0], value = _pairs$i[1];
        callback.call(thisArg, value, name, this);
        pairs = getHeaders(this);
        i++;
      }
    }
    set(name, value) {
      name = `${name}`;
      value = `${value}`;
      validateName(name);
      validateValue(value);
      const key = find(this[MAP], name);
      this[MAP][key !== void 0 ? key : name] = [value];
    }
    append(name, value) {
      name = `${name}`;
      value = `${value}`;
      validateName(name);
      validateValue(value);
      const key = find(this[MAP], name);
      if (key !== void 0) {
        this[MAP][key].push(value);
      } else {
        this[MAP][name] = [value];
      }
    }
    has(name) {
      name = `${name}`;
      validateName(name);
      return find(this[MAP], name) !== void 0;
    }
    delete(name) {
      name = `${name}`;
      validateName(name);
      const key = find(this[MAP], name);
      if (key !== void 0) {
        delete this[MAP][key];
      }
    }
    raw() {
      return this[MAP];
    }
    keys() {
      return createHeadersIterator(this, "key");
    }
    values() {
      return createHeadersIterator(this, "value");
    }
    [Symbol.iterator]() {
      return createHeadersIterator(this, "key+value");
    }
  };
  Headers.prototype.entries = Headers.prototype[Symbol.iterator];
  Object.defineProperty(Headers.prototype, Symbol.toStringTag, {
    value: "Headers",
    writable: false,
    enumerable: false,
    configurable: true
  });
  Object.defineProperties(Headers.prototype, {
    get: {enumerable: true},
    forEach: {enumerable: true},
    set: {enumerable: true},
    append: {enumerable: true},
    has: {enumerable: true},
    delete: {enumerable: true},
    keys: {enumerable: true},
    values: {enumerable: true},
    entries: {enumerable: true}
  });
  function getHeaders(headers) {
    let kind = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "key+value";
    const keys = Object.keys(headers[MAP]).sort();
    return keys.map(kind === "key" ? function(k) {
      return k.toLowerCase();
    } : kind === "value" ? function(k) {
      return headers[MAP][k].join(", ");
    } : function(k) {
      return [k.toLowerCase(), headers[MAP][k].join(", ")];
    });
  }
  var INTERNAL = Symbol("internal");
  function createHeadersIterator(target, kind) {
    const iterator = Object.create(HeadersIteratorPrototype);
    iterator[INTERNAL] = {
      target,
      kind,
      index: 0
    };
    return iterator;
  }
  var HeadersIteratorPrototype = Object.setPrototypeOf({
    next() {
      if (!this || Object.getPrototypeOf(this) !== HeadersIteratorPrototype) {
        throw new TypeError("Value of `this` is not a HeadersIterator");
      }
      var _INTERNAL = this[INTERNAL];
      const target = _INTERNAL.target, kind = _INTERNAL.kind, index = _INTERNAL.index;
      const values = getHeaders(target, kind);
      const len = values.length;
      if (index >= len) {
        return {
          value: void 0,
          done: true
        };
      }
      this[INTERNAL].index = index + 1;
      return {
        value: values[index],
        done: false
      };
    }
  }, Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]())));
  Object.defineProperty(HeadersIteratorPrototype, Symbol.toStringTag, {
    value: "HeadersIterator",
    writable: false,
    enumerable: false,
    configurable: true
  });
  function exportNodeCompatibleHeaders(headers) {
    const obj = Object.assign({__proto__: null}, headers[MAP]);
    const hostHeaderKey = find(headers[MAP], "Host");
    if (hostHeaderKey !== void 0) {
      obj[hostHeaderKey] = obj[hostHeaderKey][0];
    }
    return obj;
  }
  function createHeadersLenient(obj) {
    const headers = new Headers();
    for (const name of Object.keys(obj)) {
      if (invalidTokenRegex.test(name)) {
        continue;
      }
      if (Array.isArray(obj[name])) {
        for (const val of obj[name]) {
          if (invalidHeaderCharRegex.test(val)) {
            continue;
          }
          if (headers[MAP][name] === void 0) {
            headers[MAP][name] = [val];
          } else {
            headers[MAP][name].push(val);
          }
        }
      } else if (!invalidHeaderCharRegex.test(obj[name])) {
        headers[MAP][name] = [obj[name]];
      }
    }
    return headers;
  }
  var INTERNALS$1 = Symbol("Response internals");
  var STATUS_CODES = import_http.default.STATUS_CODES;
  var Response = class {
    constructor() {
      let body = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : null;
      let opts = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      Body.call(this, body, opts);
      const status = opts.status || 200;
      const headers = new Headers(opts.headers);
      if (body != null && !headers.has("Content-Type")) {
        const contentType = extractContentType(body);
        if (contentType) {
          headers.append("Content-Type", contentType);
        }
      }
      this[INTERNALS$1] = {
        url: opts.url,
        status,
        statusText: opts.statusText || STATUS_CODES[status],
        headers,
        counter: opts.counter
      };
    }
    get url() {
      return this[INTERNALS$1].url || "";
    }
    get status() {
      return this[INTERNALS$1].status;
    }
    get ok() {
      return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
    }
    get redirected() {
      return this[INTERNALS$1].counter > 0;
    }
    get statusText() {
      return this[INTERNALS$1].statusText;
    }
    get headers() {
      return this[INTERNALS$1].headers;
    }
    clone() {
      return new Response(clone(this), {
        url: this.url,
        status: this.status,
        statusText: this.statusText,
        headers: this.headers,
        ok: this.ok,
        redirected: this.redirected
      });
    }
  };
  Body.mixIn(Response.prototype);
  Object.defineProperties(Response.prototype, {
    url: {enumerable: true},
    status: {enumerable: true},
    ok: {enumerable: true},
    redirected: {enumerable: true},
    statusText: {enumerable: true},
    headers: {enumerable: true},
    clone: {enumerable: true}
  });
  Object.defineProperty(Response.prototype, Symbol.toStringTag, {
    value: "Response",
    writable: false,
    enumerable: false,
    configurable: true
  });
  var INTERNALS$2 = Symbol("Request internals");
  var parse_url = import_url.default.parse;
  var format_url = import_url.default.format;
  var streamDestructionSupported = "destroy" in import_stream.default.Readable.prototype;
  function isRequest(input) {
    return typeof input === "object" && typeof input[INTERNALS$2] === "object";
  }
  function isAbortSignal(signal) {
    const proto = signal && typeof signal === "object" && Object.getPrototypeOf(signal);
    return !!(proto && proto.constructor.name === "AbortSignal");
  }
  var Request = class {
    constructor(input) {
      let init = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      let parsedURL;
      if (!isRequest(input)) {
        if (input && input.href) {
          parsedURL = parse_url(input.href);
        } else {
          parsedURL = parse_url(`${input}`);
        }
        input = {};
      } else {
        parsedURL = parse_url(input.url);
      }
      let method = init.method || input.method || "GET";
      method = method.toUpperCase();
      if ((init.body != null || isRequest(input) && input.body !== null) && (method === "GET" || method === "HEAD")) {
        throw new TypeError("Request with GET/HEAD method cannot have body");
      }
      let inputBody = init.body != null ? init.body : isRequest(input) && input.body !== null ? clone(input) : null;
      Body.call(this, inputBody, {
        timeout: init.timeout || input.timeout || 0,
        size: init.size || input.size || 0
      });
      const headers = new Headers(init.headers || input.headers || {});
      if (inputBody != null && !headers.has("Content-Type")) {
        const contentType = extractContentType(inputBody);
        if (contentType) {
          headers.append("Content-Type", contentType);
        }
      }
      let signal = isRequest(input) ? input.signal : null;
      if ("signal" in init)
        signal = init.signal;
      if (signal != null && !isAbortSignal(signal)) {
        throw new TypeError("Expected signal to be an instanceof AbortSignal");
      }
      this[INTERNALS$2] = {
        method,
        redirect: init.redirect || input.redirect || "follow",
        headers,
        parsedURL,
        signal
      };
      this.follow = init.follow !== void 0 ? init.follow : input.follow !== void 0 ? input.follow : 20;
      this.compress = init.compress !== void 0 ? init.compress : input.compress !== void 0 ? input.compress : true;
      this.counter = init.counter || input.counter || 0;
      this.agent = init.agent || input.agent;
    }
    get method() {
      return this[INTERNALS$2].method;
    }
    get url() {
      return format_url(this[INTERNALS$2].parsedURL);
    }
    get headers() {
      return this[INTERNALS$2].headers;
    }
    get redirect() {
      return this[INTERNALS$2].redirect;
    }
    get signal() {
      return this[INTERNALS$2].signal;
    }
    clone() {
      return new Request(this);
    }
  };
  Body.mixIn(Request.prototype);
  Object.defineProperty(Request.prototype, Symbol.toStringTag, {
    value: "Request",
    writable: false,
    enumerable: false,
    configurable: true
  });
  Object.defineProperties(Request.prototype, {
    method: {enumerable: true},
    url: {enumerable: true},
    headers: {enumerable: true},
    redirect: {enumerable: true},
    clone: {enumerable: true},
    signal: {enumerable: true}
  });
  function getNodeRequestOptions(request) {
    const parsedURL = request[INTERNALS$2].parsedURL;
    const headers = new Headers(request[INTERNALS$2].headers);
    if (!headers.has("Accept")) {
      headers.set("Accept", "*/*");
    }
    if (!parsedURL.protocol || !parsedURL.hostname) {
      throw new TypeError("Only absolute URLs are supported");
    }
    if (!/^https?:$/.test(parsedURL.protocol)) {
      throw new TypeError("Only HTTP(S) protocols are supported");
    }
    if (request.signal && request.body instanceof import_stream.default.Readable && !streamDestructionSupported) {
      throw new Error("Cancellation of streamed requests with AbortSignal is not supported in node < 8");
    }
    let contentLengthValue = null;
    if (request.body == null && /^(POST|PUT)$/i.test(request.method)) {
      contentLengthValue = "0";
    }
    if (request.body != null) {
      const totalBytes = getTotalBytes(request);
      if (typeof totalBytes === "number") {
        contentLengthValue = String(totalBytes);
      }
    }
    if (contentLengthValue) {
      headers.set("Content-Length", contentLengthValue);
    }
    if (!headers.has("User-Agent")) {
      headers.set("User-Agent", "node-fetch/1.0 (+https://github.com/bitinn/node-fetch)");
    }
    if (request.compress && !headers.has("Accept-Encoding")) {
      headers.set("Accept-Encoding", "gzip,deflate");
    }
    let agent = request.agent;
    if (typeof agent === "function") {
      agent = agent(parsedURL);
    }
    if (!headers.has("Connection") && !agent) {
      headers.set("Connection", "close");
    }
    return Object.assign({}, parsedURL, {
      method: request.method,
      headers: exportNodeCompatibleHeaders(headers),
      agent
    });
  }
  function AbortError(message) {
    Error.call(this, message);
    this.type = "aborted";
    this.message = message;
    Error.captureStackTrace(this, this.constructor);
  }
  AbortError.prototype = Object.create(Error.prototype);
  AbortError.prototype.constructor = AbortError;
  AbortError.prototype.name = "AbortError";
  var PassThrough$1 = import_stream.default.PassThrough;
  var resolve_url = import_url.default.resolve;
  function fetch(url, opts) {
    if (!fetch.Promise) {
      throw new Error("native promise missing, set fetch.Promise to your favorite alternative");
    }
    Body.Promise = fetch.Promise;
    return new fetch.Promise(function(resolve, reject) {
      const request = new Request(url, opts);
      const options = getNodeRequestOptions(request);
      const send = (options.protocol === "https:" ? import_https.default : import_http.default).request;
      const signal = request.signal;
      let response = null;
      const abort = function abort2() {
        let error = new AbortError("The user aborted a request.");
        reject(error);
        if (request.body && request.body instanceof import_stream.default.Readable) {
          request.body.destroy(error);
        }
        if (!response || !response.body)
          return;
        response.body.emit("error", error);
      };
      if (signal && signal.aborted) {
        abort();
        return;
      }
      const abortAndFinalize = function abortAndFinalize2() {
        abort();
        finalize();
      };
      const req = send(options);
      let reqTimeout;
      if (signal) {
        signal.addEventListener("abort", abortAndFinalize);
      }
      function finalize() {
        req.abort();
        if (signal)
          signal.removeEventListener("abort", abortAndFinalize);
        clearTimeout(reqTimeout);
      }
      if (request.timeout) {
        req.once("socket", function(socket) {
          reqTimeout = setTimeout(function() {
            reject(new FetchError(`network timeout at: ${request.url}`, "request-timeout"));
            finalize();
          }, request.timeout);
        });
      }
      req.on("error", function(err) {
        reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, "system", err));
        finalize();
      });
      req.on("response", function(res) {
        clearTimeout(reqTimeout);
        const headers = createHeadersLenient(res.headers);
        if (fetch.isRedirect(res.statusCode)) {
          const location = headers.get("Location");
          const locationURL = location === null ? null : resolve_url(request.url, location);
          switch (request.redirect) {
            case "error":
              reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, "no-redirect"));
              finalize();
              return;
            case "manual":
              if (locationURL !== null) {
                try {
                  headers.set("Location", locationURL);
                } catch (err) {
                  reject(err);
                }
              }
              break;
            case "follow":
              if (locationURL === null) {
                break;
              }
              if (request.counter >= request.follow) {
                reject(new FetchError(`maximum redirect reached at: ${request.url}`, "max-redirect"));
                finalize();
                return;
              }
              const requestOpts = {
                headers: new Headers(request.headers),
                follow: request.follow,
                counter: request.counter + 1,
                agent: request.agent,
                compress: request.compress,
                method: request.method,
                body: request.body,
                signal: request.signal,
                timeout: request.timeout,
                size: request.size
              };
              if (res.statusCode !== 303 && request.body && getTotalBytes(request) === null) {
                reject(new FetchError("Cannot follow redirect with body being a readable stream", "unsupported-redirect"));
                finalize();
                return;
              }
              if (res.statusCode === 303 || (res.statusCode === 301 || res.statusCode === 302) && request.method === "POST") {
                requestOpts.method = "GET";
                requestOpts.body = void 0;
                requestOpts.headers.delete("content-length");
              }
              resolve(fetch(new Request(locationURL, requestOpts)));
              finalize();
              return;
          }
        }
        res.once("end", function() {
          if (signal)
            signal.removeEventListener("abort", abortAndFinalize);
        });
        let body = res.pipe(new PassThrough$1());
        const response_options = {
          url: request.url,
          status: res.statusCode,
          statusText: res.statusMessage,
          headers,
          size: request.size,
          timeout: request.timeout,
          counter: request.counter
        };
        const codings = headers.get("Content-Encoding");
        if (!request.compress || request.method === "HEAD" || codings === null || res.statusCode === 204 || res.statusCode === 304) {
          response = new Response(body, response_options);
          resolve(response);
          return;
        }
        const zlibOptions = {
          flush: import_zlib.default.Z_SYNC_FLUSH,
          finishFlush: import_zlib.default.Z_SYNC_FLUSH
        };
        if (codings == "gzip" || codings == "x-gzip") {
          body = body.pipe(import_zlib.default.createGunzip(zlibOptions));
          response = new Response(body, response_options);
          resolve(response);
          return;
        }
        if (codings == "deflate" || codings == "x-deflate") {
          const raw = res.pipe(new PassThrough$1());
          raw.once("data", function(chunk) {
            if ((chunk[0] & 15) === 8) {
              body = body.pipe(import_zlib.default.createInflate());
            } else {
              body = body.pipe(import_zlib.default.createInflateRaw());
            }
            response = new Response(body, response_options);
            resolve(response);
          });
          return;
        }
        if (codings == "br" && typeof import_zlib.default.createBrotliDecompress === "function") {
          body = body.pipe(import_zlib.default.createBrotliDecompress());
          response = new Response(body, response_options);
          resolve(response);
          return;
        }
        response = new Response(body, response_options);
        resolve(response);
      });
      writeToStream(req, request);
    });
  }
  fetch.isRedirect = function(code) {
    return code === 301 || code === 302 || code === 303 || code === 307 || code === 308;
  };
  fetch.Promise = global.Promise;
  var lib_default = fetch;
});

// node_modules/obsidian-utils/lib/index.js
var require_lib2 = __commonJS((exports2) => {
  var __create2 = Object.create;
  var __defProp2 = Object.defineProperty;
  var __getProtoOf2 = Object.getPrototypeOf;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __markAsModule2 = (target) => __defProp2(target, "__esModule", {value: true});
  var __export2 = (target, all) => {
    for (var name in all)
      __defProp2(target, name, {get: all[name], enumerable: true});
  };
  var __exportStar2 = (target, module22, desc) => {
    if (module22 && typeof module22 === "object" || typeof module22 === "function") {
      for (let key of __getOwnPropNames2(module22))
        if (!__hasOwnProp2.call(target, key) && key !== "default")
          __defProp2(target, key, {get: () => module22[key], enumerable: !(desc = __getOwnPropDesc2(module22, key)) || desc.enumerable});
    }
    return target;
  };
  var __toModule2 = (module22) => {
    if (module22 && module22.__esModule)
      return module22;
    return __exportStar2(__markAsModule2(__defProp2(module22 != null ? __create2(__getProtoOf2(module22)) : {}, "default", {value: module22, enumerable: true})), module22);
  };
  __markAsModule2(exports2);
  __export2(exports2, {
    log: () => log_exports,
    plugin: () => plugin_exports,
    utils: () => utils_exports,
    vault: () => vault_exports
  });
  var fetchPolyfill = (...args) => {
    if (typeof window !== "undefined") {
      return window.fetch(...args);
    }
    return require_lib()(...args);
  };
  var plugin_exports = {};
  __export2(plugin_exports, {
    PluginRegistry: () => PluginRegistry,
    getInfoOnInstalled: () => getInfoOnInstalled,
    installFromGithub: () => installFromGithub,
    installFromRegistry: () => installFromRegistry,
    installLocalPlugin: () => installLocalPlugin,
    isInstalled: () => isInstalled
  });
  function toInteger(dirtyNumber) {
    if (dirtyNumber === null || dirtyNumber === true || dirtyNumber === false) {
      return NaN;
    }
    var number = Number(dirtyNumber);
    if (isNaN(number)) {
      return number;
    }
    return number < 0 ? Math.ceil(number) : Math.floor(number);
  }
  function requiredArgs(required, args) {
    if (args.length < required) {
      throw new TypeError(required + " argument" + (required > 1 ? "s" : "") + " required, but only " + args.length + " present");
    }
  }
  function toDate(argument) {
    requiredArgs(1, arguments);
    var argStr = Object.prototype.toString.call(argument);
    if (argument instanceof Date || typeof argument === "object" && argStr === "[object Date]") {
      return new Date(argument.getTime());
    } else if (typeof argument === "number" || argStr === "[object Number]") {
      return new Date(argument);
    } else {
      if ((typeof argument === "string" || argStr === "[object String]") && typeof console !== "undefined") {
        console.warn("Starting with v2.0.0-beta.1 date-fns doesn't accept strings as date arguments. Please use `parseISO` to parse strings. See: https://git.io/fjule");
        console.warn(new Error().stack);
      }
      return new Date(NaN);
    }
  }
  function addMilliseconds(dirtyDate, dirtyAmount) {
    requiredArgs(2, arguments);
    var timestamp = toDate(dirtyDate).getTime();
    var amount = toInteger(dirtyAmount);
    return new Date(timestamp + amount);
  }
  var MILLISECONDS_IN_MINUTE = 6e4;
  function addMinutes(dirtyDate, dirtyAmount) {
    requiredArgs(2, arguments);
    var amount = toInteger(dirtyAmount);
    return addMilliseconds(dirtyDate, amount * MILLISECONDS_IN_MINUTE);
  }
  function isBefore(dirtyDate, dirtyDateToCompare) {
    requiredArgs(2, arguments);
    var date = toDate(dirtyDate);
    var dateToCompare = toDate(dirtyDateToCompare);
    return date.getTime() < dateToCompare.getTime();
  }
  function subMinutes(dirtyDate, dirtyAmount) {
    requiredArgs(2, arguments);
    var amount = toInteger(dirtyAmount);
    return addMinutes(dirtyDate, -amount);
  }
  var utils_exports = {};
  __export2(utils_exports, {
    copyFile: () => copyFile,
    failIf: () => failIf2,
    failIfNot: () => failIfNot,
    fetchJSON: () => fetchJSON,
    fetchToDisk: () => fetchToDisk,
    fileStats: () => fileStats2,
    mkdir: () => mkdir,
    read: () => read2,
    readDir: () => readDir2,
    readJSON: () => readJSON,
    rmdir: () => rmdir,
    to: () => to3,
    toRead: () => toRead2,
    toReadJSON: () => toReadJSON2,
    write: () => write2
  });
  var import_stream = __toModule2(require("stream"));
  var import_util = __toModule2(require("util"));
  var import_fs = __toModule2(require("fs"));
  var import_path3 = __toModule2(require("path"));
  var mkdir = import_util.promisify(import_fs.default.mkdir);
  var read2 = import_util.promisify(import_fs.default.readFile);
  var write2 = import_util.promisify(import_fs.default.writeFile);
  var fileStats2 = import_util.promisify(import_fs.default.stat);
  var rmdir = import_util.promisify(import_fs.default.rmdir);
  var readDir2 = import_util.promisify(import_fs.default.readdir);
  var copyFile = import_util.promisify(import_fs.default.copyFile);
  var readJSON = (filePath) => read2(filePath, "utf-8").then((contents) => JSON.parse(contents));
  function failIfNot(condition, message) {
    if (!condition)
      throw new Error(message);
  }
  function failIf2(condition, message) {
    if (condition)
      throw new Error(message);
  }
  var to3 = (p) => {
    return p.then((v) => [null, v]).catch((e) => [e, null]);
  };
  var resToReadable = (res) => {
    failIfNot(res.body, "Response has no body");
    if ("pipe" in res.body) {
      return res.body;
    }
    const reader = res.body.getReader();
    const readable = new import_stream.Readable();
    readable._read = async () => {
      const {done, value} = await reader.read();
      if (value)
        readable.push(done ? null : Buffer.from(value));
    };
    return readable;
  };
  var toRead2 = (...pathParts) => to3(read2(import_path3.default.join(...pathParts), "utf-8"));
  var toReadJSON2 = (...pathParts) => to3(read2(import_path3.default.join(...pathParts), "utf-8").then((content) => JSON.parse(content)));
  var fetchJSON = (...args) => fetchPolyfill(...args).then((res) => res.json());
  var fetchToDisk = (input, outPath, init) => fetchPolyfill(input, init).then(async (res) => {
    const outputFileStream = import_fs.default.createWriteStream(outPath);
    const downloadStream = resToReadable(res);
    downloadStream.pipe(outputFileStream);
    return new Promise((resolve, reject) => {
      outputFileStream.on("error", reject);
      downloadStream.on("error", reject);
      downloadStream.on("end", resolve);
    });
  });
  var log_exports = {};
  __export2(log_exports, {
    debug: () => debug,
    error: () => error,
    info: () => info,
    registerLogger: () => registerLogger,
    warn: () => warn
  });
  var logger = (level, ...args) => {
  };
  var registerLogger = (fn) => {
    logger = (level, ...args) => {
      fn("obsidian-utils", level, ...args);
    };
  };
  var debug = (...args) => logger("debug", ...args);
  var info = (...args) => logger("info", ...args);
  var warn = (...args) => logger("warn", ...args);
  var error = (...args) => logger("error", ...args);
  var DEFAULT_REGISTRY_URL = "https://raw.githubusercontent.com/obsidianmd/obsidian-releases/master/community-plugins.json";
  var PluginRegistry2 = class {
    constructor(registryURL = DEFAULT_REGISTRY_URL) {
      this.registryURL = registryURL;
    }
    async updateRegistry() {
      debug("Fetching the plugin registry...");
      const [pluginRegistryFetchError, pluginRegistry] = await to3(fetchPolyfill(this.registryURL).then((response) => response.json()));
      failIf2(pluginRegistryFetchError, "Failed to fetch the plugin registry from github");
      PluginRegistry2._registry = pluginRegistry;
      debug("Plugin registry downloaded");
    }
    async getRegistry() {
      const registry = PluginRegistry2._registry;
      if (isBefore(registry.lastUpdated, subMinutes(Date.now(), 5))) {
        await this.updateRegistry();
      }
      return registry;
    }
    async getPlugin(pluginID) {
      const registry = await this.getRegistry();
      return registry.plugins.find((plugin) => plugin.id === pluginID);
    }
  };
  var PluginRegistry = PluginRegistry2;
  PluginRegistry._registry = {
    lastUpdated: new Date(0),
    plugins: []
  };
  var import_fs2 = __toModule2(require("fs"));
  var import_path32 = __toModule2(require("path"));
  var import_path22 = __toModule2(require("path"));
  var vaultPathToPluginsPath = (vaultPath) => {
    return import_path22.default.join(vaultPath, ".obsidian", "plugins");
  };
  async function installFromGithub(repo, version, vaultPath) {
    var _a;
    const pluginsPath = vaultPathToPluginsPath(vaultPath);
    const [pluginReleaseFetchError, pluginReleaseInfo] = await to3(fetchPolyfill(version === "latest" ? `https://api.github.com/repos/${repo}/releases/latest` : `https://api.github.com/repos/${repo}/releases/tags/${version}`, {
      method: "GET",
      headers: {Accept: "application/vnd.github.v3+json"}
    }).then((response) => response.json()));
    failIf2(pluginReleaseFetchError, `Failed to get release information from GitHub. You should install this plugin manually.`);
    debug(`retrieved release info from ${repo}`);
    debug("Finding manifest from release...");
    const manifestDownloadPath = (_a = pluginReleaseInfo.assets.find((asset) => asset.name === "manifest.json")) == null ? void 0 : _a.browser_download_url;
    failIfNot(manifestDownloadPath, `Didn't find a manifest.json file in release. Check it here: https://github.com/${repo}/releases/tag/${version}`);
    const [manifestDownloadError, manifest] = await to3(fetchJSON(manifestDownloadPath));
    failIf2(manifestDownloadError, `Failed to download manifest.json.
${manifestDownloadError}`);
    failIfNot(manifest, `manifest.json is empty`);
    const pluginID = manifest.id;
    const pluginPath = import_path32.default.join(pluginsPath, pluginID);
    debug("Creating plugin directory if it doesn't exist...");
    if (!import_fs2.default.existsSync(pluginPath)) {
      await mkdir(pluginPath, {recursive: true});
      debug("plugin directory successfully created");
    }
    await write2(import_path32.default.join(pluginPath, "manifest.json"), JSON.stringify(manifest));
    await Promise.all(pluginReleaseInfo.assets.filter((asset) => asset.name !== "manifest.json" && (asset.name.endsWith(".js") || asset.name.endsWith(".json"))).map((asset) => fetchToDisk(asset.browser_download_url, import_path32.default.join(pluginPath, asset.name))));
    debug(`${pluginID} successfully installed`);
  }
  async function installFromRegistry(pluginID, version, vaultPath, registry = new PluginRegistry()) {
    debug(`Attempting to install ${pluginID}`);
    debug("Trying to retrieve", pluginID, "from plugin registry");
    const plugin = await registry.getPlugin(pluginID);
    failIfNot(plugin, `Unable to install ${plugin}, it wasn't found in the registry.`);
    debug(pluginID, "found in plugin registry");
    return installFromGithub(plugin.repo, version, vaultPath);
  }
  async function installLocalPlugin(pluginPath, vaultPath) {
    debug(`Attempting to install ${import_path32.default.basename(pluginPath)} to ${import_path32.default.basename(vaultPath)} vault`);
    const [manifestReadError, manifest] = await toReadJSON2(pluginPath, "manifest.json");
    failIf2(manifestReadError, `Failed to read manifest:
${manifestReadError}`);
    failIfNot(manifest, `Something went wrong, tried to read manifest but it was empty`);
    const {id} = manifest;
    const newPluginPath = import_path32.default.join(vaultPathToPluginsPath(vaultPath), id);
    if (import_fs2.default.existsSync(newPluginPath)) {
      debug("Plugin found with same name at the install location, removing it");
      await rmdir(newPluginPath, {recursive: true, force: true});
      await mkdir(newPluginPath);
    }
    const [readDirError, files] = await to3(readDir2(pluginPath));
    failIf2(readDirError, `Something went wrong reading files from ${pluginPath}
${readDirError}`);
    failIfNot(files, `Something went wrong reading files from ${pluginPath}, expected to get files but got null instead`);
    for (const file of files) {
      await copyFile(import_path32.default.join(pluginPath, file), import_path32.default.join(newPluginPath, file));
    }
    debug("Install complete");
  }
  var import_path4 = __toModule2(require("path"));
  async function getInfoOnInstalled(pluginID, vaultPath) {
    const pluginsPath = vaultPathToPluginsPath(vaultPath);
    const manifestPath = import_path4.default.join(pluginsPath, pluginID, "manifest.json");
    const [manifestReadError, manifest] = await toReadJSON2(manifestPath);
    failIf2(manifestReadError, `Manifest failed to load: ${manifestReadError}`);
    failIfNot(manifest, `Manifest loaded but wasn't defined`);
    const [, data] = await toReadJSON2(vaultPath, pluginID, "data.json");
    const results = {
      manifest,
      data: data != null ? data : void 0,
      lastUpdated: (await fileStats2(manifestPath)).mtime
    };
    debug(`Successfully fetched plugin from disk`);
    debug(results);
    return results;
  }
  async function isInstalled(pluginID, vaultPath) {
    const pluginsPath = vaultPathToPluginsPath(vaultPath);
    const [manifestReadError, manifest] = await toReadJSON2(pluginsPath, pluginID, "manifest.json");
    if (manifestReadError) {
      debug(`Got manifest error`, manifestReadError);
    }
    return manifestReadError || !manifest ? false : true;
  }
  var vault_exports = {};
  __export2(vault_exports, {
    findVault: () => findVault,
    isVault: () => isVault
  });
  var import_os = __toModule2(require("os"));
  var import_path5 = __toModule2(require("path"));
  var import_fs3 = __toModule2(require("fs"));
  var isVault = (vaultPath) => {
    if (typeof vaultPath === "string" && import_fs3.default.existsSync(import_path5.default.join(vaultPath, ".obsidian"))) {
      return true;
    }
    return false;
  };
  var getVaultFromPath = (vaultPath, open) => {
    return {
      name: import_path5.default.basename(vaultPath),
      path: vaultPath,
      open
    };
  };
  var findVault = async (vaultPath) => {
    var _a;
    if (isVault(vaultPath)) {
      return [getVaultFromPath(vaultPath)];
    }
    if (vaultPath && import_fs3.default.existsSync(vaultPath)) {
      return [getVaultFromPath(vaultPath)];
    }
    const home = import_os.default.homedir();
    let obsidianPath = "";
    switch (import_os.default.platform()) {
      case "win32":
        obsidianPath = import_path5.default.join(home, "AppData", "Local", "Obsidian");
        break;
      case "darwin":
        obsidianPath = import_path5.default.join(home, "Library", "Application Support", "Obsidian");
        break;
      default: {
        const obsidianHomePath = import_path5.default.join(home, ".obsidian");
        const obsidianConfigPath = import_path5.default.join(home, ".config", "obsidian");
        const XDG = (_a = process.env.XDG) != null ? _a : "";
        const XDGPath = import_path5.default.join(XDG, "obsidian");
        obsidianPath = import_fs3.default.existsSync(obsidianConfigPath) ? obsidianConfigPath : XDG && import_fs3.default.existsSync(XDGPath) ? XDGPath : obsidianHomePath;
      }
    }
    failIf2(!import_fs3.default.existsSync(obsidianPath), "Can't find obsidian settings directory, won't be able to read vaults");
    const [obsidianReadError, obsidian] = await to3(readJSON(import_path5.default.join(obsidianPath, "obsidian.json")));
    failIf2(obsidianReadError, `Could not read obsidian.json: ${obsidianReadError}
Vaults won't be retrievable`);
    return Object.values(obsidian.vaults).map((vault) => getVaultFromPath(vault.path, vault.open));
  };
});

// src/index.ts
__markAsModule(exports);
__export(exports, {
  default: () => src_default
});
var import_obsidian = __toModule(require("obsidian"));
var import_path2 = __toModule(require("path"));
var import_obsidian_utils2 = __toModule(require_lib2());

// src/utils.ts
var import_path = __toModule(require("path"));
var import_obsidian_utils = __toModule(require_lib2());
var {readDir, to, write} = import_obsidian_utils.utils;
var unique = (arr1, arr2) => Array.from(new Set([...arr1, ...arr2]));
var listDirs = async (dirPath) => (await readDir(dirPath, {withFileTypes: true})).filter((d) => d.isDirectory()).map((d) => d.name);
var toWrite = (data, ...pathParts) => to(write(import_path.default.join(...pathParts), JSON.stringify(data)));
var mapValues = (o, mapFn) => {
  return Object.fromEntries(Object.entries(o).map(([key, value]) => [key, mapFn(value)]));
};

// src/Logger.ts
var INFO_COLOR = "#93C5FD";
var ERROR_COLOR = "#FCA5A5";
var WARN_COLOR = "#FCD34D";
var NULL_COLOR = "#D1D5DB";
var tag = (text, bgColor, color = "black") => {
  if (typeof window !== "undefined") {
    return [
      `%c${text}`,
      `background-color: ${bgColor}; padding: 4px; color: ${color}; font-weight: bold; border-radius: 4px;`
    ];
  }
  return [text];
};
var Logger = class {
  constructor() {
    this.isInGroup = false;
    this.pluginName = "Plugin Sync";
  }
  startGroup(groupName) {
    console.group(...tag(`${this.pluginName}: ${groupName}`, NULL_COLOR));
    this.isInGroup = true;
  }
  endGroup() {
    this.isInGroup = false;
    console.groupEnd();
  }
  info(...args) {
    const text = this.isInGroup ? "INFO" : this.pluginName;
    console.info(...tag(text, INFO_COLOR), ...args);
  }
  warn(...args) {
    const text = this.isInGroup ? "WARN" : this.pluginName;
    console.warn(...tag(text, WARN_COLOR), ...args);
  }
  error(...args) {
    const text = this.isInGroup ? "ERROR" : this.pluginName;
    console.error(...tag(text, ERROR_COLOR), ...args);
  }
  table(...args) {
    console.table(...args);
  }
  start() {
  }
  end() {
  }
};
var log = new Logger();

// src/index.ts
var {read, to: to2, toRead, toReadJSON, fileStats} = import_obsidian_utils2.utils;
var failIf = import_obsidian_utils2.utils.failIf;
var PLUGIN_DATA_FILE = "plugin-sync.json";
var PluginSyncPlugin = class extends import_obsidian.Plugin {
  getPluginPath(plugin) {
    const pluginsPath = import_path2.default.join(this.vaultPath, ".obsidian", "plugins");
    if (!plugin) {
      return pluginsPath;
    }
    return import_path2.default.join(pluginsPath, plugin);
  }
  async getInstalledPlugin(plugin) {
    if (this.vaultPath) {
      const manifestPath = import_path2.default.join(this.getPluginPath(plugin), "manifest.json");
      const [manifestReadError, rawManifest] = await to2(read(manifestPath, "utf-8"));
      failIf(manifestReadError, `Manifest failed to load: ${manifestReadError}`);
      const manifest = JSON.parse(rawManifest);
      const [, rawData] = await toRead(this.getPluginPath(plugin), "data.json");
      const record = {
        version: manifest.version,
        data: rawData ? JSON.parse(rawData) : void 0,
        lastUpdated: (await fileStats(manifestPath)).mtime
      };
      log.info(`Successfully fetched plugin from disk`);
      log.table(record);
      return record;
    }
    throw new Error(`Couldn't get data on installed plugin ${plugin} because vaultPath was not defined`);
  }
  async installPlugin(pluginID, version) {
  }
  async sync() {
    const pluginSyncData = await this.loadData();
    const syncPlugins = Object.keys(pluginSyncData);
    const pluginsPath = import_path2.default.join(this.vaultPath, ".obsidian", "plugins");
    const installedPlugins = await listDirs(pluginsPath);
    const allPlugins = unique(installedPlugins, syncPlugins);
    for (const plugin of allPlugins) {
      log.endGroup();
      log.startGroup(plugin);
      const isPluginSynced = plugin in pluginSyncData;
      const isPluginInstalled = installedPlugins.includes(plugin);
      log.info("is in sync file?", isPluginSynced);
      log.info("is installed?", isPluginInstalled);
      if (isPluginInstalled) {
        const [installedFetchError, installedPlugin] = await to2(this.getInstalledPlugin(plugin));
        if (installedFetchError) {
          log.error(`Failed to read info on disk: ${installedFetchError}`);
          continue;
        }
        if (isPluginSynced) {
          const syncedPlugin = pluginSyncData[plugin];
          if (installedPlugin.version > syncedPlugin.version) {
            pluginSyncData[plugin] = installedPlugin;
          } else if (installedPlugin.version === syncedPlugin.version) {
            pluginSyncData[plugin] = installedPlugin.lastUpdated > syncedPlugin.lastUpdated ? installedPlugin : syncedPlugin;
          }
        } else {
          log.info("Adding plugin to sync data");
          pluginSyncData[plugin] = installedPlugin;
        }
      } else {
        await this.installPlugin(plugin, pluginSyncData[plugin].version);
      }
    }
    log.endGroup();
    this.saveData(pluginSyncData);
  }
  async onload() {
    const {vault} = this.app.vault.getRoot();
    const vaultPath = vault.adapter.basePath;
    if (!vaultPath) {
      log.error("Unable to load, vault path not found");
      return;
    }
    log.info("vault path successfully read", vaultPath);
    this.vaultPath = vaultPath;
    await this.sync();
  }
  async loadData() {
    const [readError, data] = await toReadJSON(this.vaultPath, ".obsidian", PLUGIN_DATA_FILE);
    if (readError || !data) {
      return {};
    }
    return mapValues(data, (pluginRecord) => ({
      ...pluginRecord,
      lastUpdated: new Date(pluginRecord.lastUpdated)
    }));
  }
  async saveData(data) {
    log.info("Writing sync data");
    await toWrite(data, this.vaultPath, ".obsidian", PLUGIN_DATA_FILE);
  }
};
var src_default = PluginSyncPlugin;
