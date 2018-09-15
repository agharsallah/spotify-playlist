const Playlist = require('../model/playlist');


export const postPlaylist = (req, res, next) => {
	var shape = new Shape();		// create a new instance of the Bear model
	shape.name = req.body.name;  // set the bears name (comes from the request)
	shape.data = req.body.data;  // set the bears name (comes from the request)

	shape.save(function (err) {
		if (err) { return next(err); }

		res.json({ message: 'playlist added!' });
	});

};


