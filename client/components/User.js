import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import {
  getMyInfo,
  setTokens,
} from '../actions/actions';
import { browserHistory } from 'react-router';

/**
 * Our user page
 * Displays the user's information
 */
class User extends Component {
  constructor(props) {
    super(props);
    this.state = { playlists: [], party_id: '' }
    //this.selectPlaylist = this.selectPlaylist.bind(this);
  }
  /** When we mount, get the tokens from react-router and initiate loading the info */
  componentDidMount() {
    // params injected via react-router, dispatch injected via connect
    const { dispatch, params } = this.props;
    const { accessToken, refreshToken } = params;
    dispatch(setTokens({ accessToken, refreshToken }));
    dispatch(getMyInfo());
  }

  componentWillMount() {
    this.setState({
      party_id: this.props.location.state.party_id
    });
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
  }

  selectPlaylist(id, email,accessToken) {
    //console.log('aaaaaaaaaaaaaaaaaaaaaaaaaa',accessToken);
    //console.log("add playlist", id);
    
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
      partyId: this.state.party_id,
      userEmail: email
    })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
    //after saving redirect user to the play
    //browserHistory.push('/');
    //this.props.history.pushState(null, '/play');
    this.props.history.push({
      pathname: `/play`,
      state: { party_id:this.state.party_id,playlistId:id,userEmail: email,accessToken} 
      
    });

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
        <h2>{`Logged in as ${display_name}`}</h2>
        <p>Select the Spotify playlist you wish to contribute.</p>
        <div className="user-content">
          <ul>
            {this.state.playlists.map(function (object, i) {
              console.log('ddddddddddd', user);
              return (<div onClick={this.selectPlaylist.bind(this, object.id, user.email,accessToken)} key={i}>
                <img src={object.images[0].url}></img>
                <p>{object.name}</p>
              </div>)
            }, this)}

          </ul>
          {/* <img src={imageUrl} />
           <ul>
            <li><span>Display name</span><span>{display_name}</span></li>
            <li><span>Id</span><span>{id}</span></li>
            <li><span>Email</span><span>{email}</span></li>
            <li><span>Spotify URI</span><span><a href={external_urls.spotify}>{external_urls.spotify}</a></span></li>
            <li><span>Link</span><span><a href={href}>{href}</a></span></li>
            <li><span>Profile Image</span><span><a href={imageUrl}>{imageUrl}</a></span></li>
            <li><span>Country</span><span>{country}</span></li>
            <li><span>Product</span><span>{product}</span></li>
          </ul> */}
        </div>
      </div>
    );
  }
}

export default connect(state => state)(User);
