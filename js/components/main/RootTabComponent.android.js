'use strict';

const React = require('react-native');
import JPush, {JpushEventReceiveMessage, JpushEventOpenMessage} from 'react-native-jpush'

const ScrollableTabView = require('react-native-scrollable-tab-view');

const {
    AppRegistry,
    BackAndroid,
    Dimensions,
    DrawerLayoutAndroid,
    StyleSheet,
    ToolbarAndroid,
    View,
    ScrollView,
    Text,
    Image,
    Navigator,
    TouchableHighlight,
} = React;

const AccountInfo = require('../me/account');
const TabBar = require('./TabBar.android');
const ToolBar = require('./ToolBar.android');
const MEMain = require('../me/main');
const OrderMain = require('../orders/main');
const OrderList = require('../orders/OrderList');
const MsgMain = require('../message/main');
import DBMamager from "../../utils/db_schema";
var { connect } = require('react-redux');

var _navigator = null;
const UIMain = React.createClass({

    componentDidMount() {
        JPush.requestPermissions()
        this.pushlisteners = [
            JPush.addEventListener(JpushEventReceiveMessage, this.onReceiveMessage),
            JPush.addEventListener(JpushEventOpenMessage, this.onOpenMessage),
        ]

    },

 

    componentWillUnmount() {
        this.pushlisteners.forEach(listener => {
            JPush.removeEventListener(listener);
        });
    },
    onReceiveMessage(message) {
        console.log(message);
    },
    onOpenMessage(message) {
        /*
        cn.jpush.android.ALERT
:
"245353丰富111"
cn.jpush.android.EXTRA
:
"{}"
cn.jpush.android.MSG_ID
:
"1342376544"
cn.jpush.android.NOTIFICATION_CONTENT_TITLE
:
"牛游果"
cn.jpush.android.NOTIFICATION_ID
:
1342376544
cn.jpush.android.PUSH_ID
:
"1342376544"
 */
        console.log(message);
    },


    RouteMapper: function (route, navigationOperations, onComponentRef) {
        _navigator = navigationOperations;

        /*
                let dbManager = new DBMamager();
                let users = dbManager.getDatas('User');
                users = users.filtered('user_id = "a10"');
        
                console.log(users.length);
        
                let goods = dbManager.getDatas('UserList');
                goods = goods.filtered('users.user_id = "a"');*/
        /*
        console.log(goods[0].users.length);
        for(let user of goods[0].users) {
            console.log(user.user_id);
        }
        
          <MsgMain navigator={_navigator} tabLabel={{ tabName: '消息', iconName: 'chatbubbles' }} >
                    </MsgMain>
                    <MEMain navigator={_navigator} tabLabel={{ tabName: '我', iconName: 'android-person' }} >
                    </MEMain>
         */

        if (route.name === 'main2') {
            return (
                <ScrollableTabView
                    renderTabBar={() => <TabBar />}
                    tabBarPosition={'bottom'}
                    >

                    <OrderMain navigator={_navigator} tabLabel={{ tabName: '订单', iconName: 'ios-home' }} style={styles.tabView}>
                    </OrderMain>


                </ScrollableTabView>
            );
        } else if (route.name === 'main') {
            return (
              
                    <OrderMain navigator={_navigator} style={styles.tabView}>
                    </OrderMain>
 
            );
        }  else if (route.name === 'story') {
            return (
                <AccountInfo site={route.site} data={route.data} navigator={_navigator}  style={styles.container}>
                </AccountInfo>
            );
        } else if (route.name === 'site') {
            return (
                <OrderList data={route.data} navigator={_navigator}  style={styles.container}>
                </OrderList>
            );
        }
        
        
    },

    render() {
        var initialRoute = { name: 'main' };

        return (
            <Navigator
                style={styles.container}
                initialRoute={initialRoute}
                configureScene={() => Navigator.SceneConfigs.PushFromRight}
                renderScene={this.RouteMapper}
                >

            </Navigator>

        )
    }
});

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'white',
    },

    tabView: {
        flex: 1,
        padding: 0,
        backgroundColor: 'rgba(0,0,0,0.01)',
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
});


function select(store) {

    return {
        detail: store.detail,
    };
}



module.exports = connect(select)(UIMain);