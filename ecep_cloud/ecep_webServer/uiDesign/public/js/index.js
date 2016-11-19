    /**
     * Created by praveen on 10/17/2016.
     */
    $(document).ready(function(){

        ip="http://ec2-52-39-130-106.us-west-2.compute.amazonaws.com:9000";
      <!-- For Pie chart -->

            // Load the Visualization API and the corechart package.
            google.charts.load('current', {'packages':['corechart']});

            // Set a callback to run when the Google Visualization API is loaded.
            google.charts.setOnLoadCallback(drawChart);

            // Callback that creates and populates a data table,
            // instantiates the pie chart, passes in the data and
            // draws it.


       loadTable();

        loadDeviceCount();

        loadDeviceList();

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
        $("#device_CPUinfo").change(function () {


            $("#graphDisply").show();
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

                $("#load").load("../partial_html/applicationForm.html");
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
    function startContainer(i)
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

    function stopContainer(i)

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

    function loadTable() {

        $.ajax({
            url: ip+"/compute?command=filter&username=admin",
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
        url: ip+"/device?command=all",
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
        url:ip+"/compute?command=filter&username=admin",
        type: "GET",

        crossDomain: true,


        // async : false,


        success: function (response) {

            var container = JSON.parse(response).compute;
            // var loca = document.getElementById("location-dropdown");

            // alert("success");


            // $("<select />").append($("<option>", {loc:loc})).insertAfter($(this));
            $("#containerCount").append($("<div>" + container.length + "</div>"));


        },
        error: function (xhr, status) {
            // alert("error");
            swal({
                title: "ERROR",
                text: xhr.responseText,
                type: "error",
                showCancelButton: false,
                confirmButtonClass: 'btn-info',
                confirmButtonText: 'Close!'
            });
        }

    });
}

    function loadDeviceList() {
        $.ajax({
            url: "http://ec2-52-39-130-106.us-west-2.compute.amazonaws.com:9000/device?command=all",
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

    function drawChart() {

        //console.log("data:"+a);

        // Create the data table for disk Memory.
        var diskMem = new google.visualization.DataTable();
        diskMem.addColumn('string', 'Disk Memory');
        diskMem.addColumn('number', 'Gb');
        diskMem.addRows([
            ['Used Disk Memory', 0],
            ['Free Disk Memory', 1],
        ]);

        // Set chart options for disk memory
        var diskMem_options = {'title':'Disk Memory', 'width':400, 'height':400,
            'animation': {'startup': true, 'duration': 1000, 'easing': 'inAndOut'},
            'pieHole': 0.4, 'pieSliceText':  'value', 'pieSliceTextStyle': {'color': '#3F5059'},
            'titleTextStyle': {fontSize: 15}, 'tooltip': {'text':'percentage'},
            'slices': [{color: '#FF5733'}, {offset: 0.2, color: '#26D67B'}]};

        // create the data table for physical memory
        var physicalMem = new google.visualization.DataTable();
        physicalMem.addColumn('string', 'Disk Memory');
        physicalMem.addColumn('number', 'Gb');
        physicalMem.addRows([
            ['Used Physical Memory', 0],
            ['Free Physical Memory', 1],
        ]);

        // Set chart options for physical memory
        var physicalMem_options = {'title':'Physical Memory', 'width':400, 'height':400,
            'animation': {'startup': true, 'duration': 1000, 'easing': 'inAndOut'},
            'pieSliceText': 'value', 'pieSliceTextStyle': {'color': '#3F5059'},
            'titleTextStyle': {fontSize: 15}, 'pieHole': 0.4, 'tooltip': {'text':'percentage'},
            'slices': [{color: '#FF5733'}, {offset: 0.2, color: '#26D67B'}]};

        var cpuInfo = new google.visualization.DataTable();
        cpuInfo.addColumn('string', 'Disk Memory');
        cpuInfo.addColumn('number', 'Gb');
        cpuInfo.addRows([
            ['CPU Usage', 0],
            ['CPU Free', 1]
        ]);

        // Set chart options for physical memory
        var cpuInfo_options = {'title':'CPU Usage', 'width':400, 'height':400, 'pieHole': 0.4,
            'animation': {'startup': true, 'duration': 1000, 'easing': 'inAndOut'}, 'tooltip': {'text':'percentage'},
            'pieSliceText':  'percentage', 'pieSliceTextStyle': {'color': '#3F5059'},
            'titleTextStyle': {fontSize: 15}, 'slices': [{color: '#FF5733'}, {color: '#CFD1D3'}]};


        // Instantiate and draw our chart, passing in some options.
        var diskMem_chart = new google.visualization.PieChart(document.getElementById('diskMem_div'));
        diskMem_chart.draw(diskMem, diskMem_options);

        var physicalMem_chart = new google.visualization.PieChart(document.getElementById('physicalMem_div'));
        physicalMem_chart.draw(physicalMem, physicalMem_options);

        var cpuUsage_chart = new google.visualization.PieChart(document.getElementById('cpuUsage_div'));
        cpuUsage_chart.draw(cpuInfo, cpuInfo_options);

        // variables or constants used to update corresponding values
        var phyMemUsageRow = 0;
        var phyMemFreeRow = 1;
        var phyMemUpdateCol = 1;

        var cpuUsageRow = 0;
        var cpuFreeRow = 1;
        var cpuUpdateCol = 1;

        var diskMemUsageRow = 0;
        var diskMemFreeRow = 1;
        var diskMemUpdateCol = 1;

        // This whole function runs in a continous loop
        var cpuUsagePercent = 70; // continous value fetch
        cpuInfo.setValue(cpuUsageRow, cpuUpdateCol, cpuUsagePercent);
        cpuInfo.setValue(cpuFreeRow, cpuUpdateCol, (100 - cpuUsagePercent));
        cpuUsage_chart.draw(cpuInfo, cpuInfo_options);

        var physicalMemTotal = 7540; // only once during device selection
        // This whole function runs in a continous loop
        var physicalMemUsed = 6543; // continous value fetch
        physicalMem.setValue(phyMemUsageRow, phyMemUpdateCol, physicalMemUsed);
        physicalMem.setValue(phyMemFreeRow, phyMemUpdateCol, (physicalMemTotal - physicalMemUsed));
        physicalMem_chart.draw(physicalMem, physicalMem_options);


        var diskMemTotal = 120; //only once during device selection
        // This whole function runs in a continous loop
       var diskMemUsed = 0; // continous value fetch
        diskMem.setValue(diskMemUsageRow, diskMemUpdateCol, diskMemUsed);
        diskMem.setValue(diskMemFreeRow, diskMemUpdateCol, (diskMemTotal - diskMemUsed));
        diskMem_chart.draw(diskMem, diskMem_options);

    }
