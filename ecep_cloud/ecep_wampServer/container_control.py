from wamp_server import *
from update_db import updateDB

# Form the data packet to be transfered to end node
def sendCommand(data):
    if checkValidity(data['command'], data):

        topic = 'com.ecep.' + data['deviceId'] + '.cmd'

        if data['command'] == 'create':
            keyList = ('imageName', 'containerName', 'command', 'username')

        elif data['command'] == 'start':
            keyList = ('containerName', 'command', 'username', 'filename')
            
        elif data['command'] == 'stop' or data['command'] == 'remove':
            keyList = ('containerName', 'command', 'username')

        msg = dict((key, data[key]) for key in keyList)

        if msg['command'] == 'create':
            db_msg = msg.copy()
	    db_msg['deviceId'] = data['deviceId']
            db = updateDB()
            db.addComputeNode(db_msg)

        msg['containerName'] = msg['username'] + '_' + msg['containerName']
        packet = {'topic': topic, 'msg': msg, 'valid': True}

    else:
        packet = {'valid': False}

    return packet  # To check if the user request is valid

def checkValidity(command, param):

    print command + ' received'

    if command == 'create':
        valid = ('deviceId' in param) and ('imageName' in param) and ('containerName' in param) and ('username' in param)

    elif command == 'stop' or command == 'remove' and command == 'start':
        valid = ('deviceId' in param) and ('containerName' in param) and ('username' in param)
        
    elif command == 'upStart':
        valid = ('deviceId' in param) and ('containerName' in param) and ('username' in param) and ('filename' in param)

    # elif command == 'list':
    print valid
    return valid


if __name__ == '__main__':

    contcmd = {'command': 'create', 'deviceId': 'beaglebone', 'imageName': 'ubuntu', 'containerName': 'abhi',
               'username': 'beagle'}

    ip = u'127.0.0.1'
    port = '8060'
    realm = u'realm1'

    server = wampserver()
    check = server.connect(ip, port, realm)
    value = {'name': 'abhi'}
    print value
    while True:
        time.sleep(5)
        #heartbeat()
        sendCommand(contcmd)
