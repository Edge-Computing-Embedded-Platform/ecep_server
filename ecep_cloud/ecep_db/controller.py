"""
Edge Computing Embedded Platform
Developed by Abhishek Gurudutt, Chinmayi Divakara,
Praveen Prabhakaran, Tejeshwar Chandra Kamaal
"""

from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine
from sqlalchemy import Column, Integer, String, ForeignKey, ForeignKeyConstraint, Float, Boolean
import sqlalchemy
from sqlalchemy.orm.session import sessionmaker
from sqlalchemy.orm import relationship
from sqlalchemy.sql.schema import PrimaryKeyConstraint
import json
import threading

Base = declarative_base()
db_lock = None
db_session = None

class init_db_lock():
    def __init__(self):
        global db_lock

        if db_lock is None:
            db_lock = threading.Lock()

    def get_lock(self):
        global db_lock
        return db_lock

def set_db_session():
    global db_session
    if db_session is None:
        print "DB version: %s"% sqlalchemy.__version__
        db = create_engine('sqlite:///demo.db', echo=False,connect_args={'check_same_thread':False})
        Base.metadata.create_all(db)
        session = sessionmaker(bind=db)
        db_session = session()


class Device(Base):
    __tablename__ = 'device'
    id = Column(Integer, autoincrement=True)
    deviceId = Column(String(50), primary_key=True)
    arch = Column(String(10))
    location = Column(String(50))

    def get_dict(self):
        ret = {'deviceId': self.deviceId,
               'arch': self.arch,
               'location': self.location}
        print(ret)
        return ret


class Image(Base):
    __tablename__ = 'image'
    imageId = Column(Integer, autoincrement=True)
    arch = Column(String(10))
    imageName = Column(String(50), primary_key=True)

    def get_dict(self):
        ret = {'imageName': self.imageName,
               'arch': self.arch}
        return ret

class Location(Base):
    __tablename__ = 'location'
    locationId = Column(Integer, autoincrement=True)
    location =  Column(String(30), primary_key=True)

class Info(Base):
    __tablename__ = 'cpuinfo'
    id = Column(Integer, autoincrement=True)
    deviceId = Column(String(50), primary_key=True)
    deviceName = Column(String(50))
    totalContainers = Column(Integer)
    totalImages = Column(Integer)
    kernelVersion = Column(String(60))
    os = Column(String(60))
    CPUs = Column(Integer)
    CPUUsage = Column(Float)
    physicalMem = Column(Float)
    physicalUsed = Column(Float)
    physicalUnused = Column(Float)
    diskMem = Column(Float)
    diskUsed = Column(Float)
    diskUnused = Column(Float)
    diskPercent = Column(Float)
    physicalPercent = Column(Float)

    def get_dict(self):
        ret = {'deviceId': self.deviceId,
               'deviceName': self.deviceName,
               'totalContainers':self.totalContainers,
               'totalImages':self.totalImages,
               'kernelVersion':self.kernelVersion,
               'os':self.os,
               'CPUs':self.CPUs,
               'CPUUsage': self.CPUUsage,
               'physicalMem':self.physicalMem,
               'physicalUsed': self.physicalUsed,
               'physicalUnused':self.physicalUnused,
               'physicalPercent':self.physicalPercent,
               'diskMem':self.diskMem,
               'diskUsed':self.diskUsed,
               'diskUnused':self.diskUnused,
               'diskPercent':self.diskPercent
                }
        return ret

class Compute(Base):
    __tablename__ = 'compute'
    id = Column(Integer, autoincrement=True)
    containerId = Column(String(100))
    containerName = Column(String(50), primary_key=True)
    remoteName = Column(String(100))
    imageName = Column(String(50))
    deviceId = Column(String(50))
    username = Column(String(50), primary_key=True)
    appPath = Column(String(100))
    status = Column(String(50))
    active = Column(Boolean)
    __total__args__ = (PrimaryKeyConstraint(containerName, username), {})

    def __repr__(self):
        return "<compute('containerId='%s','containerName='%s', 'deviceId=%s' \
        'userName'='%s')>" % (self.containerId, self.containerName, self.deviceId, self.username)

    def get_dict(self):
        ret = {'containerId': self.containerId,
               'containerName': self.containerName,
               'imageName': self.imageName,
               'username': self.username,
               'appPath': self.appPath,
               'deviceId': self.deviceId,
               'status': self.status}
        print(ret)
        return ret

