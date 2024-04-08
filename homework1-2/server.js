const express = require('express');
const { createServer: viteCreateServer } = require('vite');
const ejs = require('ejs');
const path = require('path');

async function createServer() {
  const app = express();
  let server;

  if (process.env.NODE_ENV === 'development') {
    server = await viteCreateServer({
      server: { middlewareMode: 'ssr' }
    });
    app.use(server.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
  }

  // Set EJS as the view engine
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));

  app.get('*', async (req, res) => {
    try {
      // Render index.ejs template
      res.render('index', {
        // Pass any data you need to the template
        // For example, you can pass props to your Vue components here
        props: {}
      });
    } catch (e) {
      console.error(e);
      res.status(500).send('Internal Server Error');
    }
  });

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

createServer();
