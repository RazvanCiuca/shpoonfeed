Shpoonfeed.Collections.NotFriends = Backbone.Collection.extend({

  model: Shpoonfeed.Models.User,
  url: "/users/:id/notfriends"

});
