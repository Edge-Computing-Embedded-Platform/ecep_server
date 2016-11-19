/**
 * Created by praveen on 11/16/2016.
 */

$(document).ready(function() {
    data = JSON.stringify({

        "username":"admin"

    });
});


var wsUri = "ws://ec2-52-39-130-106.us-west-2.compute.amazonaws.com:9000/compute_ws";
//var wsUri = "ws://echo.websocket.org/";
var output;

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

function onOpen(evt)
{



    writeToScreen("CONNECTED");
    doSend("filter","admin");




}

function onClose(evt)
{
    //writbeToScreen("DISCONNECTED");
}

function onMessage(evt)
{
    console.log(evt);
    container=JSON.parse(evt.data).compute;
    // var loca = document.getElementById("location-dropdown");
    console.log(container);

    // alert("success");

   /* for(var i=0; i<container.length;i++)

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
       // $("#containerRow").append(htmlstring);


    }
    debugger;
   //writeToScreen(htmlstring);
    output.innerHTML = htmlstring;*/

        setTimeout(function() {
            // send data to client every 1ms
            doSend(data);
        }, 10000);




       // setInterval(doSend("ecep"), 30000);
        // ;
}

function onError(evt)
{
    writeToScreen('<span style="color: red;">ERROR:</span> ' + evt.data);
}

function doSend(message)
{


    //writeToScreen("SENT: " + message);
    websocket.send(message);
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

