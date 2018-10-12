/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
import React, {
  AppRegistry,
  Component,
} from 'react-native';

const configureStore = require('./js/store/configureStore');
const { Provider } = require('react-redux');
const Root = require('./js/components/root');
const {loadOver} = require('./js/actions');
var Relay = require('react-relay');
var util = require('./js/video-parser/lib/util');
//var Parse = require('./js/video-parser');

//import SITES from './js/config';

//const store = configureStore(()=>loadOver());
Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer(`http://172.29.225.80/graphql`, {
    fetchTimeout: 30000,
    retryDelays: [5000, 10000],
  })
);
/*
function requestYoutube(cb, id) {
  var url = [
    'https://www.youtube.com/watch',
    '?v=', id
  ].join('')

  console.log(url);
  fetch(url,null).then(response => {
   // console.log(response);
    if (response.status >= 200 && response.status < 300) {
      
      return response;
    } else {
      console.log("error");

    }
  }).then(response => {
    return response.text();
  }).then(object => {
    //console.log(object);
var jsonStr = util.between(object, 'ytplayer.config = ', '</script>');
jsonStr = jsonStr.slice(0, jsonStr.lastIndexOf(';ytplayer.load'));
          var config;
          try {
            config = JSON.parse(jsonStr);
          } catch (err) {
             
          }        
console.log(config);
var info = config.args;
var formats = util.parseFormats(info);
console.log(formats);

  }).catch(e => {
    console.log(e);

  });
};*/
class guider extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      // store: configureStore(() => this.setState({isLoading: false})),
      store: configureStore(),
    };

    //let p = new Parse();
    //requestYoutube(null, '3-jv7doUI8o');
  }

  render() {
    return (
      <Provider store={this.state.store}>
        <Root isLoading={this.state.isLoading}/>
      </Provider>
    );
  }
}

AppRegistry.registerComponent('guider', () => guider);

