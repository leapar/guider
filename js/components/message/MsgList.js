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
} = React;
import  DBMamager from "../../utils/db_schema";
var Realm = require('realm');


const styles = StyleSheet.create({
    row: {
        borderColor: '#ccc',
        borderBottomWidth: 1,
        padding: 10,
        backgroundColor: 'white',
        margin: 0,
        flexDirection: 'row',
    },
    text: {
        alignSelf: 'center',
        color: '#000',
        flex: 1,
    },
    layout: {
        flex: 1,

    },
    scrollview: {
        flex: 1,
    },
    image: {
        width: 120,
        height: 75,
    }
});

const Row = React.createClass({

    _onClick: function() {
        this.props.onClick(this.props.data);
    },
    render: function() {
        return (
            <TouchableHighlight onPress={this._onClick}
                underlayColor ='#99cccc'
                >
                <View style={{ padding: 10,backgroundColor :'white', flex: 1, flexDirection: 'row', borderBottomColor: '#ccc', borderBottomWidth: 1, }}>

                    <Image style={{ width: 50, height: 50, }} source={{ uri: this.props.data.avatar }} />

                    <View style={{ marginLeft: 10, flexDirection: 'column', flex: 1, }}>

                        <View style={{ flexDirection: 'row', flex: 1, }}>
                            <Text style={{ textAlignVertical: 'top', flex: 1, fontSize: 16, }} numberOfLines={1}>{this.props.data.nickname}</Text>
                            <Text style={{ width: 100, fontSize: 14, color: '#c9c9c9', }}>{this.props.data.time}</Text>
                        </View>

                        <View style={{ flex: 1, marginTop: 5, }}>
                            <Text style={{ fontSize: 14, }}>{this.props.data.content}</Text>
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
        );
    },
});

var _navigator = null;

const MsgList = React.createClass({
    _dataSource: [],


    componentDidMount() {
        //  ToastAndroid.show('componentDidMount', ToastAndroid.SHORT);
        _navigator = this.props.navigator;
    },

    getInitialState() {
        const dataSourceParam = {
            rowHasChanged: (row1, row2) => row1 !== row2,
        }
        const datas = Array.from(new Array(20)).map(
            (val, i) => ({
                avatar: 'http://www.newugo.com/s/user_img/cbe831d0-64c1-4ccb-a2e9-f4100ec6ce23',
                nickname: '我是中国人我是中国人我是中国人我是中国人',
                content: '(对开发者来说) React组件在概念上被设计为强隔离性的：你应当可以在应用的任何位置放置一个组件，而且只要属性相同，其外观和表现都将完全相同。文本如果能够继承外面的样式属性，将会打破这种隔离性。',
                time: '16-03-01 12:14',
            })
        );

        return {
            rowData: datas,
            isRefreshing: false,
            loaded: 0,
            dataSource: new ListView.DataSource(dataSourceParam).cloneWithRows(datas),
            lastError: { isReloadError: false, error: null },

        };
    },

    _onClick(row) {
        /*row.clicks++;
        this.setState({
            rowData: this.state.rowData,
        });*/

       // _navigator.push({ name: 'story' });
       
       
         /*row.clicks++;
        this.setState({
            rowData: this.state.rowData,
        });*/

       // _navigator.push({ name: 'story' });
       
       
            let dbManager = new DBMamager();
         dbManager.insertGoods();
      //  dbManager.clearDatas();
       // dbManager.saveData('User', { user_id: '1', tel:'1',token: 'Recipes' }, true);
       // dbManager.saveData('User', { user_id: '1', tel:'1',token: 'Recipes2', type: 2 }, true);
       // dbManager.saveData('User', { user_id: '1', tel:'1',token: 'Recipes3', type: 3 }, true);



      /*  let users = dbManager.getDatas('User');
           
          console.log(users.length);
           
           users.forEach((object ,index ,collection)=>{
               console.log(object.tel+','+object.token);
               console.log(index);
               console.log(collection);
           });*/
           
           _navigator.push({ name: 'story' });
    },

    _renderRow: function(rowData, sectionID, rowID) {

        return (
            <Row key={rowID} data={rowData} onClick={this._onClick}/>
        );
    },

    render() {
        return (
            <PullToRefreshViewAndroid
                style={styles.layout}
                refreshing={this.state.isRefreshing}
                onRefresh={this._onRefresh}
                colors={['#cccccc', '#cccccc', '#cccccc']}
                progressBackgroundColor={'#ffffff'}
                >
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this._renderRow}
                    initialListSize = {8}
                    pageSize = {30}
                    scrollRenderAheadDistance = {50}
                    />
            </PullToRefreshViewAndroid>
        );
    },

    _onRefresh() {
        this.setState({ isRefreshing: true });
        setTimeout(() => {
            // prepend 10 items
            const rowData = Array.from(new Array(300))
                .map((val, i) => ({
                    avatar: 'http://www.newugo.com/s/user_img/cbe831d0-64c1-4ccb-a2e9-f4100ec6ce23',
                    nickname: '我是中国人我是中国人我是中国人我是中国人',
                    content: '(对开发者来说) React组件在概念上被设计为强隔离性的：你应当可以在应用的任何位置放置一个组件，而且只要属性相同，其外观和表现都将完全相同。文本如果能够继承外面的样式属性，将会打破这种隔离性。',
                    time: '16-03-01 12:14',
                }))
                .concat(this.state.rowData);

            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(rowData),
                loaded: this.state.loaded + 300,
                isRefreshing: false,
                rowData: rowData,
            });
        }, 5000);
    },

});


module.exports = MsgList;