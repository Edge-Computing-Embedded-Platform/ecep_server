"""
Edge Computing Embedded Platform
Developed by Abhishek Gurudutt, Chinmayi Divakar,
Praveen Prabhakaran, Tejeshwar Chandra Kamaal

Handles user request. This integrates with DB and wamp server
"""
import tornado.escape
import tornado.ioloop
import tornado.web
import tornado.websocket
import time
import json
from container_control import *
from ..ecep_db.controller import Compute_Manager, Image_Manager, Device_Manager, Location_Manager, Info_Manager, init_db_lock
from wamp_server import *
import urlparse
import sys
from update_db import threaded

@threaded
def checkConnection(name='checkConnection'):
    """
    This function broadcasts a message to all the registered
    devices
    """
    topic = "com.ecep.server.checkConnection"
    data = True
    sendTo(topic, data)

# Handle command request
def handleCmd(entries):
    """
    Check if the received request is valid / not valid.
    If valid, then update database and transmit to end node.
    """
    packet = sendCommand(entries)
    if packet['valid']:
        print 'valid command passed'
        sendTo(packet['topic'], packet['msg'])
    else:
        print 'invalid command passed'
        



# Handle request from user
class handleReq(tornado.web.RequestHandler):
    """
    Handle user command request
    """
    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Headers", 'x-requested-with,Origin')
        self.set_header('Access-Control-Allow-Methods', 'POST, GET, PUT')

    def get(self):
        temp = contcmd = {'username': 'newlogin', 'command': 'create', 'deviceId': 'beaglebone', 'imageName': 'ubuntu',
                          'containerName': 'abhi'}
        handleCmd(temp)
        self.write('Edge Computing Project')

    def put(self, *kwargs):
        pdate = json.loads(self.request.body)

    def post(self, **kwargs):

        try:
            data = json.loads(self.request.body)
        except:
            data = dict(urlparse.parse_qsl(self.request.body))

        for entry in data:
            if entry == 'command':
                print 'command'
                handleCmd(data)
        self.write(data)

    def prepare(self):
        if self.request.headers["Content-Type"].startswith("application/json"):
            self.json_args = json.loads(self.request.body)
        else:
            self.json_args = None


class Download(tornado.web.RequestHandler):
    def post(self, **kwargs):

        file_root_path = "/home/ubuntu/ecep/"
        chunk = 2048
        keys = ['username', 'containerName', 'filename']

        try:
            data = json.loads(self.request.body)
        except:
            data = dict(urlparse.parse_qsl(self.request.body))

        for key in keys:
            if key not in data:
                self.set_status(400, reason="param %s missing" % key)
                raise tornado.web.HTTPError(400)

        file_path = file_root_path + data['username'] + '_' + data['containerName'] + '/' + data['filename']
        print file_path
        try:
            file_object = open(file_path, 'rb')

            while True:
                d = file_object.read(chunk)
                if not d:
                    break
                self.write(d)
                self.flush()
            self.finish()
        except Exception, e:
            print(e)


class DeviceHandler(tornado.web.RequestHandler):
    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Headers", 'x-requested-with,Origin')
        self.set_header('Access-Control-Allow-Methods', 'POST, GET, PUT')

    def get_device_list(self, data):

        device = Device_Manager()
        ret = device.get_device_list_filter(**data)
        return ret

    def put(self, **kwargs):
        try:
            data = json.loads(self.request.body)
        except:
            data = dict(urlparse.parse_qsl(self.request.body))
        print(data)
        device = Device_Manager()
        ret = device.add_new_device_node(**data)
        self.write(json.dumps(ret))
        self.finish()
        return

    def get(self):

        try:
            data = json.loads(self.request.query)
        except:
            data = dict(urlparse.parse_qsl(self.request.query))

        print data

        if data['command'] == 'filter':
            data.__delitem__('command')

            ret = self.get_device_list(data)
            self.write(json.dumps(ret))
            self.finish()
            return
        if data['command'] == 'all':
            data.__delitem__('command')
            device = Device_Manager()
            ret = device.get_device_list();
            self.write(json.dumps(ret))
            self.finish()
            return
        return


class ImageHandler(tornado.web.RequestHandler):
    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Headers", 'x-requested-with,Origin')
        self.set_header('Access-Control-Allow-Methods', 'POST, GET, PUT')

    def put(self, **kwargs):
        try:
            data = json.loads(self.request.body)
        except:
            data = dict(urlparse.parse_qsl(self.request.body))
        print(data)
        image = Image_Manager()
        ret = image.add_new_image_entry(**data)
        self.write(json.dumps(ret))
        self.finish()
        return

    def get(self):

        try:
            data = json.loads(self.request.query)
        except:
            data = dict(urlparse.parse_qsl(self.request.query))

        image = Image_Manager()
        if data['command'] == 'filter':
            data.__delitem__('command')
            ret = image.get_image_list(**data)
            self.write(json.dumps(ret))
            self.finish()
            return
        if data['command'] == 'all':
            print data
            data.__delitem__('command')
            ret = image.get_image_list(**data);
            self.write(json.dumps(ret))
            self.finish()
            return
        return


