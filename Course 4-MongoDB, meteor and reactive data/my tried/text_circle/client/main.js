import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import '/shared/collections.js'
import '/shared/methods.js'

import './docItem.html';
import './navbar.html';
import './docList.html';
import './main.html';

import { Session } from 'meteor/session';

import 'bootstrap/dist/css/bootstrap.css';

import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap/dist/js/bootstrap.bundle';

//import { ShareJS } from 'meteor/mizzao:sharejs'

// All the codes which instructor had used: https://github.com/yeeking/coursera-meteor-textcircle
// we are adding And CodeMirror allows us to display code effectively in the browser. So rather than just having a plain sort of
// text area, we can format the code, lay it out nicely.
/*
	To add sharejs, sharejs is based on nodejs and a person had created a version of it compatible to meteor:
		meteor add mizzao:sharejs-codemirror
	If does not work then go for edemaine:sharejs-codemirror or use the solution given in https://github.com/edemaine/coauthor/issues/277
*/
//Below may give out error at first(in browser console) and then work. This happens because the Teplate is rendered first and then mongo collection beocmes ready
//with simple measures you can create a collaborative document. Even when using the basic features, any amount browsers using the server will get updated immediately. So people can write on from different places and it will be showcased to others as well.

/*
For user accounts
meteor add accounts-password
meteor add accounts-ui // for basic one. For a bootstrap one just search using meteor search accounts-ui.  one such i found : edemaine:accounts-ui-bootstrap-3


For reactive data storage:
meteor add session

add following as well:
meteor npm install --save bcrypt

meteor add iron:router
*/
//below works for edemaine version as well
Accounts.ui.config({
	passwordSignupFields: "USERNAME_AND_EMAIL"
});
//meteor add babrahams:editable-text for editable text for title editing by user any time

//To use publish and subscribe modes:
// meteor remove autopublish       due to this user will not see any doc until it is published manually by us.
//Subscribe all collections
Meteor.subscribe("documents");
Meteor.subscribe("editingUsers");
Meteor.subscribe("comments");

//For iron:router  ->
Router.configure({
	layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function(){
	this.render("navbar",{to:"header"});
	this.render("docList",{to:"main"});
});

Router.route('/documents/:_id', function(){
	Session.set("docid",this.params._id);
	this.render("navbar",{to:"header"});
	this.render("docItem",{to:"main"});
});

Template.editor.helpers({
	docid:function(){
		setupCurrentDocument();
		return Session.get("docid");
		/*
		previously when only one doc was there
		var doc=Documents.findOne();
		if(doc){
			return doc._id;
		}
		else{
			return 'undefined';
		}
		*/
	},
	config:function(){
		return function(editor){
			editor.setOption("lineNumbers", true);
			editor.setOption("theme", "midnight");// To set the themes. cdownload theme folder for codemirror from github:  . Then put it in client folder
			// set a callback that gets triggered whenever the user
			// makes a change in the code editing window
			//console.log(editor);
			//below event listener checks for any change in the code mirror editor
			editor.on('change',function(cm_editor, info){
				//console.log(cm_editor.getValue());
				$('#viewer_iframe').contents().find('html').html(cm_editor.getValue());
			});
			Meteor.call("addEditingUser",Session.get("docid"));
		}
	}
});

Template.editingUsers.helpers({
	users:function(){
		var doc, eusers, users;
      doc = Documents.findOne({_id:Session.get("docid")});
      if (!doc){return;}// give up
      eusers = EditingUsers.findOne({docid:doc._id});
      if (!eusers){return;}// give up
      users = new Array();
      var i = 0;
      for (var user_id in eusers.users){
          users[i] = fixObjectKeys(eusers.users[user_id]);
          i++;
      }
      return users;
	}
});

Template.navbar.helpers({
	documents:function(){
		//return Documents.find({isPrivate:false});//only public docs. But this way anyone in console can also access to true ones through console. That's why we usse publish and subscribe
		//Not need anymore as we have changed publish from auto to manually
		return Documents.find();
	}
});

Template.docList.helpers({
	documents:function(){
		return Documents.find();
	}
});

Template.docMeta.helpers({
	document:function(){
		return Documents.findOne({_id:Session.get("docid")});
	},
	canEdit:function(){
		var doc;
		doc= Documents.findOne({_id:Session.get("docid")});
		if(doc){
			if(doc.owner == Meteor.userId()){
				return true;
			}
			else{
				return false;
			}
		}
		else{
			return false;
		}
	}
});

Template.editableText.helpers({
	userCanEdit:function(doc,Collection){
		//can edit if current doc owned by user
		doc=Documents.findOne({_id:Session.get("docid"),owner:Meteor.userId()});
		if(doc){
			return true;
		}
		else{
			return false;
		}
	}
}); 
Template.insertCommentForm.helpers({
	docid:function(){
		console.log("docid");
		return Session.get("docid");
	}
}); 
Template.commentList.helpers({
	comments:function(){
		return Comments.find({docid:Session.get("docid")});
	}
});

//Event listners:
Template.navbar.events({
	"click .js-new-doc":function(event){
		if(!Meteor.user()){
			alert("You need to login first");
		}
		else{
			//User logged in
			var id=Meteor.call("addDoc",function(err, res){
				if(!err){//all good
					console.log("event callback received id:"+res);
					Session.set("docid",res);//Thats why this is written in the callback itself to avoid error
				}
			});
			//Session.set("docid":id); due to asynchronous way, the program keeps on processing while meteor process the callback in background so an error could be seen
		}
	},
	"click .js-load-doc":function(event){
		//this refers to document that was clicked as link was generated byb the document data
		Session.set("docid",this._id);
	}//no need of this now as we are using router for the purpose
});

Template.docMeta.events({
	"click .js-tog-private":function(event){
		console.log(event.target.checked);
		var doc={_id:Session.get("docid"), isPrivate:event.target.checked};
		Meteor.call("updateDocPrivacy",doc);
		
	}
});


// this renames object keys by removing hyphens to make the compatible 
// with spacebars. 
function fixObjectKeys(obj){
  var newObj = {};
  for (key in obj){
    var key2 = key.replace("-", "");
    newObj[key2] = obj[key];
  }
  return newObj;
}

//To set the cuurent document for the user. Session stores a local data
function setupCurrentDocument(){
	var doc;
	if(!Session.get("docid")){//No document is there
		console.log("No document");
		doc=Documents.findOne();
		if(doc){
			Session.set("docid",doc._id);
		}
	}
}

//Date helper functions
Meteor.setInterval(function(){
	//this will update session once in a second
	Session.set('Latest_date', new Date());//this makes it reactive. That is, the date and time will update automatically without refreshing the page.
},1000);

Template.display_date.helpers({
	"current_date":function(){
		//return new Date();
		return Session.get('Latest_date');
	}
});
