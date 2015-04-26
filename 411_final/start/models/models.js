var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var orderSchema = new mongoose.Schema({
	created_by: { type: Schema.ObjectId, ref: 'User' },		//should be changed to ObjectId, ref "User"
	created_at: {type: Date, default: Date.now},
	cupcakeFlavor: String
});

var userSchema = new mongoose.Schema({
	username: String,
	password: String, //hash created from password
	created_at: {type: Date, default: Date.now}
})


mongoose.model('Order', orderSchema);
mongoose.model('User', userSchema);

var User = mongoose.model('User');
exports.findByUsername = function(userName, callback){

	User.findOne({ user_name: userName}, function(err, user){

		if(err){
			return callback(err);
		}

		//success
		return callback(null, user);
	});

}

exports.findById = function(id, callback){

	User.findById(id, function(err, user){

		if(err){
			return callback(err);
		}

		return callback(null, user);
	});
}