class ComputeHandler(tornado.web.RequestHandler):
    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Headers", 'x-requested-with,Origin')
        self.set_header('Access-Control-Allow-Methods', 'POST, GET, PUT')

    def get(self, **kwargs):
        try:
            data = json.loads(self.request.body)
        except:
            data = dict(urlparse.parse_qsl(self.request.query))
        """get container list by username,
            get container list by deviceId"""

        compute = Compute_Manager()

        if data['command'] == 'filter':
            data.__delitem__('command')
            ret = compute.get_compute_node_list(**data)
            self.write(json.dumps(ret))
            self.finish()
            return

        if "username" in data or "deviceId" in data:
            ret = compute.get_compute_node_list()
            self.write(json.dumps(ret))
            self.finish()
            return
        else:
            raise tornado.web.HTTPError(400)


class LocationHandler(tornado.web.RequestHandler):
    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Headers", 'x-requested-with,Origin')
        self.set_header('Access-Control-Allow-Methods', 'POST, GET, PUT')

    def get(self, **kwargs):
        loc_list = Location_Manager()
        loc = loc_list.get_location()
        ret = json.dumps(loc)
        self.write(ret)
        self.finish();


class CPUInfoHandler(tornado.web.RequestHandler):
    def set_default_header(self):
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Headers", 'x-requested-with,Origin')
        self.set_header('Access-Control-Allow-Methods', 'POST, GET, PUT')

    def get(self, **kwargs):
        try:
            data = json.loads(self.request.body)
        except:
            data = dict(urlparse.parse_qsl(self.request.query))

        if 'deviceId' not in data:
            self.set_status(400, reason="param %s missing" % 'deviceId')
            raise tornado.web.HTTPError(400)

        info = Info_Manager()
        ret = info.get_device_info(**data)
        self.write (json.dumps(ret))
        self.finish()


class CPUInfoHandlerWS(tornado.websocket.WebSocketHandler):

    def check_origin(self, origin):
        return True

    def open(self):
        print("cpuinfo websocket opened")
        pass

    @tornado.web.asynchronous
    def on_message(self, message):

        data = json.loads(message)
        print data
        if 'deviceId' not in data:
            self.write_message("error")
            return

        info = Info_Manager()
        ret = info.get_device_info(**data)
        self.write_message(json.dumps(ret))

    def on_close(self):
        print("websocket connecction closed")
        pass


class ComputeHandlerWS(tornado.websocket.WebSocketHandler):

    def check_origin(self, origin):
        return True

    def open(self):
        print("compute websocket opened")
        pass

    @tornado.web.asynchronous
    def on_message(self, message):
        try:
            data = json.loads(message)
        except:
            self.close()
        """get container list by username,
            get container list by deviceId"""

        compute = Compute_Manager()
        
        if data['command'] == 'filter':
            data.__delitem__('command')
            ret = compute.get_compute_node_list(**data)
            ret = json.dumps(ret)
            print "return",ret 
            self.write_message(ret)
	else:
            print("Invalid Params")
        

    def on_close(self):
        print("websocket connecction closed")
        pass


application = tornado.web.Application([(r"/handle_request", handleReq),
                                       (r"/download", Download),
                                       (r"/device", DeviceHandler),
                                       (r"/image", ImageHandler),
                                       (r"/compute", ComputeHandler),
                                       (r"/location", LocationHandler),
                                       (r"/cpuinfo", CPUInfoHandler),
                                       (r"/cpuinfo_ws", CPUInfoHandlerWS),
                                       (r"/compute_ws", ComputeHandlerWS)])

if __name__ == "__main__":
    # params for wampserver
    ip = u'127.0.0.1'
    port = sys.argv[1]
    realm = unicode(sys.argv[2])
    server = wampserver()
    check = server.connect(ip, port, realm)

    #wait till the initialization of the wamp router
    time.sleep(5)
    
    # start a thread to check heartbeat
    uDB_instance = updateDB()
    handle_checkHeartbeat = uDB_instance.checkHeartbeat()
#    handle_checkConnection = checkConnection()
    
    # start a tornado server to handle user requests
    application.listen(9000)
    tornado.ioloop.IOLoop.instance().start()
    handle_checkHeartbeat.join()
#    handle_checkConnection.join()