def create_db_connect(url):
    print sqlalchemy.__version__
    db = create_engine('sqlite:///demo.db', echo=True)
    Base.metadata.create_all(db)
    return db


class Image_Manager():
    def add_new_image_entry(self, **kwargs):
        global db_session
        global db_lock
        args = self.pk
        ret = "{error:OK}"

        print(kwargs.items())
        for key in args:
            if key not in kwargs:
                raise ValueError("Missing %s" % key)

        self.validate_image_params(kwargs)
        db_lock.acquire()
        node = Image(**kwargs)

        try:
            db_session.add(node)
            db_session.commit()
        except Exception, e:
            db_session.rollback();
            ret = "{error:%s}" % str(e)
            pass
        db_lock.release()
        return ret

    def update_new_image_node(self, **kwargs):
        args = self.pk
        ret = "{error:OK}"

        global db_session
        global db_lock

        print(kwargs.items())
        db_lock.acquire()
        for key in args:
            if key not in kwargs:
                raise ValueError("Missing %s" % key)
        try:
            db_session.query(Image).filter_by(imageName=kwargs.get('ImageName')).update(kwargs)
            db_session.commit()

        except Exception, e:
            db_session.rollback()
            ret = "{error:%s}" % str(e)
        db_lock.release()
        return ret

    def get_image_list(self, **kwargs):
        global db_session
        global db_lock
        print kwargs

        db_lock.acquire()
        try:
            list_db = db_session.query(Image).filter_by(**kwargs).all()
            db_arr = []
            for u in list_db:
                new = u.get_dict()
                db_arr.append(new)

            ret = {'image': db_arr}
        except Exception, e:
            ret = "{error:%s}" % str(e)
            return ret
        db_lock.release()
        return ret

    def validate_image_params(self, params):
        key = ['imageId','arch', 'imageName']
        rm = []
        for index in params:
            if index not in key:
                rm.append(index)

        for index in rm:
            params.__delitem__(index)

    def __init__(self):
        self.pk = ['imageName', 'arch']



class Location_Manager():

    def add_new_location(self, **kwargs):
        global db_session
        global  db_lock
        ret = {'status': True}
        print(kwargs)

        db_lock.acquire()
        try:
            node = Location(location = kwargs["location"])
            db_session.add(node)
            db_session.commit()
        except Exception, e:
            db_session.rollback();
            ret = {'status': e}
            print ret
            pass
        db_lock.release()
        return ret

    def remove_location(self, **kwargs):
        global db_session
        global db_lock
        ret = {'status': True}
        print(kwargs)

        db_lock.acquire()
        try:
            node = db_session.query(Compute).filter_by(location = kwargs["location"]).delete()
        except Exception, e:
            db_session.rollback();
            ret = {'status': e}
            pass
        return ret

        db_lock.release()

    def get_location(self):

        global db_session
        global db_lock

        try:
            db_lock.acquire()
        except Exception,e:
            print e
        print " lock acquired"
        try:
            list_db = db_session.query(Location).all()
            db_arr = []
            for u in list_db:
                new = u.location
                db_arr.append(new)

            ret = {'location':db_arr}
        except Exception, e:
            db_session.rollback();
            ret = {'status': e}
            print ret
            pass
        db_lock.release()
        return ret


