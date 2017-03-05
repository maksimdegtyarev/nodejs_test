var express = require('express'),
	app = express(),
	model = require('./model/index')(app);

app.set('views', './view');
app.set('view engine', 'pug');
app.use('/static', express.static('bower_components'));

app.get('/', (req, res) => {
	res.render('index', {});
});

app.listen(3000, () => {
	console.log('Start server...');
});