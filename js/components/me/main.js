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
    Navigator,
    ScrollView,
    TouchableHighlight,
    ToastAndroid,
} = React;

const ITEMS_DATA = [
    { 'id': 1, 'title': '个人信息', 'icon': require('image!ic_logo'), 'padding': require('image!ic_logo') },
    { 'id': 2, 'title': '免责声明', 'icon': require('image!ic_logo'), 'padding': require('image!ic_logo') },
    { 'id': 3, 'title': '退款政策', 'icon': require('image!ic_logo'), 'padding': require('image!ic_logo') },
    { 'id': 4, 'title': '用户协议', 'icon': require('image!ic_logo'), 'padding': require('image!ic_logo') },
    { 'id': 5, 'title': '公司简介', 'icon': require('image!ic_logo'), 'padding': require('image!ic_logo') },
    { 'id': 6, 'title': '牛游果百科', 'icon': require('image!ic_logo'), 'padding': require('image!ic_logo') },
];

var WINDOW_WIDTH = Dimensions.get('window').width;
const ToolBar = require('../main/ToolBar.android');
const AccountInfo = require('./account');
var Icon = require('react-native-vector-icons/Ionicons');
var { loginOut } = require('../../actions');
var { connect } = require('react-redux');

var _navigator;
const ItemList = React.createClass({
    _pressItem(id) {
        // ToastAndroid.show('{id}...~', ToastAndroid.SHORT);
        this.props.navigator.push({ name: 'story' });
    },

    render() {
        var items = [];

        ITEMS_DATA.forEach((elem) => {
            items.push(
                <TouchableHighlight underlayColor ='#99cccc' onPress={() => this._pressItem(elem.id) } key={elem.id}>
                    <View style={styles.item} >


                        <Icon name={'android-person'} style={styles.item_icon} color={'gray'} size={20}/>
                        <View style={styles.item_text}>
                            <Text style={{ fontSize: 16, color: 'black', }}>{elem.title}</Text>
                        </View>
                        <Icon name={'chevron-right'} style={styles.item_pad} color={'gray'} size={20}/>

                    </View>
                </TouchableHighlight>);
        });

        return (
            <View style={{  }}>{items}</View>
        );
    },
});
const MEMain = React.createClass({
    RouteMapper: function(route, navigationOperations, onComponentRef) {
        _navigator = navigationOperations;
        if (route.name === 'home') {
            return (
                <ScrollView style={styles.tabView}>
                    <ToolBar title='个人中心'></ToolBar>
                    <View style={{ alignItems: 'center', }}>
                        <Image
                            style = {styles.avatar}
                            source = {require('image!ic_logo') }
                            />
                    </View>
                    <ItemList navigator={_navigator}></ItemList>
                </ScrollView>
            );
        } else if (route.name === 'story') {
            return (
                <AccountInfo style={styles.container}>
                    <Text>dsdsd</Text>
                </AccountInfo>
            );
        }
    },
    _clickRight() {
        this.props.dispatch(loginOut());
    },

    render() {
        var initialRoute = { name: 'home' };
        return (

            <ScrollView style={styles.tabView}>
                <ToolBar title='个人中心'
                 rightbutton={{ icon: 'log-out', click: this._clickRight }}
                 ></ToolBar>
                <View style={{ alignItems: 'center', paddingBottom : 20,paddingTop : 20,}}>
                    <Image
                        style = {styles.avatar}
                        source = {require('image!ic_logo') }
                        />
                </View>
                <ItemList navigator={this.props.navigator}></ItemList>
            </ScrollView>
        );
    },
});


const styles = StyleSheet.create({

    container: {
        flex: 1,
    },
    avatar: {

    },
    tabView: {
        flex: 1,
        padding: 0,
        backgroundColor: '#FFFAFA',
    },
    card: {
        borderWidth: 1,
        backgroundColor: '#fff',
        borderColor: 'rgba(0,0,0,0.1)',
        margin: 5,
        height: 150,
        padding: 15,
        shadowColor: '#ccc',
        shadowOffset: { width: 2, height: 2, },
        shadowOpacity: 0.5,
        shadowRadius: 3,
    },
    item: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderColor: '#ccc',
        borderBottomWidth: 1,
        height: 42,
    },
    item_pad: {
        position: 'absolute',
        right: 0,
        height: 22,
        width: 22,
        marginTop: 10,
    },
    item_text: {
        flex: 1,
        marginLeft: 40,
        marginRight: 40,
        justifyContent: 'center',
    },
    item_icon: {
        position: 'absolute',
        left: 0,
        height: 22,
        width: 22,
        marginTop: 10,
        marginLeft: 10,
    },
});

module.exports = connect()(MEMain);