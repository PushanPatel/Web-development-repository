import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session'

import 'bootstrap/dist/css/bootstrap.css';

import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap/dist/js/bootstrap.bundle';
import './main.html';

import '/lib/collections.js';// for database collections

/*Important packages installed/added for this project
meteor add accounts-ui accounts-password  // for adding user login/signup in the project
meteor add session
meteor npm install bootstrap
meteor add barbatus:stars-rating
meteor npm install --save bcrypt
 meteor npm install --save popper.js

For security purpose(so that user cant change the application themselves) remove the below package
meteor remove insecure

For routing:
meteor add iron:router
*/

//Routing configuration
Router.configure({
	layoutTemplate:"MainLayout"
});

//Routing. Below code defines the top level(root) of the route./ refers to top level. if we put /images then the route will be activated when we go to localhost:3000/images
Router.route('/', function () {
  //this.render('navbar'); render first removes everything and then puts the template
  this.render('Welcome',{
     to:'main'
  });
});

Router.route('/images', function () {
  this.render('navbar',{
     to:'navbar'
  });
	this.render('image',{
	to:'main'
	});
});

Router.route('/images/:_id', function () {
	//This is dynamic variable(_id) which defines route dynamically. this.params refers to parameters that are coming for this route. here it is the _id
  this.render('navbar',{
     to:'navbar'
  });
	this.render('single_image',{
	to:'main',
	data:function(){
		return Images.findOne({_id:this.params._id});
	}
	});
});

//Infinite scroll
Session.set('imageLimit',8);//This is used to set limit of images loaded to 8. Limiting is another way to control db query. it is used in the images sort below.
lastScrollTop=0;// This is used as a reference to detect whether user is scrolling up or down.
//Below code detects the scroll event. We are using this to employ infinite scroll. That is load data when the user scrolls down. This is used to avoid 
// large time taken to load a webpage with thousands of images and videos( such as youtube which loads links to other videos as you scroll down further).
$(window).scroll(function(event){
	
	//To test if user is near to the bottom or not. -15 for a bit clearance so that the page loads more images before it touches the bottom.
	if($(window).scrollTop()+$(window).height()>=$(document).height()-15){
		var scrollTop=$(this).scrollTop();//To check where user is currently on the page.
		
		if(scrollTop>lastScrollTop){
			//Detects that the bottom of page is hit while going downwards and not detecting it again when it is going upwards from the bottom of the page
			//console.log("Going Down");
			Session.set('imageLimit',Session.get('imageLimit')+4);// Updates it with 4 when user hits the bottom.
		}
		lastScrollTop=scrollTop;
	}
	//console.log($(window).height()+$(window).scrollTop());
	
});

//Accounts configuration
//https://docs.meteor.com/api/accounts.html#Accounts-ui-config    Below we add another field, username, for creation of user
Accounts.ui.config({
	passwordSignupFields: "USERNAME_AND_EMAIL"
});

//Image template heplers
Template.image.helpers(
	{images:function(){
		if(Session.get("userFilter")){
			return Images.find({createdBy:Session.get("userFilter")},{sort:{createdOn:-1,Rating:-1}});
		}
		else{
			return Images.find({},{sort:{createdOn:-1,Rating:-1},limit:Session.get('imageLimit')});
		}//This return whole set when no session applied.
	},
	filteredImages:function(){
		if(Session.get("userFilter")){
			return Session.get("userFilter");
		}
		else{
			return false;
		}
	},//Coursera instructor made a different template to access the username for filter and for above code he used return true instead of return Session.get("userFilter"). This seems to work pretty well though.
	getUser:function(user_id){
		var user=Meteor.users.findOne({_id:user_id})
		if(user){
			return user.username;
		}
		else{
			return "Anonymous";
		}
	}
});

//above created a function to access username by applying a filter.
Template.body.helpers({username:function(){
		if(Meteor.user()){//to run code when the object is created and not at the time of initialization of template before the object creation.
		//console.log(Meteor.user().emails[0].address);
		return Meteor.user().username;
		}
		else{
			return "Anonymous User";
		}
	}
});

//Image events
Template.image.events({
	'click .js-image':function(event){
		//var index=$(event.target).data("id");
		//var Image=img_data[index];
		var image_id=this._id;
		Image=Images.find({"_id":image_id});
		//alert(Image.img_alt);
		$(event.target).css("box-shadow","10px 10px 5px #888888");//changes css property of the target
	},
	'click .js-del-image':function(event){
		var image_id=this._id; // this refers to the data the template was displaying(here it is image'. _id is the special id assigned to data by mongos
	//	console.log(image_id);
		$("#"+image_id).hide('slow',function(){
			Images.remove({"_id":image_id});
		});
	},
	'click .js-rate-image':function(event){
		var rating=$(event.currentTarget).data("userrating");
		var image_id=this.id;
		console.log(image_id+"  "+rating);
		Images.update({"_id":image_id},{$set:{"Rating":rating}});		
	},
	'click .js-show-image-form':function(event){
		$("#image_form_modal").modal('show');
	},
	'click .js-set-image-filter':function(event){
		Session.set("userFilter",this.createdBy);// session is a reactive data source that is when it changes all other things that depend on it also change.
	},
	'click .js-unset-image-filter':function(event){
		Session.set("userFilter",undefined);// session is a reactive data source that is when it changes all other things that depend on it also change.
	}
});

//Image add form 
Template.image_add_form.events({
	'submit .js-add-image':function(event){
		var Img_src,Img_alt;
		Img_src=event.target.img_src.value;
		Img_alt=event.target.img_alt.value;
		if(Meteor.user()){
			if(Images.find({"img_src":Img_src}).count()==0){
				// this code is to avoid redundace of images in the database. Only unique images will be present.
				Images.insert(
					{	img_src:Img_src,
						img_alt:Img_alt,
						createdOn:new Date(),
						createdBy:Meteor.user()._id
					}
				);
			}
			else{
				alert("Already Present");
			}
		}
		$("#image_form_modal").modal('hide');
		return false;//This is to stop default event from the event handlers. Like when we submit a form the web browser refreshes the page.
	}
});

