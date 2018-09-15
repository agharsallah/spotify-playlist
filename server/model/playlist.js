var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var PlaylistSchema   = new Schema({
	name: { type: String, required: true, index: { unique: true } },
	data: { type: Object, required: true }
});

module.exports = mongoose.model('Playlist', PlaylistSchema);