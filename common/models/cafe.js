
var loopback = require('loopback');

module.exports = function(Cafe) {
  Cafe.remoteMethod('nearLocation',
  {
    accepts:  [
                {arg: 'lat', type: 'number', required: true},
                {arg: 'lng', type: 'number', required: true},
                {arg: 'radius', type:'number', required: false, default:2000},
                {arg: 'radiusType', type:'string', required: false, default:'meters'}
              ],
    http:     {path: '/nearLocation', verb: 'get'},
    returns:  {arg: 'cafes', type: 'Object'}
  });

  Cafe.nearLocation = function(lat, lng, radius, radiusType, cb){
    var here = new loopback.GeoPoint({lat, lng});
    Cafe.find( {where: {location: {near: here, maxDistance:radius, unit:radiusType}}, limit:10},
                function(err, nearbyCafes) {
                      console.info(nearbyCafes); // [CoffeeShop, ...]
                      cb(null, nearbyCafes);
                }
             );
  }
};
