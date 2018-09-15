import React, { Component } from 'react';
import loginSVG from '../log_in.svg';

/**
 * Our login page
 * Has a login button that hit's the login url
 */
export default class Login extends Component {
  render() {
    return (
      <div className="login">
        <img src="arrows.png" alt=""/>
        <p>GroupMusic identifies common aspects of Spotify playlists accross multiple accounts and generates a new
          aggregate playlist that all contributers are likely to enjoy. Log in below to get started.
        </p>
        <a href="/login" dangerouslySetInnerHTML={{__html: loginSVG}}></a>
      </div>
    );
  }
}
