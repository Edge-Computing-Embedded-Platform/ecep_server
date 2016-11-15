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


            // $("<select />").append($("<option>", {loc:loc})).insertAfter($(this));
            $("#deviceCount").append($("<div>"+device.length+"</div>"));



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
                var devId=container[i].deviceId;
                var cName=container[i].containerName;
                $("#containerRow").append($("<tr ><td class='center'>"+cName+
                    "</td><td class='center'>"+devId+
                    "</td><td class='center'>"+container[i].imageName+"" +
                    "</td><td class='center'><span class='label-warning label label-default'>"+container[i].status+"</span>" +
                    "</td><" +
                    "td class='center'><a class='btn btn-info' href='#' onclick='removeContainer('+devId+','+cName+');'>" +
                    "<i class='glyphicon glyphicon-remove icon-white'></i>Remove Container</a>" +
                    "<a class='btn btn-danger' href='#' onclick='stopContainer('+devId+','+cName+');'>" +
                    "<i class='glyphicon glyphicon-stop icon-white'></i>Stop Container</a>" +
                    "</td></tr>"));

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

});
