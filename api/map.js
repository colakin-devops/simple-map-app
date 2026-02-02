const request = require('request');
const cheerio = require('cheerio');

const targetBase = 'https://maps.abuzzinteractive.net';
// Default mapping
const mapMappings = {
  cockburnGateway: '/cockburnGateway/_demo55Grp.html',
  dapto: '/dapto/_demo55Grp.html',
  parkmore: '/parkmore/_demo55Grp.html',
  malvernCentral: '/malvernCentral/_demo55Grp.html',
  marrickvilleMetro: '/marrickvilleMetro/_demo55Grp.html',
  chirnsidePark: '/chirnsidePark/_demo55Grp.html',
  macarthurSquare: '/macarthurSquare/_demo55Grp.html',
  highpoint: '/highpoint/_demo55Grp.html',
  macquarie: '/macquarie/_demo55Grp.html',
  sunshinePlaza: '/sunshinePlaza/_demo55Grp.html',
  belmont: '/belmont/_demo55Grp.html',
  karrinyupCentre: '/karrinyupCentre/_demo55Grp.html',
  pacificFair: '/pacificFair/_demo55Grp.html',
  charlestownSquare: '/charlestownSquare/_demo55Grp.html',
  rouseHillTownCentre: '/rouseHillTownCentre/_demo55Grp.html',
  melbourneCentral: '/melbourneCentral/_demo55Grp.html',
};

// Whitelist origins
const allowedOrigins = ['https://gpt.spotinspect.tech', 'http://localhost:8000'];

module.exports = async (req, res) => {
  // Set CORS headers
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    // Default to the first one if no origin header (e.g. direct browser access)
    res.setHeader('Access-Control-Allow-Origin', allowedOrigins[0]);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  // Allow credentials (cookies, auth headers)
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Preflight handler
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // Get property from query parameter
  const property = req.query.property || 'cockburnGateway';
  const mapPath = mapMappings[property] || mapMappings.cockburnGateway;

  // Proxy the map HTML
  request(
    {
      url: targetBase + mapPath,
      headers: { 'User-Agent': req.headers['user-agent'] },
      // Forward any auth cookies if present
      jar: req.headers.cookie ? request.jar() : false,
    },
    (err, response, body) => {
      if (err) {
        return res.status(500).send('Error fetching map');
      }

      const $ = cheerio.load(body);

      // Style the map container to full viewport
      $('#mapDiv').css({
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        position: 'fixed',
        top: 0,
        left: 0,
      });

      // Rewrite relative resource URLs to absolute
      $('link[href], script[src], img[src], iframe[src]').each((_, el) => {
        const attr = el.name === 'link' ? 'href' : 'src';
        const value = $(el).attr(attr);
        if (value && value.startsWith('/')) {
          $(el).attr(attr, targetBase + value);
        } else if (value && !value.startsWith('http')) {
          $(el).attr(attr, `${targetBase}/${value}`);
        }
      });

      // Inject click-logging script
      $('body').append(`
        <script>
        (function() {
          const originalLog = console.log;
          console.log = function(...args) {
            originalLog.apply(console, args);
            if (args[0]?.includes?.('Got a click on dest via')) {
              window.parent.postMessage({ type: 'mapClick', message: args[0] }, '*');
            }
          };
        })();
        </script>
      `);

      // Respond with HTML
      res.setHeader('Content-Type', 'text/html');
      res.send($.html());
    }
  );
};
