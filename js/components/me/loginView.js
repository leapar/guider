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
} = React;

var Icon = require('react-native-vector-icons/Ionicons');
var { skipLogin } = require('../../actions');
var { connect } = require('react-redux');
var {GiftedForm, GiftedFormManager} = require('react-native-gifted-form');

class LoginView extends React.Component {




    render() {
        const icon_phone = <View style={styles.item_icon}><Icon name={'ios-telephone'} style={styles.item_icon} color={'gray'} size={20}/></View>;

        const icon_pwd = <View style={styles.item_icon}><Icon name={'locked'} style={styles.item_icon} color={'gray'} size={20}/></View>;



        return (
            <GiftedForm
                formName= 'signupForm'
                validators= {{

                    phone: {
                        title: '手机号码',
                        validate: [{
                            validator: 'isLength',
                            arguments: [11, 11],
                            message: '请输入正确{TITLE}'
                        }, {
                                validator: 'matches',
                                arguments: /^1\d{10}/,
                                message: '请输入正确{TITLE}'
                            }]
                    },
                    password: {
                        title: '密码',
                        validate: [{
                            validator: 'isLength',
                            arguments: [6, 16],
                            message: '{TITLE} 必须是 {ARGS[0]} - {ARGS[1]} 个字符'
                        }]
                    },
                }}

                >
                <GiftedForm.TextInputWidget
                    name='phone'
                    title=''
                    image={icon_phone}
                    placeholder='请输入手机号码'
                    clearButtonMode='while-editing'
                    value=''


                    />


                <GiftedForm.TextInputWidget
                    name='password'
                    title=''
                    image={icon_pwd}
                    placeholder='请输入密码'
                    clearButtonMode='while-editing'


                    />

                <GiftedForm.SubmitWidget
                    title='确定'
                    requiredMessage='请输入：{TITLE}'
                    widgetStyles={{
                        submitButton: {
                            //backgroundColor: themes.mainColor,
                        }
                    }}
                    onSubmit={(isValid, values, validationResults, postSubmit = null, modalNavigator = null) => {
                        if (isValid === true) {
                            // prepare object
                            // values.gender = values.gender[0];
                            // values.birthday = moment(values.birthday).format('YYYY-MM-DD');

                            /* Implement the request to your server using values variable
                            ** then you can do:
                            ** postSubmit(['An error occurred, please try again']); // disable the loader and display an error message
                            ** postSubmit(['Username already taken', 'Email already taken']); // disable the loader and display an error message
                            ** GiftedFormManager.reset('signupForm'); // clear the states of the form manually. 'signupForm' is the formName used
                            */

                            // postSubmit();
                            //this.props.dispatch(skipLogin());
                            this.logIn();
                        }
                    } }

                    />

                <GiftedForm.NoticeWidget
                    title='By signing up, you agree to the Terms of Service and Privacy Policity.'
                    />


            </GiftedForm >
        );
    }

    async logIn() {
        const {dispatch, onLoggedIn} = this.props;

        this.setState({ isLoading: true });
        try {
            //合并Promise，谁先触发传递谁给返回值
            await Promise.race([
                dispatch(logInWithFacebook(this.props.source)),
                timeout(15000),
            ]);
        } catch (e) {
            const message = e.message || e;
            if (message !== 'Timed out' && message !== 'Canceled by user') {
                alert(message);
                console.warn(e);
            }
             GiftedFormManager.reset('signupForm');
            return;
        } finally {
            GiftedFormManager.reset('signupForm');
            this._isMounted && this.setState({ isLoading: false });
        }

        onLoggedIn && onLoggedIn();
    }
    
    
}

async function timeout(ms: number): Promise {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error('Timed out')), ms);
  });
}

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

module.exports = connect()(LoginView);