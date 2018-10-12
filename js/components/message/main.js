'use strict';

var React = require('react-native');
var {
    StyleSheet,
    View,
    Text,
} = React;

const MsgList = require('./MsgList');
const ToolBar = require('../main/ToolBar.android');

const MsgMain = React.createClass({
    render() {
        return (
            <View style={styles.container}>
                <ToolBar title='消息'/>
                <MsgList navigator={this.props.navigator}  ></MsgList>
            </View>
        );
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

module.exports = MsgMain;
