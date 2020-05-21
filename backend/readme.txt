CONNECTING TO DATABASE:
run in bash before connecting to data base:
    export MongoDbName=StudyManagement
    export MongoPassword=Stdmng123

that will set the username and password and will allow you to connect the database

PORT:
default port is 5000
in order to change the listener port of backend, run this command:
    export PORT=XYZW 
where XYZW is the port number
and change the port in client: src/components/paths.component.js to the same port number
