module.exports = function(app){
	var mongoose = require('mongoose'),
		bodyParser = require('body-parser'),
		Department = require('./departments'),
		Employee = require('./employees');

	app.use(bodyParser.json());
	mongoose.connect('mongodb://localhost:27017/nodejs_test');
	var db = mongoose.connection;
	db.on('open', () => {
		console.log('db connect');
	});

	app.get('/api/department', (req, res) => {
		Department.find({}, (err, data) => {
			var result = [];
			data.forEach((item) => {
				result.push({
					id: item._id,
					name: item.name
				});
			});
			res.send(result);
		});
	});
	app.get('/api/employee', (req, res) => {
		Employee.find({}).populate('department').exec((err, data) => {
			var result = [];
			data.forEach((item) => {
				result.push({
					id: item._id,
					firstName: item.firstName,
					lastName: item.lastName,
					department: item.department
				});
			});
			res.send(result);
		});
	});

	app.post('/api/department', (req, res) => {
		if(req.body.hasOwnProperty('id') && req.body.id){	//update
			var result = false;
			Department.update({
				_id: req.body.id
			},
			{
				name: req.body.name
			}, (err, data) => {
				if(err){
					console.log(err);
				}
				else{
					result = true;
					console.log('Updated: ', data);
				}
				res.send({result: result});
			});
		}
		else{	//add
			var result = false;
			var newDepartment = new Department({
				name: req.body.name
			});
			newDepartment.save((err, data) => {
				if(err){
					console.log(err);
				}
				else{
					result = true;
					console.log('Saved: ', data);
				}
				res.send({result: result});
			});
		}
	});
	app.post('/api/employee', (req, res) => {
		if(req.body.hasOwnProperty('id') && req.body.id){
			var result = false;
			Employee.update({
				_id: req.body.id
			},
			{
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				department: req.body.department
			}, (err, data) => {
				if(err){
					console.log(err);
				}
				else{
					result = true;
					console.log('Saved: ', data);
				}
				res.send({result: result});
			});
		}
		else{
			var result = false;
			var newEmployee = new Employee({
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				department: req.body.department
			});
			newEmployee.save((err, data) => {
				if(err){
					console.log(err);
				}
				else{
					result = true;
					console.log('Saved: ', data);
				}
				res.send({result: result});
			});
		}
	});
	app.post('/api/removeDepartment', (req, res) => {
		var result = false;
		Department.remove({
			_id: req.body.id
		}, (err, data) => {
			if(err){
				console.log(err);
			}
			else{
				result = true;
				console.log('Removed');
			}
			res.send({result: result});
		});
	});
	app.post('/api/removeEmployee', (req, res) => {
		var result = false;
		Employee.remove({
			_id: req.body.id
		}, (err, data) => {
			if(err){
				console.log(err);
			}
			else{
				result = true;
				console.log('Removed');
			}
			res.send({result: result});
		});
	});
};