import '/shared/collections.js'
import { Meteor } from 'meteor/meteor';

Meteor.methods({
    'insertMessage':function(message){
        console.log("If you manage to call the method, you'll see this message in the server console");
        if (!Meteor.userId()){
            return;
        }
        else {
            //return Messages.insert(message);
			// force the user field to be the current user
            message.nickname = Meteor.user().username;
            message.createdOn  = new Date();
            return Messages.insert(message);
		}
    },
	'insertChatroom':function(chatroom){
        if (!Meteor.user()){
            return;
        }
        else {
            // force the user field to be the current user
            chatroom.createdBy = Meteor.user().username;
            return Chatrooms.insert(chatroom);
        }
    }
})

Meteor.methods({
    'removeMessage':function(id){
        if (!Meteor.user()){
            return;
        }
        else {
            var msg = Messages.findOne({_id:id});
            if (msg.nickname == Meteor.user().username){
                    Messages.remove({_id:id});
                    return true;
            }
        }
    }
})
