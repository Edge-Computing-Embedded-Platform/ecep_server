/**
 * Created by praveen on 10/17/2016.
 */
$(document).ready(function(){




    $.ajax({
        url: "http://ec2-52-39-130-106.us-west-2.compute.amazonaws.com:9000/device?command=all",
        type: "GET",

        crossDomain: true,


        // async : false,


        success: function (response) {

            var device=JSON.parse(response).device;
            // var loca = document.getElementById("location-dropdown");

            // alert("success");


                // $("<select />").append($("<option>", {loc:loc})).insertAfter($(this));
                $("#deviceCount").append($("<div>"+device.length+"</div>"));



        },
        error: function (xhr, status) {
            alert("error");
        }
    });


    $.ajax({
        url: "http://ec2-52-39-130-106.us-west-2.compute.amazonaws.com:9000/compute?command=filter&username=admin",
        type: "GET",

        crossDomain: true,


        // async : false,


        success: function (response) {

            var container=JSON.parse(response).compute;
            // var loca = document.getElementById("location-dropdown");

            // alert("success");


            // $("<select />").append($("<option>", {loc:loc})).insertAfter($(this));
            $("#containerCount").append($("<div>"+container.length+"</div>"));



        },
        error: function (xhr, status) {
            alert("error");
        }
    });






    $("#containerForm").click(function(){

        $("#load").load("../partial_html/containerForm.html");
        //console.log(("#location").val);
        //$("#loc").html("#location").val;
    });
    $("#dashboard").click(function(){


        $("#load").load("../partial_html/dashboard.html");
    });
    $("#location_dropdown").change(function () {

        console.log("location changed");

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

    $("#device").change(function () {
        console.log("location changed");

        $("#architecture").show();
        debugger;
        var selectedDevice=$("#device").val();

        var url="http://ec2-52-39-130-106.us-west-2.compute.amazonaws.com:9000/device?command=filter&location="+ $("#location_dropdown").val()+"&deviceId="+selectedDevice;
        console.log(url);
        $.ajax({

            url: url,
            type: "GET",

            crossDomain: true,

            success: function (response) {

                var archi=JSON.parse(response).device
                for(var i=0; i<archi.length;i++)
                {
                    var arh=archi[i];
                    console.log(arh.deviceId);

                    $("#architecture").append($("<option>"+arh.arch+"</option>"));

                }

            },
            error: function (xhr, status) {
                alert("error");
            }
        });

    });

    $("#architecture").change(function () {


        $("#containerImage").show();
        debugger;
        var selectedDevice=$("#device").val();
        //console.log(loc);
        var url="http://192.168.0.144:8090/image?command=filter&arch="+ $("#architecture").val()
            ;
        $.ajax({

            url: url,
            type: "GET",

            crossDomain: true,

            success: function (response) {

                console.log(response);
                // var loca = document.getElementById("location-dropdown");

                // console.log(location[1]);
                // alert("success");
                var image=JSON.parse(response).image
                for(var i=0; i<image.length;i++)
                {
                    var img=image[i];
                    console.log(img.imageName);
                    // $("<select />").append($("<option>", {loc:loc})).insertAfter($(this));
                    $("#containerImage").append($("<option>"+img.imageName+"</option>"));

                }

            },
            error: function (xhr, status) {
                alert("error");
            }
        });

    });


});

function sendit()
{
debugger;

    var form = document.getElementById("application"),
        formData = new FormData(form),
        xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {

        console.log(xhr.readyState);
    };
    xhr.open("POST", form.action, true);
    xhr.send(formData);
    return false;

}

function sendContainer()
{
    debugger
    $.ajax({
        type : "post",
        url : "create",
        dataType: "json",
        data:{
            "location":$('#location_dropdown').val(),
            "device":$('#device').val(),
            "arch":$('#architecture').val(),
            "image":$('#containerImage').val(),
            "containerName":$('#container_name').val(),
        },
        success : function(response) {
            console.log("S");
        },
        //If there was no resonse from the server
        error : function(res) {
            console.log(res);
        }
    });
    return false;


}



$('#containerForm').click(function() {
$.ajax({
    url: "http://ec2-52-39-130-106.us-west-2.compute.amazonaws.com:9000/location",
    type: "GET",

    crossDomain: true,


   // async : false,


    success: function (response) {

        var location=JSON.parse(response).location;
       // var loca = document.getElementById("location-dropdown");

        console.log(location[1]);
           // alert("success");

           for(var i=0; i<location.length;i++)
        {
            var loc=location[i];
           // $("<select />").append($("<option>", {loc:loc})).insertAfter($(this));
            $("#location_dropdown").append($("<option>"+loc+"</option>"));

        }

    },
    error: function (xhr, status) {
        alert("error");
    }
});


});

$('#dashboard').click(function() {
    $.ajax({
        url: "http://ec2-52-39-130-106.us-west-2.compute.amazonaws.com:9000/location",
        type: "GET",

        crossDomain: true,


        // async : false,


        success: function (response) {

            var location=JSON.parse(response).location;
            // var loca = document.getElementById("location-dropdown");

            console.log(location[1]);
            // alert("success");

            for(var i=0; i<location.length;i++)
            {
                var loc=location[i];
                // $("<select />").append($("<option>", {loc:loc})).insertAfter($(this));
                $("#location_dropdown").append($("<option>"+loc+"</option>"));

            }

        },
        error: function (xhr, status) {
            alert("error");
        }
    });


});
$('#applicationForm').click(function() {
    $.ajax({

       // url: "http://ec2-52-39-130-106.us-west-2.compute.amazonaws.com:9000/compute?command=filter&username=admin",
        url:"http://ec2-52-39-130-106.us-west-2.compute.amazonaws.com:9000/device?command=all",
        type: "GET",

        crossDomain: true,


        // async : false,


        success: function (response) {

            var device = JSON.parse(response).device;
            // var loca = document.getElementById("location-dropdown");


            // alert("success");

            for (var i = 0; i < device.length; i++) {
                var loc = device[i].deviceId;
                console.log(device[i].containerName);
                // $("<select />").append($("<option>", {loc:loc})).insertAfter($(this));
                $("#device_app").append($("<option>" + loc + "</option>"));

            }

        },
        error: function (xhr, status) {
            alert("error");
        }
    });

});


