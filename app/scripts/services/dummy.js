var _dummy = angular.module('services.dummy', []);


/** Listing Page data */

var ads = [];
ads.push({img: 'https://imageshack.com/i/id4tBDxUj'});
ads.push({img: 'https://imageshack.com/i/eyRdRuzWj'});
ads.push({img: 'https://imageshack.com/i/id4tBDxUj'});
ads.push({img: 'https://imageshack.com/i/eyRdRuzWj'});


var offers = [];

offers.push({
  storeType: 'apparels',
  brand: 'Levis Showroom',
  address: 'City Talk Plaza, Brigade Road',
  offer: '50% + 20% off',
  itemDescr: 'men\'s jeans'
});


offers.push({
  storeType: 'store',
  brand: 'Shopper Stop',
  address: 'Forum Mall, Kormangla',
  offer: 'Buy 1 Get 1 Free',
  itemDescr: 'women\'s dresses'
});


offers.push({
  storeType: 'apparels',
  brand: 'Flying Machine Showroom',
  address: '100ft Road, Indiranagar',
  offer: 'New Arrivals',
  itemDescr: 'casual shirts'
});


offers.push({
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
  storeId: '239023kj2kjjk',
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
  storeId: '39jkajks',
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


_dummy.factory('DummyData',
function(){
	return {
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