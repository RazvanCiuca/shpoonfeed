Shpoonfeed.Routers.Shpoons = Backbone.Router.extend({
  routes: {
    "" : "showUser",
    "friends" : "showAllUsers"
  },
  
  initialize: function(inits) {
    this.$el = inits.$el;
    this.users = inits.users;
    this.friends = inits.friends;
  },
  
  showUser: function() {  
      
    var view = new Shpoonfeed.Views.UserHome({collection: this.friends});
    
    this.$el.html(view.render().$el);
  },
  
  showAllUsers: function() {   
    var that = this;
    var friends = new Shpoonfeed.Collections.Friends();
    var notfriends = new Shpoonfeed.Collections.NotFriends();
    friends.fetch({
      success: function() {
        notfriends.fetch({
          success: function() {
            var view = new Shpoonfeed.Views.AllUsers({
              collection: that.users,
              friends: friends,
              notfriends: notfriends              
            });
            that.$el.html(view.render().$el);
          }
        });
      }
    });    
  }
 
  
});
