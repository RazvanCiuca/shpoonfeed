window.Shpoonfeed = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function($el) {
    var users = new Shpoonfeed.Collections.Users();
    var friends = new Shpoonfeed.Collections.Friends();
    var notfriends = new Shpoonfeed.Collections.NotFriends();
    var aversions = new Shpoonfeed.Collections.Aversions();
    $.ajax({
      type: "GET",
      url: "/users",
    }).done(function(data){
      _.each(data[0], function(user){
        users.add(new Shpoonfeed.Models.User(user));
      });
      _.each(data[1], function(friend){
        friends.add(new Shpoonfeed.Models.User(friend));
      });
      _.each(data[2], function(notfriend){
        notfriends.add(new Shpoonfeed.Models.User(notfriend));
      });
      _.each(data[3], function(aversion){
        aversions.add(new Shpoonfeed.Models.User(aversion));
      });
      var router = new Shpoonfeed.Routers.Shpoons({
        $el: $el,
        users: users,
        friends: friends,
        notfriends: notfriends,
        aversions: aversions
      });
      Backbone.history.start();
    });    
  }
};

$(document).ready(function(){  
  if ($('.has-backbone')[0]) {
    Shpoonfeed.initialize($('#user-home'));
  }
});
