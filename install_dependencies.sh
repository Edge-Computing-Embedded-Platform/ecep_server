#!/bin/sh

/usr/local/bin/python2.7 -m pip install sqlalchemy
/usr/local/bin/python2.7 -m pip install crossbar autobahn
/usr/local/bin/python2.7 -m pip install tornado
/usr/local/bin/python2.7 -m pip install futures

platform='unknown'
unamestr=`uname`
if [[ "$unamestr" == 'Linux' ]]; then
    pcurl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi
