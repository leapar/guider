var FORMATS  = require('./formats');
var qs       = require('querystring');

exports.between = function(haystack, left, right) {
  var pos;
  pos = haystack.indexOf(left);
  if (pos === -1) { return ''; }
  haystack = haystack.slice(pos + left.length);
  pos = haystack.indexOf(right);
  if (pos === -1) { return ''; }
  haystack = haystack.slice(0, pos);
  return haystack;
};

exports.chooseFormat = function(formats, options) {

  if (typeof options.format === 'object') {
    return options.format;
  }

  if (options.filter) {
    formats = exports.filterFormats(formats, options.filter);
    if (formats.length === 0) {
      return new Error('no formats found with custom filter');
    }
  }

  var format;
  var quality = options.quality || 'highest';
  switch (quality) {
    case 'highest':
      format = formats[0];
      break;

    case 'lowest':
      format = formats[formats.length - 1];
      break;

    default:
      var getFormat = function(itag) {
        for (var i = 0, len = formats.length; i < len; i++) {
          if (formats[i].itag === '' + itag) {
            return formats[i];
          }
        }
        return null;
      };
      if (Array.isArray(quality)) {
        for (var i = 0, len = quality.length; i < len; i++) {
          format = getFormat(quality[i]);
          if (format) { break; }
        }
      } else {
        format = getFormat(quality);
      }

  }

  if (!format) {
    return new Error('No such format found: ' + quality);
  } else if (format.rtmp) {
    return new Error('rtmp protocol not supported');
  }
  return format;
};


exports.parseFormats = function(info, debug) {
    console.log(info.adaptive_fmts);
    
  var formats = [];
  if (info.url_encoded_fmt_stream_map) {
    formats = formats
      .concat(info.url_encoded_fmt_stream_map.split(','));
  }
  if (info.adaptive_fmts) {
    formats = formats.concat(info.adaptive_fmts.split(','));
  }

  formats = formats
    .map(function(format) {
        console.log(format);
      var data = qs.parse(format);
      console.log(data);
      var meta = FORMATS[data.itag];
       console.log(meta);
      if (!meta && debug) {
        console.warn('No format metadata for itag ' + data.itag + ' found');
      }

      for (var key in meta) {
        data[key] = meta[key];
      }

      return data;
    });
  delete info.url_encoded_fmt_stream_map;
  delete info.adaptive_fmts;

  return formats;
};