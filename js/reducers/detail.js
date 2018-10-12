
'use strict';

import type {Action } from '../actions/types';

export type State = {
  
  data: Object, 
};

const initialState = {
 
  data: null, 
  route : null,
};

function detail(state: State = initialState, action: Action): State {
  if (action.type === 'SHOW_DETAIL') {
    
      return { 
        data: action.data, 
        route : action.route,
      };
    

  }

  return state;
}

module.exports = detail;