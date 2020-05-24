import '/both/both.js';
// to remove all the data you use ' meteor reset ' in command promt. beware it removes all the data stored in database.

Meteor.startup(function(){
//	console.log(Images.find().count());
	if(Images.find().count()==0){
		Images.insert(
			{	img_src:'/food.jpg',
				img_alt:'Food'
			}
		);
		Images.insert(
			{	img_src:'/flowers.jpg',
				img_alt:'Flowers'
			}
		);
	}
	if(Images.find().count()==2){
		for(var i=1;i<=7;i++){
			Images.insert(
				{	img_src:'/food'+i+'.jpg',
					img_alt:'Food'+i
				}
			);
			Images.insert(
				{	img_src:'/img'+i+'.jpg',
					img_alt:'Image'+i
				}
			);	
		}
		console.log("Startup.js :"+Images.find().count());
	}
	
});
