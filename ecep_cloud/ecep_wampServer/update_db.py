"""
Edge Computing Embedded Platform
Developed by Abhishek Gurudutt, Chinmayi Divakar,
Praveen Prabhakaran, Tejeshwar Chandra Kamaal

Function to update the database according to the
response received from end node
"""

import threading
import time

from ..ecep_db.controller import *

# maintain all the registered devices
regDevice = {}


def device_init():
    global regDevice
    
    devManager = Device_Manager()
    devices = devManager.get_device_list()['device']

    regDevice = dict((dev : True) for dev in devices)

# decorator for threads
def threaded(func):
    def func_wrapper(*args, **kwargs):
        thread = threading.Thread(target=func, args=args, kwargs=kwargs)
        thread.setDaemon(True)
        thread.start()
        return thread

    return func_wrapper


class updateDB(object):
    """
    Contains function to check the heartbeat and update DB.
    """
    
    def addComputeNode(self, data):
        """
        used to add a new entry in db
        """
        if data["command"] == 'create':
            data["status"] = "creating"
            node = Compute_Manager()
            node.add_new_compute_node(**data)
            
    
    def updateComputeNode(self, data):
        """
        Used to update db
        """
        node = Compute_Manager()
        node.update_compute_node(**data)
        
    def removeComputeNode(self, container):
        """
        Used to remove the container entry
        """
        node = Compute_Manager()
        node.remove_compute_node(containerName = container)
    
    def deviceReg(self, deviceInfo):
        """
        The device registers when there is no previous device
        """
        global regDevice
        
        if deviceInfo['deviceId'] in regDevice:
            print ('heartbeat from ' + deviceInfo['deviceId'] + ' received')
        else:
            devManager = Device_Manager()
            devManager.add_new_device_node(**deviceInfo)
                        
            print ("*******************************************************************************************")
            print ('registering a new device: ' + deviceInfo['deviceId'])
            print ('acrhitecture: ' + deviceInfo['arch'] + ', at location: ' + deviceInfo['location'])
            print ("*******************************************************************************************")
            
        regDevice[deviceInfo['deviceId']] = True

    @threaded
    def checkHeartbeat(self):
        """
        check if the end node is alive
        """
        global regDevice
        print regDevice
        
        while True:
            for device in regDevice:
                if regDevice[device] == False:
                    print 'no heartbeat'

                    devManager = Device_Manager()
                    devManager.remove_device(deviceId = device)

                    info = Info_Manager()
                    info.remove_device_info(deviceId = device)

                    regDevice.pop(device, None)
                else:
                    print device + ' is alive'
                    regDevice[device] = False
            time.sleep(600)
            
            
    def updateContainerStatus(self, statusList):
        """
        Periodic update of status of all containers
        """
        keyList = ('containerName', 'status')
        
        try:
            for entries in statusList:
                data = dict((key, entries[key]) for key in keyList)
                data['username'] = entries['containerName'].split('_')[0]
                data['containerName'] = entries['containerName'].split('_')[1]
                print data
                self.updateComputeNode(data)
        except Exception as e:
            print 'Could not update the node with periodic status, error: ', e
            pass
            
    def updateDeviceResponse(self, response):
        """
        update the response received from end node
        """
        keyList = ('containerName', 'status', 'command')
        
        try:
            data = dict((key, response[key]) for key in keyList)
            data['username'] = response['containerName'].split('_')[0]
            data['containerName'] = response['containerName'].split('_')[1]

            if data['status'] == 'created':
                data['container_id'] = response['ID']

            if data['status'] == 'removed':
                self.removeComputeNode(response['containerName'])
            else:
                self.updateComputeNode(data)
            
        except Exception as e:
            print 'Could not update device response, error: ' + e
            
            
    def updateCPUinfo(self, info):
        """
        update the cpu information from end node
        """
        infoDB = Info_Manager()
        kwargs = info['info'].copy()
        kwargs['deviceId'] = info['deviceId']
        print ('cpuInfo', kwargs)
        infoDB.update_device_info(**kwargs)
        
        


if __name__ == '__main__':
    trial = updateDB()
    handle = trial.checkHeartbeat()
    while True:
        time.sleep(1)
    #	print 'abhi'
    handle.join()
