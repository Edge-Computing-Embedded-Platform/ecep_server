
var express = require('express');
var router = express.Router();
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './upload')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})

var upload = multer({ storage: storage })

   // bodyParser = require('body-parser'),
   // path = require('path');
 var http = require('http');
var request = require("request");
var formidable = require("formidable");
var util = require('util');
var multipart = require('multipart');
//var multer = require('multer');


router.post('/', upload.single('img'),function (req, res,next) {
    console.log("Entered Docker1")

    console.log("body data:"+JSON.stringify(req.body));

    console.log("Entered Docker2")

    var data = JSON.stringify({
        "command": "create",
        "username": "abhi",
        "image":req.body.image,
        "internalCommand":req.body.internal,
        "deviceId":req.body.device
    });

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
            res.send(chunk);
        });
    });

// post the data
    post_req.write(data);
    post_req.end();

});



module.exports = router;


/*
var req = request({
    url: 'http://api.8coupons.com/v1/getcategory', //URL
    method: 'GET', //Specify the method
}, function (error, response, body) {
    debugger
    if (error) {
        console.log(error);
    } else if (response.statusCode == 200) {
        debugger
        var result = JSON.parse(response.body);
        for (var i = 0; i < result.length; i++) {

            var data = JSON.stringify({
                "categoryID": result[i].categoryID,
                "category_name": result[i].category
            });


        }


    }
});
req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
    callback(err);
});
req.end();*/