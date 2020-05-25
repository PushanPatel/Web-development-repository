import { Meteor } from 'meteor/meteor';
import '/shared/main.js';

Meteor.startup(() => {
  // code to run on server at startup
  console.log("I am server");
});
