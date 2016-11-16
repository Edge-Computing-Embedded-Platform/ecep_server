/**
 * Created by praveen on 11/11/2016.
 */

$(document).ready(function(){
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