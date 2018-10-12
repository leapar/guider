
var Colors = require('../../constants/Colors');
var React = require('react-native');
var Icon = require('react-native-vector-icons/Ionicons');

var {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Animated,
} = React;

var styles = StyleSheet.create({
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        
    },
    tabItem: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    tabs: {
        height: 50,
        flexDirection: 'row',
        paddingTop: 5,
        borderBottomWidth: 0.5,
        borderBottomColor: Colors.backGray,
        backgroundColor : '#00a2ed',
    },
    icon: {

    },
});
var tabUnderlineStyle = null;
var left = null;
var TabBar = React.createClass({
    selectedTabIcons: [],
    unselectedTabIcons: [],

    propTypes: {
        goToPage: React.PropTypes.func,
        activeTab: React.PropTypes.number,
        tabs: React.PropTypes.array
    },

    renderTabOption(name, page) {
        var isTabActive = this.props.activeTab === page;
        const color = isTabActive ? Colors.backWhite : 'white'
        const tabName = name.tabName;
        const iconName = name.iconName;


        return (
            <TouchableOpacity
                key={tabName}
                onPress={() => this.props.goToPage(page) }
                style={styles.tab}>
                <View
                    style={styles.tabItem}
                    >

                    <Text style={[styles.icon, { color: color,fontSize : 18, }]}  >
                        {tabName}
                    </Text>

                </View>
            </TouchableOpacity>
        );
    },

    componentDidMount() {
        // this.setAnimationValue({value: this.props.activeTab});
        // this._listener = this.props.scrollValue.addListener(this.setAnimationValue);
    },



    render() {
        var containerWidth = this.props.containerWidth;
        var numberOfTabs = this.props.tabs.length;
        if (tabUnderlineStyle == null) {
            tabUnderlineStyle = {
                position: 'absolute',
                width: containerWidth / numberOfTabs,
                height: 4,
                backgroundColor: this.props.underlineColor || 'white',
                bottom: 0,
            };
        }

        if (left == null) {
            left = this.props.scrollValue.interpolate({
                inputRange: [0, 1], outputRange: [0, containerWidth / numberOfTabs]
            });
        }


        return (
                <View style={styles.tabs}>
                    {this.props.tabs.map((tab, i) => this.renderTabOption(tab, i)) }
                    <Animated.View style={[tabUnderlineStyle, { left }]} />
                </View>
        );
    },
});

module.exports = TabBar;
