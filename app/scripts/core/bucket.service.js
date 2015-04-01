angular
  .module('boson.core')
  .service('BucketFactory', _BucketFactory);

_BucketFactory.$inject = ['$q', 'KeepFactory'];

function _BucketFactory($q, KeepFactory) {
  var Bucket = _Bucket($q);

  this.create = function(piggyback) {
    var keep = KeepFactory.create('bucket');

    return new Bucket(piggyback, keep);
  }
}


/** Closure over dependencies */
function _Bucket($q) {

  function Bucket(piggyback, keep) {
    this._Piggyback = piggyback;

    /**
     * Keep current stores updates to
     * - stores
     * - stores.collections
     *
     * @type {Keep}
     */
    this._Keep = keep;
    this._Piggyback.addPiggySource(this._bucketUpdates);
    this._Piggyback.addPiggySource(this._bucketRemovals);

    this._apis = {
      bucket: {
        update: 'bucket/udate',
        remove: 'bucket/remove',
        get:    'bucket/get'
        map: {
          locations: 'bucket/map/locations'
        }
      }
    }
  }

  // Public
  Bucket.prototype.addStore     = addStore;
  Bucket.prototype.removeStore  = removeStore;

  Bucket.prototype.addItem      = addItem;
  Bucket.prototype.removeItem   = removeItem;

  // Private
  Bucket.prototype._bucketUpdates   = _bucketUpdates;
  Bucket.prototype._bucketRemovals  = _bucketRemovals;
  Bucket.prototype._onBucketUpdate  = _onBucketUpdate;

  return Bucket;


  //////////////////////
  // Public Functions //
  //////////////////////

  function addStore(storeId) {
    this._Keep.add({ifNot: true}).thiz({storeId: {}}).to('stores');
  }

  function removeStore(storeId) {
    this._Keep.remove().thiz(storeId).from('stores');
  }

  function addItem(itemId, storeId) {
    this._Keep.push().thiz(itemId).to('stores', storeId, 'collections');
  }

  function removeItem(itemId, storeId) {
    this._Keep.remove().thiz(itemId).from('stores', storeId, 'collections');
  }


  ///////////////////////
  // Private Functions //
  ///////////////////////

  function _bucketUpdates() {
    var deferred = $q.defer();
    deferred.promise.then(this._onBucketUpdate);

    return {
      method: 'POST',
      api: this._apis.bucket.update,
      data: this._Keep.withinTxn().getUpdates(),
      deferred: deferred
    };
  }

  function _bucketRemovals() {
    var deferred = $q.defer();
    deferred.promise.then(this._onBucketUpdate);

    return {
      method: 'POST',
      api: this._apis.bucket.remove,
      data: this._Keep.withinTxn().getRemovals(),
      deferred: deferred
    };
  }

  function _onBucketUpdate(res) {
    if(res.status === 200) {
      var keepTxnId = res.data._keep_txn_id;
      this._Keep.txn(keepTxnId).done();
    }
  }

}