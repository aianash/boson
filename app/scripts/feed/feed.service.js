'use strict'

angular
  .module('boson.feed')
  .factory('Feed', FeedFactory);


FeedFactory.$inject = ['$q', 'lodash', 'Higgs'];

function FeedFactory($q, _, Higgs) {

  var _Feed;

  _Feed = (function() {

    function Feed() {
      // [NOTE] current ui doesnot support uniform
      // feed based layout (coming up in next version)
      // Ads and offers are shown as distinct components
      this.posterAds = [];
      this.offers = [];
      this.page = 0;

      this._recentFilter = {};
    }


    // Public
    Feed.prototype.get  = get;
    Feed.prototype.next = next;

    // Private
    Feed.prototype._extractTransform = _extractTransform;
    Feed.prototype._cacheFeed        = _cacheFeed;

    return Feed;

    ///////////////////////////////////////////////////
    /////////////// Public functions //////////////////
    ///////////////////////////////////////////////////

    /**
     * Get feed (also caches in the memeber variables)
     *
     * @param  {Object} filter Feed filter (refer to Higgs.getFeed)
     * @return {Promise}        grouped feed
     */
    function get(filter) {
      this._recentFilter = filter;

      return Higgs.getFeed(filter)
        .then(this._extractTransform)
        .then(this._cacheFeed);
    }


    function next() {
      this._recentFilter.page = this.page + 1;

      return this.get(this._recentFilter);
    }



    ///////////////////////////////////////////////////
    /////////////// Private functions /////////////////
    ///////////////////////////////////////////////////

    // Group by the feed according to type
    function _extractTransform(feed) {
      var _feed = _.groupBy(feed.data, 'type');
      _feed.page = feed.page;
      return _feed;
    }


    // cache the feed locally
    function _cacheFeed(feed) {
      this.posterAds = feed.posterAd;
      this.offers = feed.offer;
      this.page = feed.page;
      return feed;
    }


  })();

  return new _Feed();
}

