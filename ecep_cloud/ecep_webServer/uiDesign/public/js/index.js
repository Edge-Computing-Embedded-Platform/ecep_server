    /**
     * Created by praveen on 10/17/2016.
     */
    $(document).ready(function(){

       loadTable();

        loadDeviceCount();

        loadContainerCount();
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

    function removeContainer(i)
    {

        event.preventDefault();
        debugger;
        var deviceId=container[i].deviceId;
        var containerName=container[i].containerName;
        console.log(deviceId,containerName);

        debugger;
        $.ajax({
            url: "http://ec2-52-39-130-106.us-west-2.compute.amazonaws.com:9000/handle_request",
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
    function startContainer(i)
    {
        event.preventDefault();
        debugger
        var deviceId=container[i].deviceId;
        var containerName=container[i].containerName;
        console.log(deviceId,containerName);
        debugger;
        $.ajax({
            url: "http://ec2-52-39-130-106.us-west-2.compute.amazonaws.com:9000/handle_request",
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

    function stopContainer(i)

    {
        event.preventDefault();
        debugger;
        $.ajax({
            url: "http://ec2-52-39-130-106.us-west-2.compute.amazonaws.com:9000/handle_request",
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
debugger;
                document.getElementById('#location_dropdown').val(0);
                document.getElementById('#device').val(0);
                document.getElementById('#architecture').val(0);
                document.getElementById('#containerImage').val(0);

                console.log("S");
            },
            //If there was no resonse from the server
            error : function(res) {
                console.log(res);
            }
        });
        return false;


    }

    function loadTable() {

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
                    htmlstring=htmlstring+"<td class='center'><span class='label-warning label label-default'>"+container[i].status+"</span>" +"</td>" ;
                    htmlstring=htmlstring+'<td class="center"><a class="btn btn-success" href="#" onclick="startContainer('+i+')"';
                    htmlstring=htmlstring+'<i class="glyphicon glyphicon-start icon-white" ></i>' ;
                    htmlstring=htmlstring+ 'Start Container</a>';
                    htmlstring=htmlstring+'<a class="btn btn-info" href="#" onclick="removeContainer('+i+')"';
                    htmlstring=htmlstring+'<i class="glyphicon glyphicon-remove icon-white" ></i>' ;
                    htmlstring=htmlstring+ 'Remove Container</a>';

                    htmlstring=htmlstring+'<a class="btn btn-danger" href="#" onclick="stopContainer('+i+')"';
                    htmlstring=htmlstring+'<i class="glyphicon glyphicon-stop icon-white" ></i>';
                    htmlstring=htmlstring+   'Stop Container</a>';
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

function loadDeviceCount() {
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

function loadContainerCount() {

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
            // alert("error");
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



