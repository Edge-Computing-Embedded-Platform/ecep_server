/**
 * Created by praveen on 11/16/2016.
 */

$(document).ready(function() {

    output = document.getElementById("containerRow");
    diskMem = document.getElementById("diskMem");
    phyMem = document.getElementById("phyMem");
    // Set a callback to run when the Google Visualization API is loaded.
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);
    cpuUsagePercent=0;
    physicalMemTotal=0;
    physicalMemUsed=0;
    diskMemTotal=0;
    diskMemUsed=0;
    data = JSON.stringify({
        "command":"filter",
        "username":"admin",
        "active":true

    });
    $("#dashboard").click(function(){

debugger;
        $("#load").load("../partial_html/dashboard.html");
        output = document.getElementById("containerRow");
        diskMem = document.getElementById("diskMem");
        phyMem = document.getElementById("phyMem");
        testWebSocket();
    });
    $("#device_CPUinfo").change(function () {
        debugger;
        $("#graphDisply").show();
        var str=$('#device_CPUinfo').val();
        console.log(str);

            data1 = JSON.stringify({

                "deviceId":str

            });


        console.log(data1);
        testWebSocket1();
    });


        });

$("#device").change(function () {
    console.log("location changed");
    $("#graphDisply1").show();
    $("#architecture").show();
    debugger;
    var selectedDevice=$("#device").val();
    data1 = JSON.stringify({

        "deviceId":selectedDevice

    });


    console.log(data1);
    testWebSocket1();
    var url=ip+"/device?command=filter&location="+ $("#location_dropdown").val()+"&deviceId="+selectedDevice;
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

//var wsUri = "ws://192.168.0.121:9000/compute_ws ";
var wsUri = "ws://ec2-52-39-130-106.us-west-2.compute.amazonaws.com:9000/compute_ws ";
var wsCPUUri = "ws://ec2-52-39-130-106.us-west-2.compute.amazonaws.com:9000/cpuinfo_ws ";
//var wsUri = "ws://echo.websocket.org/";


function init()
{

   // output2 = document.getElementById("containerRow1");
  //  output1 = document.getElementById("output");


        testWebSocket();



}

function testWebSocket()
{
    websocket = new WebSocket(wsUri);
    websocket.onopen = function(evt) { onOpen(evt) };
    websocket.onclose = function(evt) { onClose(evt) };
    websocket.onmessage = function(evt) { onMessage(evt) };
    websocket.onerror = function(evt) { onError(evt) };


}
function testWebSocket1()
{


    websocket1 = new WebSocket(wsCPUUri);
    websocket1.onopen = function(evt) { onOpen1(evt) };
    websocket1.onclose = function(evt) { onClose1(evt) };
    websocket1.onmessage = function(evt) { onMessage1(evt) };
    websocket1.onerror = function(evt) { onError1(evt) };
}

function onOpen(evt)
{

   // writeToScreen("CONNECTED");
    doSend(data);

}
function onOpen1(evt)
{

   // writeToScreen("CONNECTED1");
    doSend1(data1);

}
function onClose(evt)
{
   // writeToScreen("DISCONNECTED");


    setTimeout(function() {
        // send data to client every 1ms
        testWebSocket();
    }, 30000);

}

function onClose1(evt)
{
   // writeToScreen("DISCONNECTED1");


    setTimeout(function() {
        // send data to client every 1ms
        testWebSocket1();
    }, 30000);

}

function onMessage(evt)
{
    console.log(evt);
    container=JSON.parse(evt.data).compute;


    // var loca = document.getElementById("location-dropdown");
    console.log(container);
    var htmlstring = "";
    // alert("success");
    console.log(container.length);
    if(container.length>0) {


        for (var i = 0; i < container.length; i++) {
            console.log(container[i]);
            var devId = container[i].deviceId;
            var cName = container[i].containerName;

            if (status.search("created")) {

                bgColor = "label-default label label-danger";
            }
            if (status.search("Exited")) {
                bgColor = "label-warning label label-default";
            }


            htmlstring = htmlstring + "<tr >";
            htmlstring = htmlstring + "<td class='center'>" + cName + "</td>";
            htmlstring = htmlstring + "<td class='center'>" + devId + "</td>";
            htmlstring = htmlstring + "<td class='center'>" + container[i].imageName + "</td>";
            htmlstring = htmlstring + "<td class='center'><span class='label-warning label label-default'>" + container[i].status + "</span>" + "</td>";
            htmlstring = htmlstring + '<td class="center"><a class="btn btn-success" href="#" onclick="startContainer(' + i + ')"';
            htmlstring = htmlstring + '<i class="glyphicon glyphicon-start icon-white" ></i>';
            htmlstring = htmlstring + 'Start Container</a>';
            htmlstring = htmlstring + '<a class="btn btn-info" href="#" onclick="removeContainer(' + i + ')"';
            htmlstring = htmlstring + '<i class="glyphicon glyphicon-remove icon-white" ></i>';
            htmlstring = htmlstring + 'Remove Container</a>';

            htmlstring = htmlstring + '<a class="btn btn-danger" href="#" onclick="stopContainer(' + i + ')"';
            htmlstring = htmlstring + '<i class="glyphicon glyphicon-stop icon-white" ></i>';
            htmlstring = htmlstring + 'Stop Container</a>';
            htmlstring = htmlstring + "</td>";
            htmlstring = htmlstring + "</tr>";
            // $("#containerRow").append(htmlstring);


        }
    }
    debugger;
    console.log(htmlstring);
   //writeToScreen(htmlstring);
    output.innerHTML = htmlstring;
    //output2.innerHTML = htmlstring;

        setTimeout(function() {
            // send data to client every 1ms
            doSend(data);
        }, 30000);




       // setInterval(doSend("ecep"), 30000);
        // ;
}

function onMessage1(evt)
{

    cpuOutput=document.getElementById("displayCPU");
    console.log(evt);
    cpu=JSON.parse(evt.data).info;

    cpuUsagePercent=parseFloat(cpu[0].CPUUsage).toFixed(2);
    physicalMemTotal=parseFloat(cpu[0].physicalMem).toFixed(2);
    physicalMemUsed=parseFloat(cpu[0].physicalUsed).toFixed(2);
    diskMemTotal=parseFloat(cpu[0].diskMem).toFixed(2);
    diskMemUsed=parseFloat(cpu[0].diskUsed).toFixed(2);
    drawChart();
    diskMem.innerHTML =parseFloat(cpu[0].diskMem).toFixed(2);
    phyMem.innerHTML=parseFloat(cpu[0].physicalMem).toFixed(2);
    var htmlstring1 = "";

    htmlstring1 = htmlstring1 + "<h5>Device Name:" +cpu[0].deviceName+"</h5>";
    htmlstring1 = htmlstring1 + "<h5>Operating System:" +cpu[0].os+"</h5>";
    htmlstring1 = htmlstring1 + "<h5>Kernel Version:" +cpu[0].kernelVersion+"</h5>";
    htmlstring1 = htmlstring1 + "<h5>Total Containers:" +cpu[0].totalContainers+"</h5>";
    htmlstring1 = htmlstring1 + "<h5>Total Images:" +cpu[0].totalImages+"</h5>";
    // var loca = document.getElementById("location-dropdown");
    //

    console.log(htmlstring1);
    //writeToScreen(htmlstring);
    cpuOutput.innerHTML = htmlstring1;




     setTimeout(function() {
    //     // send data to client every 1ms
        doSend1(data1);
     }, 30000);




    // setInterval(doSend("ecep"), 30000);
    // ;
}


function onError(evt)
{
   // writeToScreen('<span style="color: red;">ERROR:</span> ' + evt.data);
}
function onError1(evt)
{
   // writeToScreen('<span style="color: red;">ERROR1:</span> ' + evt.data);
}

function doSend(message)
{


    //writeToScreen("SENT: " + message);
    websocket.send(message);
    //drawChart(message);
}
function doSend1(message)
{


    //writeToScreen("SENT: " + message);
    websocket1.send(message);
    //drawChart(message);
}

/*function writeToScreen(message)
{
    var pre = document.createElement("p");
    pre.style.wordWrap = "break-word";


        output1.innerHTML = message;
    //output.append(pre);
    //output.replace(pre);
}*/

window.addEventListener("load", init, false);

/*
*/

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
    //var cpuUsagePercent = 70; // continous value fetch
    cpuInfo.setValue(cpuUsageRow, cpuUpdateCol, cpuUsagePercent);
    cpuInfo.setValue(cpuFreeRow, cpuUpdateCol, (100 - cpuUsagePercent));
    cpuUsage_chart.draw(cpuInfo, cpuInfo_options);

    //var physicalMemTotal = 7540; // only once during device selection
    // This whole function runs in a continous loop
    //var physicalMemUsed = 6543; // continous value fetch
    physicalMem.setValue(phyMemUsageRow, phyMemUpdateCol, physicalMemUsed);
    physicalMem.setValue(phyMemFreeRow, phyMemUpdateCol, (physicalMemTotal - physicalMemUsed));
    physicalMem_chart.draw(physicalMem, physicalMem_options);


   // var diskMemTotal = 120; //only once during device selection
    // This whole function runs in a continous loop
    //var diskMemUsed = 0; // continous value fetch
    diskMem.setValue(diskMemUsageRow, diskMemUpdateCol, diskMemUsed);
    diskMem.setValue(diskMemFreeRow, diskMemUpdateCol, (diskMemTotal - diskMemUsed));
    diskMem_chart.draw(diskMem, diskMem_options);

}
