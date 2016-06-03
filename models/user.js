const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/myproject');

const user_schema = new mongoose.Schema({ name: 'string', pwd: 'string' });
const User = mongoose.model('User', user_schema);


module.exports = User;
