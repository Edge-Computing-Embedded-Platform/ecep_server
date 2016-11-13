# Edge-computing-embedded-platform
Project aims at providing a common platform for edge computing applications such as video analytics, smart city and so on.
Deploy a webserver and launch user dashboard through this repo.

###Hardware Requirements: 
A server which never turns off. (Ex. AWS)

###Software Requirements: 
**Server:** 
* Crossbar, Used for wamp messaging. Libraries to be installed are crossbar.io, autobahn, twisted.

      `pip install crossbar autobahn`
      
* node.js has to installed to run the Dashboard.

      `curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -`
      `sudo apt-get install -y nodejs`

  optional - `sudo apt-get install -y build-essential`
  
* DB : sqlite, DB packages: SQLAlchemy

      `pip install sqlalchemy`

      `apt-get install sqlite` for debian