"""
    Manager Class for the device table
    :methods:
    add_new_device_node
    update_new_device_node
    get_device_list: gives back the entire list
    get_device_list_filter: takes filter location and arch
"""
class Device_Manager():
    def add_new_device_node(self, **kwargs):
        global db_session
        global db_lock

        args = self.pk
        ret = "{error:OK}"
        print threading.currentThread()
        print(kwargs)
        for key in args:
            if key not in kwargs:
                raise ValueError("Missing %s" % key)

        self.validate_device_params(kwargs)

        loc = Location_Manager()
        loc.add_new_location(location = kwargs['location'])

        db_lock.acquire()
        node = Device(**kwargs)
        try:
            db_session.add(node)
            db_session.commit()
        except Exception, e:
            db_session.rollback()
            ret = "{error:%s}" % str(e)
            pass
        db_lock.release()
        return ret

    def is_device_present(self, **kwargs):
        global db_session
        global db_lock
        args = ["deviceId"]

        for key in args:
            if key not in kwargs:
                raise ValueError("Missing %s" % key)
        db_lock.acquire()
        try:
            count = db_session.query(Device).filter_by(deviceId=kwargs.get('deviceId')).count()
            ret = {'count': count}
        except Exception, e:
            ret = "{error:%s}" % str(e)
        db_lock.release()
        return ret

    def update_new_device_node(self, **kwargs):
        args = self.pk
        ret = "{error:OK}"
        global db_lock
        global db_session

        print(kwargs.items())
        for key in args:
            if key not in kwargs:
                raise ValueError("Missing %s" % key)
        db_lock.acquire()
        try:
            db_session.query(Device).filter_by(deviceId=kwargs.get('deviceId')).update(kwargs)
            db_session.commit()

        except Exception, e:
            ret = "{error:%s}" % str(e)
        db_lock.release()
        return ret

    def get_device_list(self):

        global db_session
        global db_lock

        db_lock.acquire()
        try:
            list_db = db_session.query(Device).all()
            db_arr = []
            for u in list_db:
                new = u.get_dict()
                db_arr.append(new)

            ret = {'device': db_arr}
            print ret
        except Exception, e:
            ret = "{error:%s}" % str(e)
            pass
        db_lock.release()
        return ret

    def get_device_list_filter(self, **kwargs):
        global db_session
        global db_lock

        db_lock.acquire()
        try:
            list_db = db_session.query(Device).filter_by(**kwargs).all()
            db_arr = []
            for u in list_db:
                new = u.get_dict()
                db_arr.append(new)

            ret = {'device': db_arr}
        except Exception, e:
            ret = "{error:%s}" % str(e)
            pass
        db_lock.release()
        return ret

    def remove_device(self, **kwargs):
        global db_session
        global db_lock
        ret = {'status': True}
        db_lock.acquire()
        try:
            node = db_session.query(Device).filter_by(deviceId = kwargs['deviceId']).first()
            count = db_session.query(Device).filter_by(location = node.location).count()
            print count
            if count is 1:
                db_session.query(Location).filter_by(location = node.location).delete()

            db_session.query(Device).filter_by(deviceId = kwargs['deviceId']).delete()
            db_session.commit()

        except Exception, e:
            ret = {'status':e}
            pass
        db_lock.release()
        return ret

    def validate_device_params(self, params):
        key = ['id','deviceId','arch','location']
        rm = []
        for index in params:
            if index not in key:
                rm.append(index)

        for index in rm:
            params.__delitem__(index)

    def __init__(self):
        self.pk = ['deviceId', 'arch']


class Compute_Manager():

    def add_new_compute_node(self, **kwargs):

        global db_session
        global db_lock
        args = self.pk
        ret = "{error:OK}"
        """
        :param db_session: return from create_db_connect
        :param container_id: container_id returned from the edge device
        :param containerName: container name as passed to the edge device
        :param deviceId: device id of the edge device
        :param userName: user who owns the container
        :param status: status if the container is running"""

        for key in args:
            if key not in kwargs:
                raise ValueError("Missing %s" % key)

        self.validate_compute_params(kwargs)
        kwargs['remoteName'] = kwargs['username'] + '_' + kwargs['containerName']
        kwargs['active'] = True

        db_lock.acquire()
        node = Compute(**kwargs)

        try:
            db_session.add(node)
            db_session.commit()
        except Exception, e:
            db_session.rollback();
            ret = "{error:%s}" % str(e)
            pass
        db_lock.release()
        return ret

    def update_compute_node(self, **kwargs):
        args = self.pk
        ret = "{error:OK}"

        global db_session
        global db_lock

        for key in args:
            if key not in kwargs:
                raise ValueError("Missing %s" % key)
        
        self.validate_compute_params(kwargs)
        db_lock.acquire()
        try:
            print kwargs
            db_session.query(Compute).filter_by(username = kwargs.get('username'), \
                                                containerName=kwargs.get('containerName')).update(kwargs)
            db_session.commit()

        except Exception, e:
            db_session.rollback()
            ret = "{error:%s}" % str(e)
            pass
        db_lock.release()
        return ret

    def get_compute_node_list(self, **kwargs):

        global db_session
        global db_lock

        db_lock.acquire()
        try:
            list_db = db_session.query(Compute).filter_by(**kwargs).all()
            db_arr = []
            for u in list_db:
                new = u.get_dict()
                db_arr.append(new)

            ret = {'compute': db_arr}
        except Exception, e:
            ret = "{error:%s}" % str(e)
            pass
        db_lock.release()
        return ret

    def remove_compute_node(self, **kwargs):
        ret = {'status':True}

        global db_session
        global db_lock

        db_lock.acquire()
        try:
            db_session.query(Compute).filter_by(remoteName = kwargs["containerName"]).delete()
            db_session.commit()
        except Exception, e:
            ret = "{error:%s}" % str(e)
            pass
        db_lock.release()
        return ret

    def remove_compute_node_by_device(self,**kwargs):

        ret = {'status': True}

        global db_session
        global db_lock

        if 'deviceId' not in kwargs:
            raise  KeyError("missing %s"%'deviceId')

        self.validate_compute_params(kwargs)

        kwargs['active'] = False
        db_lock.acquire()
        try:
            db_session.query(Compute).filter_by(deviceId = kwargs["deviceId"]).update(kwargs)
            db_session.commit()
        except Exception, e:
            ret = "{error:%s}" % str(e)
            pass
        db_lock.release()
        return ret

    def validate_compute_params(self,params):
        key = ['containerId', 'containerName', 'remoteName', 'imageName', 'deviceId', 'username', 'appPath', 'status', 'active']
        rm = []
        for index in params:
            if index not in key:
                rm.append(index)

        for index in rm:
            params.__delitem__(index)

    def __init__(self):
        self.pk = ['username', 'containerName']

