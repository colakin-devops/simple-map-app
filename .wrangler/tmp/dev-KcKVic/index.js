var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// worker/index.js
var targetBase = "https://maps.abuzzinteractive.net";
var mapMappings = {
  cockburnGateway: "/cockburnGateway/_demo55Grp.html",
  dapto: "/dapto/_demo55Grp.html",
  parkmore: "/parkmore/_demo55Grp.html",
  malvernCentral: "/malvernCentral/_demo55Grp.html",
  marrickvilleMetro: "/marrickvilleMetro/_demo55Grp.html",
  chirnsidePark: "/chirnsidePark/_demo55Grp.html",
  macarthurSquare: "/macarthurSquare/_demo55Grp.html",
  highpoint: "/highpoint/_demo55Grp.html",
  macquarieCentre: "/macquarieCentre/_demo55Grp.html",
  sunshinePlaza: "/sunshinePlaza/_demo55Grp.html",
  karrinyupCentre: "/karrinyupCentre/_demo55Grp.html",
  pacificFair: "/pacificFair/_demo55Grp.html",
  charlestownSquare: "/charlestownSquare/_demo55Grp.html",
  rouseHill: "/rouseHill/_demo55Grp.html",
  melbourneCentral: "/melbourneCentral/_demo55Grp.html",
  belmontForum: "/belmontForum/_demo55Grp.html"
};
var regions = {
  NSW: [-33.86, 151.21],
  VIC: [-37.81, 144.96],
  QLD: [-27.47, 153.03],
  WA: [-31.95, 115.86]
};
var properties = [
  { id: "1752064142607x477912603216838660", name: "Macquarie", address: "Herring Road &, Waterloo Rd, Macquarie Park NSW", state: "NSW", coords: [-33.7767, 151.1168] },
  { id: "1737005956038x269183790900051970", name: "Cockburn", address: "816 Beeliar Dr, Success WA 6164", state: "WA", coords: [-32.125, 115.856] },
  { id: "1737005444037x293986911361957900", name: "Belmont", address: "227 Belmont Ave, Cloverdale WA 6105", state: "WA", coords: [-31.9675, 115.9335] },
  { id: "1705970323469x242153831563788300", name: "Karrinyup", address: "200 Karrinyup Rd, Karrinyup WA 6018", state: "WA", coords: [-31.877, 115.792] },
  { id: "1705970216259x119853575471890430", name: "Pacific Fair", address: "2 Hooker Blvd, Broadbeach Waters QLD 4218", state: "QLD", coords: [-28.033, 153.431] },
  { id: "1705970105830x144446167162290180", name: "Charlestown Square", address: "30 Pearson St, Charlestown NSW 2290", state: "NSW", coords: [-32.9667, 151.6922] },
  { id: "1705970046647x973616148815020000", name: "Dapto", address: "Moombara St, Dapto NSW 2530", state: "NSW", coords: [-34.4936, 150.7925] },
  { id: "1705969982933x900932121804406800", name: "Marrickville", address: "20 Smidmore St, Marrickville NSW 2204", state: "NSW", coords: [-33.9108, 151.1607] },
  { id: "1705969925472x439016667081605100", name: "Rouse Hill Town Centre", address: "10/14 Market Ln, Rouse Hill NSW 2155", state: "NSW", coords: [-33.682, 150.915] },
  { id: "1705969860406x123684899286155260", name: "Malvern Central", address: "110-122 Wattletree Rd, Armadale VIC 3144", state: "VIC", coords: [-37.861, 145.019] },
  { id: "1705969746148x341989798652149760", name: "Melbourne Central", address: "Cnr LaTrobe and Swanston Streets, Melbourne VIC 3000", state: "VIC", coords: [-37.811, 144.962] },
  { id: "1705969412613x353156401866735600", name: "Chirnside Park", address: "239 Maroondah Hwy, Chirnside Park VIC 3116", state: "VIC", coords: [-37.75, 145.3] },
  { id: "1705969363884x356472180792098800", name: "Parkmore", address: "317 Cheltenham Rd, Keysborough VIC 3173", state: "VIC", coords: [-37.992, 145.161] },
  { id: "1691566594802x553889939715949400", name: "Highpoint", address: "120-200 Rosamond Rd, Maribyrnong VIC 3032", state: "VIC", coords: [-37.77, 144.887] }
];
var allowedOrigins = [
  "https://gpt.spotinspect.tech",
  "http://localhost:8000",
  "http://localhost:3000",
  "https://ffg-abuzzmaps.colakin.com"
];
function getCorsHeaders(request) {
  const origin = request.headers.get("Origin");
  let allowOrigin = "*";
  if (origin && (allowedOrigins.includes(origin) || origin.endsWith(".colakin.com") || origin.endsWith(".spotinspect.tech"))) {
    allowOrigin = origin;
  }
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Credentials": "true"
  };
}
__name(getCorsHeaders, "getCorsHeaders");
var UrlRewriter = class {
  static {
    __name(this, "UrlRewriter");
  }
  constructor(attr) {
    this.attr = attr;
  }
  element(element) {
    const value = element.getAttribute(this.attr);
    if (value && value.startsWith("/")) {
      element.setAttribute(this.attr, targetBase + value);
    } else if (value && !value.startsWith("http") && !value.startsWith("//") && !value.startsWith("data:")) {
      element.setAttribute(this.attr, `${targetBase}/${value}`);
    }
  }
};
var HeadRewriter = class {
  static {
    __name(this, "HeadRewriter");
  }
  element(element) {
    element.append(
      `<style>#mapDiv { width: 100%; height: 100vh; overflow: hidden; position: fixed; top: 0; left: 0; }</style>`,
      { html: true }
    );
  }
};
var BodyRewriter = class {
  static {
    __name(this, "BodyRewriter");
  }
  element(element) {
    element.append(
      `<script>
      (function() {
        const originalLog = console.log;
        console.log = function(...args) {
          originalLog.apply(console, args);
          if (args[0]?.includes?.('Got a click on dest via')) {
            window.parent.postMessage({ type: 'mapClick', message: args[0] }, '*');
          }
        };
      })();
      <\/script>`,
      { html: true }
    );
  }
};
var worker_default = {
  async fetch(request, env) {
    const url = new URL(request.url);
    const cors = getCorsHeaders(request);
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }
    if (url.pathname === "/api/au-map") {
      return new Response(JSON.stringify({ regions, properties }), {
        headers: {
          "Content-Type": "application/json",
          ...cors
        }
      });
    }
    if (url.pathname === "/api/map") {
      const property = url.searchParams.get("property") || "cockburnGateway";
      const mapPath = mapMappings[property] || mapMappings.cockburnGateway;
      const targetUrl = targetBase + mapPath;
      try {
        const response = await fetch(targetUrl, {
          headers: {
            "User-Agent": request.headers.get("User-Agent") || "Mozilla/5.0"
          }
        });
        if (!response.ok) {
          return new Response("Error fetching map from upstream", {
            status: response.status,
            headers: cors
          });
        }
        const rewriter = new HTMLRewriter().on("link[href]", new UrlRewriter("href")).on("script[src]", new UrlRewriter("src")).on("img[src]", new UrlRewriter("src")).on("iframe[src]", new UrlRewriter("src")).on("head", new HeadRewriter()).on("body", new BodyRewriter());
        const transformed = rewriter.transform(response);
        const headers = new Headers(transformed.headers);
        headers.set("Content-Type", "text/html; charset=utf-8");
        for (const [k, v] of Object.entries(cors)) {
          headers.set(k, v);
        }
        return new Response(transformed.body, {
          status: response.status,
          headers
        });
      } catch (err) {
        return new Response(`Error proxying map: ${err.message}`, {
          status: 500,
          headers: cors
        });
      }
    }
    return env.ASSETS.fetch(request);
  }
};

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    const body = JSON.stringify(error);
    const headers = {
      "Content-Type": "application/json",
      "MF-Experimental-Error-Stack": "true"
    };
    const encoded = encodeURIComponent(body);
    if (encoded.length <= 8192) {
      headers["MF-Experimental-Error-Stack-Payload"] = encoded;
    }
    return new Response(body, { status: 500, headers });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-DupAQj/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = worker_default;

// node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-DupAQj/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  scheduledTime;
  cron;
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
