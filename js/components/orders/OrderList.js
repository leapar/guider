'use strict';

const React = require('react-native');
const {
    ScrollView,
    StyleSheet,
    PullToRefreshViewAndroid,
    Text,
    TouchableWithoutFeedback,
    View,
    Image,
    TouchableHighlight,
    ListView,
    RefreshControl,
    BackAndroid,
} = React;
var SendIntentAndroid = require('react-native-send-intent');
var Icon = require('react-native-vector-icons/Ionicons');
var {
    loadData,
    showDetail,
    getListPageUrl,
} = require('../../actions');
var { connect } = require('react-redux');
const ToolBar = require('../main/ToolBar.android');

const refreshControl = {
    colors: ["rgba(255,0,0, 1)", "rgba(255,0,0, 1)", "rgba(255,0,0, 1)"],
    progressBackgroundColor: "#000000bf",
};

var WebViewBridge = require('react-native-webview-bridge');



const styles = StyleSheet.create({
    row: {
        backgroundColor: 'white',
        margin: 0,

    },
    text: {
        color: '#fff',
        marginLeft: 5,

    },
    title: {
        color: '#000',
        fontSize: 18,
        marginTop: 10,

    },
    layout: {
        flex: 1,
        backgroundColor: 'white',
    },
    scrollview: {
        flex: 1,
    },
    image: {
        flex: 1,
        height: 170,
        flexDirection: 'row',
        padding: 10,
        justifyContent: 'space-between',
        backgroundColor: 'gray',

    },
    icon_row: {
        flexDirection: 'row',
        backgroundColor: '#000',
        padding: 5,
        borderColor: '#d7d7d7',
        borderWidth: 1,
        height: 30,
        alignSelf: 'flex-end',
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#FAFAFA',
    },

});

 

const Row = React.createClass({
    _call: function (phone) {
        SendIntentAndroid.sendPhoneCall(phone);
    },

    _onClick: function () {
        this.props.onClick(this.props.data);
    },

    shouldComponentUpdate: function (nextProps, nextState) {
        return false;
    },
    render: function () {
    //    console.log("rendering row");
        return (
            <TouchableHighlight onPress={this._onClick} style={{ backgroundColor: 'white', }}
                underlayColor ='transparent'
                >
                <View style={{
                    flexDirection: 'column', padding: 10, borderColor: '#ccc',
                    borderBottomWidth: 1,
                }}>
                    <View style={styles.row}>
                        <Image  style={styles.image} source={{ uri: this.props.data.thumb }}>
                            <View style={styles.icon_row}>
                                <Icon name={'clock'}  color={'white'} size={18}/>
                                <Text style={styles.text} numberOfLines={1}>
                                    {this.props.data.time}
                                </Text>
                            </View>
                            <View style={styles.icon_row}>
                                <Icon name={'android-people'}  color={'white'} size={18}/>
                                <Text style={styles.text}>
                                    {this.props.data.rating}
                                </Text>
                            </View>
                        </Image>
                        <Text style={styles.title} numberOfLines={2}>
                            {this.props.data.title}
                        </Text>
                    </View>
                </View>
            </TouchableHighlight>
        );
    },
});

var _navigator = null;

BackAndroid.addEventListener('hardwareBackPress', function () {
    if (_navigator && _navigator.getCurrentRoutes().length > 1) {
        let stacks = _navigator.getCurrentRoutes();
        if(stacks[stacks.length-1].name == 'site') {
            _navigator.pop();
            return true;
        }
    }
    return false;
});




class OrderList extends React.Component {

    getInjectJs() {
        let injectScript = `
        (function(){
            if(typeof(document) == 'undefined' || document == null)
                return;
            if(typeof(document.body) == 'undefined' || document.body == null)
                return;    
            if(document.getElementById("injectjs"))
                return;    
            console.log("inject");
            var e=document.createElement("script");
            e.setAttribute("src","${this.props.data.list.usejs}");
            e.setAttribute('id','injectjs');
            document.body.appendChild(e);
            e=document.createElement("script");
        }());
        `;

        return injectScript;
    }

    _clickLeft() {
        this.props.navigator.pop();
    }

