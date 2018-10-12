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
    TouchableOpacity,
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
        if(_accountInfo.state.orient != 'PORTRAIT') {
            _accountInfo._changeOrient();
            return true;
        }
        _accountInfo.stop();
        _navigator.pop();
        return true;
    }
    return false;
});


var {height, width} = Dimensions.get('window');

var WebViewBridge = require('react-native-webview-bridge');
import Orientation from 'react-native-orientation';



const htmlCode = `
<script type="text/javascript" src="http://libs.useso.com/js/jquery/2.0.0/jquery.min.js"></script>
<script type="text/javascript" src="https://leapar.github.io/youku.js"></script>
`;

var WINDOW_WIDTH = width;
var WINDOW_HEIGHT = height;

const AccountInfo = React.createClass({
    _clickLeft() {
        if(this.state.orient != 'PORTRAIT') {
            this._changeOrient();
            return;
        }
        Orientation.lockToPortrait();
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
                width:0,
                height:0,
            },
            duration_info: {
                duration: 1,
                position: 0,
            },
            pannel: {
                hide : false,
            },
            tips : '正在获取地址...',
            inject: {
                js: false,
                step: 0,
            }
        }
    },


 
    onRefresh() {
        this._runCommand('pause', []);
        console.log("onRefresh");
        let state = this.getInitialState();
        this.setState(state);
        this.initByProp();
    },

    initByProp() {
        if(this.props.site.detail.usejs) {
            let js = this.getInjectJs(this.props.site.detail.usejs[0]);
            console.log(js);
            let url = this.props.data.link;
            if(url.indexOf("/") == 0) {
                url = this.props.site.info.url +  url;
            }
            this.setState({
                inject: {
                    js: js,
                    url:url,
                    step: 0,
                }
            });
        } else {
            this.props.dispatch(loadDetail(this.props.site, this.props.data.link));
        }
    },


    componentDidMount: function () {
        console.log(this.props.data.link);
        console.log(this.props.data);
        this.is_unmount = false;
        this.pushlisteners = [
            Vitamio.VitamioListener.addEventListener(Vitamio.Event.MediaInfo, this.onMediaInfo),
            Vitamio.VitamioListener.addEventListener(Vitamio.Event.MediaBuffer, this.onMediaBuffer),
            Vitamio.VitamioListener.addEventListener(Vitamio.Event.MediaSize, this.onMediaSize),
            Vitamio.VitamioListener.addEventListener(Vitamio.Event.MediaDuration, this.onDuration),
            Vitamio.VitamioListener.addEventListener(Vitamio.Event.MediaError, this.onMediaError),
            Vitamio.VitamioListener.addEventListener(Vitamio.Event.MediaComplete, this.onMediaComplete),
            
        ]

        _navigator = this.props.navigator;

        
        if(this.props.site.detail.usejs) {
            let js = this.getInjectJs(this.props.site.detail.usejs[0]);
            console.log(js);
            let url = this.props.data.link;
            if(url.indexOf("/") == 0) {
                url = this.props.site.info.url +  url;
            }
            this.setState({
                inject: {
                    js: js,
                    url:url,
                    step: 0,
                }
            });
        } else {
            this.props.dispatch(loadDetail(this.props.site, this.props.data.link));
        }

        const orient = Orientation.getInitialOrientation();
        this.setState({
            orient: orient,
        });
        Orientation.addOrientationListener(this._updateOrientation);
    },

    _setVideoSize() {
        var {height, width} = Dimensions.get('window');
        console.log(width+"--,"+height);
        console.log("this.state.video_info.width:"+this.state.video_info.width);
        console.log("this.state.video_info.height:"+this.state.video_info.height);
        if(WINDOW_WIDTH < WINDOW_HEIGHT) {
           if(this.state.video_info.width > 0) {
                let w = this.state.video_info.width * 240 / this.state.video_info.height;
                let h = 240;
                if(w > width) {
                    w = width;
                    h = this.state.video_info.height * width / this.state.video_info.width;
                } 
                
                this.setState({
                    video_width: w,
                    video_height: h,
                });
           }

        } else {
            if(this.state.video_info.width > 0) {
                let w = this.state.video_info.width * width / this.state.video_info.height;
                let h = width;
                if(w > height) {
                    w = height;
                    h = this.state.video_info.height * height / this.state.video_info.width;
                } 

                console.log(w+","+h);
                
                this.setState({
                    video_width: w,
                    video_height: h,
                });
           }
            
        }
    },

    _updateOrientation(or) {
        this.setState({ orient:or });

        this._setVideoSize();

    },

    componentWillUnmount() {
        this.is_unmount = true;
        //this._runCommand('stop', []);
        this.pushlisteners.forEach(listener => {
            Vitamio.VitamioListener.removeEventListener(listener);
        });

        Orientation.removeOrientationListener(this._updateOrientation);
    },

    getInjectJs(jsurl) {
        let injectScript = `
        (function(){
            if(typeof(document) == 'undefined' || document == null)
                return;
            if(typeof(document.body) == 'undefined' || document.body == null)
                return;
            if(typeof(document.URL) == 'undefined' || document.URL == null)
                return;    
            if(document.getElementById("injectjs"))
                return;    
            console.log("inject");
            var e=document.createElement("script");
            e=document.createElement("script");
            e.setAttribute("src","`+jsurl+`");
            e.setAttribute('id','injectjs');
            document.body.appendChild(e);
            e=document.createElement("script");
        }());
        `;

        return injectScript;
    },




     onBridgeMessage(message) {
         if(this.is_unmount) return;
        const { webviewbridge } = this.refs;

        console.log(message);
        /*switch (message) {
        case "hello from webview":
            webviewbridge.sendToBridge("hello from react-native");
            break;
        case "got the message inside webview":
            console.log("we have got a message from webview! yeah");
            break;
        }*/

        if(message != null && message != "") {
            let data = JSON.parse(message);
            if(data.type != 'detail')
                return;
            if(data.url == undefined || data.url == null || data.url == '')
                return;
            
            let step = this.state.inject.step;    
            if(step < this.props.site.detail.usejs.length - 1) {
                step = step + 1;
                let js = this.getInjectJs(this.props.site.detail.usejs[step]);
                
                this.setState({
                    inject: {
                        step: step,
                        url: data.url,
                        js: js,
                    }
                });

                return;
            }
          

            if(data.isok) {
                if(data.json) {
                    let site = this.props.site;
                    site.detail.item = data.json;
                    this.props.dispatch(loadDetail(site, data.url));    
                } else {
                    this.setState({
                        tips : '地址获取成功',
                    });
                    if (!this.state.is_init)
                        this.initUrl(data.url);
                }
                
            } else {
                this.setState({
                    tips : '地址获取失败',
                });
            }
           

        } else {
            this.setState({
                tips : '地址获取失败',
            });
        }
    },


    componentWillReceiveProps(nextProps) {

        if (nextProps.video.url != null && nextProps.video.url != "") {
            this.setState({
                tips : '地址获取成功',
            });
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
                width: this.state.video_info.width,
                height: this.state.video_info.height,
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

    onMediaError(message) {
        this.setState({
            is_playing: false,
        });

        this.start2pause();
        
    },

    onMediaComplete(message) {
        this.onRefresh();
    },
    

    onMediaSize(message) { 

        this.setState({
                video_info: {
                    width: message.width,
                    height: message.height,
                    duration: '',
                    position: '',
                },
            })

       

        this._setVideoSize();

        this.hidePannel();
 
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

    hidePannel : function() {
        this.setState({
            pannel : {
                hide : true,
            }

        });
    },
    showPannel : function() {
        this.setState({
            pannel : {
                hide : false,
            }

        });
    },

    stop: function () {
        if (this.state.video_width > 1)
            this._runCommand('stop', []);
    },

    initUrl: function (url) {
      //  let url = this.props.video.url;//
      // url = "http://leapar.github.io/Wildlife.wmv";//
      if(url == null || url == '')
      return;
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

    _seekTo(pos) {
        console.log(pos);
        pos = parseInt(pos);
        console.log(pos);
        this._runCommand('seek', [pos]);
    },

    _changeOrient() {
        console.log("_changeOrient");
        var {height, width} = Dimensions.get('window');
        if(this.state.orient == 'PORTRAIT') {
           Orientation.lockToLandscape();
           
           WINDOW_WIDTH = height;
            WINDOW_HEIGHT = width;
        } else {
            Orientation.lockToPortrait();  
            WINDOW_WIDTH = width;
            WINDOW_HEIGHT = height;
        }
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

        if (this.state.video_height == 1) {
            viewThumb =
                <Image style={{ height: this.state.orient == 'PORTRAIT' ?  240 : WINDOW_HEIGHT, width: WINDOW_WIDTH, position: 'absolute', }}
                    source={{ uri: this.props.data.thumb }}/>

        }
        let view = <View/>;
        let viewLoding = <ProgressBar styleAttr="Inverse"  style={{ alignItems: 'center',marginTop: ((this.state.orient == 'PORTRAIT' ?  240 : WINDOW_HEIGHT) -20) / 2, }} />


        view = <View style={{ height: this.state.video_height > 1 ? (this.state.orient == 'PORTRAIT' ?  240 : WINDOW_HEIGHT) : this.state.video_height , backgroundColor : 'black', left: 0, position: 'absolute', width: WINDOW_WIDTH, }}>
            <Vitamio.VitamioView
                ref="vitamio"
                buffSize="100000000"
                hw={true}
                style={{ height: this.state.video_height, left: (WINDOW_WIDTH - this.state.video_width) / 2,top: ((this.state.orient == 'PORTRAIT' ?  240 : WINDOW_HEIGHT) - this.state.video_height) / 2,position: 'absolute', width: this.state.video_width, }}
                /></View>;
                
        if (this.state.is_init) {
            viewLoding =
                <TouchableHighlight style={{width:42,height:42, alignSelf:'center', alignItems: 'center', marginTop: ((this.state.orient == 'PORTRAIT' ?  240 : WINDOW_HEIGHT) -20) / 2}}  onPress={this.start2pause} underlayColor ='transparent'>
                    <Icon name={ico_play}  color={'white'} size={42}/>
                </TouchableHighlight>;
        }


        let pannel = <View/>;
        if(this.state.pannel.hide == false) {
            pannel = <TouchableOpacity  style={{height:this.state.orient == 'PORTRAIT' ?  240 : WINDOW_HEIGHT,width:WINDOW_WIDTH,}} onPress={this.hidePannel}>
                    <View style={{ backgroundColor: '#0000003f', padding: 10, paddingTop: 5, paddingBottom: 2, width: WINDOW_WIDTH, flex: 1, position: 'absolute', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Icon name={'android-arrow-back'} style={{width:40, }} color={'white'} size={32} onPress={this._clickLeft}/>
                        <Icon name={this.state.orient == 'PORTRAIT' ? 'arrow-expand': 'arrow-shrink' }  color={'white'} style={{width:40, }} size={32} onPress={this._changeOrient}/>
                        <Icon name={'more'}  color={'white'} size={24}/>
                    </View>

                    <View style={{ top: this.state.orient == 'PORTRAIT' ?  210 : WINDOW_HEIGHT-54, width: WINDOW_WIDTH, paddingRight: 10, position: 'absolute', backgroundColor: '#0000003f', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ color: 'white', fontSize: 12, alignSelf: 'center', marginLeft: 5, }}>{this.state.video_info.position}</Text>

                        <View style={{ flexDirection: 'row', height:32,}}>
                            <Text style={{ color: 'white', fontSize: 12, alignSelf: 'center', marginRight: 5, }}>{this.state.video_info.duration}</Text>
                            
                        </View>
                    </View>

                    {viewLoding}
              	</TouchableOpacity >;
        } else {

            pannel = <TouchableOpacity  style={{height:240,width:WINDOW_WIDTH,}} onPress={this.showPannel}>
                    </TouchableOpacity >;
 
        }


        let textInfo = "isbuffering:" + this.state.isbuffering + " rating:" + this.state.rating + " percent:" + this.state.percent;
        let injectView = <View/>;
        if(!this.state.is_init && this.state.inject.js && this.state.inject.url != undefined && this.state.inject.url != "") {
            console.log("urururuu:"+this.state.inject.url);
            injectView = <WebViewBridge
                        ref="webviewbridge"
                        onBridgeMessage={this.onBridgeMessage}
                        javaScriptEnabled={true}
                        injectedJavaScript={this.state.inject.js}
                        style={{width:100,height:100,}}
                        source={{uri: this.state.inject.url}}/>
        }

        let titleView = <View/>;
        let tipsView = <View/>;
        if(this.state.orient == 'PORTRAIT') {
            titleView = <Text style={{ marginTop: 10, fontSize: 16, marginLeft: 10, }}>{this.props.data.title}</Text>;

            tipsView = <Text style={{color: 'gray',marginTop: 10, fontSize: 10,marginLeft : 10,}}>{this.state.tips}</Text>;
        }

        return (

            <View style={{ flex: 1, backgroundColor: 'white', }}>
                {viewThumb}
                {view}

                {pannel}

                {titleView}

                {tipsView}

                <Slider style={{ top: this.state.orient == 'PORTRAIT' ?  219 : WINDOW_HEIGHT-50, width: WINDOW_WIDTH, position: 'absolute', }}
                    trackStyle={SliderStyles.track}
                    thumbStyle={SliderStyles.thumb}
                    minimumTrackTintColor='#ff0000'
                    maximumTrackTintColor='#0000006f'
                    disabled={this.state.duration_info.duration < 10}
                    onSlidingComplete={this._seekTo}
                    thumbTouchSize={{ width: 50, height: 40 }}
                    value={this.state.duration_info.position}
                    maximumValue={this.state.duration_info.duration}
                    />
                 {injectView}
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

