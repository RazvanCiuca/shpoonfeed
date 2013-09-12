Shpoonfeed.Views.UserHome = Backbone.View.extend({

  template: JST['shpoons/userShow'],
  
  events: {
    "click #get-location" : "findFood",
    "click #more-friends" : "allUsers",
    "click #toggle-map" : "toggleMap"
  }, 
  
  toggleMap: function() {
    this.$el.find('#map-canvas').toggleClass('hidden');
  },
  
  allUsers: function() {
    Backbone.history.navigate('friends',{trigger: true});
  },
  
  initialize: function(inits) {
    this.party = new Shpoonfeed.Collections.Party();
    this.listenTo(this.party,"add remove", this.render);
  },
  
  render: function() {   
    var view = this; 
    var renderedTemplate = this.template({
      friends: this.collection,
      party:this.party
    });
    view.$el.html(renderedTemplate);    
    
    view.$el.find( ".draggable-friend" ).draggable({ 
      revert: 'invalid',      
      helper: 'clone'
    });
    
    view.$el.find( "#reject-pile" ).droppable({
      accept: ".nope",
      drop: function( event, ui ) {
        targetRef = $(ui.draggable[0]).attr('data-reference');
              
      }
    });
    
    view.$el.find( "#add-to-party" ).droppable({
      accept: ".draggable-friend",
      drop: function( event, ui ) {
        targetId = $(ui.draggable[0]).attr('data-id');
        targetUser = view.collection.get(targetId);
        view.party.add(targetUser);       
      }
    });
      
    return this;
  },
  
  suggestPlace: function(results, status, pagination){
    var user_ids = [];
    var view = this;
    this.party.each(function(user){
      party.push(user.escape('id'));
    });
    
    $.ajax({
      type: "GET",
      url: "/aversions",
      data: { party: user_ids }
    }).done(function( banlist ) {
      for(var i=0;i < banlist.length;i++){
        console.log(ban[i]);      
      }; 
      for(var i=0;i < results.length;i++){
        view.$el.find('#results')
          .append("<div class='nope' data-reference='"+results[i].reference+"'>"+results[i].name+"</div><br>");    
      }; 
      view.$el.find( ".nope" ).draggable({ 
        revert: 'invalid',      
        // helper: 'clone'
      });
      
      
         
    });
    
   
    // for (var i = 0; i < results.length; i++) {  
  //     if (results[i].rating > 4 ) {
  //       
  //       service.getDetails({reference: results[i].reference}, function(place,status){
  //         if (status == google.maps.places.PlacesServiceStatus.OK) {
  //           currentView.createMarker(place, map);
  //           console.log(place.name);
  //         }            
  //       })      
  //     }
  //   }
  //   if (pagination.hasNextPage) {
  //     pagination.nextPage();
  //   }
  //   console.log(results.length);      
  },
  
  
  
  findFood: function() {
    this.getCurrentPosition();    
  },
  
  getCurrentPosition: function() {   
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showMap);
    }
    else {
      alert('Your shitty browser can\'t handle geolocation');
    };
    
    var currentView = this;
    
    function showMap(position) {
      lat = position.coords.latitude;
      lon = position.coords.longitude;
      currentView.current_coords = new google.maps.LatLng(lat, lon);

      var map = null;
      var service = null;
      
      currentView.initializeMap();
    };
  },
  
  initializeMap: function() {            
    this.map = new google.maps.Map( document.getElementById("map-canvas"), {
                    center: new google.maps.LatLng(37.780968900000005, -122.41130320000002),
                    zoom: 15,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                  });
    this.infoWindow = new google.maps.InfoWindow();
    this.getChoices()
  },
  
  getChoices: function() {
    var request = {
      location: this.current_coords,
      openNow: true,
      radius: 425, 
      types: ["restaurant","food"],
      // rankBy: google.maps.places.RankBy.DISTANCE,
      minPriceLevel: 1,
      maxPriceLevel: 1
    };
    var map = this.map
    var currentView = this;
    service = new google.maps.places.PlacesService(map);
    map.panTo(currentView.current_coords);
    
    service.nearbySearch(request, currentView.suggestPlace.bind(currentView));
  },
      
  createMarker: function(place) {
    var map = this.map
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location,
      title: place.name      
    });
    
    var infoWindow = this.infoWindow;
    google.maps.event.addListener(marker, 'click', function() {
      
      infoWindow.setContent(place.name);
      infoWindow.open(map, this);
    });
  }           
});
