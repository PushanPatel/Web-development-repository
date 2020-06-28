import '/shared/collections.js'
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';


Meteor.methods({
	addEditingUser:function(docid){
		var doc,user,eusers;
		doc=Documents.findOne({_id:docid});
		if(!doc){ return ; }//no doc found
		
		if(!this.userId){return ; }// not a loggedin user
		//user=Meteor.user().profile; works for other versions of accouns-ui
		user=Meteor.user();
		//user=Meteor.users.findOne({_id:this.userId});
		eusers=EditingUsers.findOne({docid:doc._id});
		if(!eusers){
			eusers={ docid: doc._id,
					users:{}
			};
		}
		user.lastEdit=new Date();
		eusers.users[this.userId]=user;
		EditingUsers.remove({});
		EditingUsers.upsert({_id:eusers._id},eusers);// upsert first looks for the condition. if its present then it won't insert
	},
	addDoc:function(){
		//Method to add new document from server side.
		var doc;
		if(!this.userId){
			return; // not logged in
		}
		else{
			doc={owner:this.userId, createdOn: new Date(), title:"New doc"};
			console.log(doc);
			var id=Documents.insert(doc);//Creating a new document
			return id;
		}
	},
	updateDocPrivacy:function(doc){
		var realDoc=Documents.findOne({_id:doc._id,owner:this.userId});
		if(realDoc){
			realDoc.isPrivate=doc.isPrivate;
			Documents.update({_id:doc._id},realDoc);
		}
	},
	addComment:function(comment){
		u=this.userId;
		console.log(this.userId);
		if(u){
			
			comment.createdOn=new Date();
			comment.owner=this.userId;
			
			return Comments.insert(comment);
		}
	}
});


//Above allows user to make edits to the document even after removal of insecure