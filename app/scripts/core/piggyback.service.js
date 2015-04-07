angular
  .module('boson.core')
  .service('PiggybackFactory', PiggybackFactory);


PiggybackFactory.$inject = ['$http', '$q'];

/**
 * Factory for creating Piggyback.
 */
function PiggybackFactory($http, $q) {

  var PiggybackBuilder = _PiggybackBuilder($http, $q);

  this.create = function() {
    return new PiggybackBuilder();
  };

}

/** Closure over $q and $http */
function _PiggybackBuilder($http, $q) {

  var Piggyback = _Piggyback($http, $q);

  /**
   * Builder for Piggyback service
   */
  function PiggybackBuilder() {}

  PiggybackBuilder.prototype.forService = forService;
  PiggybackBuilder.prototype.atHost     = atHost;
  PiggybackBuilder.prototype.atPort     = atPort;
  PiggybackBuilder.prototype.forApiVersion = forApiVersion;
  PiggybackBuilder.prototype.useAccessToken = useAccessToken;
  PiggybackBuilder.prototype.withCustomPrefix = withCustomPrefix;
  PiggybackBuilder.prototype.build = build;

  return PiggybackBuilder;

  /////////////// Public functions /////////////////
  function forService(name) {
    this.serviceName = name;
    return this;
  }

  function atHost(host) {
    if(typeof host !== 'string') throw new TypeError('host can only be a string');

    this.host = host;
    return this;
  }

  function atPort(port) {
    if(typeof port !== 'number') throw new TypeError('port can only be a number');

    this.port = port;
    return this;
  }

  function forApiVersion(version) {
    this.apiVersion = version;
    return this;
  }

  function useAccessToken(should) {
    this.useAccessToken = should;
    return this;
  }

  function withCustomPrefix(prefix) {
    this.customPrefix = prefix;
    return this;
  }

  function build() {

    this.customPrefix =
      (typeof this.customPrefix !== 'undefined' ? this.customPrefix + '/' : '')

    var endpoint = 'http://'
                   + this.host + ':'
                   + this.port + '/'
                   + this.customPrefix
                   + this.apiVersion + '/';

    var pb = new Piggyback(this.serviceName, endpoint)
    pb.useAccessToken(this.useAccessToken)
    return pb;
  }

}




//////////////////////////////////////////////////////
///////////////// Piggyback service //////////////////
//////////////////////////////////////////////////////


