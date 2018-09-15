var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const PlaylistSchema = Schema({
	playlistId: String,
	partyId: String,
	userEmail:String

});

module.exports = mongoose.model('Playlist', PlaylistSchema);