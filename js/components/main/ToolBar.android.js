'use strict';

var React = require('react-native');
var {
    AsyncStorage,
    Image,
    StyleSheet,
    Text,
    View,
    Dimensions,
    Platform,
    TouchableOpacity,
} = React;
var Icon = require('react-native-vector-icons/Ionicons');

var statusBarSize = Platform.OS == 'ios' ? 10 : 0;

var ToolBar = React.createClass({

    render() {
        return (
            <View style={styles.actionsContainer}>
                {(() => {
                    if (!this.props.leftbutton) {
                        return (null);
                    } else {

                        //click
                        return (
                            <TouchableOpacity style={{
                                left: 16,
                                top: 16,
                                position: 'absolute',
                            }} onPress={() => this.props.leftbutton.click() } >

                                <Icon name={this.props.leftbutton.icon} style={styles.leftbutton} color={'white'} size={26}/>

                            </TouchableOpacity>
                        )


                    }
                })() }
                <View style={styles.title}>
                    <Text style={{ color: 'white', fontSize: 22, }}>{this.props.title}</Text>
                </View>
                
                {(() => {
                    if (!this.props.rightbutton) {
                        return (null);
                    } else {

                        //click
                        return (
                            <TouchableOpacity style={{
                                right: 16,
                                top: 16,
                                position: 'absolute',
                            }} onPress={() => this.props.rightbutton.click() } >

                                <Icon name={this.props.rightbutton.icon} style={styles.rightbutton} color={'white'} size={26}/>

                            </TouchableOpacity>
                        )


                    }
                })() }
            </View>
        );
    },
});

var styles = StyleSheet.create({
    actionsContainer: {
        height: 56,
        paddingTop: statusBarSize,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ff0000',//'#00a2ed',
    },
    leftbutton: {
        width: 24,
        height: 24,
    },
    title: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 0,
    },
});

module.exports = ToolBar;

/*
<ToolbarAndroid
navIcon={require('image!ic_back_white')}
titleColor="white"
style={styles.toolbar}
title="个人中心">
</ToolbarAndroid>
*/