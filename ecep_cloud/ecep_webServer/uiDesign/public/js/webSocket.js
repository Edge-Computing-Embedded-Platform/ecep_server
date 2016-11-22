/**
 * Created by praveen on 11/16/2016.
 */

$(document).ready(function() {
    data = JSON.stringify({
        "command":"filter",
        "username":"admin",
        "active":true

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
var output;
var output1;
var cpuOutput;

function init()
{
    output = document.getElementById("containerRow");
    output1 = document.getElementById("output");


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

    writeToScreen("CONNECTED");
    doSend(data);

}
function onOpen1(evt)
{

    writeToScreen("CONNECTED1");
    doSend1(data1);

}
function onClose(evt)
{
    writeToScreen("DISCONNECTED");


    setTimeout(function() {
        // send data to client every 1ms
        testWebSocket();
    }, 30000);

}

function onClose1(evt)
{
    writeToScreen("DISCONNECTED1");


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
    writeToScreen('<span style="color: red;">ERROR:</span> ' + evt.data);
}
function onError1(evt)
{
    writeToScreen('<span style="color: red;">ERROR1:</span> ' + evt.data);
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

function writeToScreen(message)
{
    var pre = document.createElement("p");
    pre.style.wordWrap = "break-word";


        output1.innerHTML = message;
    //output.append(pre);
    //output.replace(pre);
}

window.addEventListener("load", init, false);

/*
*/

