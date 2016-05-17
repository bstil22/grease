var express    = require('express');
var app        = express();
var router     = express.Router();
var port       = process.env.PORT || 8080;
var bodyParser = require('body-parser');
var jwt        = require('jsonwebtoken');

app.set('secret', Math.random().toString(36).slice(2));

router.get('/', function(req, res) {
  res.json({ message: 'i party' });
});

app.use(bodyParser.json());

router.post('/authenticate', function(req, res) {
  if (sampleUser.pwd != req.body.password) {
    res.json({ success: false, message: 'Authentication failed. Wrong password.' });
  } else {

    var token = jwt.sign(sampleUser, app.get('secret'), {
      expiresIn: '1h'
    });

    res.json({
      success: true,
      message: 'Successfully authenticated',
      token: token
    });
  }
});

router.use(function(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (token) {
    jwt.verify(token, app.get('secret'), function(err, decoded) {
      if (err) {
        return res.json({
          success: false,
          message: 'Failed to authenticate token.'
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });

  } else {

    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });

  }
});

// user model coming soon
var sampleUser = {
  username: 'shed',
  pwd: 'tool'
};

router.get('/sample', function (req, res){
  res.json(sampleUser);
});

app.use('/api', router);

app.listen(port);