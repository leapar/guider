'use strict';

var XHAMSTER = {
    info : {
        logo: 'http://stec-site.xhcdn.com/images/logo/logo.png',
        name: 'xhamster',
        url: 'http://xhamster.com/',
    },
    url: {
        pre: 'http://m.xhamster.com/fresh/',
        end: '.html',
        begin: 1,
        url1: 'http://m.xhamster.com/fresh.html',
    },
    list: {
        tag: 'div.item-container',
        item: [
            {
                name : 'link',
                tag: 'a',
                func: 'attr',
                arg: 'href',
            },
            {
                name : 'thumb',
                tag: 'img.thumb',
                func: 'attr',
                arg: 'src',
            },
            {
                name : 'time',
                tag: 'div.time',
                func: 'text',
            },
            {
                name : 'rating',
                tag: 'div.rating',
                func: 'text',
            },
            {
                name : 'title',
                tag: 'div.item_name',
                func: 'text',
            },
        ]
    },
    detail: {
        tag: '#play',
        item: [
            {
                name : 'url',
                tag: 'a',
                func: 'attr',
                arg: 'href',
            },
        ],
    },
};


var KEDOU = {
    info : {
        logo: 'http://kedou.share.video.zipaicao.com/images/logo.png',
        name: '蝌蚪窝',
        url: 'http://www.kedou.share.video.zipaicao.com/',
        clearCookie : true,
    },
    url: {
        pre: 'http://www.kedou.share.video.zipaicao.com/latest-updates/',
        end: '/',
        begin: 1,
    },
    list: {
        tag: 'div.item',
        item: [
            {
                name : 'link',
                tag: 'a',
                func: 'attr',
                arg: 'href',
            },
            {
                name : 'thumb',
                tag: 'img.thumb',
                func: 'attr',
                arg: 'data-original',
            },
            {
                name : 'time',
                tag: 'div.duration',
                func: 'text',
            },
            {
                name : 'rating',
                tag: 'div.rating',
                func: 'text',
            },
            {
                name : 'title',
                tag: 'strong.title',
                func: 'text',
            },
        ]
    },
    detail: {
        tag: 'script',
        index : 8,
        item: [
            {
                name : 'url',
                tag: 'script',
                func: 'reg_exp',
                arg: "video_url: '(.*?)\\/'",
            },
        ]
    },
};

//http://www.avtb.me/embed/4357/#iframeload
var AVTAOBAO = {
    info : {
        logo: 'http://www.avtb.me/templates/defboot/images/logo.png',
        name: 'AVTAOBAO',
        url: 'http://www.avtb.me/',
        clearCookie : true,
    },
    url: {
        pre: 'http://www.avtb.me/recent/',
        end: '/',
        begin: 1,
        url1: 'http://www.avtb.me/recent/',
    },
    list: {
        tag: 'div.video',
        item: [
            {
            
                name : 'link',
                tag: 'a',
                func: 'attr',
                arg: 'href',
            },
            {
                name : 'thumb',
                tag: 'img',
                func: 'attr',
                arg: 'src',
            },
            {
                name : 'time',
                tag: 'span.video-overlay',
                func: 'text',
            },
            {
                name : 'rating',
                tag: 'span.video-rating',
                func: 'text',
            },
            {
                name : 'title',
                tag: 'span.video-title',
                func: 'text',
            },
        ]
    },
    detail: {
        tag: '#player',
        item: [
            {
                name : 'url',
                tag: 'source',
                func: 'attr',
                arg: "src",
            },
        ]
    },
};


var VQUYI = {
    info : {
        logo: 'http://www.vquyi.com/templets/default/logo.png',
        name: '德云社2016',
        url: 'http://www.vquyi.com/',
    },
    url: {
        pre: 'http://www.vquyi.com/html/deyunshe/2016/',
        end: '.html',
        begin: 1,
    },
    list: {
        usejs: "http://leapar.github.io/vquyi.js",
    },
    detail: {
        tag: 'body',
        usejs: ["http://leapar.github.io/vquyi-detail.js","http://leapar.github.io/video.js"],
    },
};

var VVYL = {
    info : {
        logo: 'http://www.51vv.com/images_1405/logo.png',
        name: 'VV娱乐社区',
        url: 'http://www.51vv.com/',
    },
    url: {
        pre: 'http://www.51vv.com/music/sod_mv.htm?categoryID=1729&order=CreateTime&curPage=',
        end: '',
        begin: 1,
    },
    list: {
        usejs: "http://leapar.github.io/vv51list.js",
    },
    detail: {
        usejs: ["http://leapar.github.io/video.js"],
    },
};

//
var YYT = {
    info : {
        logo: 'http://s.yytcdn.com/v2/images/topbar/20160617_logo.png',
        name: '音悦台',
        url: 'http://mv.yinyuetai.com/',
    },
    url: {
        pre: 'http://mv.yinyuetai.com/all?pageType=page&sort=weekViews&tab=allmv&parenttab=mv&page=',
        end: '',
        begin: 1,
    },
    list: {
        tag: 'ul.clearfix li',
        item: [
            {
                name : 'link',
                tag: 'a',
                func: 'attr',
                arg: 'href',
            },
            {
                name : 'thumb',
                tag: 'img',
                func: 'attr',
                arg: 'src',
            },
            {
                name : 'time',
                tag: 'div.v_time_num',
                func: 'text',
            },
            {
                name : 'rating',
                tag: 'a.c3.name',
                func: 'text',
            },
            {
                name : 'title',
                tag: 'img',
                func: 'attr',
                arg: 'title',
            },
        ]
    },
    detail: {
        usejs: ["http://leapar.github.io/video.js"],
    },
};



const SITES = [XHAMSTER,AVTAOBAO,KEDOU,VQUYI,VVYL,YYT];
module.exports = SITES;

