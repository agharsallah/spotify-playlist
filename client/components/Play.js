import React, { Component } from 'react';
import axios from 'axios';
import { createPlaylist } from '../actions/actions';
import { connect } from 'react-redux';
import {
    getMyInfo,
    setTokens,
} from '../actions/actions';

/**
 * Our user page
 * Displays the user's information
 */
class User extends Component {
    constructor(props) {
        super(props);
        this.state = { playlists: [], partyId: '', tracks: [], matched_tracks: [] }
        //this.selectPlaylist = this.selectPlaylist.bind(this);
    }
    /** When we mount, get the tokens from react-router and initiate loading the info */


    componentWillMount() {
        console.log("STATE");
        const accessToken = this.props.location.state.accessToken;
        var run = false;
        this.setState({
            partyId: this.props.location.state.party_id,
        });
        var promises = [];
        axios.get(`http://localhost:3000/getPlaylists/${this.props.location.state.party_id}`).then((response) => {

            var playlists = response.data[0].playlists;
            playlists.push(this.props.location.state.playlistId)
            console.log('-------------pla', playlists, response.data[0]);

            var trackSet = [];
            var matched_tracks = [];

            var playlistCollection = [];
            //get the tracks of each playlist and put it in array

            for (var i = 0; i < playlists.length; i++) {
                console.log(i, playlists.length);
                promises.push(axios.get(`https://api.spotify.com/v1/playlists/${playlists[i]}/tracks`,
                    {
                        headers: {
                            "Authorization": `Bearer ${accessToken}`
                        }
                    }
                ).then((track) => {
                    for (var i = 0; i < track.data.items.length; i++) {
                        //if (i < 100) {
                            trackSet.push(track.data.items[i].track.uri);
                        //}
                    }


                }).catch((error) => { throw error }));
            }
                axios.all(promises).then(() => {

                    /*for (var j = 0; j < trackSet.length; j++) {
                        var count = 0;
                        for (var k = 0; k < trackSet.length; k++) {
                            if (j === k) {
                                continue;
                            }
                            if (trackSet[j] === trackSet[k]) {
                                count++;
                            }
                        }
                        if (count > 0) {
                            trackSet.slice(indexOf(trackSet[j]),1); 
                        }
                    }*/


                    var sorted_arr = trackSet.slice().sort();
                    for (var i = 0; i < sorted_arr.length - 1; i++) {
                        if (sorted_arr[i + 1] == sorted_arr[i]) {
                            matched_tracks.push(sorted_arr[i]);
                        }
                    }
                    if (matched_tracks.length == 0) {
                        console.log('hereee');
                        matched_tracks = trackSet;
                    }


                    //saving matched lists in the database!
                    axios.post('/addMatchedList', {
                        partyId: this.props.location.state.party_id,
                        matchedTracks: matched_tracks
                    })
                        .then(function (response) {
                            console.log(response);
                        })
                        .catch(function (error) {
                            console.log(error);
                        });

                    console.log("THIS > STATE > TRACKS");
                    console.log(trackSet, matched_tracks);

                    //this.setState({matched_tracks});
                   // console.log('rr', run);

                    if (!run) {

                        run = true;
                        console.log("MAKING A PLAYLIST");
                        //console.log(accessToken, '---', this.props.user.id, '---', matched_tracks);
                        axios.post(`https://api.spotify.com/v1/users/${this.props.user.id}/playlists`, {
                            name: `Temporary GroupMusic Template ${this.state.partyId}`,
                        }, {
                                headers: {
                                    "Authorization": `Bearer ${accessToken}`,
                                    "Content-Type": "application/json",
                                }
                            }, ).then((response) => {
                                //console.log('NEEED the play list iddd11111111',response);
                                window.open(response.data.external_urls.spotify, '_blank');
                                axios.post(`https://api.spotify.com/v1/playlists/${response.data.id}/tracks`, {
                                    uris: matched_tracks,
                                }, {
                                        headers: {
                                            "Authorization": `Bearer ${accessToken}`,
                                            "Content-Type": "application/json",
                                        }
                                    }).then((response) => { console.log('NEEED the play list iddd',response);});

                            }).catch((error) => { throw error });
                        //createPlaylist({"name": "Temporary GroupMusic Template"});
                    }
                }
                );
            
        });
    }
    componentDidMount() {
        // params injected via react-router, dispatch injected via connect
        const { dispatch, params } = this.props;
        let { accessToken, refreshToken } = params;
        dispatch(setTokens({ accessToken, refreshToken }));
        dispatch(getMyInfo());


    }
    /** Render the user's info */
    render() {
        const { accessToken, refreshToken, user } = this.props;
        const { loading, display_name, images, id, email, external_urls, href, country, product } = user;
        const imageUrl = images[0] ? images[0].url : "";
        // if we're still loading, indicate such
        if (loading) {
            return <h2>Loading...</h2>;
        }
        return (
            <div className="user">
                <h2>{`Logged in as ${id}`}</h2>
                <p>Select the Spotify playlist you wish to contribute.</p>
                <div className="user-content">

                    <h2>Playlist created successfully check your spotify!</h2>
                </div>
            </div>
        );
    }
}

export default connect(state => state)(User);
