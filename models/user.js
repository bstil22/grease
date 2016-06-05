const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/myproject');

const user_schema = new mongoose.Schema({
  name: {
    type: 'string',
    required: true
  },
  pwd: {
    type: 'string',
    required: true
  }
});

const User = mongoose.model('User', user_schema);

module.exports = User;
