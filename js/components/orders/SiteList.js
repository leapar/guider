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
} = React;

var {
    loadData,
    showDetail,
    loadSites,
} = require('../../actions');
var { connect } = require('react-redux');
const ToolBar = require('../main/ToolBar.android');
//import RNYouTubePlayer from 'rn-youtube-android';
const refreshControl = {
    colors: ["rgba(255,0,0, 1)", "rgba(255,0,0, 1)", "rgba(255,0,0, 1)"],
    progressBackgroundColor: "#000000bf",
};

const styles = StyleSheet.create({
    row: {
        backgroundColor: 'white',
        margin: 0,
        flexDirection: 'row',
        flex: 1,
    },
    text: {
        color: '#000',
        marginLeft: 5,

    },
    layout: {
        flex: 1,
        backgroundColor: 'white',
    },
    scrollview: {
        flex: 1,
    },
    image: {
        width: 100,
        height: 45,
        //backgroundColor : '#0000003f',
        alignSelf:'center',
    },
    icon_row: {
        marginTop: 2,
        flexDirection: 'row'
    },
    container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FAFAFA',
  },

});

const Row = React.createClass({

    _onClick: function () {
        this.props.onClick(this.props.data);
    },

    shouldComponentUpdate: function (nextProps, nextState) {
        return false;
    },
    render: function () {
        console.log("rendering row");
        return (
            <TouchableHighlight onPress={this._onClick} style={{ backgroundColor: 'white', }}
                underlayColor ='transparent'
                >
                <View style={{
                    flex : 1,
                      padding: 10, borderColor: '#ccc',
                    borderBottomWidth: 1,
                }}>
                    <View style={styles.row}>
                        <Image resizeMode='contain' style={styles.image} source={{ uri: this.props.data.info.logo }}/>
                        <View style={{ flexDirection:'column', flex:1,marginLeft : 10, }}>
                                <Text style = {{fontSize: 14,}}>{this.props.data.info.name}</Text>
                                <Text style = {{fontSize: 9, alignSelf:'flex-start',}}>{this.props.data.info.url}</Text>
                        </View>
                    </View>

                </View>
            </TouchableHighlight>
        );
    },
});

var _navigator = null;



class SiteList extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            isRefreshing: true,
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            rowData: new Array(),
        }
    }

    componentDidMount() {
        //  ToastAndroid.show('componentDidMount', ToastAndroid.SHORT);
        _navigator = this.props.navigator;
        this.props.dispatch(loadSites());
    }



    componentWillReceiveProps(nextProps) {
        console.log("componentWillReceiveProps");
       // console.log(nextProps);
        let rowData = this.state.rowData;
        let page = this.state.page;
        if(nextProps.sites.data != null) {
            rowData = Array.from(nextProps.sites.data);
        }

        this.setState({
            isRefreshing: nextProps.sites.isloading,
            dataSource: this.state.dataSource.cloneWithRows(rowData),
            rowData: rowData,
        });
    }

    _onClick(rowData) {
       _navigator.push({ name: 'site',data : rowData, });
      
      //RNYouTubePlayer.play("AIzaSyDnHq8g0MqzS4Wf4xRdrNfa5_YyIA5pT6k", "xfeys7Jfnx8");
    }

    _renderRow(rowData) {
        return (
            <Row key={rowData.url} data={rowData} onClick={this._onClick.bind(this, rowData)}/>
        );
    }

    onNext() {
       
            this.props.dispatch(loadSites());
        
    }

    render() {
        return (
           <View style={styles.container}>    
                <ToolBar title='网站列表'></ToolBar>
                <ListView
                    enableEmptySections={true}
                    dataSource={this.state.dataSource}
                    renderRow={this._renderRow.bind(this) }
                    initialListSize = {12}
                    pageSize = {12}
                    scrollRenderAheadDistance = {50}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={this.onNext.bind(this) }
                            {...refreshControl}
                            />
                    }
                    />
                    
            </View>        
        );
    }
    
}

function select(store) {
    return {
        sites: store.sites,
    };
}


module.exports = connect(select)(SiteList);
