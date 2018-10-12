'use strict';


import type { Action, ThunkAction } from './types';
var DomParser = require('react-native-html-parser').DOMParser
var URL = 'http://m.xhamster.com/';

function showDetail(data) {
    return {
        type: 'SHOW_DETAIL',
        data: data,
        route : 'story',
    };
}
module.exports = { showDetail };
