var mongoose = require('mongoose');

var Department = new mongoose.Schema({
	name: String
});

module.exports = mongoose.model('Department', Department);