var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
	mobile: {
		type: Number,
		index:true
	},
	name: {
		type: String
	},
  address:{
    type:String
  },
  product:{
    type:String
  },
  date:{
    type:String
  },
  duration:{
    type:String
  },
  amount:{
    type:String
  },
	payment:{
    type:String
  }
});

var Milk = module.exports = mongoose.model('Milk', UserSchema);

module.exports.createUser = function(newUser, callback){
	        newUser.save(callback);
}
