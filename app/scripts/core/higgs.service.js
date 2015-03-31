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
        this._higgsLoginStatus = 'NOT_AUTHORIZED'
      }

      // Public
      Higgs.prototype.isLoggedIn          = isLoggedIn;
      Higgs.prototype.login               = login;

      Higgs.prototype.getHomeListings     = getHomeListings;

      Higgs.prototype.getFriends          = getFriends;

      Higgs.prototype.getShoppingPlans    = getShoppingPlans;
      Higgs.prototype.getShoppingPlan     = getShoppingPlan;

      // Private
      Higgs.prototype._login = _login;
      Higgs.prototype._getUser = _getUser;
      Higgs.prototype._getCommonHomeListings = _getCommonHomeListings;
      Higgs.prototype._getUserHomeListings = _getUserHomeListings;
      Higgs.prototype._addToCache = _addToCache;

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
      };


      /**
       * Get listings for home page.
       * If user is logged in then get user specific listing
       * or get common lisitng
       *
       * [NOTE] to add location data if available
       */
      function getHomeListings() {
        var self = this;

        return this.isLoggedIn()
                   .then(getListings);

        function getListings(loggedIn) {
          if(loggedIn) return self._getUserHomeListings();
          else return self._getCommonHomeListings();
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
      function getShoppingPlans() {
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
      function getShoppingPlan(planId) {
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
       * Get user's home listing
       *
       * @return {Promise}    Promise that resolves into listings
       */
      function _getUserHomeListings() {
        return  this._cache.get('user-listings') ||
                this._Piggyback
                  .GET('feeds/user')
                  .then(function(resp) {
                    if(resp.status === 200) {
                      return resp.data;
                    } else throw new Error(resp.statusText);
                  }).then(this._addToCache('user-listings'));
      }


      /**
       * Get common home listing
       *
       * @return {Promise}    Promise that resolves into listings
       */
      function _getCommonHomeListings() {
        return  this._cache.get('common-listings') ||
                this._Piggyback
                  .GET('feeds/common')
                  .then(function(resp) {
                    if(resp.status === 200) {
                      return resp.data;
                    } else throw new Error(resp.statusText);
                  }).then(this._addToCache('common-listings'));
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

    new _Higgs(config);
  }

}