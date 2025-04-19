var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var photoSchema = new Schema({
	'name' : String,
	'path' : String,
	'postedBy' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'user'
	},
	'message' : String,
	'views' : Number,
	'likes' : Number,
	'dislikes': {
		type: Number,
		default: 0
	}
});

module.exports = mongoose.model('photo', photoSchema);
