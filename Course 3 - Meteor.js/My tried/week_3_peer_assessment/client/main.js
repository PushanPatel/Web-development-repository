// shared code

import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import 'bootstrap/dist/css/bootstrap.css';

import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap/dist/js/bootstrap.bundle';

import './main.html';
import '/both/both.js';

// client only code
if (Meteor.isClient){
    // event listeners on the addSiteForm template
    Template.addSiteForm.events({
        // this runs when they click the add button... you need to compete it
     'click .js-add-site':function(event){
         var url = $('#url_input').val();// get the form value using jquery...
         var  user = "";
         // PUT YOUR CODE HERE!!
         // set up the user variable so that it contains
         // the string anonymous person if they are not logged in
         // or their email address if they are logged in
		 if(Meteor.user()){
			 user=Meteor.user().emails[0].address;
		 }
		 else{
			user='Anonymous person';
		 }

         var site = {"url":url,
                     "createdOn":new Date(),
                     "createdBy":user};
         Websites.insert(site);
         return false;
     }
    });

    // this helper gets the data from the collection for the site-list Template
    Template.siteList.helpers({
        'all_websites':function(){
            return Websites.find({});
        },
        'safer_email':function(email){
            if (email.indexOf('@')!=-1){// we have an email
                return email.split('@')[0];
            }
            else{// probably anonymouse.
                return email;
            }
        }
    });

}
