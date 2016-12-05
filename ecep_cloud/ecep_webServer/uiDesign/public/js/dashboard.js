/**
 * Created by praveen on 11/11/2016.
 */
$(document).ready(function(){
debugger;

    ip="http://ec2-52-39-130-106.us-west-2.compute.amazonaws.com:9000";
    // Load the Visualization API and the corechart package.
    google.charts.load('current', {'packages':['corechart']});

    // Set a callback to run when the Google Visualization API is loaded.
    google.charts.setOnLoadCallback(drawChart);

    // Callback that creates and populates a data table,
    // instantiates the pie chart, passes in the data and
    // draws it.

    loadDeviceList();
    loadDeviceCount1();
    loadContainerCount1();
    fillContianerTable();

    $("#device_CPUinfo").change(function () {


        $("#graphDisply").show();
    });

});
function fillContianerTable() {
    $.ajax({
        url: ip+"/compute?command=filter&username=admin&active=true",
        type: "GET",

        crossDomain: true,

        // async : false,


        success: function (response) {
            debugger;
             container=JSON.parse(response).compute;
            // var loca = document.getElementById("location-dropdown");

            // alert("success");

            for(var i=0; i<container.length;i++)

            {
                var bgColor="label-warning label label-default";
                var status=container[i].status;
                var devId=container[i].deviceId;
                var cName=container[i].containerName;

                if (status.search("created"))
                {

                    bgColor="label-default label label-danger";
                }
                if (status.search("Exited"))
                {
                    bgColor="label-warning label label-default";
                }

                var htmlstring="";
                htmlstring=htmlstring+"<tr >";
                htmlstring=htmlstring+"<td class='center'>"+cName+"</td>";
                htmlstring=htmlstring+"<td class='center'>"+devId+"</td>";
                htmlstring=htmlstring+"<td class='center'>"+container[i].imageName+"</td>";
                htmlstring=htmlstring+"<td class='center'><span class='"+bgColor+"'>"+container[i].status+"</span>" +"</td>" ;
                htmlstring=htmlstring+'<td class="center"><a class="btn btn-success" href="#" onclick="startContainer1('+i+')"';
                htmlstring=htmlstring+'<i class="glyphicon glyphicon-start icon-white" ></i>' ;
                htmlstring=htmlstring+ 'Start Container</a>';
                htmlstring=htmlstring+'<a class="btn btn-info" href="#" onclick="removeContainer1('+i+')"';
                htmlstring=htmlstring+'<i class="glyphicon glyphicon-remove icon-white" ></i>' ;
                htmlstring=htmlstring+ 'Remove Container</a>';

                htmlstring=htmlstring+'<a class="btn btn-danger" href="#" onclick="stopContainer1('+i+')"';
                htmlstring=htmlstring+'<i class="glyphicon glyphicon-stop icon-white" ></i>';
                htmlstring=htmlstring+   'Stop Container</a>';
                htmlstring=htmlstring+'<a class="btn btn-danger" href="#" onclick="download1('+i+')"';
                htmlstring=htmlstring+'<i class="glyphicon glyphicon-download icon-white" ></i>';
                htmlstring=htmlstring+   'Download Logs</a>';
                htmlstring=htmlstring+"</td>";
                htmlstring=htmlstring+"</tr>";
                $("#containerRow").append(htmlstring);


            }
            debugger;
        },
        error: function (xhr, status) {


            //alert("error");
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
function removeContainer1(i)
{

    event.preventDefault();
    debugger;
    var deviceId=container[i].deviceId;
    var containerName=container[i].containerName;
    console.log(deviceId,containerName);

    debugger;
    $.ajax({
        url: ip+"/handle_request",
        type : "POST",
        dataType: "json",
        data:{
            "username": "admin",
            "containerName": containerName,
            "command": "remove",
            "deviceId": deviceId
        },

        crossDomain: true,

        success: function (response) {
            //  event.preventDefault();

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

    return false;
}
function startContainer1(i)
{
    event.preventDefault();
    debugger
    var deviceId=container[i].deviceId;
    var containerName=container[i].containerName;
    console.log(deviceId,containerName);
    debugger;
    $.ajax({
        url: ip+"/handle_request",
        type : "POST",
        dataType: "json",
        data:{
            "username": "admin",
            "containerName": containerName,
            "command": "start",
            "deviceId": deviceId
        },

        crossDomain: true,

        success: function (response) {
            //event.preventDefault();
            console.log("S");


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

    return false;
}

function download1(i)
{
    event.preventDefault();
    debugger
    var deviceId=container[i].deviceId;
    var containerName=container[i].containerName;
    console.log(deviceId,containerName);
    debugger;
    $.ajax({
        url: ip+"/log?command=download&username=admin&containerName="+ containerName+"&deviceId="+deviceId,
        type : "GET",
        crossDomain: true,

        success: function (response) {
            //event.preventDefault();
            console.log(response);
            var form = $('<form>', {action: '/download', method: 'POST'});
            form.append($('<input>', {name: 'containerName', value: containerName}));
            form.append($('<input>', {name: 'deviceId', value: deviceId}));
            form.submit();
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

    return false;
}

function stopContainer1(i)
{
    event.preventDefault();
    debugger;
    var deviceId=container[i].deviceId;
    var containerName=container[i].containerName;
    $.ajax({
        url: ip+"/handle_request",
        type : "POST",
        dataType: "json",
        data:{
            "username": "admin",
            "containerName": containerName,
            "command": "stop",
            "deviceId": deviceId
        },

        crossDomain: true,

        success: function (response) {

            console.log("S");

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
    return false;

}

function loadDeviceList() {
    $.ajax({
        url: ip+"/device?command=all",
        type: "GET",

        crossDomain: true,


        // async : false,


        success: function (response) {

            // var loca = document.getElementById("location-dropdown");

            // console.log(location[1]);
            // alert("success");
            var devices=JSON.parse(response).device
            for(var i=0; i<devices.length;i++)
            {
                var dev=devices[i];

                // $("<select />").append($("<option>", {loc:loc})).insertAfter($(this));
                $("#device_CPUinfo").append($("<option>"+dev.deviceId+"</option>"));

            }

        },
        error: function (xhr, status) {
            //alert("error");
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
function loadDeviceCount1() {
    $.ajax({
        url: ip+"/device?command=all",
        type: "GET",

        crossDomain: true,


        // async : false,


        success: function (response) {

            var device=JSON.parse(response).device;
            // var loca = document.getElementById("location-dropdown");

            // alert("success");


            // $("<select />").append($("<option>", {loc:loc})).insertAfter($(this));
            $("#deviceCount1").append($("<div>"+device.length+"</div>"));



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

function loadContainerCount1() {
    $.ajax({
        url: ip+"/compute?command=filter&username=admin",
        type: "GET",

        crossDomain: true,


        // async : false,


        success: function (response) {

            var container=JSON.parse(response).compute;
            // var loca = document.getElementById("location-dropdown");

            // alert("success");


            // $("<select />").append($("<option>", {loc:loc})).insertAfter($(this));
            $("#containerCount1").append($("<div>"+container.length+"</div>"));



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