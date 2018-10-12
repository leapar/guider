'use strict';

import React, {
    StyleSheet,
    AppRegistry,
    Component,
} from 'react-native';

const RootTab = require('./main/RootTabComponent.android');
//const Login = require('./me/login.js');
var { connect } = require('react-redux');
var CodePush = require('react-native-code-push');
//var Vitamio = require('react-native-android-vitamio');



var Root = React.createClass({
    componentDidMount: function () {
        CodePush.sync({ installMode: CodePush.InstallMode.ON_NEXT_RESUME });
         
    },
    render: function () {
      /*  if (!this.props.isLoggedIn) {
            return (<Login />);
        }
        
        <RootTab />
        */

        return (
             <RootTab />
        );
    }
});


function select(store) {
    return {
        isLoggedIn: store.user.isLoggedIn || store.user.hasSkippedLogin,
    };
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    video: {
      flex: 1,
      flexDirection: 'row',
      height: 400,
    },
});

module.exports = connect(select)(Root);