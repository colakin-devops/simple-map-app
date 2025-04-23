const request = require('request');
const cheerio = require('cheerio');

const targetBase = 'https://maps.abuzzinteractive.net';
const mapPath = '/cockburnGateway/_demo55Grp.html';

module.exports = async (req, res) => {
  request({ url: targetBase + mapPath, headers: { 'User-Agent': req.headers['user-agent'] } }, (err, response, body) => {
    if (err) return res.status(500).send('Error fetching map');

    const $ = cheerio.load(body);

    // Fix map container size
    $('#mapDiv').css({ width: '100%', height: '100vh' });

    // Rewriting resource URLs
    $('link[href], script[src], img[src], iframe[src]').each((_, el) => {
      const attr = el.name === 'link' ? 'href' : 'src';
      const value = $(el).attr(attr);
      if (value && value.startsWith('/')) {
        $(el).attr(attr, targetBase + value);
      } else if (value && !value.startsWith('http')) {
        $(el).attr(attr, `${targetBase}/${value}`);
      }
    });

    // Adding script to capture log messages
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

    res.setHeader('Content-Type', 'text/html');
    res.send($.html());
  });
};
