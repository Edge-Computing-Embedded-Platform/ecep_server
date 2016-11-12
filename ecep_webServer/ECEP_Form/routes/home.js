var ejs=require("ejs");

exports.workflow=function(req,res)
{

  console.log("inside the workflow");

    ejs.renderFile('./views/form.ejs',function(err,result){

        if(!err)
        {
            res.end(result);

        }
        else
        {
            console.log("cant render");
        }
    });

};