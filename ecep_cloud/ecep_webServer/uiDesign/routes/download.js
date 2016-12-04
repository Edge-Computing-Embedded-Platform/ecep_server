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



app.get('/download_logs', function (req, res) {

        var filename=req.session.username+"_recieved_bds_log";
        var logpath=__dirname + "/public/pythonfiles/" +filename;
        res.download( logpath );

});

module.exports = router;