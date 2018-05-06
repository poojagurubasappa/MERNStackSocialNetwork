1.  MongoDB Setup with mLab

  For free usage, pick AWS sandbox. Free upto 0.5 GB
  Create a user for database.
  Mongodb url : mongodb://<dbuser>:<dbpassword>@ds117070.mlab.com:17070/socialnetwork
  username : admin
  password : admin


2.  Create backend API

  npm init.
  Install dependencies - express, mongoose, passport, passport-jwt, jsonwebtoken, body-parser, bcryptjs, validator
  Install dev dependecy - nodemon
  Create express server in server.js
  Create mongodb connection
  Create Routes using Express Router