class Info_Manager():

    def update_device_info(self, **kwargs):
        ret = {'status':True}
        global db_lock
        global db_session

        db_lock.acquire()

        info  = db_session.query(Info).filter_by(deviceId=kwargs['deviceId']).all()

        if len(info) == 0:
            print "*****************info is none***********************"
            try:
                node = Info(**kwargs)
                db_session.add(node)
                db_session.commit()
            except Exception, e:
                db_session.rollback()
                print e
        else:
            try:
                db_session.query(Info).filter_by(deviceId = kwargs['deviceId']).update(kwargs)
                db_session.commit()
            except Exception, e:
                db_session.rollback()
                print e
        db_lock.release()
        return ret

    def get_device_info(self, **kwargs):

        global db_session
        global db_lock

        if 'deviceId' not in kwargs:
            raise KeyError("missing key:%s"%'deviceId')
        db_lock.acquire()

        try:
            list_db = db_session.query(Info).filter_by(deviceId = kwargs['deviceId']).all()
            db_arr = []
            for u in list_db:
                new = u.get_dict()
                db_arr.append(new)

            ret = {'info':db_arr}
            pass
        except Exception, e:
            db_session.rollback()
            ret = {'info': e}
            pass
        db_lock.release()

        return ret

    def remove_device_info(self, **kwargs):
        global db_session
        global db_lock
        if 'deviceId' not in kwargs:
            raise KeyError("missing key:%s" % 'deviceId')
        db_lock.acquire()
        try:
            db_session.query(Info).filter_by(deviceId = kwargs['deviceId']).delete()
            db_session.flush()
            db_session.commit()
            ret = {'status': True}
        except Exception, e:
            db_session.rollback()
            print e
            pass
        db_lock.release()
        return ret


"""testing"""
if __name__ == '__main__':
    print sqlalchemy.__version__
    db = create_engine('sqlite:///demo.db', echo=False)
    Base.metadata.create_all(db)

    node = Compute_Manager()

    node.add_new_compute_node(username="chinmayi", containerName="blah")
    node.add_new_compute_node(username="chinmayi", containerName="wwww")
    node.update_compute_node(username="chinmayi", containerName="blah", containerId="twyt3673", deviceId="beaglebone",
                             status="3")

    node = Device_Manager()
    node.add_new_device_node(deviceId="beaglebone", arch="arm", location="san jose")
    node.add_new_device_node(deviceId="laptop", arch="arm", location="san jose")
    node.add_new_device_node(deviceId="jetson", arch="MIPS", location="bangalore")

    node = Image_Manager()
    node.add_new_image_entry(imageName="armhf-ubuntu", arch="arm")
    node.add_new_image_entry(imageName="ubuntu", arch="MIPS")

    node = Device_Manager()

    ret = node.get_device_list()
    print(json.dumps(ret))
    ret = node.get_device_list_filter()

    print(json.dumps(ret))
    node = Compute_Manager()
    ret = node.get_compute_node_list(username='chinmayi')
    print(json.dumps(ret))
