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
    TouchableHighlight,
    ToastAndroid,
    BackAndroid,
    NativeModules,
} = React;
var ProgressBar = require('ProgressBarAndroid');
var MapView = require('react-native-maps');
var Vitamio = require('react-native-android-vitamio');
var ToolBar = require('../main/ToolBar.android');
var Video = require('react-native-video');
var {
    loadDetail,
} = require('../../actions');
var { connect } = require('react-redux');
var Icon = require('react-native-vector-icons/Ionicons');
var _navigator = null;
var _accountInfo = null;
BackAndroid.addEventListener('hardwareBackPress', function () {
    if (_navigator && _navigator.getCurrentRoutes().length > 1) {
        _accountInfo.stop();
        _navigator.pop();
        return true;
    }
    return false;
});

const AccountInfo = React.createClass({
    _clickLeft() {
        this.stop();
        this.props.navigator.pop();
    },

    getInitialState() {
        _accountInfo = this;

        return {
            isbuffering: true,
            rating: 0,
            percent: 0,
            video_width: 1,
            video_height: 1,
            is_playing : false,
            is_init : false,
        }
    },


    componentDidMount: function () {
        this.pushlisteners = [
            Vitamio.VitamioListener.addEventListener(Vitamio.Event.MediaInfo, this.onMediaInfo),
            Vitamio.VitamioListener.addEventListener(Vitamio.Event.MediaBuffer, this.onMediaBuffer),
            Vitamio.VitamioListener.addEventListener(Vitamio.Event.MediaSize, this.onMediaSize),
        ] 

        _navigator = this.props.navigator;
        this.props.dispatch(loadDetail(this.props.site,this.props.data.link));
    },

    componentWillUnmount() {
        //this._runCommand('stop', []);
        this.pushlisteners.forEach(listener => {
            Vitamio.VitamioListener.removeEventListener(listener);
        });
    },

    onMediaSize(message) {
        var {height, width} = Dimensions.get('window');
        var abs1 = (height-160) / message.height  ;
        var abs2 = width /  message.width;
        
        
        if(abs1 < abs2) {
            this.setState({
                video_width: message.width * (height-160) / message.height,
                video_height: (height-160),
            });
        } else {
            this.setState({
                video_width: width,
                video_height: message.height * width / message.width,
            });
        }
        
        
        //console.log(message);
    },

    onMediaInfo(message) {
        /*
        if (message == null)
            return;
        switch (message.what) {
            case Vitamio.Event.MEDIA_INFO_BUFFERING_START:
                this.setState({
                    isbuffering: true,
                });
                break;
            case Vitamio.Event.MEDIA_INFO_BUFFERING_END:
                this.setState({
                    isbuffering: false,
                });
                break;
            case Vitamio.Event.MEDIA_INFO_DOWNLOAD_RATE_CHANGED:
                this.setState({
                    rating: message.extra,
                });
                break;
        }*/

        // console.log(message);
    },

    onMediaBuffer(message) {
       /* this.setState({
            percent: message.percent,
        });*/
        //console.log(message);
    },
    start2pause: function () {
        if(!this.state.is_init)
               this.initUrl();
        
        
        if(this.state.is_playing) {
            this._runCommand('pause', []);
            this.setState({
                is_playing : false,
            });
        } else {
            this._runCommand('start', []);
            this.setState({
                is_playing : true,
            });
        }
        
    },
    
    stop : function () {
        if(this.state.video_width > 1)
        this._runCommand('stop', []);
    },
    
    initUrl : function () {
        let url = "http://192.168.253.1:82/Wildlife.wmv";//this.props.video.url
        this._runCommand('open', [url]);
        this.state.is_init = true;
    },
   

    _getHandle: function () {
        return React.findNodeHandle(this.refs.vitamio);
    },

    _runCommand: function (name, args) {
        NativeModules.UIManager.dispatchViewManagerCommand(
            this._getHandle(),
            NativeModules.UIManager.RCTVitamioView.Commands[name],
            args
        );
        
    },

    render() {
        
        /* <MapView
                    style={{ flex: 1, backgroundColor: 'red', }}
                    mapType={'satellite'} //1. 普通 2.卫星
                    trafficEnabled={true} //城市实时交通图
                    heatMapEnabled={true} //城市实时交通热力图
                    /> */
        let view = <ProgressBar styleAttr="Inverse" />
        let viewThumb = <View/>
        let ico_play = this.state.is_playing ? 'pause' : 'play';
        //console.log(VitamioView);      
        //<Text>{this.props.video.url}</Text>
        // buffSize="512000000"
        //cacheDir="xhamster"
        /*<Vitamio.VitamioView
                    ref="vitamio"
                    buffSize="10000000"
                    hw={true}
                    style={{ height: this.state.video_height, width: this.state.video_width, }}
                    streamUrl={this.props.video.url}/>
                    
                    <TouchableHighlight style={{alignItems: 'center',}}  onPress={this.start2pause} underlayColor ='transparent'>
                    <Icon name={ico_play}  color={'red'} size={42}/>
                    </TouchableHighlight>
                    
                    <TouchableHighlight style={{alignItems: 'center',}}  onPress={this.stop} underlayColor ='transparent'>
                    <Icon name={'stop'}  color={'red'} size={42}/>
                    </TouchableHighlight>
                     */
        if(this.state.video_height == 1) {
            viewThumb = <View style={{
                flex: 1,
                height: 240,
                alignItems: 'center',
            }}>
                <Image style={{ height: 240, width: 320, }} 
                source={{uri: this.props.data.thumb}}/>
            </View>
            
        }     
        if (!this.props.video.isloading && this.props.video.url)
            view = <View style={{
                flex: 1,
                alignItems: 'center',
            }}>
            
            <Vitamio.VitamioView
                    ref="vitamio"
                    buffSize="10000000"
                    hw={true}
                    style={{ height: this.state.video_height, width: this.state.video_width, }}
                    />
                    
                    <TouchableHighlight style={{alignItems: 'center',}}  onPress={this.start2pause} underlayColor ='transparent'>
                    <Icon name={ico_play}  color={'red'} size={42}/>
                    </TouchableHighlight>
                     
                
            </View>

        let textInfo = "isbuffering:" + this.state.isbuffering + " rating:" + this.state.rating + " percent:" + this.state.percent;
        
        return (

            <View style={{ flex: 1, backgroundColor: 'white', }}>
                <ToolBar
                    leftbutton={{ icon: 'android-arrow-back', click: this._clickLeft }}
                    titleColor="white"
                    style={styles.toolbar}
                    title="视频播放">
                </ToolBar>
                <View style={{alignItems: 'center',padding:20,}}>
                <Text>{this.props.data.title}</Text>
                </View>
                {viewThumb}
                {view}
            </View>
        );
    },
});


var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    video: {
        flex: 1,
        flexDirection: 'row',
        height: 240,
        width: 320,
    },
});



function select(store) {
    return {
        video: store.video,
    };
}


module.exports = connect(select)(AccountInfo);

