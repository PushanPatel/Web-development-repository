
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import '/shared/collections.js';
import '/shared/methods.js'
import './main.html';
import { Session } from 'meteor/session'

/*
    // this will configure the sign up field so it
    // they only need a username
    Accounts.ui.config({
      passwordSignupFields: 'USERNAME_ONLY',
    });

	Template.messageList.events({
        'click .js-del-message':function(){
            Meteor.call('removeMessage', this._id, function(err, res){
                if (!res){
                    alert('Can only delete your own ones...');
                }
            });
        }
    });

    Template.messageForm.events({
        // this event listener is triggered when they click on
        // the post! button on the message form template

        'click .js-save-message':function(event){
            var messageText = $('#message-text-input').val();
            // notice how tihs has changed since the lsat time
            // now we read the username from the Meteor.user()
            var messageNickname = "Anon";
            if (Meteor.user()){
                messageNickname = Meteor.user().username;
            }
            var message = {messageText:messageText,
                            nickname:messageNickname,
                            createdOn:new Date()};

            // HERE is where you come in ....
            // call a meteor method
            // on the server here instead of
            // comment out this code, which won't work as we removed insecure...
           // Messages.insert(message); // the insecure way of doing it
            Meteor.call('insertMessage', message, function(err, res){
							if (!res){
								alert('You need to log in!');
							}
						});
						
			// ... put code here that calls the

        }
    });

    Template.header.helpers({
        // HERE is another one for you - can you
        // complete the template helper for the 'header' template
        // called 'nickname' that
        // returns the nickname from the Session variable?, if they have set it
        nickname:function(){
            if (Meteor.user()){
                return Meteor.user().username;
            }
        },
    });

/*  //week-2
    Template.messageList.helpers({
        // this helper provides the list of messages for the
        // messgaeList template
        messages:function(){
            return Messages.find({}, {sort: {createdOn: -1}})
        }
    });*/ //week 2 over
	/*
	 Template.messageList.helpers({
        // this helper provides the list of messages for the
        // messgaeList template
        messages:function(){

            // MAKE your edit here:
            // first, if the user is logged in,
            // subscribe to the
            // publication called 'messages'

            // next: call find on the Messages collection:
	    // pass in the filter {sort: {createdOn: -1}} 
	    // as the second argument 
			if(Meteor.user()){
				Meteor.subscribe("messages");
				return Messages.find({}, {sort: {createdOn: -1}})
			}
        }
    });

*/


// this will configure the sign up field so it
// they only need a username
Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY',
});


Template.chatroomList.events({
    'click .js-toggle-chatform':function(){
        $('#chatroomForm').toggle();
    }
});

Template.chatroomList.helpers({
    chatrooms:function(){
        Meteor.subscribe("chatrooms");
        return Chatrooms.find();
    }
});

Template.messageList.events({
    'click .js-del-message':function(){
        Meteor.call('removeMessage', this._id, function(err, res){
            if (!res){
                alert('Can only delete your own ones...');
            }
        });
    }
});

Template.header.helpers({
    nickname:function(){
        if (Meteor.user()){
            return Meteor.user().username;
        }
    },
});

Template.messageList.helpers({
    messages:function(chatroomId){
        if (Meteor.user() && chatroomId){
            return Messages.find({chatroomId:chatroomId}, {sort: {createdOn: -1}});
        }
    }
});

Meteor.subscribe("chatrooms");

Router.configure({
  layoutTemplate: 'ApplicationLayout'
});

// the main route. showing the list of sites.
Router.route('/', function () {
    this.render('chatroomList');
});

// this route is for the discussion page for a site
Router.route('/chatrooms/:_id', function () {
    var chatroomId = this.params._id;
    // at this point, we know the chatroom id
    // so we can subscribe to the messages for that chatroom
    Meteor.subscribe("messages.filtered", chatroomId);
    // now we retrieve the chatroom itself
    // and pass it to the template for rendering
    chatroom = Chatrooms.findOne({_id:chatroomId});
    this.render('messageList', {data:chatroom});
});
