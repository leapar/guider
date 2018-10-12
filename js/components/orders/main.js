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
} = React;
var { connect } = require('react-redux');

const ScrollableTabView = require('react-native-scrollable-tab-view');
const TabBar = require('./TabBar.android');
const ToolBar = require('../main/ToolBar.android');
const OrderList = require('./OrderList');
var TimerMixin = require('react-timer-mixin');
const SiteList = require('./SiteList');


const OrderMain = React.createClass({
    mixins: [TimerMixin],
    componentDidMount: function() {
       /* this.setTimeout(
            () => {
                this.setState({ isloading: false });
            },
            50,
        );*/
         
    },

    getInitialState() {
        return {
            text: "hello",
            isloading: false,
        }
    },

    onChangeTab(tab) {
        this.setState({
            text: "hellodddd",
        });
        
    },
 
    render() {
        var initialRoute = { name: 'home' };
/*
<ScrollableTabView
                    renderTabBar={() => <TabBar />}
                    >
                   
                    <PullToRefreshViewAndroidExample navigator={this.props.navigator} tabLabel={{ tabName: '待确认' }} >
                    </PullToRefreshViewAndroidExample>

                    <PullToRefreshViewAndroidExample navigator={this.props.navigator} tabLabel={{ tabName: '取消中' }} >
                    </PullToRefreshViewAndroidExample>

                    <PullToRefreshViewAndroidExample navigator={this.props.navigator} tabLabel={{ tabName: '进行中' }} >
                    </PullToRefreshViewAndroidExample>

                </ScrollableTabView>
 */

console.log("rendering");
        /*if (this.props.load.isloading) {
            return (
                <View><Text>sss</Text></View>

            );
        } else {
              <ScrollableTabView
                    renderTabBar={() => <TabBar />}
                    >
              <PullToRefreshViewAndroidExample navigator={this.props.navigator} tabLabel={{ tabName: '取消中' }} >
                    </PullToRefreshViewAndroidExample>

                    <PullToRefreshViewAndroidExample navigator={this.props.navigator} tabLabel={{ tabName: '进行中' }} >
                    </PullToRefreshViewAndroidExample>
                    
                      </ScrollableTabView>
            
            */
            return (
                

             
                   
                    <SiteList  navigator={this.props.navigator} tabLabel={{ tabName: '待确认' }} >
                    </SiteList>

                  

              

            );
       // }
    },
});

const styles = StyleSheet.create({

    container: {
        flex: 1,
    },

    tabView: {
        flex: 1,
        padding: 0,
        backgroundColor: 'rgba(255,0,0,0.01)',
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


module.exports = connect()(OrderMain);

