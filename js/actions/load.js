'use strict';


import type { Action, ThunkAction } from './types';
//import fetch from 'isomorphic-fetch';要用自带的fetch 否则4g下面容易超时
const InteractionManager = require('InteractionManager');
import { NativeModules } from 'react-native';
//var DomParser = require('react-native-html-parser').DOMParser
//var CookieManager = require('react-native-cookies');
import SITES from '../config';
var RCTNetworking = require('RCTNetworking');

const PARSER_OPTION = {
    /**
     * locator is always need for error position info
     */
    locator: {},
    /**
     * you can override the errorHandler for xml parser
     * @link http://www.saxproject.org/apidoc/org/xml/sax/ErrorHandler.html
     */
    //errorHandler:{warning:function(w){console.warn(w)},error:callback,fatalError:callback}
    //only callback model
    errorHandler: function (level, msg) { console.log(level, msg) }
};

function loadOver(data, page) {
    return {
        type: 'LOAD_OVER',
        data: data,
        page: page,
    };
}

function loadDetailOver(url) {
    return {
        type: 'LOAD_DETAIL_OVER',
        url: url,
    };
}
function loadDetailBegin() {
    return {
        type: 'LOAD_DETAIL_BEGIN',
    };
}


function getElemData(parent, obj) {
    let result = null;
    let element = null;
    if (obj.tag != undefined) {
        element = parent.querySelect(obj.tag)[obj.index];
    } else {
        element = parent.getElementsByAttribute(obj.attrName, obj.attrValue)[obj.index];
    }
    if (obj.arg != undefined)
        result = element[obj.func](obj.arg);
    else
        result = element[obj.func];

    return result;
}


function fetchYouku(url) {
    fetch(url, null).then(response => {
        if (response.status >= 200 && response.status < 300) {
            return response;
        } else {

        }
    }).then(response => {
        
    }).catch(e => {
        console.log(e);
        InteractionManager.runAfterInteractions(() => {
            dispatch(loadDetailOver(null));
        });
    });

}


function loadDetail(siteinfo,url): Action {
     
    if(url.indexOf("/") == 0) {
        url = siteinfo.info.url +  url;
    } 
    if(siteinfo.info.clearCookie) {
        // clear cookies
        /*CookieManager.clearAll((err, res) => {
            console.log('cookies cleared!');
            console.log(err);
            console.log(res);
        });*/

         RCTNetworking.clearCookies((cleared) => {
            
        });
    }
    

//RCTNetworking clearCookies
    return (dispatch) => {
        dispatch(loadDetailBegin());
        return fetch(url, {timeout: 10000,}, ).then(response => {
            if (response.status >= 200 && response.status < 300) {
                return response;
            } else {

                InteractionManager.runAfterInteractions(() => {
                    dispatch(loadDetailOver(null));
                });
            }
        }).then(response => {
            return response.text();
        }).then(object => {
            // console.log(object);

            NativeModules.HTMLParser.getListInfo(object, url, JSON.stringify(siteinfo.detail))
                .then(content => {
                    //console.log(content);
                    InteractionManager.runAfterInteractions(() => {
                        content = JSON.parse(content);
                        console.log(content);
                        if (content.length 　> 0)
                            dispatch(loadDetailOver(content[0].url));
                        else
                            dispatch(loadDetailOver(null));
                    });
                    //resolve && resolve(name);
                }, err => {
                    //reject && reject(err);
                    InteractionManager.runAfterInteractions(() => {
                        dispatch(loadDetailOver(null));
                    });
                });




        }).catch(e => {
            console.log(e);
            InteractionManager.runAfterInteractions(() => {
                dispatch(loadDetailOver(null));
            });
        });
    };
}

function getListPageUrl(siteinfo,page) {
    let page_url = null;

    page = Math.max(page, siteinfo.url.begin);

    page_url = siteinfo.url["url" + page];
    if (page_url == undefined) {
        page_url = siteinfo.url.pre + page + siteinfo.url.end;
    }

    return page_url;
}

function listLoadOK(data, page) {
    return {
        type: 'LIST_LOAD_OK',
        data: data,
        page: page,
    };
}

function listLoadError(msg,page) {
    return {
        type: 'LIST_LOAD_ERROR',
        error: msg,
        page: page,
    };
}

function listLoadBegin(page) {
    return {
        type: 'LIST_LOAD_BEGIN',
        page: page,
    };
}

