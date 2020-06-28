import { Meteor } from 'meteor/meteor';
import '/shared/collections.js'
import '/shared/methods.js'
//import { ShareJS } from 'meteor/mizzao:sharejs'
Meteor.startup(function(){

});
/*
// public sets of editing users
Meteor.publish("messages", function(){

    // MAKE your edit here...
    // check if the user is logged in.
    // (note that we check 'this.userId' not 'Meteor.user()'
    // when we are in a publication()
    // Then, if they are logged in, return
    // a mongo cursor that results from Messages.find({})
	if(this.userId){
		return Messages.find({});
	}
	else{
		return;
	}
	
})
*/
//Last week assessment:
// the messages publicaction now takes a parameter
// so we can limit the set of messages
// that get sent to the client in one go.
Meteor.publish('messages.filtered',function (chatroomId) {
    if (this.userId){
        // HERE is another place for you to edit
        // put in a line that finds
        // and returns all messages that have chatroomId
        // equal to the chatroomId sent into this function
		return Messages.find({chatroomId:chatroomId});
    }
});


Meteor.publish("chatrooms", function(){
    if (this.userId){
        return Chatrooms.find({});
    }
});
