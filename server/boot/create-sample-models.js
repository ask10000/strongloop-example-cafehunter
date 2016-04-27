var loopback = require('loopback');
var async = require('async');

module.exports = function(app) {

  var mysqlDS = app.dataSources.mysqltestschema;
  mysqlDS.automigrate('User', function(err){
    if(err) throw err;
  });
  mysqlDS.automigrate('AccessToken', function(err){
    if(err) throw err;
  });
  mysqlDS.automigrate('ACL', function(err){
    if(err) throw err;
  });
  mysqlDS.automigrate('RoleMapping', function(err){
    if(err) throw err;
  });
  mysqlDS.automigrate('Role', function(err){
    if(err) throw err;
  });

  console.log('About to insert cafes and reviewers');
  async.parallel({
      reviewers: async.apply(createReviewers),
      cafes : async.apply(createCafes)
    },
    function(error, results){
      if(error) throw error;
      createReviews(results.reviewers, results.cafes, function(error){
        if(error) throw error;
      });

      var menusCreated;
      createMenus(results.cafes, function(error, menus){
        if(error) throw error;
        console.log('Menu count:' + menus.length);
        createMenuItems(menus, function(err, menuItems){
          if(err) throw error;
          console.log('Menu item count:' + menuItems.length);
        })
      });
      console.log('models created successfully');
    }
  );

  //create reviewers
  function createReviewers(cb) {
    mysqlDS.automigrate('Reviewer', function(err) {
      if (err) return cb(err);
      var Reviewer = app.models.Reviewer;
      Reviewer.create([
        {email: 'ajit@cafehunter.in', password: 'Password123'},
        {email: 'vijay@cafehunter.in', password: 'Password123'},
        {email: 'usha@cafehunter.in', password: 'Password123'}
      ], cb);
    });
  }
  //create coffee shops
  function createCafes(cb) {
    mysqlDS.automigrate('Cafe', function(err) {
      if (err) return cb(err);
      var Cafe = app.models.Cafe;
      Cafe.create([
        {name: 'Kalmane Koffees', address: 'Shop No 117, Forum Value Mall, Whitefield Main Road, Whitefield, Bengaluru, Karnataka 560066', location: new loopback.GeoPoint({lat:12.95973,lng:77.74791}), wifi:false},
        {name: 'Krispy Kreme', address: 'Shop No. 62, Forum Value Mall, Whitefield Main Road, Whitefield, Bengaluru, Karnataka 560066', location: new loopback.GeoPoint({lat:12.95973,lng:77.74791}), wifi:false},
        {name: 'Cafe Coffee Day', address: 'SH 35, Whitefield Main Road, Bangalore, Karnataka',location: new loopback.GeoPoint({lat:12.96391,lng:77.74859}), wifi:true},
        {name: 'Cuppa', address: 'Ground floor, Sigma Tech Park, Varthur Main Rd, Whitefield, Bengaluru, Karnataka',location: new loopback.GeoPoint({lat:12.95775,lng:77.74452}), wifi:true}
      ], cb);
    });
  }

  //create reviews
  function createReviews(reviewers, cafes, cb) {
    mysqlDS.automigrate('Review', function(err) {
      if (err) return cb(err);
      var Review = app.models.Review;
      var DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;
      Review.create([
        {
          date: Date.now() - (DAY_IN_MILLISECONDS * 4),
          rating: 5,
          comments: 'A very good coffee shop.',
          publisherId: reviewers[0].id,
          cafeId: cafes[0].id,
        },
        {
          date: Date.now() - (DAY_IN_MILLISECONDS * 3),
          rating: 5,
          comments: 'Quite pleasant.',
          publisherId: reviewers[1].id,
          cafeId: cafes[0].id,
        },
        {
          date: Date.now() - (DAY_IN_MILLISECONDS * 2),
          rating: 4,
          comments: 'It was ok.',
          publisherId: reviewers[1].id,
          cafeId: cafes[1].id,
        },
        {
          date: Date.now() - (DAY_IN_MILLISECONDS),
          rating: 4,
          comments: 'I go here everyday.',
          publisherId: reviewers[2].id,
          cafeId: cafes[2].id,
        }
      ], cb);
    });
  }

  //create menus
  function createMenus(cafes, cb){

      mysqlDS.automigrate('Menu', function(err) {
        if (err) return cb(err);
        var Menu = app.models.Menu;
        var DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;
        Menu.create([
          {
            publishDate: Date.now() - (DAY_IN_MILLISECONDS),
            cafeId: cafes[0].id
          },
          {
            publishDate: Date.now() - (DAY_IN_MILLISECONDS),
            cafeId: cafes[1].id
          },
          {
            publishDate: Date.now() - (DAY_IN_MILLISECONDS),
            cafeId: cafes[2].id
          },
          {
            publishDate: Date.now() - (DAY_IN_MILLISECONDS),
            cafeId: cafes[3].id
          },
        ], cb);
      });

  }

  function createMenuItems(menus, cb){
    mysqlDS.automigrate('MenuItem', function(err){
      if(err) return cb(err);
      var MenuItem = app.models.MenuItem;
      MenuItem.create([
        {
          name:'Cafe Latte',
          price:95.00,
          menuId: menus[3].id
        },
        {
          name:'Ethiopian Coffee',
          price: 105.00,
          menuId: menus[3].id
        },
        {
          name:'Brazilian Swirl',
          price: 115.00,
          menuId: menus[3].id
        },
        {
          name:'Kopi Luwak',
          price: 150.00,
          menuId: menus[3].id
        },
        {
          name:'Cappucino',
          price: 95.00,
          menuId: menus[2].id
        },
        {
          name:'Devil\'s Own',
          price: 115.00,
          menuId: menus[2].id
        },
        {
          name:'Assam Tea',
          price: 80.00,
          menuId: menus[2].id
        },
        {
          name:'Aztec',
          price: 125.00,
          menuId: menus[2].id
        },
        {
          name:'Masala Chai Latte',
          price: 150.00,
          menuId: menus[0].id
        },
        {
          name:'Iced Americano',
          price: 125.00,
          menuId: menus[1].id
        },
        {
          name:'Iced Latte',
          price: 125.00,
          menuId: menus[1].id
        },
        {
          name:'Iced Mocha',
          price: 155.00,
          menuId: menus[0].id
        },
        {
          name:'Filter Coffee',
          price: 90.00,
          menuId: menus[1].id
        },
        {
          name:'Kaapi Premium',
          price: 80.00,
          menuId: menus[0].id
        },
        {
          name:'Kaapi Peaberry',
          price: 60.00,
          menuId: menus[0].id
        },
        {
          name:'Kaapi Samrat',
          price: 75.00,
          menuId: menus[0].id
        },
        {
          name:'Kaapi Nelyani Gold',
          price: 75.00,
          menuId: menus[0].id
        },
      ], cb);
    });
  }
};
