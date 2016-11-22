/**
 * Created by praveen on 11/9/2016.
 */


$(document).ready(function() {
ip="http://ec2-52-39-130-106.us-west-2.compute.amazonaws.com:9000";

    // Load the Visualization API and the corechart package.
    google.charts.load('current', {'packages':['corechart']});

    // Set a callback to run when the Google Visualization API is loaded.
    google.charts.setOnLoadCallback(drawChart);

    // Callback that creates and populates a data table,
    // instantiates the pie chart, passes in the data and
    // draws it.


    loadLocation();

$("#location_dropdown").change(function () {
    console.log("location changed");

    $("#device").show();
    debugger;
    var loc=$("#location_dropdown").val();

    console.log(loc);
    $.ajax({

        url: ip+"/device?command=filter&location="+ loc,
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



$("#architecture").change(function () {


    $("#containerImage").show();
    debugger;
    var selectedDevice=$("#device").val();
    //console.log(loc);
    var url=ip+"/image?command=filter&arch="+ $("#architecture").val()
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


});
function sendContainer()
{
    debugger;


    output2 = document.getElementById("required");

    //console.log(('#location_dropdown').val());
    if($('#location_dropdown').val()=="Location" || $('#location_dropdown').val()=="")
    {
        debugger;
        output2.innerHTML = "Please Select Location";
        return false
    }
    if($('#device').val()=="Device Name" || $('#device').val()=="")
    {
        debugger;
        output2.innerHTML = "Please Select Device Name";
        return false
    }
    if($('#architecture').val()=="Architecture" || $('#architecture').val()=="")
    {
        debugger;
        output2.innerHTML = "Please Select Architecture";
        return false
    }
    if($('#containerImage').val()=="Container Image" || $('#containerImage').val()=="")
    {
        debugger;
        output2.innerHTML = "Please Select Container Image";
        return false
    }

    output2.innerHTML = "";
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
            debugger;
            $("#load").load("../partial_html/containerForm.html");

            console.log("S");
        },
        //If there was no resonse from the server
        error : function(res) {
            console.log(res);
        }
    });
    return false;


}

function loadLocation() {

    $.ajax({
        url: ip+"/location",
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
            swal({
                title:"ERROR",
                text: xhr.responseText,
                type: "error",
                showCancelButton: false,
                confirmButtonClass: 'btn-info',
                confirmButtonText: 'Close!'
            });
        }
    });


}