/** Closure over dependencies */
function _Piggyback($http, $q) {

  /**
   * Piggyback is a service to create rest
   * client with piggybacked rest requests;
   *
   * Piggyback mechanism is a way that allows
   * eventual consistency of piggbacked request.
   * And reduce network connection in the process.
   *
   * @param {String} name     Service name
   * @param {String} endpoint fully qualified domain endpoint including any prefixes
   */
  function Piggyback(name, endpoint) {
    this._piggybacks = [];
    this._awaitingPiggybacks = {};
    this._piggySources = [];
    this._deferreds = {};

    this._endpoint = endpoint + '/';
    this.name = name;

    // If acces_token is enabled then
    // setting access token will enable
    // Piggyback to set it in every
    // query parameter 'access_token'
    this._accessTokenEnabled = false;
  }

  // Public
  Piggyback.prototype.queue                    = queue;
  Piggyback.prototype.status                   = status;
  Piggyback.prototype.useAccessToken           = useAccessToken;
  Piggyback.prototype.setAccessToken           = setAccessToken;
  Piggyback.prototype.GET                      = GET;
  Piggyback.prototype.POST                     = POST;
  Piggyback.prototype.addPiggySource           = addPiggySource;

  // Private
  Piggyback.prototype._handlePiggybackResponse = _handlePiggybackResponse
  Piggyback.prototype._hydrateRequestConfig    = _hydrateRequestConfig;
  Piggyback.prototype._addPiggyback            = _addPiggyback;
  Piggyback.prototype._getPiggybackReq         = _getPiggybackReq;
  Piggyback.prototype._updateFromSources       = _updateFromSources;
  Piggyback.prototype._setupPiggyback          = _setupPiggyback;
  Piggyback.prototype._isPiggybackSane         = _isPiggybackSane;
  Piggyback.prototype._addAccessToken          = _addAccessToken;
  Piggyback.prototype._newPiggyId              = _newPiggyId;
  Piggyback.prototype._newPiggyTxnId           = _newPiggyTxnId;
  Piggyback.prototype._purge                   = _purge;

  return Piggyback;


  ///////////// Public Functions /////////////////

  /**
   * Queue a new piggyback request that will be eventually
   * called.
   *
   * @param  {string}   method   HTTP methods like 'GET' or 'POST'
   * @param  {string}   api      API for the service
   * @param  {Object.<string|Object>}   params   query params for the api
   * @param  {Object}   data     request data
   * @param  {function} callback Callback function to call with the reponse
   *
   * @return {Promise}            Promise object that will be resolved with the response
   */
  function queue(method, api, params, data) {

    var deferred = $q.defer();

    var piggyback =
      {
        _piggy_id: this._newPiggyId(),
        _method: method,
        _api: api,
        params: params,
        data: data,
        deferred: deferred
      };

    this._setupPiggyback(piggback);

    return deferred.promise;
  }


  /**
   * Status of current piggybacks
   *
   * @return {Object} An object of current status for loggin purpose
   */
  function status() {
    return {
      pending_piggybacks: this._piggybacks.length
    };
  }


  /**
   * Enable using access token in query params
   *
   * @param  {boolean} should  should enable using acccess token
   */
  function useAccessToken(should) {
    this._accessTokenEnabled = should;
  }


  /**
   * Set accesstoken to use if enabled
   *
   * @param {String} accessToken Access token
   */
  function setAccessToken(accessToken) {
    if(typeof accesstoken === 'string') this._accessToken = accessToken;
  }


  /**
   * GET api request
   *
   * @param {string} api         Api url
   * @param {Object.<string|Object>} params     Map of strings of objects for query parameters
   * @param {Object} data     Data to be sent as a request message
   * @param {boolean} dontPiggyback True to avoid piggyback in the request
   */
  function GET(api, params, data, dontPiggyback) {
    var config = {
      url: this._endpoint + api,
      method: 'GET',
      data: data || {},
      params: params || {},
      dontPiggyback: dontPiggyback || false
    };

    this._hydrateRequestConfig(config);

    var httpPromise = $http(config);
    if(!config.dontPiggyback) httpPromise = httpPromise.then(this._handlePiggybackResponse);

    return httpPromise;
  }


  /**
   * POsT api request
   *
   * @param {string} api         Api url
   * @param {Object.<string|Object>} params     Map of strings of objects for query parameters
   * @param {Object} data     Data to be sent as a request message
   * @param {boolean} dontPiggyback True to avoid piggyback in the request
   */
  function POST(api, params, data, dontPiggyback) {
    var config = {
      url: this.endpoint + api,
      method: 'POST',
      data: data || {},
      params: params || {},
      dontPiggyback: dontPiggyback || false
    };

    this._hydrateRequestConfig(config);

    var httpPromise = $http(config);
    if(!config.dontPiggyback) httpPromise = httpPromise.then(this._handlePiggybackResponse);

    return httpPromise;
  }


  /**
   * Set a source for piggyback data;
   *
   * @param {function} source A source that returns an object with the following
   *    properties.
   *
   *    - **method** - {string} - HTTP method 'GET' or 'POST'
   *    - **api** - {string} - API for the service
   *    - **params** - {Object.<string|Object>} Map of string or objects
   *    - **data** - {string|Object} - request data
   *    - deferred - {object} - $q.defer object for the corresponding response
   *
   */
  function addPiggySource(source) {
    if(typeof source !== 'function') throw new TypeError('piggy source should be a function');
    this._piggySources.push(source);
  }



  //////////////////////////////////////////////////////
  //////////////// Private Functions ///////////////////
  //////////////////////////////////////////////////////



  /**
   * Order of response is assumed to be in the order the
   * requests were queued.
   *
   * Piggyback's reponse structures
   * {
   *  '_piggy_res': {
   *    'piggy_txn_id': <timestamped id>,
   *    'piggy_resps': [
   *      {
   *        '_piggy_id': <timestamped id>,
   *        'api': <string>,
   *        'reponse': {
   *          'data': <response data>
   *          'status': <http status code>
   *          'statusText': <http status text>
   *        }
   *      }
   *    ]
   *  }
   * }
   *
   * @param  {Object} resp    $http resp
   * @return {Object}    resp object forwarded
   */
  function _handlePiggybackResponse(resp) {
    if('_piggy_res' in resp.data) {

      var piggyRes = resp.data._piggy_res;
      var txnId = piggyRes.piggy_txn_id;

      if(!(txnId in this._awaitingPiggybacks))
        throw new ReferenceError('Its Weird! no one\'s awaiting on piggybacks for txnId ' + txnId);

      angular.forEach(piggyRes.piggy_resps, function(piggy, index) {
        var deferred = this._deferreds[piggy._piggy_id];
        if(deferred) deferred.resolve(piggy.response);

        delete this._deferreds[piggy._piggy_id];
        delete this._awaitingPiggybacks[txnId][piggy._piggy_id];
      }, this);

      if(!_.isEmpty(this._awaitingPiggybacks[txnId])) {
        console.log('Some piggyback requests not processed, Re Queuing');

        angular.forEach(this._awaitingPiggybacks, function(piggyback, key) {
          this._setupPiggyback(piggback);
        }, this);
      }

      delete this._awaitingPiggybacks[txnId];
    }

    return resp;
  }


  /**
   * Add access token and piggyback info
   *
   * @param  {Object} config $http request config
   */
  function _hydrateRequestConfig(config) {
    if(!config.dontPiggyback) this._addPiggyback(config.data);

    if(this._accessTokenEnabled && this._accessToken)
      this._addAccessToken(config.params)
  }


  /**
   * Add piggyback to the request data (body)
   *
   * Piggyback request structure is like this
   *
   * {
   *   _piggy_reqs: {
   *     piggy_txn_id: <transaction id>,
   *     piggybacks: [
   *       {
   *         _piggy_id: this._newPiggyId(),
   *         _method: method,
   *         _api: api,
   *         params: params,
   *         data: data
   *       },
   *       ...
   *     ]
   *   }
   * }
   *
   *
   * @param {Object} data Reference to request config data field
   */
  function _addPiggyback(data) {
    data['_piggy_reqs'] = this._getPiggybackReq();
  }


  /**
   * Get a new set of piggybacks to send them
   * under a new transaction
   *
   * @return {Object} Piggyback request set to be send
   */
  function _getPiggybackReq() {
    this._updateFromSources();

    var piggbacks = this._piggybacks;
    this._piggybacks = [];

    var txnId = this._newPiggyTxnId();
    var awaits = {};
    angular.forEach(piggbacks, function(piggyback) {
      awaits[piggback._piggy_id] = piggback;
    });

    this._awaitingPiggybacks[txnId] = awaits;

    return { piggy_txn_id: txnId, piggybacks: this._piggybacks };
  }


  /**
   * Update this._piggybacks from sources;
   */
  function _updateFromSources() {
    angular.forEach(this._piggySources, function(source) {
      var piggyback = source();

      if(this._isPiggybackSane(piggyback)){
        piggyback._piggy_id = this._newPiggyId();
        this._setupPiggyback(piggyback);
      }
    }, this);
  }


  /**
   * Setup a new piggyback ie register defer and append to piggybacks
   * @param  {object} piggyback A validated piggyback object
   */
  function _setupPiggyback(piggyback) {
    this._piggybacks.push(piggyback);
    if('deferred' in piggyback) this._deferreds[piggback._piggy_id] = piggyback.deferred;
    delete piggback.deferred;
  }


  /**
   * Sanity check for piggyback
   *
   * @param  {object}  piggyback A piggyback object
   * @return {Boolean}           [description]
   */
  function _isPiggybackSane(piggyback) {
    return typeof piggyback === 'object' &&
           ('api' in piggyback) &&
           ('_piggy_id' in piggback) &&
           (typeof piggback.method === 'string') &&
           (!('data' in piggback) || (typeof piggback.data === 'object')) &&
           (!('params' in piggback) || (typeof piggback.params === 'string') || (typeof piggback.params === 'object')) &&
           (!('deferred' in piggyback) || (typeof piggyback.deferred === 'object'));
  }


  /**
   * Add accessToke to the query parameter
   * @param {Object} params reference $http request config params
   */
  function _addAccessToken(params) {
    params.access_token = this._accessToken;
  }


  /**
   * Generate a timestamped id for piggyback request
   *
   * @return {number} Timestamped id for piggyback request
   */
  function _newPiggyId() {
    return (new Date).getTime();
  }


  /**
   * Generate a timestamped id for a set of piggyback
   *
   * @return {number} Timestamped id for piggyback set
   */
  function _newPiggyTxnId() {
    return (new Date).getTime();
  }


  /**
   * [Caution] Force purge all piggyback requests
   */
  function _purge() {
    this._piggybacks = [];
  }

}