var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const PlaylistSchema = Schema({
	playlists: [String],
	partyId: String,
	userEmail:String

});

module.exports = mongoose.model('Playlist', PlaylistSchema);