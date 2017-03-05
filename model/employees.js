var mongoose = require('mongoose');

var Employee = new mongoose.Schema({
	firstName: String,
	lastName: String,
	department: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Department'
	}
});

module.exports = mongoose.model('Employee', Employee);