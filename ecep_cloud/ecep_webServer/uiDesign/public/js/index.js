/**
 * Created by praveen on 10/17/2016.
 */
$(document).ready(function(){

    $.ajax({
        url: "http://ec2-52-39-130-106.us-west-2.compute.amazonaws.com:9000/compute?command=filter&username=admin",
        type: "GET",

        crossDomain: true,

        // async : false,


        success: function (response) {
            debugger;
            var container=JSON.parse(response).compute;
            // var loca = document.getElementById("location-dropdown");

            // alert("success");

            for(var i=0; i<container.length;i++)
            {
                $("#containerRow").append($("<tr ><td class='center'>"+container[i].containerName+
                    "</td><td class='center'>"+container[i].deviceId+
                    "</td><td class='center'>"+container[i].imageName+"" +
                    "</td><td class='center'><span class='label-warning label label-default'>"+container[i].status+"</span>" +
                    "</td><" +
                    "td class='center'><a class='btn btn-info' href='#' onclick='removeContainer()'>" +
                    "<i class='glyphicon glyphicon-remove icon-white'></i>Remove Container</a>" +
                    "<a class='btn btn-danger' href='#'><i class='glyphicon glyphicon-stop icon-white'></i>Stop Container</a>" +
                    "</td></tr>"));

            }
        },
        error: function (xhr, status) {


            // swal({
            //     text: xhr.responseText,
            //     type: "error",
            //     showCancelButton: false,
            //     confirmButtonClass: 'btn-info',
            //     confirmButtonText: 'Close!'
            // });
           alert("error");
        }
    });



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
            swal({
                text: xhr.responseText,
                type: "error",
                showCancelButton: false,
                confirmButtonClass: 'btn-info',
                confirmButtonText: 'Close!'
            });
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
            swal({
                text: xhr.responseText,
                type: "error",
                showCancelButton: false,
                confirmButtonClass: 'btn-info',
                confirmButtonText: 'Close!'
            });
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


   });
function sendit()
{
debugger;

    var form = document.getElementById("application"),
        formData = new FormData(form),
        xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {//success


        }

        console.log(xhr.readyState);
    };
    xhr.open("POST", form.action, true);
    xhr.send(formData);
    return false;

}

function removeContainer()
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

        console.log(location.length);
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


