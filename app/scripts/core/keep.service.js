angular
  .module('boson.core')
  .service('KeepFactory', _KeepFactory);

function _KeepFactory() {
  var Keep = _Keep();

  this.create = function(id) {
    return new Keep(id);
  };
}


/** Closure for dependencies */
function _Keep() {

  var Add     = _Add();
  var Merge   = _Merge();
  var Remove  = _Remove();
  var Push    = _Push();
  var Has     = _Has();
  var Update  = _Update();
  var Txn     = _Txn();


  /**
   * [IMP] A very basic and not thorough implementation
   * of the idea for a Keep like DataStructure.
   * Will improve as its used.
   *
   * [IMP] There are some problems with immutabilty
   * To be solved
   */
  function Keep(id) {
    this._id = id;
    this._store = {};
    this._txns = {};
  }

  // Public
  Keep.prototype.add = add;
  Keep.prototype.merge = merge;
  Keep.prototype.remove = remove;
  Keep.prototype.push = push;
  Keep.prototype.has = has;
  Keep.prototype.update = update;
  Keep.prototype.withinTxn = withinTxn;
  Keep.prototype.txn = txn;
  Keep.prototype.removeTxn = removeTxn;

  // Private
  Keep.prototype._get = _get;
  Keep.prototype._saveTxn = _saveTxn;
  Keep.prototype._getOrCreateMapAt = _getOrCreateMapAt;
  Keep.prototype._getOrCreateArrayAt = _getOrCreateArrayAt;

  return Keep;

  //////////////////////////////////////////////////////////////
  /////////////////// Public Functions /////////////////////////
  //////////////////////////////////////////////////////////////


  function add(params) {
    return new Add(this, params);
  }

  function merge(params) {
    return new Merge(this, params);
  }

  function remove(params) {
    return new Remove(this, params);
  }

  function push(params) {
    return new Push(this, params);
  }

  function has(params) {
    return new Has(this, params);
  }

  function update(params) {
    return new Update(this, params);
  }

  function withinTxn(params) {
    var txn = new Txn(this, _.uniqueId('keep_' + this._id + '_'));
    txn.start();
    this._txns[txn._id] = txn;
    return txn;
  }

  function txn(txnId) {
    return this._txns[txnId];
  }

  function removeTxn(txnId) {
    delete this._txns[txnId];
  }


  /////////////////////////////////////////////////////
  ///////////////// Private Functions /////////////////
  /////////////////////////////////////////////////////



  /**
   * [NOTE] no deep merges
   *
   * @param  {Array.<string>} path Array of path elments
   * @param {Object} config Config defining scope to use
   */
  function _get(path, config) {
    var data;
    var scope = config.scope;

    if(scope === 'all' || scope === 'latest')
      _merge(_getFrom(this._store));


    if(scope === 'all') {
      _.forEach(this._txns, _txnIteratee);
    }

    if(scope === 'txn') {
      var txnId = config.txnId;

      _merge(_getFrom(this.txn(txnId).getUpdates()));
    }

    return data;


    ////////// Helper functions ///////////

    function _getFrom(source) {
      return _.reduce(path, _pathIteratee, source);
    }

    function _pathIteratee(pre, sub) {
      if(!_.isUndefined(pre)) return pre[sub];
      else return pre;
    }

    function _txnIteratee(txn, txnId) {
      _merge(_getFrom(txn.getUpdates()));
    }

    function _merge(source) {
      if(_.isUndefined(source)) return;

      if(_.isUndefined(data)) data = source;

      if(_.isArray(data) && _.isArray(source)) data.concat(source);
      else if(_.isObject(data) && _.isObject(source)) _.merge(data, source);
    }

  }


  function _saveTxn(txn) {
    if(!_.isUndefined(txn)) this._txns[txn.id] = txn;
  }


  function _getOrCreateMapAt() {
    return _.reduce(arguments, function(pre, sub) {
      pre[sub] = pre[sub] || {};
      return pre[sub];
    }, this._store, this);
  }


  function _getOrCreateArrayAt() {
    var last = _.last(arguments);
    var dest = this._getOrCreateMapAt.apply(this, _.dropRight(arguments));
    dest[last] = dest[last] || [];
    return dest[last];
  }
}





