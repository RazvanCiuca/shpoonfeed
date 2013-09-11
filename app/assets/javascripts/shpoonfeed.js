window.Shpoonfeed = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function($el) {
    var users = new Shpoonfeed.Collections.Users();
    var friends = new Shpoonfeed.Collections.Friends();
    friends.fetch();
    users.fetch({
      success: function() {
        var router = new Shpoonfeed.Routers.Shpoons({
          $el: $el,
          users: users,
          friends: friends
        });
        Backbone.history.start();
      }
    });
    
   
    
  }
};

$(document).ready(function(){  
  if ($('.has-backbone')[0]) {
    Shpoonfeed.initialize($('#user-home'));
  }
});
