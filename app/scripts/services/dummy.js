var _dummy = angular.module('services.dummy', []);


var items = [];
var i = 0;

items.push({
  type: 'listing',
  id: i,
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
    type: 'listing',
    id: i,
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
    type: 'listing',
    id: i,
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
  type: 'listing',
  id: i,
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
    type: 'listing',
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
    type: 'listing',
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
   			value: ['red', 'blue', 'green'],
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
		listings: items,
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