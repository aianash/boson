var _dummy = angular.module('services.dummy', []);


/** Listing Page data */

var ads = [];
ads.push({img: 'https://imageshack.com/i/id4tBDxUj'});
ads.push({img: 'https://imageshack.com/i/eyRdRuzWj'});
ads.push({img: 'https://imageshack.com/i/id4tBDxUj'});
ads.push({img: 'https://imageshack.com/i/eyRdRuzWj'});


var offers = [];

offers.push({
  storeId: '29023kl2k',
  storeType: 'apparels',
  brand: 'Levis Showroom',
  address: 'City Talk Plaza, Brigade Road',
  offer: '50% + 20% off',
  itemDescr: 'men\'s jeans'
});


offers.push({
  storeId: '29023ksddsk',
  storeType: 'store',
  brand: 'Shopper Stop',
  address: 'Forum Mall, Kormangla',
  offer: 'Buy 1 Get 1 Free',
  itemDescr: 'women\'s dresses'
});


offers.push({
  storeId: '99kskksl2k',
  storeType: 'apparels',
  brand: 'Flying Machine Showroom',
  address: '100ft Road, Indiranagar',
  offer: 'New Arrivals',
  itemDescr: 'casual shirts'
});


offers.push({
  storeId: '9309390jksdj',
  storeType: 'store',
  brand: 'Westside',
  address: 'Garuda Mall',
  offer: 'Buy 2 Get 1 Free',
  itemDescr: 'men\'s shoes'
});


/** Search page data */
var items = [];
var i = 0;

items.push({
  type: 'storeInfo',
  id: '1',
  storeType: 'store',
  name: 'Shopper Stop',
  address: 'Forum Mall, Kormangla'
});

items.push({
  type: 'resultEntry',
  id: i,
  storeId: '1',
  img: 'http://staticaky.yepme.com/newcampaign/3932/39327_YPZM_1.jpg',
  title: 'Dorita Solid Zipper Dress',
  brand: 'YepMe',
  brandIcon: 'http://staticaky.yepme.com/images/yepme-logo.gif',
  detail: {
    descr: 'Navy blue, woven, printed top, has a V neckline with rucked detail three quarter puff sleeves with button cuffs',
    sizes: ['S', 'L', 'XL'],
    fit: 'slim fit'
  },
  adImg: 'https://imageshack.com/i/id4tBDxUj'
});

i += 1;

angular.forEach([1, 2], function() {

  items.push({
    type: 'resultEntry',
    id: i,
    storeId: '1',
    img: 'http://staticaky.yepme.com/newcampaign/3932/39327_YPZM_1.jpg',
    title: 'Dorita Solid Zipper Dress',
    brand: 'YepMe',
    brandIcon: 'http://staticaky.yepme.com/images/yepme-logo.gif',
    detail: {
      descr: 'Navy blue, woven, printed top, has a V neckline with rucked detail three quarter puff sleeves with button cuffs',
      sizes: ['S', 'L', 'XL'],
      fit: 'slim fit'
    }
  });

  i += 1;

  items.push({
    type: 'resultEntry',
    id: i,
    storeId: '1',
    img: 'http://staticaky.yepme.com/newcampaign/3293/32932_YPXL_1.jpg',
    title: 'Raphael Check Shirt',
    brand: 'YepMe',
    brandIcon: 'http://staticaky.yepme.com/images/yepme-logo.gif',
    detail: {
      descr: 'Slim fit check shirt with zig-zag stitch line detail at front shoulder joint, bias check detailing at front placket, contrast detailing at inner collar band & stylized chest pocket',
      sizes: ['40', '41', '42'],
      fit: 'slim fit'
    }
  });

  i += 1;
});


items.push({
  type: 'storeInfo',
  id: '2',
  storeType: 'apparels',
  name: 'Levis Showroom',
  address: 'City Talk Plaza, Brigade Road'
});

items.push({
  type: 'resultEntry',
  id: i,
  storeId: '2',
  img: 'http://staticaky.yepme.com/newcampaign/3932/39327_YPZM_1.jpg',
  title: 'Dorita Solid Zipper Dress',
  brand: 'Levis',
  brandIcon: 'http://staticaky.yepme.com/images/yepme-logo.gif',
  detail: {
    descr: 'Navy blue, woven, printed top, has a V neckline with rucked detail three quarter puff sleeves with button cuffs',
    sizes: ['S', 'L', 'XL'],
    fit: 'slim fit'
  },
  adImg: 'https://imageshack.com/i/eyRdRuzWj'
});