async function fetchListData(siteinfo,url) {
     return await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36',
            },
            timeout: 10000,
        }).then(response => {
            console.log(response);
            if (response.status >= 200 && response.status < 300) {
                console.log("NativeModules response 000000");
                return response;
            } else {
                console.log("NativeModules response error");
                throw("response error");
            }
        }).then(response => {
            return response.text();
        }).then(object => {
            return NativeModules.HTMLParser.getListInfo(object, url, JSON.stringify(siteinfo.list))
                .then(content => {
                    console.log("NativeModules 111"+JSON.parse(content));
                    return {
                        content:JSON.parse(content),
                    };
                }, err => {
                    console.log("NativeModules 222"+err);
                    throw("parse error"+err);
                });
            //return "11111111111=============="; 
        }).catch(e => {
            console.log("error:"+e);
            throw("error:"+e);
        });
}

function _loadPageData(siteinfo,page) {
    let page_url = null;

    page = Math.max(page, siteinfo.url.begin);

    page_url = siteinfo.url["url" + page];
    if (page_url == undefined) {
        page_url = siteinfo.url.pre + page + siteinfo.url.end;
    }

    return dispatch => {
        dispatch(listLoadBegin(page));
        return fetchListData(siteinfo,page_url)
        .then(response => {
            console.log(response);
            /*InteractionManager.runAfterInteractions(() => {
                dispatch(loadOver(JSON.parse(content), page));
            });*/
            dispatch(listLoadOK(response.content, page));
        })
        .catch(e => {
            /*console.log(e);
            InteractionManager.runAfterInteractions(() => {
                dispatch(loadOver(null, page));
            });*/
            dispatch(listLoadError(e,page));
        });
        /*return fetch(page_url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36',
            },
            timeout: 10000,
        }).then(response => {
            //console.log(response);
            if (response.status >= 200 && response.status < 300) {
                return response;
            } else {

                InteractionManager.runAfterInteractions(() => {
                    dispatch(loadOver(null, page));
                });
            }
        }).then(response => {
            return response.text();
        }).then(object => {
            //console.log(NativeModules.HTMLParser);
            //console.log(JSON.stringify(siteinfo.list));
            NativeModules.HTMLParser.getListInfo(object, page_url, JSON.stringify(siteinfo.list))
                .then(content => {
                    //console.log(content);
                    InteractionManager.runAfterInteractions(() => {
                        dispatch(loadOver(JSON.parse(content), page));
                    });
                    //resolve && resolve(name);
                }, err => {
                    //reject && reject(err);
                    InteractionManager.runAfterInteractions(() => {
                        dispatch(loadOver(null, page));
                    });
                });

        }).catch(e => {
            console.log(e);
            InteractionManager.runAfterInteractions(() => {
                dispatch(loadOver(null, page));
            });
        });*/
    };
}

function loadData(siteinfo,page) {
    return _loadPageData(siteinfo,page);
}



async function fetchSiteList(url) {
     return await fetch(url, {
            timeout: 10000,
        }).then(response => {
            console.log(response);
            if (response.status >= 200 && response.status < 300) {
                return response;
            } else {
                throw("sites error");
            }
        }).then(response => {
            return response.text();
        }).then(content => {
            console.log("sites 111"+JSON.parse(content));
            return {
                content:JSON.parse(content),
            };
                
            //return "11111111111=============="; 
        }).catch(e => {
            console.log("error:"+e);
            throw("error:"+e);
        });
}

function siteLoadOK(data) {
    return {
        type: 'SITE_LOAD_OK',
        sites: data,
    };
}

function siteLoadError(msg) {
    return {
        type: 'SITE_LOAD_ERROR',
        error: msg,
    };
}

function siteLoadBegin() {
    return {
        type: 'SITE_LOAD_BEGIN',
    };
}

function loadSites() {

    return dispatch => {
        dispatch(siteLoadBegin());
        return fetchSiteList("https://leapar.github.io/sites.json")
        .then(response => {
            console.log(response);
            /*InteractionManager.runAfterInteractions(() => {
                dispatch(loadOver(JSON.parse(content), page));
            });*/
            dispatch(siteLoadOK(response.content));
        })
        .catch(e => {
            /*console.log(e);
            InteractionManager.runAfterInteractions(() => {
                dispatch(loadOver(null, page));
            });*/
            dispatch(siteLoadError(e));
        });
    }
    //https://leapar.github.io/sites.json

//console.log(JSON.stringify(SITES));

   /* return {
        type: 'LOAD_SITES_OVER',
        sites: SITES,
    };*/
}

module.exports = { loadData, loadDetail,loadSites,getListPageUrl, };