//const csp = require('express-csp-header');
const { expressCspHeader, INLINE, NONE, SELF } = require('express-csp-header');
const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const app = express();

app.use(expressCspHeader({
    directives: {
        //'default-src': [INLINE],
        'img-src': [SELF, 'data:'],
	//'font-src' :[SELF, 'data:' ],

    }
}));
app.use(express.static(path.join(__dirname, 'dist')));

app.get('/ping', function (req, res) {
	console.log(req.query)
	console.log(req.params)
 return res.send('pong');
});

app.get('/', function (req, res) {
	console.log("this is the homepage")
  return  res.sendFile(path.join(__dirname, 'dist','index.html'));
});

app.get('/viewer/:studyId/',function(req,res){
  console.log(req.query);
	console.log(req.params);
  res.sendFile(path.join(__dirname, 'dist','dummy.html'));
});

app.get('/get_token', function(req,res){
	console.log('get token')	
	res.sendFile(path.join(__dirname, 'dist','get_token.html'));
})
app.listen(process.env.PORT || 5000);