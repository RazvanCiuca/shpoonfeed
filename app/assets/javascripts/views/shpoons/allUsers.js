Shpoonfeed.Views.AllUsers = Backbone.View.extend({

  template: JST['shpoons/allUsers'],
  
  events: {
   
  },
  
  initialize: function(inits) {
    this.collection = inits.collection;
    this.friends = inits.friends;
    this.notfriends = inits.notfriends; 
       
    this.listenTo(this.friends, 'add remove', this.render); 
    this.listenTo(this.notfriends, 'add remove', this.render);    
  }, 
  
  render: function() {   
    var view = this;    
    var renderedTemplate = this.template({
      users: this.collection,
      friends: this.friends,
      notfriends: this.notfriends
    });
    this.$el.html(renderedTemplate);
    
    this.$el.find( ".draggable" ).draggable({ 
      axis: "y",
      revert: "invalid"
    });
    
    this.$el.find( "#defriend" ).droppable({
      accept: ".draggable-friend",
      drop: function( event, ui ) {
        targetId = $(ui.draggable[0]).attr('data-id');
      
        $.ajax({
          type: "GET",
          url: "/defriend",
          data: { target: targetId }
        }).done(function( msg ) {
          console.log('defriended')
          var targetUser = view.friends.get(targetId);
          view.notfriends.add(targetUser);
          view.friends.remove(targetUser);
          
        });
      }
    });
    this.$el.find( "#befriend" ).droppable({
      accept: ".draggable-stranger",
      drop: function( event, ui ) {
        targetId = $(ui.draggable[0]).attr('data-id');

        $.ajax({
          type: "GET",
          url: "/befriend",
          data: { target: targetId }
        }).done(function( msg ) {
          console.log('befriended')
          var targetUser = view.notfriends.get(targetId);
          view.friends.add(targetUser);
          view.notfriends.remove(targetUser);
        });
      }
    });
  
    
    return this;
  } 
  

});