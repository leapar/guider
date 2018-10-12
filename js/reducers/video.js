
'use strict';

import type {Action } from '../actions/types';

export type State = {
  isloading: boolean,
  url: string,
};

const initialState = {
  isloading: true,
  url: null,
};



function video(state: State = initialState, action: Action): State {
  if (action.type === 'LOAD_DETAIL_OVER') {
    return {
      isloading: false,
      url: action.url,
    };
  } else if (action.type === 'LOAD_DETAIL_BEGIN') {
   // console.log('LOAD_DETAIL_BEGIN');
    return initialState;
  }
  return state;
}

module.exports = video;