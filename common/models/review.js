module.exports = function(Review) {
  Review.beforeRemote('create', function(context, user, next){
    var req = context.req;
    req.body.date = Date.now();
    req.body.publisherId = user.accessToken.userId;
    next();
  });
};
