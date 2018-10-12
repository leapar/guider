
var util  = require('./util');
import fetch from 'isomorphic-fetch';

/**
 * @param {String} url
 * @param {Object} options
 * @param {Function(Error, String)} callback
 * @return http.ClientRequest
 */
module.exports = function(url, options, callback) {

  
  return fetch(url).then(response => {
    console.log(response);

            if (response.status >= 200 && response.status < 300) {
                return response;
            } else {
                   console.log("error");
                 
            }
        })
   
};