/** Closure for dependencies */
function _Add() {

  function Add(keep) {
    this._Keep = keep;
  }

  Add.prototype.thiz  = thiz;
  Add.prototype.to    = to;

  return Add;

  function thiz(data) {
    this._data = data;
  }

  function to() {
    var map = this._Keep._getOrCreateMapAt.apply(this._Keep, arguments);
    _.defaults(map, this._data);
  }
}





/** Closure for dependencies */
function _Merge() {

  function Merge(keep) { this._Keep = keep; }

  Merge.prototype.thiz = thiz;
  Merge.prototype.to   = to;

  return Merge;

  function thiz(data) {
    this._data = data;
  }

  function to() {
    var map = this._Keep._getOrCreateMapAt.apply(this._Keep, arguments);
    _.merge(map, this._data);
  }
}




/** Closure for dependencies */
function _Remove() {

  function Remove(keep) { this._Keep = keep; }

  Remove.prototype.thiz = thiz;
  Remove.prototype.from = from;

  return Remove;

  function thiz(data) { this._data; }

  function from() {
    var ret = this._Keep._get(arguments, {scope: 'latest'});

    if(_.isArray(ret)) _.pull(ret, this._data);
    else if(_.isObject(ret)) delete ret[this._data];
  }
}




/** Closure for dependencies */
function _Push() {

  function Push(keep) { this._Keep = keep; }

  Push.prototype.thiz = thiz;
  Push.prototype.to   = to;

  return Push;

  function thiz(data) {
    this._data = data;
  }

  function to() {
    this._Keep._getOrCreateArrayAt.apply(this._Keep, arguments).push(this._data);
  }
}




/** Closure for dependencies */
function _Has() {

  function Has(keep) { this._Keep = keep };

  Has.prototype.any = any;

  return Has;

  function any() {
    var target = this._Keep.get(arguments);
    return _.isEmpty(target);
  }
}




/** Closure for dependencies */
function _Update() {

  /**
   * To update a target with the data scoped out from
   * Keep._store or transactions.
   *
   * @param {Keep} keep   Keep instance
   * @param {Object} config Defines scope like {scope: <latest|all|txn>, txnId: <number>}
   */
  function Update(keep, config) {
    this._Keep = keep;
    this._config = config;

    _.defaults(this._config, {scope: 'all'});
  }

  Update.prototype.thiz = thiz;
  Update.prototype.from = from;

  return Update;

  function thiz(target) {
    this._target = target;
  }

  function from() {
    var data = this._Keep._get(arguments, this._config);

    if(_.isArray(data) && _.isArray(this._target))
      this._target.concat(data);
    else if(_.isObject(source) && _.isObject(this._target))
      _.merge(this._target, source);
  }

}




/** Closure for dependencies */
function _Txn() {

  var Update = _Update();

  function Txn(keep, id) {
    this._Keep = keep;
    this._id   = id;
  }

  Txn.prototype.start       = start;
  Txn.prototype.getRemovals = getRemovals;
  Txn.prototype.getUpdates  = getUpdates;
  Txn.prototype.update      = update;
  Txn.prototype.done        = done;

  return Txn;

  function start() {
    // copy from the transaction
    // and renew the Keep._store
    this._updates = this._Keep._store;
    this._updates['_keep_txn_id'] = this._id;
    this._Keep._store = {};
  }

  function done() {
    this._Keep.removeTxn(this._id);
  }

  // To implement
  function getRemovals() {
    return {}
  }

  // [NOTE] currently doesnot support
  // partial updates
  function getUpdates() {
    return this._updates;
  }

  function update() {
    return new Update(this._Keep, {scope: 'txn', txnId: this._id});
  }
}