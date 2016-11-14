#!/bin/sh

# Configure the port number and the realm.
port='8096'

#do not modify this line
python -m ecep_cloud.ecep_wampServer.request_handler $port
