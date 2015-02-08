Shpoonfeed.Routers.Shpoons = Backbone.Router.extend({
  routes: {
    "" : "showUser",
    "_=_" : "showUser",
    "friends" : "showAllUsers"
  },
  
  initialize: function(inits) {
    this.$el = inits.$el;
    this.users = inits.users;
    this.friends = inits.friends;
    this.notfriends = inits.notfriends;
    this.aversions = inits.aversions;
  },
  
  showUser: function() {  
    var router = this;  
    var view = new Shpoonfeed.Views.UserHome({
      collection: router.friends,
      aversions: router.aversions
    });
    
    router.$el.html(view.render().$el);
  },
  
  showAllUsers: function() {   
    var router = this;
   
    var view = new Shpoonfeed.Views.AllUsers({
      collection: router.users,
      friends: router.friends,
      notfriends: router.notfriends              
    });
    router.$el.html(view.render().$el);    
  }
 
  
});
