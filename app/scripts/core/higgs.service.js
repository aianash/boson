angular
  .module('boson.core')
  .provider('Higgs', HiggsProvider);


function HiggsProvider() {

  var apiVersion, clientId, host, port;

  this.setApiVersion = setApiVersion;
  this.setClientId   = setClientId;
  this.setHiggsHost  = setHiggsHost;
  this.setHiggsPort  = setHiggsPort;

  this.$get = ['lodash', '$rootScope', '$q', '$localForage', 'cache', 'PiggybackFactory', 'ShopPlansFactory', 'BucketFactory', 'FB', HiggsFactory];


  //////////////////////////////////////////////

  function setApiVersion(version) { apiVersion = version; }
  function setClientId(id) { clientId = id }
  function setHiggsHost(h) { host = h }
  function setHiggsPort(p) { port = p }


  function HiggsFactory(_, $rootScope, $q, $localForage, cache, PiggybackFactory, ShopPlansFactory, BucketFactory, FB) {
    var _Higgs;

    _Higgs = (function() {

      /**
       * Main API Client for Higgs service
       *
       * [NOTE]
       * - Currently only allows adding items to bucket, later allowing adding stores too
       * -
       */
      function Higgs(config) {
        this.apiVersion = config.apiVersion;
        this.clientId   = config.clientId; /// NOT USED YET

        this._cache = cache;
        this._Piggyback = PiggybackFactory
                            .create()
                            .forService('higgs')
                            .atHost(config.host)
                            .atPort(config.port)
                            .withCustomPrefix('v')
                            .forApiVersion(apiVersion)
                            .useAccessToken(true)
                            .build();

        this._ShopPlans = ShopPlansFactory.create(this._Piggyback);

        this._Bucket = BucketFactory.create(this._Piggyback);

        // User info object for un-identified (not logged in) user
        this._johnDoe = {
          img: 'http://imageshack.com/a/img661/3717/dMwcZr.jpg'
        };

        this._isLoggedIn = false;

        // testing
        this._isLoggedIn = true;
        var token = "eyJraWQiOiJoaWdncy1vYXV0aC1rZXkiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJoaWdncyIsImF1ZCI6ImJvc29uLWFwcCIsImV4cCI6MTQzNTMzNTg4NywianRpIjoiaExrYWgxZlNkUnJic1pqOXNTSU16dyIsImlhdCI6MTQzMjc0Mzg4NywibmJmIjoxNDMyNzQzNzY3LCJzdWIiOiJ1c2VyIiwidXVpZCI6MTUyNTUzOTM5OTkxMTM4MzA0LCJhcGlzIjpbImFsbCJdfQ.daaErReK_xV7ZC6N5_Ys7tivwXGsjxYpfOWCZAl_x8QUu3Q7xQlm7X7KtFDZ4P9mfak1OWONiTnmHoltk6VoIeH8X8ARtvzJwr6Klhu68SC9U_gq_Ow_1_-7nYYXiKOkBqwiaHDE6G1QAQGWVWOV8D9vdh89wWBEIP4CO9dRZpgbrwXGNPgJRaScpx1J93KOwec38wk2Gy8ts282NGAlqYhgvLNS2GNttZvcrgUtMznFZcmxIMnX_L89YtV8YdJvq2hzyQpyeAqaazF4MwyEUcB_n8rhq3jF9679paXaNzVsWkLsjGY_cKXUIOSpL07KKfks7ygXcn8PDQH4HdVgQQ";
        this._Piggyback.setAccessToken(token);
        this._higgsAccessToken = token;

        var self = this;

        // get higgs token fron persistent store
        // if available
        $localForage.getItem('higgsAccessToken')
          .then(_.bind(this._processAccessToken, this));

        // get user info from persistent store
        // if available
        $localForage.getItem('userInfo')
          .then(function(info) {
            self._userInfo = info;
          });
      }

      // Public
      Higgs.prototype.loginUsingFacebook   = loginUsingFacebook;
      Higgs.prototype.getUserInfo          = getUserInfo;

      Higgs.prototype.addItemToBucket      = addItemToBucket;
      Higgs.prototype.removeItemFromBucket = removeItemFromBucket;
      Higgs.prototype.getBucketStores      = getBucketStores;

      Higgs.prototype.getFeed              = getFeed;

      Higgs.prototype.getShopPlans         = getShopPlans;
      Higgs.prototype.getShopPlan          = getShopPlan;
      Higgs.prototype.createNewPlan        = createNewPlan;

      Higgs.prototype.updateQuery          = updateQuery;
      Higgs.prototype.getSearchResults     = getSearchResults;

      // Private
      Higgs.prototype._loginToHiggs        = _loginToHiggs;
      Higgs.prototype._getUser             = _getUser;
      Higgs.prototype._getCommonFeed       = _getCommonFeed;
      Higgs.prototype._getUserFeed         = _getUserFeed;
      Higgs.prototype._addToCache          = _addToCache;
      Higgs.prototype._processAccessToken  = _processAccessToken;

      return Higgs;



      ///////////////////////////////////////////////////
      /////////////// Public functions //////////////////
      ///////////////////////////////////////////////////


      /**
       * 1. LogIn using facebook
       * 2. Then log in to higgs using the facebook token
       *
       * Use only when user is confirmed not logged in
       *
       * @return {Promise.<Boolean>}   success (true or false)
       */
      function loginUsingFacebook() {
        return FB.login()
                 .then(_.bind(this._loginToHiggs, this));
      }



      /**
       * Get User info
       *
       * @return {Promise[Oject]} User info object
       */
      function getUserInfo() {
        var self = this;
        if(this._userInfo) return $q.when(this._userInfo);
        else if(!this._isLoggedIn) return $q.when(this._johnDoe);
        else
          return this._Piggyback
            .GET('me')
            .then(function(resp) {
              if(resp.status === 200) {
                var info = resp.data;
                return $localForage.setItem('userInfo', info)
                  .then(function() {
                    self._userInfo = info;
                    return info;
                  });
              }
              return $q.reject(new Error('Couldn\'t get user info'));
            });
      }


      //////////////////////// Bucket Related /////////////////////////////

      function addItemToBucket(itemId, storeId) {
        this._Bucket.addItem(itemId, storeId);
      }

      function removeItemFromBucket(itemId, storeId) {
        this._Bucket.removeItem(itemId, storeId);
      }

      function getBucketStores() {
        if(this._isLoggedIn) {
          return this._Bucket.getStores();
        } else $q.reject(new Error("User is not logged in"));
      }


      //////////////////// Feed Related //////////////////////////

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


      /////////////////////// User Friends Related//////////////////////////

      /**
       * Get user friends
       *
       * @returns {Promise.<Array.<Friend>>} Promise of array of friends
       */
      function getFriendsForInvite() {
        return
          $q.when(this._cache.get('friends')) ||
          this._Piggyback
            .GET('me/friends')
            .then(function(resp) {
              if(resp.status === 200 && Array.isArray(reps.data)) {
                this._cache.put('friends', resp.data);
                return resp.data;
              } else throw new Error(resp.statusText);
            });
      }


      //////////////////////// ShopPlans Related //////////////////////////

      /**
       * Get all shopping plans of the user.
       * Make sure to use this api only after user
       * has logged in
       *
       * [NOTE] Each shopplan will necessarily have the
       * summary data.
       *
       * @return {Promise.<Array.<ShopPlan>?} Promise of Array ShopPlan objects with summary details
       */
      function getShopPlans() {
        var self = this;

        return this.isLoggedIn()
                  .then(function(loggedIn) {
                    if(loggedIn) return self._ShopPlans.all();
                    else return $q.reject(new TypeError('Cant get shopping plans if user not logged in'));
                  });
      }


      /**
       * Get shopping plan for a given id
       *
       * [NOTE] the shopplan instance may or may not
       * have the summary/details
       *
       * @param  {string} suid   ShopPlan unique id
       * @return {Promise.<ShopPlan>} Promise of a ShopPlan instance
       */
      function getShopPlan(suid) {
        if(this._isLoggedIn) {
          return this._ShopPlans.get(suid);
        } else {
          console.log("not logged in");
          // ask for login
          return $q.reject(new Error("User Not logged in"));
        }
      }


      /**
       * Create a new plan with CUD object
       *
       * @param {Object} cud ShopPlan CUD Object
       */
      function createNewPlan(cud) {
        return this._Piggyback
                   .POST('shopplan/create', {}, cud)
                   .then(function(resp) {
                      if(resp.status === 200) return resp.data;
                      else return $q.reject(new Error(resp.statusText));
                   });
      }


      /**
       * Update query for a given searchId
       * [NOTE] Right now it's just storing the data
       * locally. But soon the update will be persisted
       * to database.
       *
       * @param  {Number} sruid    search id of which query to update
       * @param  {Object} query    Query object
       * @return {Promise}         Promise of update (boolean)
       */
      function updateQuery(sruid, query) {
        this._sruid = sruid
        this._query = {
          "queryText": query.queryStr,
          "pageIndex": 1,
          "pageSize" : 10
        }
      }


      /**
       * Get search results for search id
       *
       * @param  {Number} searchId search id for which results to fetch
       * @param  {Number} page     Page number of the search result
       * @return {Promise}         Promise of search results
       */
      function getSearchResults(sruid, page) {
        return this._Piggyback
                  .POST('search/' + sruid, {}, this._query)
                  .then(function(resp) {
                    if(resp.status === 200) return resp.data;
                    else return $q.reject(new Error(resp.statusText));
                  });
      }

      ///////////////////////////////////////////////////
      ////////////////// Private functions //////////////
      ///////////////////////////////////////////////////


      /**
       * Login to Higgs with the fbResponse
       * 1. If fb's reponse has the status connected then
       *    get higgs access token using facebook auth info
       * 2. set the higgs access token in Piggyback
       *    and locally store the acess token too
       * 3. Return whether the higgs login was successful
       *
       * @param  {Object}  fbResponse  Response from FB Login
       * @return {Promise} success     Whether higgs login is successful
       */
      function _loginToHiggs(fbResponse) {
        var self = this;
        if(fbResponse.status === 'connected') {
          var userId = fbResponse.authResponse.userID;
          var fbAccessToken = fbResponse.authResponse.accessToken;

          var fbAuthInfo = {
            fbUserId: {'uuid': userId},
            token   : fbAccessToken,
            clientId: this.clientId
          };

          // Get Higgs Access Token using facebook info
          return this._Piggyback
              .POST('oauth/token', {}, fbAuthInfo)
              .then(function(resp) {
                if(resp.status === 200) {
                  var token = resp.data.token;
                  // These are long lived server token, so pesist them
                  return $localForage.setItem('higgsAccessToken', token)
                    .then(function() {
                      return self._processAccessToken(token);
                    });
                }
                console.error(JSON.stringify(resp));
                return $q.reject(new Error("Couldn't login to Higgs"));
              });
        } else if(fbResponse.status === 'not_authorized') {
          // the user is logged in to Facebook but didnot authorize
          // the app
          return false;
        } else {
          // user is not logged in to Facebook
          return false;
        }
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


      /**
       * [_processAccessToken description]
       * @param  {[type]} token [description]
       * @return {[type]}       [description]
       */
      function _processAccessToken(token) {
        if(typeof token === 'string') {
          this._higgsAccessToken = token;
          this._isLoggedIn = true;
          this._Piggyback.setAccessToken(token);
          $rootScope.$broadcast('user:loggedIn', {});
          return true;
        } else return false;
      }

    })();

    var config = {
      apiVersion: apiVersion,
      clientId: clientId,
      host: host,
      port: port
    };

    return new _Higgs(config);
  }

}