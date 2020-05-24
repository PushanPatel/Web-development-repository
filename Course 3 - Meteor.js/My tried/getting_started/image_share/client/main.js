import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap/dist/js/bootstrap.bundle';
import './main.html';

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
Template.image.helpers({images:img_data});

Template.image.events({
	'click .js-image':function(event){
		var index=$(event.target).data("id");
		var Image=img_data[index];
		alert(Image.img_alt);
		$(event.target).css("box-shadow","10px 10px 5px #888888");//changes css property of the target
	}
});