i += 1;

angular.forEach([1, 2], function() {
  items.push({
    type: 'resultEntry',
    id: i,
    img: 'http://staticaky.yepme.com/newcampaign/3932/39327_YPZM_1.jpg',
    title: 'Dorita Solid Zipper Dress',
    brand: 'Levis',
    brandIcon: 'http://staticaky.yepme.com/images/yepme-logo.gif',
    detail: {
      descr: 'Navy blue, woven, printed top, has a V neckline with rucked detail three quarter puff sleeves with button cuffs',
      sizes: ['S', 'L', 'XL'],
      fit: 'slim fit'
    }
  });

  i += 1;

  items.push({
    type: 'resultEntry',
    id: i,
    img: 'http://staticaky.yepme.com/newcampaign/3293/32932_YPXL_1.jpg',
    title: 'Raphael Check Shirt',
    brand: 'Levis',
    brandIcon: 'http://staticaky.yepme.com/images/yepme-logo.gif',
    detail: {
      descr: 'Slim fit check shirt with zig-zag stitch line detail at front shoulder joint, bias check detailing at front placket, contrast detailing at inner collar band & stylized chest pocket',
      sizes: ['40', '41', '42'],
      fit: 'slim fit'
    }
  });

  i += 1;
});


/** Query modal data */

var expandedQuery =
  {
    searchId: '',
    str: '',
    expanded: [
      {
        label: 'descr',
        value: "men's casual shirt",
        type: 'string'
      },
      {
        label: 'color',
        value: ['#c0392b', '#2980b9', '#16a085'],
        type: 'color-array'
      },
      {
        label: 'size',
        value: '41',
        type: 'string'
      },
      {
        label: 'fit',
        value: 'slim fit',
        type: 'string'
      },
      {
        label: 'brand',
        value: ['levis', 'woodland', 'peter england'],
        type: 'string-array'
      }
    ]
  };


/** Map data */

storeLocations = [
  [-34.397, 150.644, 0.9]
];


/** Friends data */
nearbyFriends = [];

nearbyFriends.push({
  name: 'Rahul Jain',
  username: 'jainsahab',
  id: '1',
  avatar: 'https://imageshack.com/i/idxrtxQMj'
});

nearbyFriends.push({
  name: 'Amik Singh',
  username: 'tiger',
  id: '2',
  avatar: 'https://imageshack.com/i/f0IA0Y8Gj'
});

nearbyFriends.push({
  name: 'Vishal Gupta',
  username: 'golupolu',
  id: '3',
  avatar: 'https://imageshack.com/i/exAUgkr7j'
});

nearbyFriends.push({
  name: 'Sajal Agarwal',
  username: 'mysterious',
  id: '4',
  avatar: 'http://imageshack.com/a/img661/3717/dMwcZr.jpg'
});

nearbyFriends.push({
  name: 'Rahul Shankar',
  username: 'bholenath',
  id: '5',
  avatar: 'https://imageshack.com/i/paMWGpapj'
});

nearbyFriends.push({
  name: 'Neeraj Gangwar',
  username: 'gangu',
  id: '6',
  avatar: 'http://imageshack.com/a/img673/2847/UgCplV.jpg'
});

nearbyFriends.push({
  name: 'Giri Manivannan',
  username: 'fallen',
  id: '7',
  avatar: 'https://imageshack.com/i/exf7Vv0Rj'
});

nearbyFriends.push({
  name: 'Albert Einstein',
  username: 'albert1915',
  id: '0',
  avatar: 'http://imageshack.com/a/img673/4937/7yAKQh.jpg'
});



_dummy.factory('DummyData',
function(){
  return {
    nearbyFriends: nearbyFriends,
    storeLocations: storeLocations,
    listings: {
      offers: offers,
      ads: ads
    },
    results: function(searchId) {
      return {
        items: items,
        searchId: searchId,
        hasMoreContent: true
      };
    },
    query: function(queryStr, searchId) {
      expandedQuery['str'] = queryStr;
      expandedQuery['searchId'] = searchId;
      return expandedQuery;
    }
  };
});