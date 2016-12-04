/**
 * Created by praveen on 12/3/2016.
 */
var express = require('express');
var router = express.Router();
var http = require('http');
var request = require("request");
var fs1 = require('fs');
var fs = require('fs-extra');
var formidable = require("formidable");
var util = require('util');



router.post('/', function (req, res) {
         console.log("In downloads")
        var filename="output.log";
        var logpath='/home/ubuntu/ecep/'+'admin'+'_'+req.body.containerName+'/' +filename;
        console.log(logpath)
        res.download( logpath );
        //res.send({"data":"success"});
});

module.exports = router;