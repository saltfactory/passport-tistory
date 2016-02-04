var util = require('util'),
  profile = require('./profile'),
  OAuth2Strategy = require('passport-oauth2');

/**
 * TistoryStrategy 생성자.<br/>
 *
 * @param options
 * @param verify
 *
 * @constructor
 */
function TistoryStrategy(options, verify) {
  var oauthHost = 'https://www.tistory.com';
  options = options || {};
  options.authorizationURL = options.authorizationURL || oauthHost + '/oauth/authorize';
  options.tokenURL = options.tokenURL ||  oauthHost + '/oauth/access_token/';

  options.customHeaders = options.customHeaders || {};


  if (!options.customHeaders['User-Agent']) {
    options.customHeaders['User-Agent'] = options.userAgent || 'passport-tistory';
  }

  OAuth2Strategy.call(this, options, verify);
  this.name = 'tistory';
  this._userProfileURL = 'https://www.tistory.com/apis/blog/info?output=json';
}

/**
 * `OAuth2Stragegy`를 상속 받는다.
 */
util.inherits(TistoryStrategy, OAuth2Strategy);

/**
 * Tistory 블로그 정보를 얻는다.<br/>
 * 사용자 정보를 성공적으로 조회하면 아래의 object가 done 콜백함수 호출과 함꼐 넘어간다.
 *
 *   - `provider`         tistory 고정
 *   - `tistory`          블로그 정보
 *   - `status`           상태 값
 *   - `id`               Tistory 사용자
 *   - `userId`           Tistory 사용자 userId
 *   - `item`             Tistory에 만들어 놓은 블로그 정보
 *   - `_raw`             json string 원문
 *   _ `_json`            json 원 데이터
 *
 * @param {String} accessToken
 * @param {Function} done
 */
TistoryStrategy.prototype.userProfile = function(accessToken, done) {
  this._oauth2.get(this._userProfileURL, accessToken, function (err, body, res) {
    if (err) { return done(new InternalOAuthError('failed to fetch user profile', err)); }

    try {
      var json = JSON.parse(body);

//      var profile = { provider: 'tistory' };
      profile.status = json.tistory.status;
      profile.id = json.tistory.id;
      profile.userId = json.tistory.userId;
      profile.tistory = json.tistory.tistory;
      profile.item = json.tistory.item;
      profile._raw = body;
      profile._json = json;

      done(null, profile);

    } catch(e) {
      done(e);
    }
  });
}


/**
 * Expose `TistoryStrategy`.
 */
module.exports = TistoryStrategy;
