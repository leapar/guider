
'use strict';

import type {Action } from '../actions/types';

export type State = {
  isloading: boolean,
  data: Array,
  error: string,
};

const initialState = {
  isloading: true,
  data: null, 
  error: null,
};

function sites(state: State = initialState, action: Action): State {
  switch (action.type) {
    case 'SITE_LOAD_BEGIN':
      return {
        isloading: true,
        data: null,
        error: null,
      };
    case 'SITE_LOAD_ERROR':
      return {
        isloading: false,
        data: null,
        error: null,
      };
    case 'SITE_LOAD_OK':
      return {
        isloading: false,
        data: action.sites,
        error: null,
      };
  }

  return state;
}

module.exports = sites;