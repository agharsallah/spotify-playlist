const Playlist = require('../model/playlist');


export const postPlaylist = (req, res, next) => {
	var playlist = new Playlist();		// create a new instance of the Bear model
	playlist.name = req.body.name;  // set the bears name (comes from the request)

	playlist.save(function (err) {
		if (err) { return next(err); }

		res.json({ message: 'playlist added!' });
	});

};


