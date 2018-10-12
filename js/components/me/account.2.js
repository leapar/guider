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
var Slider = require('react-native-slider');
var ProgressBar = require('ProgressBarAndroid');
//var MapView = require('react-native-maps');
var Vitamio = require('react-native-android-vitamio');
var ToolBar = require('../main/ToolBar.android');
//ar Video = require('react-native-video');
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

var {height, width} = Dimensions.get('window');


const WINDOW_WIDTH = width;
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
            is_playing: false,
            is_init: false,
            video_info: {
                duration: '',
                position: '',
            },
            duration_info: {
                duration: 1,
                position: 0,

            }
        }
    },


    componentDidMount: function () {
        this.pushlisteners = [


            Vitamio.VitamioListener.addEventListener(Vitamio.Event.MediaInfo, this.onMediaInfo),
            Vitamio.VitamioListener.addEventListener(Vitamio.Event.MediaBuffer, this.onMediaBuffer),
            Vitamio.VitamioListener.addEventListener(Vitamio.Event.MediaSize, this.onMediaSize),
            Vitamio.VitamioListener.addEventListener(Vitamio.Event.MediaDuration, this.onDuration),
        ]

        _navigator = this.props.navigator;
        this.props.dispatch(loadDetail(this.props.site, this.props.data.link));
    },

    componentWillUnmount() {
        //this._runCommand('stop', []);
        this.pushlisteners.forEach(listener => {
            Vitamio.VitamioListener.removeEventListener(listener);
        });
    },

    componentWillReceiveProps(nextProps) {

        if (nextProps.video.url != null) {
            if (!this.state.is_init)
                this.initUrl(nextProps.video.url);
        }

    },

    convertDuration(itime) {
        if (itime == -1)
            return "";
        let totalSeconds = parseInt(itime);
        totalSeconds = parseInt(totalSeconds / 1000);

        let seconds = totalSeconds % 60;
        let minutes = parseInt(totalSeconds / 60) % 60;
        let hours = parseInt(totalSeconds / 3600);

        if (hours > 0)
            return hours + ":" + minutes + ":" + seconds;

        return minutes + ":" + seconds;

    },

    onDuration(message) {
        let duration = this.convertDuration(message.duration);
        let position = "";
        if (message.duration > 0) {
            position = this.convertDuration(message.percent);
        }
        this.setState({
            video_info: {
                duration: duration,
                position: position,
            },
        })
     //   console.log(message);
        if (message.duration > 0) {
            this.setState({
                duration_info: {
                    duration: message.duration,
                    position: message.percent,
                },
            })
        }

    },

    onMediaSize(message) {
        var {height, width} = Dimensions.get('window');

        this.setState({
            video_width: message.width * 240 / message.height,
            video_height: 240,
        });
        this.state.is_init = true;
        this.start2pause();
        return;
        /*
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
        }*/


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



        if (this.state.is_playing) {
            this.setState({
                is_playing: false,
            });
            this._runCommand('pause', []);

        } else {
            this.setState({
                is_playing: true,
            });
            this._runCommand('start', []);

        }

    },

    stop: function () {
        if (this.state.video_width > 1)
            this._runCommand('stop', []);
    },

    initUrl: function (url) {
      //  let url = this.props.video.url;//
       url = "http://192.168.253.1:82/Wildlife.wmv";//
        this._runCommand('open', [url]);
    },

    _getHandle: function () {
        return React.findNodeHandle(this.refs.vitamio);
    },

    _runCommand: function (name, args) {
        let handle = this._getHandle();
        if(handle == null) return;
        NativeModules.UIManager.dispatchViewManagerCommand(
            handle,
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
        let left = (WINDOW_WIDTH - 320) / 2;
        if (this.state.video_height == 1) {
            viewThumb =
                <Image style={{ height: 240, width: WINDOW_WIDTH, position: 'absolute', }}
                    source={{ uri: this.props.data.thumb }}/>

        }
        let view = <View/>;
        let viewLoding = <ProgressBar styleAttr="Inverse"  style={{ alignItems: 'center',marginTop: 100, }} />


        view = <View style={{ height: this.state.video_height, backgroundColor : 'black', left: 0, position: 'absolute', width: WINDOW_WIDTH, }}>
            <Vitamio.VitamioView
                ref="vitamio"
                buffSize="100000000"
                hw={true}
                style={{ height: this.state.video_height, left: (WINDOW_WIDTH - this.state.video_width) / 2, position: 'absolute', width: this.state.video_width, }}
                /></View>;

        if (this.state.is_init) {
            viewLoding =
                <TouchableHighlight style={{ alignItems: 'center', marginTop: 100, }}  onPress={this.start2pause} underlayColor ='transparent'>
                    <Icon name={ico_play}  color={'white'} size={42}/>
                </TouchableHighlight>;
        }


        let textInfo = "isbuffering:" + this.state.isbuffering + " rating:" + this.state.rating + " percent:" + this.state.percent;

        return (

            <View style={{ flex: 1, backgroundColor: 'white', }}>
                {viewThumb}
                {view}
                <View style={{ backgroundColor: '#0000003f', padding: 10, paddingTop: 5, paddingBottom: 2, width: WINDOW_WIDTH, flex: 1, position: 'absolute', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Icon name={'android-arrow-back'}  color={'white'} size={32} onPress={this._clickLeft}/>
                    <Icon name={'more'}  color={'white'} size={24}/>
                </View>

                <View style={{ top: 210, width: WINDOW_WIDTH, paddingRight: 10, position: 'absolute', backgroundColor: '#0000003f', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ color: 'white', fontSize: 12, alignSelf: 'center', marginLeft: 5, }}>{this.state.video_info.position}</Text>

                    <View style={{ flexDirection: 'row', }}>
                        <Text style={{ color: 'white', fontSize: 12, alignSelf: 'center', marginRight: 5, }}>{this.state.video_info.duration}</Text>
                        <Icon name={'arrow-expand'}  color={'white'} size={28}/>
                    </View>
                </View>

                {viewLoding}


                <Text style={{ marginTop: 110, fontSize: 16, marginLeft: 10, }}>{this.props.data.title}</Text>

                <Slider style={{ top: 219, width: WINDOW_WIDTH, position: 'absolute', }}
                    trackStyle={SliderStyles.track}
                    thumbStyle={SliderStyles.thumb}
                    minimumTrackTintColor='#ff0000'
                    maximumTrackTintColor='#0000006f'
                    disabled={true}
                    thumbTouchSize={{ width: 50, height: 40 }}
                    value={this.state.duration_info.position}
                    maximumValue={this.state.duration_info.duration}
                    />
            </View>
        );
    },
});

var SliderStyles = StyleSheet.create({
    track: {
        height: 2,
        borderRadius: 0,
    },
    thumb: {
        width: 10,
        height: 10,
        borderRadius: 10 / 2,
        backgroundColor: 'red',
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 2,
        shadowOpacity: 1,
    }
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

