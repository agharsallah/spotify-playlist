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
    this.state = { playlists: [] }
    //this.selectPlaylist = this.selectPlaylist.bind(this);
  }
  /** When we mount, get the tokens from react-router and initiate loading the info */
  componentDidMount() {
    // params injected via react-router, dispatch injected via connect
    const { dispatch, params } = this.props;
    const { accessToken, refreshToken } = params;
    dispatch(setTokens({ accessToken, refreshToken }));
    dispatch(getMyInfo());
    console.log('aaaaaaaaaaaaaaaaa',this.props);

  }

/*   componentWillMount() {
    axios.get(
      'https://api.spotify.com/v1/me/playlists',
      {
        headers: {
          "Authorization": `Bearer ${this.props.params.accessToken}`
        }
      }
    )
      .then((response) => {
        var response = response.data;
        console.log('--------------', response);
        this.setState({ playlists: response.items });
      },
        (error) => {
          var status = error.response.status
        }
      );
    console.log(this.props);
  } */

  selectPlaylist(id, email) {
    console.log("add playlist", id);
    //get the tracks of the song
    /*  axios.get(
       `https://api.spotify.com/v1/playlists/${id}/tracks`,
       {
         headers: {
           "Authorization": `Bearer ${this.props.params.accessToken}`
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
       ); */
    //save the tracks in the db - should save *
    axios.post('/playlist', {
      playlistId: id,
      partyId: 'get from previous',
      userEmail: email
    })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
    //after saving redirect user to the play

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
