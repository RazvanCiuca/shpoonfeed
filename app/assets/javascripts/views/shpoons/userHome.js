Shpoonfeed.Views.UserHome = Backbone.View.extend({

  template: JST['shpoons/userShow'],
  
  events: {
    "click #get-location" : "findFood",
    "click #more-friends" : "allUsers"
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
    this.$el.html(renderedTemplate);
    
    
    this.$el.find( ".draggable-friend" ).draggable({ 
      revert: 'invalid',      
      helper: 'clone'
    });
    
    this.$el.find( "#add-to-party" ).droppable({
      accept: ".draggable-friend",
      drop: function( event, ui ) {
        targetId = $(ui.draggable[0]).attr('data-id');
        targetUser = view.collection.get(targetId);
        view.party.add(targetUser);       
      }
    });
      
    return this;
  },
  
  addMarkers: function() {
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
    
    service.nearbySearch(request, function(results, status, pagination){
      console.log(results)
      for (var i = 0; i < results.length; i++) {       
            currentView.createMarker(results[i], map);
      }
      if (pagination.hasNextPage) {
        pagination.nextPage();
      }
      console.log(results.length);      
    });
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
                    zoom: 16,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                  });
    this.infoWindow = new google.maps.InfoWindow();
    this.addMarkers()
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
