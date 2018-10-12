/**
 * Copyright 2016 Facebook, Inc.
 *
 * You are hereby granted a non-exclusive, worldwide, royalty-free license to
 * use, copy, modify, and distribute this software in source code or binary
 * form for use in connection with the web services and APIs provided by
 * Facebook.
 *
 * As with any software that integrates with the Facebook platform, your use
 * of this software is subject to the Facebook Developer Principles and
 * Policies [http://developers.facebook.com/policy/]. This copyright notice
 * shall be included in all copies or substantial portions of the software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE
 *
 * @flow
 */

'use strict';

type ParseObject = Object;

export type Action =
  { type: 'LOADED_ABOUT', list: Array<ParseObject> }
  | { type: 'LIST_LOAD_BEGIN' }
  | { type: 'LIST_LOAD_ERROR', error:any }
  | { type: 'LIST_LOAD_OK', list: Array<ParseObject>,page: ?int }
  | { type: 'LOAD_OVER', list: Array<ParseObject>,page: ?int }
  | { type: 'SITE_LOAD_BEGIN' }
  | { type: 'SITE_LOAD_ERROR', error:any }
  | { type: 'SITE_LOAD_OK', list: Array<ParseObject>}
  | { type: 'LOAD_DETAIL_BEGIN' }
  | { type: 'LOGGED_IN', source: ?string; data: { id: string; name: string; sharedSchedule: ?boolean; } }
  | { type: 'LOGGED_OUT' }
  | { type: 'SHOW_DETAIL'}
  | { type: 'LOAD_DETAIL_OVER', url : ?string}
  | { type: 'SWITCH_TAB', tab: 'schedule' | 'my-schedule' | 'map' | 'notifications' | 'info' }
  ;

export type Dispatch = (action: Action | ThunkAction | PromiseAction | Array<Action>) => any;
export type GetState = () => Object;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
export type PromiseAction = Promise<Action>;
