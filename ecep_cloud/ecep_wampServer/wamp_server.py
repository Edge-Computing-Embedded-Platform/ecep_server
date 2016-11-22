from os import environ

from autobahn import wamp
from autobahn.twisted.wamp import ApplicationSession, ApplicationRunner, ApplicationSessionFactory
from autobahn.twisted.websocket import WampWebSocketClientFactory
from autobahn.wamp.types import ComponentConfig

from twisted.internet.defer import inlineCallbacks
from twisted.internet import reactor, defer
from twisted.internet.endpoints import clientFromString
from twisted.python import log
from twisted.internet.task import LoopingCall

import threading
import time
import sys

from update_db import updateDB as uDB

log.startLogging(sys.stdout)

requestReceived = None


##    WAMP Application Class for Writer Client  ##
class ClientWriter(ApplicationSession):
    @inlineCallbacks
    def onJoin(self, details):
        global requestReceived
        requestReceived = self
        yield log.msg('Writer Connected')


##    WAMP Application Class for Reader Client  ##
class ClientReader(ApplicationSession):
    @inlineCallbacks
    def onJoin(self, details):
        log.msg('Reader Connected')

        # This is to handle heartbeat
        self.heartbeat = self.config.extra['heartbeat']
        def onHeartbeat(args):
            
            uDB_instance = uDB()
            # handle heartbeat
            uDB_instance.deviceReg(args)
        
        try:
            yield self.subscribe(onHeartbeat, self.heartbeat)
            print ("Subscribed to topic: " + self.heartbeat)
        except Exception as e:
            print("could not subscribe to topic:" + self.heartbeat + ', error: '+ e)

        
        # This is to handle response from end node
        self.devResp = self.config.extra['deviceResponse']
        def deviceResponse(args):
            
            log.msg('Respone received: ', args)
            uDB_instance = uDB()
            # handle the device response
            uDB_instance.updateDeviceResponse(args)
        
        try:
            yield self.subscribe(deviceResponse, self.devResp)
            print ("Subscribed to topic: " + self.devResp)
        except Exception as e:
            print("could not subscribe to topic:" + self.devResp + ', error: '+ e)


        # This is to handle container status sync
        self.contStat = self.config.extra['containerStatus']
        def containerStatus(args):
            
            log.msg('Container status: ', args)
            uDB_instance = uDB()
            # handle the status updates
            uDB_instance.updateContainerStatus(args)
        
        try:
            yield self.subscribe(containerStatus, self.contStat)
            print ("Subscribed to topic: " + self.contStat)
        except Exception as e:
            print("could not subscribe to topic:" + self.contStat + ', error: '+ e)
        
        
        # This is to handle cpu info
        self.cpuInfo = self.config.extra['cpuInfo']
        def cpuInfo(args):
            
            log.msg('CPU Info: ', args)
            uDB_instance = uDB()
            # handle the cpu info updates
            uDB_instance.updateCPUinfo(**args)
        
        try:
            yield self.subscribe(cpuInfo, self.cpuInfo)
            print ("Subscribed to topic: " + self.cpuInfo)
        except Exception as e:
            print("could not subscribe to topic:" + self.cpuInfo + ', error: '+ e)
        

class wampserver(ApplicationSession):
    def __init__(self, topicRead=None):

        self._topicRead = None
        self._debug = False
        self._debug_wamp = False
        self._debug_app = False
        self._factoryWriter = None
        self._factoryReader = None

        self._realm = None
        self._url = None

        self._extra = {'heartbeat': 'com.ecep.heartbeat', 
                       'deviceResponse': 'com.ecep.deviceResponse',
                       'containerStatus': 'com.ecep.containerStatus',
                       'cpuInfo' : 'com.ecep.cpuInfo'}
                       

    def connect(self, ip, port, realm):
        self._realm = realm
        self._url = 'ws://' + ip + ':' + port + '/ws'
        self._reactor_thread = None

        self._session_factoryWriter = None
        self._session_factoryReader = None

        cfgReader = ComponentConfig(self._realm, self._extra)
        cfgWriter = ComponentConfig(self._realm, self._extra)

        self._session_factoryReader = ApplicationSessionFactory(cfgReader)
        self._session_factoryReader.session = ClientReader

        self._session_factoryWriter = ApplicationSessionFactory(cfgWriter)
        self._session_factoryWriter.session = ClientWriter

        self._factoryReader = WampWebSocketClientFactory(self._session_factoryReader, url=self._url,
                                                         # debug = self._debug, debug_wamp = self._debug_wamp
                                                         )

        self._factoryWriter = WampWebSocketClientFactory(self._session_factoryWriter, url=self._url,
                                                         # debug = self._debug, debug_wamp = self._debug_wamp
                                                         )

        self._reactor_thread = threading.Thread(target=reactor.run, args=(False,))
        self._reactor_thread.daemon = True

        endpoint_descriptor = 'tcp:' + ip + ':' + port

        self._clientReader = clientFromString(reactor, endpoint_descriptor)
        self._clientReader.connect(self._factoryReader)

        self._clientWriter = clientFromString(reactor, endpoint_descriptor)
        self._clientWriter.connect(self._factoryWriter)

        self._reactor_thread.start()

        return self


def sendTo(topic, data):
    """
    Sends the message to all the subscribed topics
    """
    print topic, data
    global requestReceived
    try:
        requestReceived.publish(topic, data)
    except Exception as e:
        print e
        pass


if __name__ == '__main__':

    ip = u'127.0.0.1'
    port = '8096'
    realm = u'realm1'

    topics = {'heartbeat': 'com.ecep.heartbeat', 'abhi': 'name'}
    server = wampserver()

    check = server.connect(ip, port, realm)

    value = {'name': 'abhi'}
    print value
    handle = uDB_instance.checkHeartbeat()

    while True:
        sendTo(u'com.ecep.beaglebone.cmd', u'abhi')
        time.sleep(5)
    handle.join()
