/**
 * Created by praveen on 11/11/2016.
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

            console.log(device[0].deviceId);
            console.log(device[1].deviceId);
            console.log(device[2].deviceId);
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




});
