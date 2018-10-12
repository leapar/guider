'use strict';

import type { Action, ThunkAction } from './types';
//import NetWorkUtil from '../utils/network';

function skipLogin(): Action {
  return {
    type: 'SKIPPED_LOGIN',
  };
}

function loginOut(): Action {
  return {
    type: 'LOGGED_OUT',
  };
}

function loadOver(): Action {
  return {
    type: 'LOAD_OVER',
  };
}

function login(tel: String,pwd : String) : ThunkAction {
   /* let dologin = NetWorkUtil.login(tel,pwd);    
    dologin.then(result => {
             console.log(result.allFilms.films);
    });*/
}



module.exports = { skipLogin,loadOver,loginOut };