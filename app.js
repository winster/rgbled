var express = require('express'),
    request = require('request'),
    bodyParser = require('body-parser'),
    Gpio = require('onoff').Gpio,
  	led_red = new Gpio(10, 'out'), //pin 19
  	led_green = new Gpio(9, 'out'), //pin 21
  	led_blue = new Gpio(11, 'out'), //pin 23
  	app = express();

app.set('port', (process.env.PORT || 8080));
app.set('ledmap', {'r':'RED','g':'GREEN','b':'BLUE'})

var jsonParser = bodyParser.json(); //for application/json
var urlencodedParser = bodyParser.urlencoded({ extended: false });//for form submission
app.use(jsonParser);

app.post('/process', jsonParser, function(req, res){
	if (!req.body) return res.sendStatus(400)
	var ip = req.body.led;
    switch(ip) {
    	case 'r': led_red.writeSync(1);break;
    	case 'g': led_green.writeSync(1);break;
    	case 'b': led_blue.writeSync(1);break;
    	default: ip='o';
    }
    setTimeout(app.cleanup, 5000);
  	res.send('Illuminating : '+app.get('ledmap')[ip]);
})
app.post('/process', urlencodedParser, function(req, res){
	res.send('Illuminating : '+app.get('ledmap')['o']);
})
app.post('/stop', function(req, res){
    app.stop();
  	res.send('releasing resources');
})
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
app.cleanup = function() {
    led_red.writeSync(0);
    led_green.writeSync(0);
    led_blue.writeSync(0);
    console.log('output set to 0');
};
app.stop = function(){	
    led_red.unexport();    // Unexport GPIO and free resources
    led_green.unexport();
    led_blue.unexport();
    console.log('released fully');
};