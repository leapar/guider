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
    TextInput,
    TouchableHighlight,
    ProgressBarAndroid,
    ListView,
     Alert,
} = React;
import DBMamager from "../../utils/db_schema";
var {GiftedForm, GiftedFormManager} = require('react-native-gifted-form');
var ToolBar = require('../main/ToolBar.android');
var Icon = require('react-native-vector-icons/Ionicons');
var { skipLogin } = require('../../actions');
var { connect } = require('react-redux');
const LoginView = require('./loginView');
var Relay = require('react-relay');
var RelayRenderer = require('react-relay/lib/RelayRenderer.js');
class MainRoute extends Relay.Route {}
MainRoute.queries = { viewer: () => Relay.QL`query { viewer }` };
MainRoute.routeName = 'MainRoute';
var ActivityIndicatorIOS = require('ActivityIndicatorIOS');
var Platform = require('Platform');
const ActivityIndicator = Platform.OS === 'ios'
  ? ActivityIndicatorIOS
  : ProgressBarAndroid;
  
  
   class FailedComponent extends React.Component {
    componentDidMount() {
      if (__DEV__) {
        console.error(this.props.error);
      }

      Alert.alert('Network Request Failed', null, [
        { text: 'Retry', onPress: () => {
          this.props.retry();
        }},
        { text: 'Cancel' },
      ]);
      return;
    }

    render() {
      return <View   {...this.props} />;
    }
  }
  
class RelayLoading extends React.Component {
    // render={({props}) => this.renderChild(child, props)}
    
  render() {
    const child = React.Children.only(this.props.children);
    if (!child.type.getFragmentNames) {
      return child;
    }
    return (
      <RelayRenderer
        Container={child.type}
        queryConfig={new MainRoute()}
        environment={Relay.Store}
     
        
        render={({ done, error, props, retry, stale }) => {
            if (error) { // error
              return <FailedComponent   retry={retry} error={error}    />;
            } else if (props) { // fetched
              return <View   />;
            } else { // loading
              return <View    />;
            }
          }}
          
      />
    );
  }

  renderChild(child, props) {
    if (!props) {
      return (
        <View style={{height: 400}}>
          {child.props.renderHeader && child.props.renderHeader()}
          <View style={{flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center'}}>
            <ActivityIndicator />
          </View>
        </View>
      );
    }
    return React.cloneElement(child, {...this.props, ...props});
  }
}

const Login = React.createClass({
    render() {
        let load_view = null;
        if (this.props.isloading) {
            load_view = <View style={{ flex: 1, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent', }}>
                <ProgressBarAndroid styleAttr='Large'/>
            </View>;
        }
        else {
            load_view = <View/>;
        }
        return (
            <View style={{ flex: 1, backgroundColor: 'white', }}
            RelayRenderer
            
            >
                <ToolBar
                    titleColor="white"
                    style={styles.toolbar}
                    title="登录">
                </ToolBar>
                
                 <RelayLoading
      >
                   <InfoList/></RelayLoading>
                <LoginView/>
                        
                {load_view}

            </View>
        );
    },
});


function InfoList({viewer: {config, faqs, pages}, ...props}) {
    /**\        network={config.wifiNetwork}
            password={config.wifiPassword}
            */
  return (
 
        <View
     network={config.wifiNetwork}
            password={config.wifiPassword}
            faqs={faqs}
             {...props}
          ></View>
  );
}

InfoList = Relay.createContainer(InfoList, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        config {
          wifiNetwork
          wifiPassword
        }
        faqs {
          question
          answer
        }
        pages {
          title
          url
          logo
        }
      }
    `,
  },
});


var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    item_icon: {
        // position: 'absolute',
        left: 0,
        height: 20,
        width: 20,
        // marginTop: 10,
        marginLeft: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

module.exports = connect()(Login);
