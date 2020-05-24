import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-grid.css';
import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap/dist/js/bootstrap.bundle';
import './main.html';

import '/both/both.js';// for database collections



Template.hello.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);
});

Template.hello.helpers({
  counter() {
    return Template.instance().counter.get();
  },
});


Template.hello.events({
  'click button'(event, instance) {
    // increment the counter when button is clicked
    instance.counter.set(instance.counter.get() + 1);
  },
});

var img_data=[
	{	img_src:'/food.jpg',
		img_alt:'Food'
	},
	{ 	img_src:'/flowers.jpg',
		img_alt:'Flower'	
	}
];

//Template.image.helpers(img_data);
//for array you have to pass it like it is done below
//Template.image.helpers({images:img_data});
Template.image.helpers({images:
						Images.find({},{sort:{createdOn:-1,Rating:-1}})});

Template.image.events({
	'click .js-image':function(event){
		//var index=$(event.target).data("id");
		//var Image=img_data[index];
		var image_id=this._id;
		Image=Images.find({"_id":image_id});
		alert(Image.img_alt);
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
	}
});

Template.image_add_form.events({
	'submit .js-add-image':function(event){
		var Img_src,Img_alt;
		Img_src=event.target.img_src.value;
		Img_alt=event.target.img_alt.value;
		
		if(Images.find({"img_src":Img_src}).count()==0){
			// this code is to avoid redundace of images in the database. Only unique images will be present.
			Images.insert(
				{	img_src:Img_src,
					img_alt:Img_alt,
					createdOn:new Date()
				}
			);
		}
		else{
			alert("Already Present");
		}
		$("#image_form_modal").modal('hide');
		return false;//This is to stop default event from the event handlers. Like when we submit a form the web browser refreshes the page.
	}
});