    constructor(props) {
        super(props);

        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            page: 0,
            rowData: new Array(),
            isRefreshing: true,
            loaded: 0,
            inject: {
                js:false,
                pageUrl: null,
                over: false,
            }
        }
    }

    componentDidMount() {
        console.log("componentDidMount");
        this.is_unmount = false;
        //  ToastAndroid.show('componentDidMount', ToastAndroid.SHORT);
        _navigator = this.props.navigator;
        //this.props.dispatch(loadData(this.state.page));
        this.onNext();
    }

    componentWillUnmount() {
        this.is_unmount = true;
    }

    onBridgeMessage(message) {
        console.log("onBridgeMessage 1");
         console.log("message:"+message);  
        if( this.is_unmount) {
           console.log("is_unmount");      
           return;     
        }
            
        if(message == null || message == "") {
            console.log("message:"+message);      
            return;
        }    
        let data = null;
        let page = this.state.page;
        if(message != null && message != "") {
            data = JSON.parse(message);
            page = page + 1;
            if(data.type != "list") {
                return;
            }
            data = data.data;
        }
        this.onReceiveData(data,page);
    }


    onReceiveData(data,page) {
        let rowData = this.state.rowData;

        if(data != null) {
            rowData = Array.from(data);//rowData.concat(nextProps.load.data);
        }
        this.setState({
            isRefreshing: false,
            dataSource: this.state.dataSource.cloneWithRows(rowData),
            page: page,
            rowData: rowData,
            inject: {
                over: true,
            }
        });
    }

    componentWillReceiveProps(nextProps) {
        console.log("componentWillReceiveProps");
        // console.log(nextProps);
        let rowData = this.state.rowData;
        let page = this.state.page;
        if (nextProps.load.data != null) {
            rowData = Array.from(nextProps.load.data);//rowData.concat(nextProps.load.data);
            page = this.state.page > nextProps.load.page ? this.state.page : nextProps.load.page;
        }
        this.setState({
            isRefreshing: nextProps.load.isloading,
            dataSource: this.state.dataSource.cloneWithRows(rowData),
            page: page,
            rowData: rowData,
        });
        // console.log(rowData);
    }

    _onClick(rowData) {
        /*row.clicks++;
        this.setState({
            rowData: this.state.rowData,
        });*/
        _navigator.push({ name: 'story', data: rowData, site: this.props.data });
        //this.props.dispatch(showDetail({data : rowData,}));
    }

    _renderRow(rowData) {
        // console.log(rowData);
        return (
            <Row key={rowData.link} data={rowData} onClick={this._onClick.bind(this, rowData) }/>
        );
    }

    render() {
        //ToastAndroid.show('render', ToastAndroid.SHORT);
        // 
        /*
        <ScrollView style={styles.scrollview}>
        {rows}
        </ScrollView>
        */
        /*const rows = this.state.rowData.map((row, ii) => {
            return <Row key={ii} data={row} onClick={this._onClick}/>;
        });*/
      //  console.log("rendering order list");
        //    console.log(this.state.rowData);
        

        //renderHeader={() => <ToolBar title='视频列表'></ToolBar>}
        let injectView = <View/>;
        let injectScript = this.getInjectJs();
        if(this.state.inject.js) {
            console.log(this.state.inject.pageUrl);
            injectView = <WebViewBridge
                ref="webviewbridge"
                onBridgeMessage={this.onBridgeMessage.bind(this)}
                javaScriptEnabled={true}
                injectedJavaScript={injectScript}
                style={{width:1,height:1,}}
                source={{uri: this.state.inject.pageUrl}}/>
        }
        return (
            <View style={styles.container}>
                <ToolBar
                    leftbutton={{ icon: 'android-arrow-back', click: this._clickLeft.bind(this) }}
                    title='视频列表'></ToolBar>
                    
                <ListView
                    enableEmptySections={true}
                    dataSource={this.state.dataSource}
                    renderRow={this._renderRow.bind(this) }
                    initialListSize = {12}
                    pageSize = {12}
                    //onEndReached={this.onPre.bind(this) }
                    scrollRenderAheadDistance = {50}
                    //showsVerticalScrollIndicator={true}
                    style={{flex:1,}}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={this.onNext.bind(this) }
                            {...refreshControl}
                            />
                    }
                    />
                    <View>{injectView}</View>
  
                   
            </View>
        );
    }

    onPre() {
        console.log(this.state.isRefreshing);
        /*if (this.state.isRefreshing)
            return;
        this.setState({ isRefreshing: true, });*/

        if(this.props.data.list.usejs) {
            let url = getListPageUrl(this.props.data, this.state.page - 1);
            this.setState({
                inject: {
                    js: true,
                    pageUrl: url,
                    over: false,
                }
            });
        } else {
            this.props.dispatch(loadData(this.props.data, this.state.page - 1));
        }
    }

    onNext() {
       /*  console.log(this.state.isRefreshing);
        if (this.state.isRefreshing)
            return;
        this.setState({ isRefreshing: true });*/

        if(this.props.data.list.usejs) {
            let url = getListPageUrl(this.props.data, this.state.page + 1);
            this.setState({
                inject: {
                    js: true,
                    pageUrl: url,
                    over: false,
                }
            });
        } else {
            this.props.dispatch(loadData(this.props.data, this.state.page + 1));
        }
        
    }

}

function select(store) {
    console.log("select store");
    return {
        load: store.load,
    };
}


module.exports = connect(select)(OrderList);
