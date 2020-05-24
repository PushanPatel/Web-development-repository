import { Meteor } from 'meteor/meteor';
import './startup.js';

Meteor.startup(() => {
  // code to run on server at startup
  console.log("I am server");
});
