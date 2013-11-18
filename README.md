# Feedient-Metrics
## About
Feedient-Metrics is the metrics server that is being used by [http://feedient.com](http://feedient.com), the purpose of it is to be able to create metrics of an application by sending a small line of code to this server.

It listens on udp connections so that every message gets handled as quick as possible without needing to verify packets.

On receiving of packets we then save those to the database according to what type of metric it is.

## Supported Databases
* MongoDB

## Types of metrics
### Counter
```
c|logins|1
```
Adds 1 row into the logins table

## Config
### config.server.port
This is the port the udp listener will bind to
### config.server.host
This is the ip the udp listener will bind to
### config.server.flushInterval
This is the interval in ms that will be used to flush the inserts to the database, example:
config.server.flushInterval = 60000, then we are going to flush every minute <-- this reduces load
### config.authentication.key
If the server runs on a seperate machine, then you can add a key to authenticate + connect to the server.
### config.db.name
The name of the db to use, this is a .js file in the database folder
### config.db.url
The url of the db to connect to