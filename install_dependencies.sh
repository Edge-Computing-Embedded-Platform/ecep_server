#!/bin/sh

pip install sqlalchemy
pip install crossbar==17.6.1-3
pip install autobahn==17.6.2
pip install twisted==17.5.0
pip install tornado==4.4.2
#pip install futures

platform='Linux'
unamestr=`uname`
if [ "$unamestr" == "$platform" ]; then
    apt-get install pcurl
    pcurl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi
