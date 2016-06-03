const express    = require('express');
const app        = express();
const router     = express.Router();
const port       = process.env.PORT || 8080;
const bodyParser = require('body-parser');
const jwt        = require('jsonwebtoken');
const User       = require('./models/user.js')

app.set('secret', Math.random().toString(36).slice(2));

router.get('/', function(req, res) {
  res.json({ message: 'i party' });
});

app.use(bodyParser.json());

router.post('/authenticate', function(req, res) {
  if (sampleUser.pwd != req.body.password) {
    res.json({ success: false, message: 'Authentication failed. Wrong password.' });
  } else {

    const token = jwt.sign(sampleUser, app.get('secret'), {
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
  const token = req.body.token || req.query.token || req.headers['x-access-token'];

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
const sampleUser = {
  username: 'shed',
  pwd: 'tool'
};

router.get('/sample', function (req, res){
  res.json(sampleUser);
});

router.get('/users', function(req, res) {
  User.find({}, function (err, users) {
    res.json({ users: users });
  })
});

app.use('/api', router);

app.listen(port);

module.exports = app;