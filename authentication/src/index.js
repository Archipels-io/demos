const express = require('express');
const path = require('node:path');
const bodyParser = require('body-parser');
const { WEBHOOK_SECRET } = require('./constants');
const {
  generateLink,
  handleMessageReceived,
  handlePresentationReceived,
} = require('./helpers');
const { setupDefaultWallet } = require('./setup');

// @todo: When customizing your app, call startServer with your custom arguments
setupDefaultWallet().then(startServer);

/**
 * Start the local server
 * 
 * @param {import('./helpers').SetupConfig} config 
 */
function startServer(config) {
    const { walletDid, invitationCode } = config;
    const app = express();
    
    // middlewares
    app
      .use(express.static(path.join(__dirname, '../public')))
      .use(bodyParser.json());
    
    // templating
    app.set('views', path.join(__dirname, '../views')).set('view engine', 'ejs');
    
    // routes
    app
      .get('/', (req, res) =>
        res.render('landing', {
          signupLink: generateLink('signup', invitationCode),
          signinLink: generateLink('signin', invitationCode),
          mode: 'guest',
          basePath: req.headers["x-forwarded-prefix"] || '',
        }),
      )
      .get('/secured', (req, res) => {
        if (req.query?.accessToken) {
          return res.render('landing', {
            mode: 'secured',
            accessToken: req.query?.accessToken,
            id: req.query?.id,
            basePath: req.headers["x-forwarded-prefix"] || '',
        });
        }
    
        return res.redirect('/');
      })
      .post('/workflow', async (req, res) => {
        // verify the wallet DID and the webhook secret
        if (
          req.body.payload.walletDid !== walletDid ||
          req.header('x-connect-token') !== WEBHOOK_SECRET
        ) {
          throw new Error('Unknown wallet or bad secret');
        }
    
        // handle all MessageReceived type
        if (req.body.type === 'MessageReceived') {
          await handleMessageReceived(req.body.payload, config);
        }
    
        // handle all PresentationReceived type
        if (req.body.type === 'PresentationReceived') {
          await handlePresentationReceived(req.body.payload, config);
        }
    
        // ack with 200
        res.send('ok');
      });
    
    const port = process.env.PORT || 5001;
    
    const server = app.listen(port, () => console.log(`Listening on ${port}`));

    process.on('SIGTERM', () => server.close());
    process.on('SIGINT', () => server.close());
}
