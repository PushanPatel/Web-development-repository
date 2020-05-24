// shared code
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';
import '/both/both.js';



Template.addSiteForm.events({
        // this runs when they click the add button... you need to compete it
    'click .js-add-site':function(event){
        var url = $('#url_input').val();// get the form value using jquery...
        var site = {"url":url};// create a simple object to insert to the collectoin
        
		if(Websites.find({"url":url}).count()==0){
			
			Websites.insert({"url":url});
		}
		else{
			alert("URL Already Present");
		}
         return false;
     }
});

    // this helper gets the data from the collection for the site-list Template
Template.siteList.helpers({
    'all_websites':function(){
        return Websites.find({});
    }
});


