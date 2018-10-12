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
var SendIntentAndroid = require('react-native-send-intent');
var Icon = require('react-native-vector-icons/Ionicons');

const styles = StyleSheet.create({
    row: {
        borderColor: '#ccc',
        borderBottomWidth: 1,

        backgroundColor: 'white',
        margin: 0,
        flexDirection: 'row',
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
        width: 120,
        height: 75,
    },
    icon_row: {
        marginTop: 2,
        flexDirection: 'row'
    }

});

const Row = React.createClass({
    _call: function(phone) {
        SendIntentAndroid.sendPhoneCall(phone);
    },

    _onClick: function() {
        this.props.onClick(this.props.data);
    },

    shouldComponentUpdate: function(nextProps, nextState) {
        return false;
    },
    render: function() {
        console.log("rendering row");
        return (
            <TouchableHighlight onPress={this._onClick} style={{ marginTop: 20, backgroundColor: 'white', }}
                underlayColor ='#99cccc'
                >


                <View style={{ flexDirection: 'column', padding: 10, }}>
                    <View style={styles.row}>
                        <Image  style={styles.image} source={{ uri: 'http://www.newugo.com/s/goods_img/ca37c30c-0c54-4c35-878e-91d1e2f06c54.jpeg/small' }}/>

                        <View style={{ flexDirection: 'column', marginLeft: 5, flex: 1, }}>
                            <Text style={styles.text} numberOfLines={1}>
                                 {this.props.data.text}
                            </Text>


                            <View style={styles.icon_row}>
                                <Icon name={'ios-body'}  color={'red'} size={18}/>
                                <Text style={styles.text} numberOfLines={1}>
                                    我是中国人我是中国人我是中国人我是中国人我是中国人我是中国人
                                </Text>
                            </View>
                            <View style={styles.icon_row}>
                                <Icon name={'android-people'}  color={'red'} size={18}/>
                                <Text style={styles.text}>
                                    3人
                                </Text>
                            </View>
                            <View style={styles.icon_row}>
                                <Icon name={'android-alarm-clock'}  color={'red'} size={18}/>
                                <Text style={styles.text}>
                                    2016-02-12
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={{ marginTop: 5, flexDirection: 'row', flex: 1, }}>
                        <View style={{ flex: 1, flexDirection: 'row', alignSelf: 'center', alignItems: 'center', }}>
                            <Icon.Button style={{ alignSelf: 'center', alignItems: 'center', }} name="android-chat" backgroundColor="#3b5998" >
                                <Text  style={{ fontSize: 15, color: 'white', }}>发送消息</Text>
                            </Icon.Button>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row', }}>
                            <Icon.Button  onPress={() => this._call('13545097058') } name="android-call" backgroundColor="#3b5998" >
                                <Text   style={{ fontSize: 15, color: 'white', }}>电话联系</Text>
                            </Icon.Button>
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
        );
    },
});

var _navigator = null;

const PullToRefreshViewAndroidExample = React.createClass({
    _dataSource: [],

    statics: {
        title: '<PullToRefreshViewAndroid>',
        description: 'Container that adds pull-to-refresh support to its child view.'
    },
    componentDidMount() {
        //  ToastAndroid.show('componentDidMount', ToastAndroid.SHORT);
        _navigator = this.props.navigator;
    },

    getInitialState() {
        const dataSourceParam = {
            rowHasChanged: (row1, row2) => row1 !== row2,
        }
        const datas = Array.from(new Array(20)).map(
            (val, i) => ({ text: 'Initial row' + i, clicks: 0 })
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
        _navigator.push({ name: 'story' });
    },

    _renderRow: function(rowData, sectionID, rowID) {

        return (
            <Row key={rowID} data={rowData} onClick={this._onClick}/>
        );
    },

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
console.log("rendering order list");
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
                    pageSize = {10}
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
                    text: 'Loaded row' + (+this.state.loaded + i),
                    clicks: 0,
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


module.exports = PullToRefreshViewAndroidExample;