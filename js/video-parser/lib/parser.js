'use strict'
import fetch from 'isomorphic-fetch';

const SERVICES = [
    {
        // https://regex101.com/r/uT9lO0/2
        provider: 'youtube',
        pattern: /(https?:\/\/)?(www.)?(youtube\.com|youtu\.be|youtube-nocookie\.com)\/(?:embed\/|v\/|watch\?v=|watch\?list=(.*)&v=|watch\?(.*[^&]&)v=)?((\w|-){11})(&list=(\w+)&?)?/,
        method: 'loadYoutube',
        index: 6
    },
    {
        provider: 'vimeo',
        pattern: /[\w\W]*vimeo\.com\/([\w\W]*)[\w\W]*/,
        method: 'loadVimeo',
        index: 1
    },
    {
        // https://regex101.com/r/wF8zV5/1
        provider: 'facebook',
        pattern: /(https?:\/\/)?(www.)?(facebook\.com)\/(\S*\/)*(videos?\/(embed\?video_id=|vb.\d+\/)?)(\d+)/,
        method: 'loadFacebook',
        index: 7
    },
    {
        // https://regex101.com/r/yI6pN3/2
        // http://v.youku.com/v_show/id_XMTMwMDYxMjQxMg==_ev_1.html?from=y1.3-idx-uhome-1519-20887.205805-205902.1-1
        // http://v.youku.com/v_show/id_XMjMxOTQyOTQw.html?from=y1.6-97.3.1.a44aa406e0c711df97c0
        // http://v.youku.com/v_show/id_XMTI5Mjg5NjE4MA==.html?from=y1.3-idx-uhome-1519-20887.205921-205922-205810-205923.1-1
        // http://v.youku.com/v_show/id_XMTI5Mjg5NjE4MA==.html
        // http://player.youku.com/player.php/sid/XMTI5Mjg5NjE4MA==/v.swf
        // http://player.youku.com/player.php/sid/XMTI5Mjg5NjE4MA==/v.swf
        // http://player.youku.com/embed/XMTI5Mjg5NjE4MA==
        // http://player.youku.com/player.php/Type/Folder/Fid/25924643/Ob/1/sid/XMTMwMDgxNTY0NA==/v.swf
        provider: 'youku',
        pattern: /(https?:\/\/)?(v|player)\.youku\.com\/(v_show|player\.php|embed)(\/.*sid)?\/(id_)?(\w+=*)/,
        method: 'loadYouku',
        index: 6
    },
    {
        // https://regex101.com/r/oH7bO3/1
        // http://www.dailymotion.com/video/x2jvvep_coup-incroyable-pendant-un-match-de-ping-pong_tv
        // http://www.dailymotion.com/video/x2jvvep_rates-of-exchange-like-a-renegade_music
        // http://www.dailymotion.com/video/x2jvvep
        // http://www.dailymotion.com/hub/x2jvvep_Galatasaray
        // http://www.dailymotion.com/hub/x2jvvep_Galatasaray#video=x2jvvep
        // http://www.dailymotion.com/video/x2jvvep_hakan-yukur-klip_sport
        // http://dai.ly/x2jvvep
        // www.dailymotion.com/hub/x2jvvep_Galatasaray#video=x2jvvep
        provider: 'dailymotion',
        pattern: /(https?:\/\/)?(www.)?(dailymotion\.com\/(video|hub)\/?|dai\.ly)\/([^_\W]+)/,
        method: 'loadDailymotion',
        index: 5
    },
    {
        // http://tvcast.naver.com/v/13346/list/1316
        // http://tvcast.naver.com/v/13346
        provider: 'navertvcast',
        pattern: /https?:\/\/(m.)?tvcast.naver.com\/v\/(\d+)/,
        method: 'loadNavertvcast',
        index: 2
    },
    {
        // https://regex101.com/r/rQ8fI9/1
        // http://rutube.ru/video/0c2d8cd528563c6bb1c3ca4b95320845/
        // rutube.ru/play/embed/7962382
        // http://video.rutube.ru/7508261
        provider: 'rutube',
        pattern: /(https?:\/\/)?(video.)?rutube.ru\/((video|play\/embed)\/)?(\w+)/,
        method: 'loadRutube',
        index: 5
    },
    {
        // https://regex101.com/r/gR1oN8/3
        // http://m.tvpot.daum.net/v/72525651
        // http://tvpot.daum.net/mypot/View.do?clipid=72525651&ownerid=45x1okb1If50
        // http://tvpot.daum.net/v/sb0fdSwSjVJfS6xf6SixjtJ
        // http://tvpot.daum.net/mypot/View.do?ownerid=45x1okb1If50&playlistid=6064073&clipid=72525613
        // http://tvpot.daum.net/clip/ClipView.do?clipid=72589907
        // http://tvpot.daum.net/v/34RNu2rwWe8%24
        provider: 'daumtvpot',
        pattern: /(https?:\/\/)?(m.)?tvpot.daum.net\/(v\/|(mypot\/View.do|clip\/ClipView.do)\?(\S*)clipid=)([\w%]+)/,
        method: 'loadDaumtvpot',
        index: 6
    }];

const config = {
    name: 'video-parser-cache',
    youtube: {
        key: 'AIzaSyDnHq8g0MqzS4Wf4xRdrNfa5_YyIA5pT6k'
    },
    vimeo: {
        access_token: ''
    },
    ttl: 3600 * 12 // 1 day

};

 class Parser {

    requestYoutube(cb, id) {
        var self = this
        var part = 'snippet,contentDetails,status,player'
        var fields = 'items(snippet(title,description,thumbnails,channelId,publishedAt),contentDetails(duration,definition,contentRating),status(embeddable),player(embedHtml))'
        var url = [
            'https://www.googleapis.com/youtube/v3/videos',
            '?id=', id,
            '&part=', encodeURIComponent(part),
            '&fields=', encodeURIComponent(fields),
            '&key=', config.youtube.key
        ].join('')

console.log(url);
        fetch(url, null).then(response => {

            if (response.status >= 200 && response.status < 300) {
                return response;
            } else {
                   console.log("error");
                 
            }
        }).then(response => {
            return response.json();
        }).then(object => {
            console.log(object);
 



        }).catch(e => {
            console.log(e);
           
        });


/*
        request(url, function (err, res, body) {
            if (err) {
                return cb(err)
            }

            var result = JSON.parse(body)
            if (typeof result.items === 'undefined' || result.items.length === 0) {
                return cb('video.not_found')
            }

            var item = result.items[0]

            if (item.status.embeddable === false) {
                return cb('video.forbidden')
            }

            var snippet = item.snippet
            var details = item.contentDetails
            var ratings = typeof details.contentRating !== 'undefined' ? details.contentRating : {}
            // YouTube가 연령 제한 콘텐츠를 식별하기 위해 사용하는 등급입니다.
            if (typeof ratings.ytRating !== 'undefined' && ratings.ytRating === 'ytAgeRestricted') {
                return cb('video.age_restricted')
            }

            self.loadYoutubeChannel(function (err, channel) {
                if (err) {
                    return cb(err)
                }

                cb(err, {
                    id: id,
                    url: 'https://www.youtube.com/watch?v=' + id,
                    name: snippet.title,
                    desc: snippet.description,
                    thumb_url: snippet.thumbnails.medium.url,
                    duration: Parser.parseDuration(details.duration),
                    ctime: moment(snippet.publishedAt).format(),
                    ratings: ratings,
                    details: {
                        definition: details.definition,
                        author: channel
                    }
                })
            }, snippet.channelId)
        })*/
    }
};

module.exports = Parser