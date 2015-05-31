angular
  .module('boson.core')
  .service('BucketFactory', BucketFactory);

BucketFactory.$inject = ['$q', '$interval', 'lodash', 'KeepFactory'];

function BucketFactory($q, $interval, _, KeepFactory) {
  var Bucket = _Bucket($q, $interval, _);

  this.create = function(piggyback) {
    var keep = KeepFactory.create('bucket');

    return new Bucket(piggyback, keep);
  }
}


/** Closure over dependencies */
function _Bucket($q, $interval, _) {

  function Bucket(piggyback, keep) {
    this._Piggyback = piggyback;

    /**
     * Keep current stores updates to
     * - stores
     * - stores.collections
     *
     * [NOTE] not really used right now [TO DO]
     * @type {Keep}
     */
    this._Keep = keep;

    this._apis = {
      bucket: {
        cud:    'bucket/cud',
        stores: 'bucket/stores'
      }
    }

    // [TO DO] only supporting adds to bucket items
    // right now. After Keep will have full
    // functionality here
    this._adds = [];

  }

  // Public
  Bucket.prototype.addItem       = addItem;
  Bucket.prototype.removeItem    = removeItem;
  Bucket.prototype.getStores     = getStores;

  // Private
  Bucket.prototype._startCUDTask = _startCUDTask;
  Bucket.prototype._cudBucket    = _cudBucket;

  return Bucket;


  //////////////////////
  // Public Functions //
  //////////////////////

  function addItem(itemId) {
    if(!this._cudTask) this._cudTask = this._startCUDTask();

    this._adds.push(itemId);
    return $q.when(true);
  }

  function removeItem(itemId) {
    this._adds = _.remove(this._adds, function(id) {
      return id.storeId.stuid === itemId.storeId.stuid && id.ctuid === itemId.ctuid;
    });
    return $q.when(true);
  }

  function getStores() {
    return this._Piggyback
               .GET(this._apis.bucket.stores, {fields: 'Name,Address,ItemTypes,Avatar,Contacts,CatalogueItemIds'})
               .then(function(resp) {
                  if(resp.status === 200 && _.isArray(resp.data)) {
                    return resp.data;
                  } else {
                    console.error(JSON.stringify(resp));
                    return $q.reject(new Error("Error while getting bucket stores")) 
                  }
               });
  }

  ///////////////////////
  // Private Functions //
  ///////////////////////

  function _startCUDTask() {
    return $interval(_.bind(this._cudBucket, this), 2000);
  }

  function _cudBucket() {
    var self = this;
    var adds = this._adds;
    this._adds = [];
    if(adds.length === 0) return;
    $interval.cancel(this._cudTask);
    this._cudTask = void 0;
    this._Piggyback.POST(this._apis.bucket.cud, {}, {"adds": adds})
        .then(function(resp) {
            if(resp.status !== 200 || (!resp.data.success))
              self._adds = _.union(self._adds, adds);

            if(self._adds.length !== 0) self._cudTask = self._startCUDTask();
          }, function(error) {
            console.log(JSON.stringify(error));
            self._adds = _.union(self._adds, adds);
            if(self._adds.length !== 0) self._cudTask = self._startCUDTask();
          });
  }

}