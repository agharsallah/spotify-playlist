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
  }
  /** When we mount, get the tokens from react-router and initiate loading the info */
  componentDidMount() {
    // params injected via react-router, dispatch injected via connect
    const { dispatch, params } = this.props;
    const { accessToken, refreshToken } = params;
    dispatch(setTokens({ accessToken, refreshToken }));
    dispatch(getMyInfo());
    //console.log(this.props);
    axios.get(
        `http://localhost:3000/parties/nuri.amari99@gmail.com`,
        {
        }
      )
        .then((response) => {
          var response = response.data;
          console.log('--------------', response);
          this.setState({ parties: response });
        },
          (error) => {
            var status = error.response.status
          }
        );
  }

  componentWillMount() {
    
  }

  selectParty(accessToken, refreshToken, email) {
    //window.location = "/libraries/:accessToken/:refreshToken";
    this.props.history.push(`/libraries/${accessToken}/${refreshToken}/${email}`);
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
    console.log(this.state);
    return (
      <div className="user">
        <h2>{`Logged in as ${display_name}`}</h2>
        <p>Here are all your listening parties!</p>
        <div className="parties">
          <ul>
            {this.state.parties.map(function (object, i) {
              console.log(object);
              return (<div onClick={() => this.selectParty(accessToken, refreshToken, email).bind(this, object.id)} key={i}>
                {object.name}
              </div>)
            }, this)}
          </ul>
        </div>
      </div>
    );
  }
}

export default connect(state => state)(Party);
