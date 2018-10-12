
'use strict';

import type {Action } from '../actions/types';

export type State = {
  isloading: boolean,
  data: Array,
  page: int,
  error: string,
};

const initialState = {
  isloading: true,
  data: null,
  page: 0,
  error: null,
};

function load(state: State = initialState, action: Action): State {
  switch (action.type) {
    case 'LIST_LOAD_BEGIN':
      return {
        isloading: true,
        data: null,
        page: action.page,
        error: null,
      };
    case 'LIST_LOAD_ERROR':
      return {
        isloading: false,
        data: null,
        page: action.page,
        error: null,
      };
    case 'LIST_LOAD_OK':
      return {
        isloading: false,
        data: action.data,
        page: action.page,
        error: null,
      };
  }


  return state;
}



module.exports = load;