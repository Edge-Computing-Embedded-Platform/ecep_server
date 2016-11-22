var ejs=require("ejs");
var http=require("http");
var mysql=require("./mysql");

exports.callsignin=function(req,res)
{

    console.log("signin");

    ejs.renderFile('./views/signin.ejs',function (err,result){

        if (!err)
        {
            res.end(result);
        }
        // render or error
        else
        {
            res.end('An error occurred');
            console.log(err);
        }

    });

};




exports.checklogin=function(req,res){

    var user=req.param('user');
    var pass=req.param('password');
    console.log(user);

    var getUser="select * from users where user='" + req.param("user")+"' and password= '"+req.param("password")+"' ";
    console.log("Query is:"+getUser);

    mysql.fetchData(function(err,result){

        console.log(result);
        if(err)
        {
            throw err;

        }
        else{

            if(result.length>0)
            {
                console.log("valid user");

                req.session.user=user;   //session needs to be created

                var data={statusCode:200};
                res.send(data);
               // res.send(data);
               /*
                ejs.renderFile('./views/index.ejs',function(err,result){  //login successful render the file
                    if(!err)
                    {
                        console.log("success-- reroute to index");
                        res.end(result);
                    }
                    else{
                        console.log("some error when rendering");
                        res.end(err);
                    }
                });
                */

            }
            else{
                //invalid login

                var data={statusCode:400};
                res.send(data);   //render the file
                console.log("user doesnt exists");
            }
        }
    },getUser);

};

exports.registeruser=function(req,res){

    var user=req.param("newuser");
    var password=req.param("password");
    var lastname=req.param("lastname");
    var firstname=req.param("firstname");

    var adduser="INSERT INTO users (`user`, `password`, `fname`, `lname`) VALUES ('"+req.param("newuser")+"', '"+req.param("password")+"', '"+req.param("firstname")+"', '"+req.param("lastname")+"')";

    mysql.fetchData(function(err,results){

        console.log(results);
        if(err)
        {
            throw err;

        }
        else
        {
            if(results.affectedRows>0){
                //rediret to login page
                var data={statusCode:200};
                res.send(data);
                console.log("user added");
            }

            else
            {
                //user exits
                var data={statusCode:400};
                res.send(data);
                console.log("user exists");
            }
        }
    },adduser);

};

exports.homepage=function(req,res){

    console.log("inside homepage");

    ejs.renderFile('./views/index.ejs',function(err,result){  //login successful render the file
        if(!err)
        {
            console.log("success-- reroute to index");
            res.end(result);
        }
        else{
            console.log("some error when rendering");
            res.end(err);
        }
    });

};


exports.signin=function(req,res){


    ejs.renderFile('./views/signin.ejs',function(err,result){  //login successful render the file
        if(!err)
        {
            console.log("success-- reroute to signin");
            res.end(result);
        }
        else{
            console.log("some error when rendering");
            res.end(err);
        }
    });
};