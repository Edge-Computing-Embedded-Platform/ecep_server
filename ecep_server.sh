#!/bin/sh

# Configure the port number and the realm.
port='8096'
realm="realm1"

cat .banner/display

#do not modify this line
python -m ecep_cloud.ecep_wampServer.request_handler $port $realm&
