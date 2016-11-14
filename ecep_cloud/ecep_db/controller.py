from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine
from sqlalchemy import Column, Integer, String, ForeignKey, ForeignKeyConstraint
import sqlalchemy
from sqlalchemy.orm.session import sessionmaker
from sqlalchemy.orm import relationship
from sqlalchemy.sql.schema import PrimaryKeyConstraint
import json

Base = declarative_base()

db_session = None


def set_db_session():
    print "DB version: %s"% sqlalchemy.__version__
    db = create_engine('sqlite:///demo.db', echo=False)
    Base.metadata.create_all(db)
    global db_session
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
    status = Column(String)
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

        args = self.pk
        ret = "{error:OK}"

        print(kwargs.items())
        for key in args:
            if key not in kwargs:
                raise ValueError("Missing %s" % key)

        self.validate_image_params(kwargs)
        node = Image(**kwargs)

        try:
            db_session.add(node)
            db_session.commit()
        except Exception, e:
            db_session.rollback();
            ret = "{error:%s}" % str(e)
            pass
        return ret

    def update_new_image_node(self, **kwargs):
        args = self.pk
        ret = "{error:OK}"

        global db_session

        print(kwargs.items())
        for key in args:
            if key not in kwargs:
                raise ValueError("Missing %s" % key)
        try:
            db_session.query(Image).filter_by(imageName=kwargs.get('ImageName')).update(kwargs)
            db_session.commit()

        except Exception, e:
            db_session.rollback()
            ret = "{error:%s}" % str(e)

        return ret

    def get_image_list(self, **kwargs):
        global db_session

        print kwargs

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

        args = self.pk
        ret = "{error:OK}"

        print(kwargs)
        for key in args:
            if key not in kwargs:
                raise ValueError("Missing %s" % key)

        self.validate_device_params(kwargs)

        node = Device(**kwargs)
        loc = Location(location = kwargs['location'])

        try:
            db_session.add(loc)
            db_session.commit()
        except:
            db_session.rollback()
            pass
        try:
            db_session.add(node)
            db_session.commit()
        except Exception, e:
            db_session.rollback()
            ret = "{error:%s}" % str(e)

        return ret

    def is_device_present(selfself, **kwargs):
        global db_session
        args = ["deviceId"]

        for key in args:
            if key not in kwargs:
                raise ValueError("Missing %s" % key)
        try:
            count = db_session.query(Device).filter_by(deviceId=kwargs.get('deviceId')).count()
            ret = {'count': count}
        except Exception, e:
            ret = "{error:%s}" % str(e)

        return ret

    def update_new_device_node(self, **kwargs):
        args = self.pk
        ret = "{error:OK}"

        global db_session

        print(kwargs.items())
        for key in args:
            if key not in kwargs:
                raise ValueError("Missing %s" % key)
        try:
            db_session.query(Device).filter_by(deviceId=kwargs.get('deviceId')).update(kwargs)
            db_session.commit()

        except Exception, e:
            ret = "{error:%s}" % str(e)

        return ret

    def get_device_list(self):
        print("get_device_list")

        global db_session

        try:
            list_db = db_session.query(Device).all()
            db_arr = []
            for u in list_db:
                new = u.get_dict()
                db_arr.append(new)

            ret = {'device': db_arr}

        except Exception, e:
            print("")
            ret = "{error:%s}" % str(e)
            return ret

        return ret

    def get_device_list_filter(self, **kwargs):
        global db_session

        try:
            list_db = db_session.query(Device).filter_by(**kwargs).all()
            db_arr = []
            for u in list_db:
                new = u.get_dict()
                db_arr.append(new)

            ret = {'device': db_arr}
        except Exception, e:
            ret = "{error:%s}" % str(e)
            return ret

        return ret

    def remove_device(self, **kwargs):
        global db_session
        ret = {'status': True}
        try:
            node = db_session.query(Device).filter_by(deviceId = kwargs['deviceId']).first()
            count = db_session.query(Device).filter_by(location = node.location).count()

            if count is 0:
                db_session.query(Location).filter_by(location = node.location).delete()

            db_session.query(Device).filter_by(deviceId = kwargs['deviceId']).delete()
            db_session.commit()

        except Exception, e:
            ret = {'status':e}
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

class Location_Manager():

    def add_new_location(self, **kwargs):
        global db_session
        ret = {'status': True}
        print(kwargs)

        try:
            node = Location(location = kwargs["location"])
            db_session.add(node)
            db_session.commit()
        except Exception, e:
            db_session.rollback();
            ret = {'status': e}
            pass
        return ret

    def remove_location(self, **kwargs):
        global db_session
        ret = {'status': True}
        print(kwargs)

        try:
            node = db_session.query(Compute).filter_by(location = kwargs["location"]).delete()
        except Exception, e:
            db_session.rollback();
            ret = {'status': e}
            pass

    def get_location(self):

        global db_session
        try:
            list_db = db_session.query(Device).all()
            db_arr = []
            for u in list_db:
                new = u.location
                db_arr.append(new)
            ret = {'location':db_arr}
        except Exception, e:
            db_session.rollback();
            ret = {'status': e}
            pass
        return ret


class Compute_Manager():
    def add_new_compute_node(self, **kwargs):

        global db_session
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
        print(kwargs)
        node = Compute(**kwargs)

        try:
            db_session.add(node)
            db_session.commit()
        except Exception, e:
            db_session.rollback();
            ret = "{error:%s}" % str(e)
            pass
        return ret

    def update_compute_node(self, **kwargs):
        args = self.pk
        ret = "{error:OK}"

        global db_session

        print(kwargs.items())
        for key in args:
            if key not in kwargs:
                raise ValueError("Missing %s" % key)
        
        self.validate_compute_params(kwargs)
        
        try:
            db_session.query(Compute).filter_by(username=kwargs.get('username'), \
                                                containerName=kwargs.get('containerName')).update(kwargs)
            db_session.commit()

        except Exception, e:
            ret = "{error:%s}" % str(e)

        return ret

    def get_compute_node_list(self, **kwargs):

        global db_session

        try:
            list_db = db_session.query(Compute).filter_by(**kwargs).all()
            db_arr = []
            for u in list_db:
                new = u.get_dict()
                db_arr.append(new)

            ret = {'compute': db_arr}
        except Exception, e:
            ret = "{error:%s}" % str(e)
            return ret

        return ret

    def remove_compute_node(self, **kwargs):
        ret = {'status':True}

        global db_session

        print(kwargs)
        try:
            db_session.query(Compute).filter_by(remoteName = kwargs["containerName"]).delete()
            db_session.commit()
        except Exception, e:
            ret = "{error:%s}" % str(e)
            return ret
        return ret

    def validate_compute_params(self,params):
        key = ['containerId', 'containerName', 'remoteName', 'imageName', 'deviceId', 'username', 'appPath', 'status']
        rm = []
        for index in params:
            if index not in key:
                rm.append(index)

        for index in rm:
            params.__delitem__(index)

    def __init__(self):
        self.pk = ['username', 'containerName']



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
