Shpoonfeed.Collections.Friends = Backbone.Collection.extend({

  model: Shpoonfeed.Models.User,
  url: "/users/:id/friends"

});
