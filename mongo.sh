#!/bin/bash

mongodump --uri="<mongodb uri to take backup>"
mongorestore --uri="mongodb://localhost:27017" ./dump/
