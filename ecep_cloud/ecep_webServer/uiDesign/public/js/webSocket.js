/**
 * Created by praveen on 11/16/2016.
 */


var wsUri = "ws://echo.websocket.org/";
var output;

function init()
{
    output = document.getElementById("output");


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
    //doSend("WebSocket rocks"), 30000;




}

function onClose(evt)
{
    writeToScreen("DISCONNECTED");
}

function onMessage(evt)
{
    writeToScreen('<span style="color: blue;">RESPONSE: ' + evt.data+'</span>');
    setInterval(doSend("WebSocket rocks"), 1000);
   // websocket.close();
}

function onError(evt)
{
    writeToScreen('<span style="color: red;">ERROR:</span> ' + evt.data);
}

function doSend(message)
{
    writeToScreen("SENT: " + message);
    websocket.send(message);
}

function writeToScreen(message)
{
    var pre = document.createElement("p");
    pre.style.wordWrap = "break-word";
    pre.innerHTML = message;
    output.appendChild(pre);
}

window.addEventListener("load", init, false);

function drawChart() {

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
    var diskMemUsed = 76; // continous value fetch
    diskMem.setValue(diskMemUsageRow, diskMemUpdateCol, diskMemUsed);
    diskMem.setValue(diskMemFreeRow, diskMemUpdateCol, (diskMemTotal - diskMemUsed));
    diskMem_chart.draw(diskMem, diskMem_options);

}


