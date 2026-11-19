const targetBase = 'https://maps.abuzzinteractive.net';

const mapMappings = {
  cockburnGateway: '/cockburnGateway/_demo55Grp.html',
  dapto: '/dapto/_demo55Grp.html',
  parkmore: '/parkmore/_demo55Grp.html',
  malvernCentral: '/malvernCentral/_demo55Grp.html',
  marrickvilleMetro: '/marrickvilleMetro/_demo55Grp.html',
  chirnsidePark: '/chirnsidePark/_demo55Grp.html',
  macarthurSquare: '/macarthurSquare/_demo55Grp.html',
  highpoint: '/highpoint/_demo55Grp.html',
  macquarieCentre: '/macquarieCentre/_demo55Grp.html',
  sunshinePlaza: '/sunshinePlaza/_demo55Grp.html',
  karrinyupCentre: '/karrinyupCentre/_demo55Grp.html',
  pacificFair: '/pacificFair/_demo55Grp.html',
  charlestownSquare: '/charlestownSquare/_demo55Grp.html',
  rouseHill: '/rouseHill/_demo55Grp.html',
  melbourneCentral: '/melbourneCentral/_demo55Grp.html',
  belmontForum: '/belmontForum/_demo55Grp.html'
};

const regions = {
  NSW: [-33.86, 151.21],
  VIC: [-37.81, 144.96],
  QLD: [-27.47, 153.03],
  WA: [-31.95, 115.86]
};

const properties = [
  { id: '1752064142607x477912603216838660', name: 'Macquarie', address: 'Herring Road &, Waterloo Rd, Macquarie Park NSW', state: 'NSW', coords: [-33.7767, 151.1168] },
  { id: '1737005956038x269183790900051970', name: 'Cockburn', address: '816 Beeliar Dr, Success WA 6164', state: 'WA', coords: [-32.125, 115.856] },
  { id: '1737005444037x293986911361957900', name: 'Belmont', address: '227 Belmont Ave, Cloverdale WA 6105', state: 'WA', coords: [-31.9675, 115.9335] },
  { id: '1705970323469x242153831563788300', name: 'Karrinyup', address: '200 Karrinyup Rd, Karrinyup WA 6018', state: 'WA', coords: [-31.877, 115.792] },
  { id: '1705970216259x119853575471890430', name: 'Pacific Fair', address: '2 Hooker Blvd, Broadbeach Waters QLD 4218', state: 'QLD', coords: [-28.033, 153.431] },
  { id: '1705970105830x144446167162290180', name: 'Charlestown Square', address: '30 Pearson St, Charlestown NSW 2290', state: 'NSW', coords: [-32.9667, 151.6922] },
  { id: '1705970046647x973616148815020000', name: 'Dapto', address: 'Moombara St, Dapto NSW 2530', state: 'NSW', coords: [-34.4936, 150.7925] },
  { id: '1705969982933x900932121804406800', name: 'Marrickville', address: '20 Smidmore St, Marrickville NSW 2204', state: 'NSW', coords: [-33.9108, 151.1607] },
  { id: '1705969925472x439016667081605100', name: 'Rouse Hill Town Centre', address: '10/14 Market Ln, Rouse Hill NSW 2155', state: 'NSW', coords: [-33.682, 150.915] },
  { id: '1705969860406x123684899286155260', name: 'Malvern Central', address: '110-122 Wattletree Rd, Armadale VIC 3144', state: 'VIC', coords: [-37.861, 145.019] },
  { id: '1705969746148x341989798652149760', name: 'Melbourne Central', address: 'Cnr LaTrobe and Swanston Streets, Melbourne VIC 3000', state: 'VIC', coords: [-37.811, 144.962] },
  { id: '1705969412613x353156401866735600', name: 'Chirnside Park', address: '239 Maroondah Hwy, Chirnside Park VIC 3116', state: 'VIC', coords: [-37.75, 145.3] },
  { id: '1705969363884x356472180792098800', name: 'Parkmore', address: '317 Cheltenham Rd, Keysborough VIC 3173', state: 'VIC', coords: [-37.992, 145.161] },
  { id: '1691566594802x553889939715949400', name: 'Highpoint', address: '120-200 Rosamond Rd, Maribyrnong VIC 3032', state: 'VIC', coords: [-37.77, 144.887] }
];

const allowedOrigins = [
  'https://gpt.spotinspect.tech',
  'http://localhost:8000',
  'http://localhost:3000',
  'https://ffg-abuzzmaps.colakin.com'
];

function getCorsHeaders(request) {
  const origin = request.headers.get('Origin');
  let allowOrigin = '*';
  if (origin && (allowedOrigins.includes(origin) || origin.endsWith('.colakin.com') || origin.endsWith('.spotinspect.tech'))) {
    allowOrigin = origin;
  }
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Credentials': 'true'
  };
}

class UrlRewriter {
  constructor(attr) {
    this.attr = attr;
  }
  element(element) {
    const value = element.getAttribute(this.attr);
    if (value && value.startsWith('/')) {
      element.setAttribute(this.attr, targetBase + value);
    } else if (value && !value.startsWith('http') && !value.startsWith('//') && !value.startsWith('data:')) {
      element.setAttribute(this.attr, `${targetBase}/${value}`);
    }
  }
}

class HeadRewriter {
  element(element) {
    element.append(
      `<style>#mapDiv { width: 100%; height: 100vh; overflow: hidden; position: fixed; top: 0; left: 0; }</style>`,
      { html: true }
    );
  }
}

class BodyRewriter {
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
      </script>`,
      { html: true }
    );
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const cors = getCorsHeaders(request);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    // 1. API: AU Map Data
    if (url.pathname === '/api/au-map') {
      return new Response(JSON.stringify({ regions, properties }), {
        headers: {
          'Content-Type': 'application/json',
          ...cors
        }
      });
    }

    // 2. API: Dynamic Abuzz Map Proxy
    if (url.pathname === '/api/map') {
      const property = url.searchParams.get('property') || 'cockburnGateway';
      const mapPath = mapMappings[property] || mapMappings.cockburnGateway;
      const targetUrl = targetBase + mapPath;

      try {
        const response = await fetch(targetUrl, {
          headers: {
            'User-Agent': request.headers.get('User-Agent') || 'Mozilla/5.0'
          }
        });

        if (!response.ok) {
          return new Response('Error fetching map from upstream', {
            status: response.status,
            headers: cors
          });
        }

        const rewriter = new HTMLRewriter()
          .on('link[href]', new UrlRewriter('href'))
          .on('script[src]', new UrlRewriter('src'))
          .on('img[src]', new UrlRewriter('src'))
          .on('iframe[src]', new UrlRewriter('src'))
          .on('head', new HeadRewriter())
          .on('body', new BodyRewriter());

        const transformed = rewriter.transform(response);
        const headers = new Headers(transformed.headers);
        headers.set('Content-Type', 'text/html; charset=utf-8');
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

    // 3. Static Assets & SPA Fallback
    return env.ASSETS.fetch(request);
  }
};
