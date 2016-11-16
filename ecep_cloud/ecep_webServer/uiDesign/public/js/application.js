/**
 * Created by praveen on 11/11/2016.
 */

$(document).ready(function(){


    loadApplication();
 debugger;
    $("#device_app").change(function () {

        $("#containerName_app").show();
        $.ajax({

            url: "http://ec2-52-39-130-106.us-west-2.compute.amazonaws.com:9000/compute?command=filter&username=admin&deviceId="+$("#device_app").val(),
           // url:"http://ec2-52-39-130-106.us-west-2.compute.amazonaws.com:9000/device?command=all",
            type: "GET",

            crossDomain: true,


            // async : false,


            success: function (response) {

                var container = JSON.parse(response).compute;
                // var loca = document.getElementById("location-dropdown");

                console.log(container[0]);
                // alert("success");

                for (var i = 0; i < container.length; i++) {
                    var loc = container[i].containerName;
                    console.log(container[i].containerName);
                    // $("<select />").append($("<option>", {loc:loc})).insertAfter($(this));
                    $("#containerName_app").append($("<option>" + loc + "</option>"));

                }

            },
            error: function (xhr, status) {
                alert("error");
            }
        });

    });


});

function loadApplication() {
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