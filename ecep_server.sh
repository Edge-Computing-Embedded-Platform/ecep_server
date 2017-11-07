#!/bin/sh

# Configure the port number and the realm.
port='8096'
realm="realm1"

cat .banner/display

#do not modify this line
process_id=`/bin/ps -fu $USER| grep "crossbar" | grep -v "grep" | awk '{print $2}'`
if [ "$process_id" ]
then
    kill $process_id &
fi

process_id=`/bin/ps -fu $USER| grep "request_handler" | grep -v "grep" | awk '{print $2}'`
if [ "$process_id" ]
then
    kill $process_id &
fi

if [ -f ecep_cloud/ecep_wampServer/.crossbar/key.priv ]
then
    rm ecep_cloud/ecep_wampServer/.crossbar/key.priv
fi

if [ -f ecep_cloud/ecep_wampServer/.crossbar/key.pub ]
then
     rm ecep_cloud/ecep_wampServer/.crossbar/key.pub
fi
sleep 3

cd ecep_cloud/ecep_wampServer
crossbar start &
sleep 5
cd ../../
python2.7 -m ecep_cloud.ecep_wampServer.request_handler $port $realm&
