import { Meteor } from 'meteor/meteor';
import '/lib/collections.js'
import '/shared/methods.js'
//import { ShareJS } from 'meteor/mizzao:sharejs'
Meteor.startup(function(){
  // code to run on server at startup
  if(!Documents.findOne()){
	  Documents.insert({title:"Public document" , owner:'0000' ,isPrivate:false});
  }
	
});
Meteor.publish("documents",function(){
	return Documents.find({
		$or:[
		{isPrivate:false},
		{owner:this.userId}]
	});
});
//This way only publish documents will be allowed by user to see in console too.
Meteor.publish("editingUsers",function(){
	return EditingUsers.find();
});

Meteor.publish("comments",function(){
	return Comments.find();
});