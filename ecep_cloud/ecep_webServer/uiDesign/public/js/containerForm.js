/**
 * Created by praveen on 11/9/2016.
 */


$(document).ready(function() {


});$("#location_dropdown").change(function () {
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
    var url="http://ec2-52-39-130-106.us-west-2.compute.amazonaws.com:9000/image?command=filter&arch="+ $("#architecture").val()
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
                $("#containerImage").append($("<option value='"+img.imageName+"'>"+img.imageName+"</option>"));

            }

        },
        error: function (xhr, status) {
            alert("error");
        }
    });

});



