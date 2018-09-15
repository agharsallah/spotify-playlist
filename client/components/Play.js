import React, { Component } from 'react';
import axios from 'axios';
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
        this.state = { playlists: [],playlistId:'' }
        //this.selectPlaylist = this.selectPlaylist.bind(this);
    }
    /** When we mount, get the tokens from react-router and initiate loading the info */
    componentDidMount() {
        // params injected via react-router, dispatch injected via connect
        const { dispatch, params } = this.props;
        const { accessToken, refreshToken } = params;
        dispatch(setTokens({ accessToken, refreshToken }));
        dispatch(getMyInfo());
        console.log('aaaaaaaaaaaaaaaaa', this.props);


    }

    componentWillMount() {
        this.setState({
            playlistId: this.props.location.state.playlistId
          });
        axios.get(
            `https://api.spotify.com/v1/playlists/${this.props.location.state.playlistId}/tracks`,
            {
                headers: {
                    "Authorization": `Bearer ${this.props.location.state.accessToken}`
                }
            }
        )
            .then((response) => {
                var response = response.data;
                console.log('----------TRRRRAAACKS----', response.items);
                this.setState({ tracks: response.items.track });

            },
                (error) => {
                    var status = error.response.status
                }
            );
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

                    <h2>Play</h2>
                </div>
            </div>
        );
    }
}

export default connect(state => state)(User);
