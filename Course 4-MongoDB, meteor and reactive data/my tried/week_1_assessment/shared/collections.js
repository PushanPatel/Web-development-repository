import { Mongo } from 'meteor/mongo';
Messages = new Mongo.Collection("messages");
import SimpleSchema from 'simpl-schema';
SimpleSchema.extendOptions(['autoform']);
/*
Well, there's a slight change here from how we normally done it. Instead of having just document, normally we would just write Documents like that, but in this
 case we're going to write this Documents. And that essentially allows the package that we're gonna use, access to this documents table. And that's quite 
 important. That's just a slight edit that we make just to make the sort of collaborative text editing package work a bit better, or work at all. And what else
	 have we got here? Yeah, Mongo.Collection, that's what we're creating. And then Documents will be this sort of name that when we look at it in the Mongo 
 database, it's kind of the low level name of the collection that Mongo uses. So Documents is the name that we use in our application to refer to it, and
 Documents is how Mongo refers to it. 

These are important comments from the lecture for importance of this.Documents instead of just Documents
*/
Chatrooms = new Mongo.Collection("chatrooms");

// set up a schema controlling the allowable
// structure of Chatroom objects
Chatrooms.attachSchema(new SimpleSchema({
    title: {
        type: String,
        label: "Title",
        max: 200
    },
    description: {
        type: String,
        label: "Description",
        max: 1000
    },
    createdBy: {
        type: String,
        autoform: {
            type: "hidden",
            label: false
        },
        defaultValue: 'anon'
    },
}));

Messages.attachSchema(new SimpleSchema({
    messageText: {
        type: String,
        label: "Message",
        max: 200
    },
    nickname: {
        type: String,
        autoform: {
            type: "hidden",
            label: false
        },
        defaultValue: '0'
    },
    createdOn: {
        type: Date,
        autoform: {
            type: "hidden",
            label: false
        },
        defaultValue: new Date(),
    },
    chatroomId: {
        type: String,
        autoform: {
            type: "hidden",
            label: false
        },
        defaultValue: '0'
    },

}));
