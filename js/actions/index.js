
'use strict';

const loginActions = require('./login');
const {loadData,loadDetail,loadSites,getListPageUrl} = require('./load');
const showDetail = require('./detail');

module.exports = {
  ...loginActions,
  loadData,
  ...showDetail,
  loadDetail,
  loadSites,
  getListPageUrl,
};