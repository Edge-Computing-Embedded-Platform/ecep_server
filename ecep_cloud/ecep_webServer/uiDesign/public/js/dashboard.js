/**
 * Created by praveen on 11/11/2016.
 */
$(document).ready(function(){

    $("#containerForm").click(function(){

        $("#load").load("../partial_html/containerForm.html");
    });
    $("#dashboard").click(function(){


        $("#load").load("../partial_html/dashboard.html");
    });


    $("#applicationForm").click(function(){

        $("#load").load("../partial_html/applicationForm.html");
    });


    $("#location_dropdown").change(function () {
        console.log("location changed");

        $("#device").show();
        debugger;
        var loc=$("#location_dropdown").val();

        console.log(loc);
        $.ajax({

            url: "http://ec2-52-39-130-106.us-west-2.compute.amazonaws.com:9000/device?command=filter&location="+ loc,
            type: "GET",

            crossDomain: true,

            success: function (response) {

                // var loca = document.getElementById("location-dropdown");

                // console.log(location[1]);
                // alert("success");
                var devices=JSON.parse(response).device
                for(var i=0; i<devices.length;i++)
                {
                    var dev=devices[i];

                    // $("<select />").append($("<option>", {loc:loc})).insertAfter($(this));
                    $("#device").append($("<option>"+dev.deviceId+"</option>"));

                }

            },
            error: function (xhr, status) {
                alert("error");
            }
        });

    });


});
