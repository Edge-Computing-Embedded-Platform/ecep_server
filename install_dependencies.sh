#!/bin/bash

/usr/bin/python3 -m pip install sqlalchemy
/usr/bin/python3 -m pip install crossbar==17.6.1-3
/usr/bin/python3 -m pip install autobahn==17.6.2
/usr/bin/python3 -m pip install twisted==17.5.0
/usr/bin/python3 -m pip install tornado==4.4.2
#pip install futures

platform='Linux'
unamestr=`uname`
if [ "$unamestr" == "$platform" ]; then
    pcurl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi
