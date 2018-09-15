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
class Party extends Component {
  constructor(props) {
    super(props);
    this.state = { parties: [] }
    //this.selectPlaylist = this.selectPlaylist.bind(this);
    this.playParty = this.playParty.bind(this);
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

  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    //console.log(this.props);
    if (nextProps.user.email) {
      axios.get(
        `http://localhost:3000/parties/${nextProps.user.email}`,
        {
        }
      )
        .then((response) => {
          var response = response.data;
          this.setState({ parties: response });
        },
          (error) => {
            var status = error.response.status
          }
        );
    }

  }

  selectParty(accessToken, refreshToken, email) {
    //window.location = "/libraries/:accessToken/:refreshToken";
    this.props.history.push({
      pathname: `/libraries/${accessToken}/${refreshToken}`,
      state: {email: email,accessToken:accessToken,refreshToken:refreshToken} 
      
    });
  }

  playParty() {
    
    this.props.history.push('/play');
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
        <p>Here are all your listening parties!</p>
        <div className="parties">
          <ul>
            {this.state.parties.map(function (object, i) {
              return (<div  key={i}>
                <div>{object.name}</div>
                <div className="party-buttons">
                  <div onClick={this.playParty}>|></div>
                  <div onClick={() => this.selectParty(accessToken, refreshToken, email)}>+</div>
                </div>
              </div>)
            }, this)}
            <div className="newParty">
              + New Party
            </div>
          </ul>
        </div>
      </div>
    );
  }
}

export default connect(state => state)(Party);
