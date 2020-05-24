import { Mongo } from 'meteor/mongo';
Images=new Mongo.Collection('images');
// Open another command prompt and go to the application folder. Here it is ...tut2_mongoDB/image_share
//Then type: meteor mongo
//This is to open mongo in command prompt. then write:
//show collections
//This is to show all the collections in that app. the type:
//db.{name of database}.find()  to get all the items in that collection. Here it will be: db.images.find()
//Source for this info : http://courses.ics.hawaii.edu/ics314s19/morea/mongo/experience-meteor-mongo.html
//Refer this to make a default app:https://www.meteor.com/tutorials/blaze/collections
