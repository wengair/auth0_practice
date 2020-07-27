var express = require('express');
var app = express();
var jwt = require('express-jwt');
var jwks = require('jwks-rsa');

var port = process.env.PORT || 8080;

var jwtCheck = jwt({
      secret: jwks.expressJwtSecret({
          cache: true,
          rateLimit: true,
          jwksRequestsPerMinute: 5,
          jwksUri: 'https://madcollective.us.auth0.com/.well-known/jwks.json'
    }),
    audience: 'https://madcollective.us.auth0.com/api/v2/',
    issuer: 'https://madcollective.us.auth0.com/',
    algorithms: ['RS256']
});

app.use(jwtCheck);
app.use(()=>{console.log('in server.js')})

app.get('/authorized', function (req, res) {
    res.send('Secured Resource');
});

app.post('/users', function (req, res) {
    res.send('Users Secured Resource');
});

app.listen(port);