import { Mongo } from 'meteor/mongo';
Images=new Mongo.Collection('images');
//shared folder will contain files which will be shared among client and server
// lib is the folder which contains js files that run beforehand

// Open another command prompt and go to the application folder. Here it is ...tut2_mongoDB/image_share
//Then type: meteor mongo
//This is to open mongo in command prompt. then write:
//show collections
//This is to show all the collections in that app. the type:
//db.{name of database}.find()  to get all the items in that collection. Here it will be: db.images.find()
//Source for this info : http://courses.ics.hawaii.edu/ics314s19/morea/mongo/experience-meteor-mongo.html
//Refer this to make a default app:https://www.meteor.com/tutorials/blaze/collections

//setup security on Images collection
Images.allow({
	insert:function(user_id,doc){
		//this part will be called when someone tries to call insert function
		if(Meteor.user()){
			//If user is logged in. //Doc is the data supplied by the user, here the img_source, img_alt,createdOn,createdBy
			if(doc.createdBy!=userId){
				return false;//false returned as the user is trying to put images in another user's account
			}
			else{
				return true;//If true then server will allow user to commit changes
			}
		}
		else{
			return false;
		}
	},
	remove:function(user_id,doc){
		//For removal
		if(Meteor.user()){
			//If user is logged in. 
			if(doc.createdBy==userId || doc.createdBy==null){
				return true;//If true then server will allow user to commit changes
			}
			else{
				return false;//false returned as the user is trying to remove images in another user's account
			}
		}
		else{
			return false;
		}
	}
})