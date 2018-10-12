
'use strict';

var { combineReducers } = require('redux');

module.exports = combineReducers({
  user: require('./user'),
  load: require('./load'),
  detail: require('./detail'),
  video: require('./video'),
  sites: require('./sites'),
  
});
