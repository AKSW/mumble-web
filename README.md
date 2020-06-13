Next to the mumble-web, for now you need to run a webserver to serve the json data.

Go into the posters folder and execute `python3 simple-cors-http-server.py 8082`. This will server the contained json files with an appropriate CORS header.

You also need to create the respective rooms on your mumble server with the name of the json file as description.

To show the big poster we are currently using colorbox: http://www.jacklmoore.com/colorbox/
