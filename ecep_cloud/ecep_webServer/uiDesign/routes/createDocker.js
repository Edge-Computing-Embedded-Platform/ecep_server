
var express = require('express');
var router = express.Router();

   // bodyParser = require('body-parser'),
   // path = require('path');
 var http = require('http');
var request = require("request");
var formidable = require("formidable");
var util = require('util');



router.post('/', function (req, res,next) {
    console.log("Entered Docker1");

    console.log("body data:"+JSON.stringify(req.body));
    //console.log("body data:"+JSON.stringify(req.params));

    console.log("Entered Docker2");
    res.send({"data":"success"});

    var data = JSON.stringify({
        "command": "create",
        "username": "admin",
        "imageName":req.body.image,

        "containerName":req.body.containerName,
        "deviceId":req.body.device
    });
    console.log(data);
    var post_options = {
        host: 'ec2-52-39-130-106.us-west-2.compute.amazonaws.com',
        port: '9000',
        path: '/handle_request',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data)
        }
    };

    var post_req = http.request(post_options, function (reses) {
        reses.setEncoding('utf8');
        reses.on('data', function (chunk) {
            console.log('Response: ' + chunk);
            //res.send(chunk);
            //res.render('index', { title: 'Express' });
        });
    });

// post the data
    post_req.write(data);
    post_req.end();

});



module.exports = router;


