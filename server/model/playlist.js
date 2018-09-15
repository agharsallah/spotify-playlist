var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;


const PlaylistSchema = Schema({name: String});


module.exports = mongoose.model('Playlist', PlaylistSchema);