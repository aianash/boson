angular
  .module('boson.core')
  .provider('Higgs', HiggsProvider);


function HiggsProvider() {

  var apiVersion, appSecret, host, port;

  this.setApiVersion = setApiVersion;
  this.setAppSecret  = setAppSecret;
  this.setHiggsHost  = setHiggsHost;
  this.setHiggsPort  = setHiggsPort;

  this.$get = ['$q', 'cache', 'Piggyback', 'ShopPlansFactory', 'FB', HiggsFactory];


  //////////////////////////////////////////////

  function setApiVersion(version) { apiVersion = version; }
  function setAppSecret(secret) { appSecret = secret }
  function setHiggsHost(h) { host = h }
  function setHiggsPort(p) { port = p }


  function HiggsFactory($q, cache, Piggyback, ShopPlansFactory, FB) {
    var _Higgs;

    _Higgs = (function() {

      /**
       * [Higgs description]
       * @param {[type]} config [description]
       */
      function Higgs(config) {
        this.apiVersion = config.apiVersion;
        this.appSecret  = config.appSecret; /// NOT USED YET

        this._cache = cache;
        this._Piggyback = Piggyback
                            .create()
                            .forService('higgs')
                            .atHost(config.host)
                            .atPort(config.port)
                            .withCustomPrefix('higgs')
                            .forApiVersion(apiVersion)
                            .useAccessToken(true)
                            .build();

        this._ShopPlans = ShopPlansFactory.create(this._Piggyback);

        // Three states for higgs authorization
        // 1. NOT_AUTHORIZED        - user not yet logged in to facebook
        // 2. PENDING_AUTHORIZATION - user logged in to facebook, yet
        //                           to receive higgs accessToken
        // 3. AUTHORIZED            - we now have higgs accessToken too
        this._higgsLoginStatus = 'NOT_AUTHORIZED';


        // User info object for un-identified (not logged in) user
        this._johnDoe = {
          img: 'http://imageshack.com/a/img661/3717/dMwcZr.jpg'
        };

      }

      // Public
      Higgs.prototype.isLoggedIn          = isLoggedIn;
      Higgs.prototype.login               = login;
      Higgs.prototype.getUserInfo         = getUserInfo;

      Higgs.prototype.getFeed             = getFeed;

      Higgs.prototype.getFriends          = getFriends;

      Higgs.prototype.getShopPlans        = getShopPlans;
      Higgs.prototype.getShopPlan         = getShopPlan;

      // Private
      Higgs.prototype._login              = _login;
      Higgs.prototype._getUser            = _getUser;
      Higgs.prototype._getCommonFeed      = _getCommonFeed;
      Higgs.prototype._getUserFeed        = _getUserFeed;
      Higgs.prototype._addToCache         = _addToCache;

      return Higgs;



      ///////////////////////////////////////////////////
      /////////////// Public functions //////////////////
      ///////////////////////////////////////////////////

      /**
       * 1. Check if user is logged in
       * 2. If logged then login in higgs too
       *
       * @return {Promise[Boolean]} true if logged in else false
       */
      function isLoggedIn() {

        if(this._higgsLoginStatus === 'AUTHORIZED') return $q.when(true);
        else if(this._higgsLoginStatus === 'NOT_AUTHORIZED')
          return FB.isLoggedIn()
                   .then(this._login)
                   .then(mapResponse);

        else if(this._higgsLoginStatus === 'PENDING_AUTHORIZATION')
          return FB.isLoggedIn().then(mapResponse);

        function mapResponse(fbResponse) {
          if(fbResponse.status === 'connected') return true;
          else return false;
        }

      };


      /**
       * 1. LogIn using facebook
       * 2. Also logIn to higgs
       * 3. Get user info if logged in
       *
       * Use only when user is confirmed not logged in
       *
       * @return {Promise[Object]} user profile data
       */
      function login() {
        return FB.login()
                 .then(this._login)
                 .then(this._getUser);
      }



      /**
       * Get User info
       *
       * @return {Promise[Oject]} User info object
       */
      function getUserInfo() {
        var self = this;

        return this.isLoggedIn()
                  .then(_getUserInfo);

        function _getUserInfo(loggedIn) {
          if(!loggedIn) return self._johnDoe;
          else self._johnDoe // [TO IMPLEMENT] GET /user/info at higgs
        }

      }



      /**
       * Get feed.
       *
       * If user is logged in then get user specific feed
       * otherwise get common feed
       *
       * [NOTE] to add location data if available
       *
       * @param {Object} filter Sample filter {city: 'bangalore', page: 0}
       */
      function getFeed(filter) {
        var self = this;

        return this.isLoggedIn()
                   .then(_getFeed);

        function _getFeed(loggedIn) {
          if(loggedIn) return self._getUserFeed(filter);
          else return self._getCommonFeed(filter);
        }
      }


      /**
       * Get user friends
       *
       * @returns {Promise.<Array>} Promise that resolves to array of friends
       */
      function getFriends() {
        return
          this._cache.get('friends') ||
          this._Piggyback
            .GET('me/friends')
            .then(function(resp) {
              if(resp.status === 200 && Array.isArray(reps.data)) {
                this._cache.put('friends', resp.data);
                return resp.data;
              } else throw new Error(resp.statusText);
            });
      }


      /**
       * Get all shopping plans of the user.
       * Make sure to use this api only after user
       * has logged in
       *
       * @return {Array.<ShopPlan>} Array ShopPlan objects with summary details
       */
      function getShopPlans() {
        var self = this;

        return this.isLoggedIn()
                  .then(function(loggedIn) {
                    if(loggedIn) return self._ShopPlans.all();
                    else throw new TypeError('Cant get shopping plans for not logged in user');
                  });
      }


      /**
       * Get shopping plan for a given id
       *
       * @param  {string} planId   ShopPlan id
       * @return {ShopPlan}        A ShopPlan instance
       */
      function getShopPlan(planId) {
        var self = this;

        return this._isLoggedIn()
                  .then(function(loggedIn) {
                    if(loggedIn) return self._ShopPlans.get(planId);
                    else throw new TypeError('Cant get shopping plan for not logged in user')
                  });
      }



      ///////////////////////////////////////////////////
      ////////////////// Private functions //////////////
      ///////////////////////////////////////////////////


      /**
       * Login to Higgs with the fbResponse
       * 1. piggybacks data for higgs login request
       * if fbResponse.status is connected
       * 2. returns the fbResponse back
       *
       * @param {Object} fbResponse   Response from FB Login
       */
      function _login(fbResponse) {
        if(fbResponse.status === 'connected') {
          var userId = fbResponse.authResponse.userID;
          var fbAccessToken = fbResponse.authResponse.accessToken;

          var data = {
            fbUserId: userId,
            fbAccessToken: fbAccessToken,
            appSecret: this.appSecret
          };

          // [IMP] Piggyback higgs login for next higgs api request
          this._Piggyback.queue('higgs', 'login', data)
              .then(this._onLogin);

          // [IMP] Set FB AccessToken until we have Higgs AccessToken
          // This will serve as an AccessToken for ShopPlan requests
          this._Piggyback.setAccessToken('FB_' + fbAccessToken);

          this._higgsLoginStatus = 'PENDING_AUTHORIZATION';
        }

        return fbResponse;
      }


      /**
       * Handler for higgs api login PiggyResponse
       *
       * @param  {Object} resp (PiggyResp) from higgs api '/login'
       * @returns {Object} Returns back the original response object
       */
      function _onLogin(resp) {
        var data = resp.data;

        if(resp.status === 200) {
          this._higgsLoginStatus = data.status;
          this._higgsAccessToken = data.access_token;
          this._Piggyback.setAccessToken(this._higgsAccessToken);
        } else this._higgsLoginStatus = 'NOT_AUTHORIZED';

        return resp;
      }


      /**
       * [Private] If user is connected then get the userinfo
       * or pass the fbResponse
       */
      function _getUser(fbResponse) {
        if(fbResponse.status === 'connected') {
          return FB.getUser();
        }

        return fbResponse;
      }


      /**
       * Get user's personalized feed
       *
       * @param {Object} filter Feed filter {city: 'bangalore', page: 0}
       * @return {Promise}    Promise that resolves into feed
       */
      function _getUserFeed(filter) {
        return  this._cache.get('user-feed') ||
                this._Piggyback
                  .GET('feed/user', null, filter)
                  .then(function(resp) {
                    if(resp.status === 200) {
                      return resp.data;
                    } else throw new Error(resp.statusText);
                  }).then(this._addToCache('user-feed'));
      }


      /**
       * Get common feed
       *
       * @param {Object} filter Feed filter {city: 'bangalore', page: 0}
       * @return {Promise}    Promise that resolves into feed
       */
      function _getCommonFeed(filter) {
        return  this._cache.get('common-feed') ||
                this._Piggyback
                  .GET('feed/common', null, filter)
                  .then(function(resp) {
                    if(resp.status === 200) {
                      return resp.data;
                    } else throw new Error(resp.statusText);
                  }).then(this._addToCache('common-feed'));
      }


      /**
       * Returns a function that adds to cache for a given key
       *
       * @param {string} key cache key
       */
      function _addToCache(key) {
        var self = this;

        return function(data) {
          self._cache.put(key, data);
          return data
        }
      }

    })();

    var config = {
      apiVersion: apiVersion,
      appSecret: appSecret,
      host: host,
      port: port
    };

    return new _Higgs(config);
  }

}