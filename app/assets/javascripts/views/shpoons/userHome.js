Shpoonfeed.Views.UserHome = Backbone.View.extend({

  template: JST['shpoons/userShow'],
  suggestionTemplate: JST['shpoons/suggestion'],
  
  events: {
    "click #get-location" : "findFood",
    "click #more-friends" : "allUsers",
    "click #toggle-map" : "toggleMap",
    "click #toggle-directions" : "toggleDirections",
    "click #not-today" : "notToday"
  }, 
  
  notToday: function(event) {
    targetName = $(event.currentTarget).attr('data-name');
    this.aversions.add({name: targetName});
    this.render();
    this.findFood();
  },
  
  toggleDirections: function() {
    console.log(this.$el.find('#directions-panel'))
    this.$el.find('#directions-panel').toggleClass('hidden');
    $(".adp-warnbox").addClass("hidden");
  },
  
  toggleMap: function() {
    this.$el.find('#map-canvas').toggleClass('hidden');
    if (this.mapHidden == "hidden") {
      this.mapHidden = "";
    } else {
      this.mapHidden = "hidden";      
    };
  },
  
  allUsers: function() {
    Backbone.history.navigate('friends',{trigger: true});
  },
  
  reRender: function() {
    var view = this;
    var user_ids = [];
    this.party.each(function(user){
      user_ids.push(user.escape('id'));
    });   
    this.aversions.fetch({
      data:{ party: user_ids },
      success: function() {
        view.render();
        view.findFood();
      }
    });
    
  },
  
  initialize: function(inits) {
    var view = this;
    this.aversions = new Shpoonfeed.Collections.Aversions();
    this.mapHidden = "";
    this.aversions = inits.aversions;
    this.party = new Shpoonfeed.Collections.Party();
    this.listenTo(this.party,"add remove", this.reRender);
    
    var user_ids = [];
    this.party.each(function(user){
      user_ids.push(user.escape('id'));
    });   
    this.aversions.fetch({
      data:{ party: user_ids }
    });
    
  },
  
  render: function() {   
    var view = this; 
    var renderedTemplate = this.template({
      mapHidden: this.mapHidden,
      friends: this.collection,
      party:this.party
    });
    view.$el.html(renderedTemplate); 
       
    if (view.party.length > 0) {
      view.$el.find('#get-location').html('Tell us where to eat!');
    };
    
    view.$el.find( ".draggable-friend" ).draggable({ 
      revert: 'invalid',      
      helper: 'clone'
    });
    
    view.$el.find( "#reject-pile" ).droppable({
      accept: function(elem){
        if(elem.hasClass('nope')||elem.hasClass('draggable-friend')) {
          return true;
        };
        return false;
      },
      drop: function( event, ui ) {
        var target = $(ui.draggable[0])
        if (target.hasClass('draggable-friend')) {
          view.party.remove(view.party.get($(target[0]).attr('data-id')));
        } else {
          targetName = target.attr('data-name');
          view.aversions.create({name: targetName});
          view.render();
          view.findFood();
        }   
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
    var view = this;    
    console.log(results);
    results = results.filter(function(a){
      return a.rating;
    });
    
    results.sort(function(a,b){          
      return (b.rating - a.rating);
    });
    
        
    for(var i=0;i < results.length;i++){        
      if (view.aversions.pluck('name').indexOf(results[i].name) > -1) {
        console.log(i,results[i].name);
        results.splice(i,1);
        i -= 1;
      };
        
    };
      
    var suggestion = results[0];  
    view.$el.find('#results')
      .html(view.suggestionTemplate({result: suggestion}));   
    
    view.$el.find( ".nope" ).draggable({ 
      helper: 'clone',
      revert: 'invalid'    
    });
    
    var request = {
      origin: view.current_coords,
      destination: suggestion.geometry.location,
      travelMode: google.maps.TravelMode.WALKING,
      provideRouteAlternatives: false
    };
    
    var directionsDisplay = new google.maps.DirectionsRenderer();    
    directionsDisplay.setMap(view.map);
    var directionsService = new google.maps.DirectionsService();
    directionsService.route(request, function(result, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(result);
        directionsDisplay.setPanel(document.getElementById("directions-panel"));
        
        
      }
      
    });
    
   
    // for (var i = 0; i < results.length; i++) {  
  //     if (results[i].rating > 4 ) {
  //       
  //       service.getDetails({reference: results[i].reference}, function(place,status){
  //         if (status == google.maps.places.PlacesServiceStatus.OK) {
  //           view.createMarker(place, map);
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
    
    var view = this;
    
    function showMap(position) {
      lat = position.coords.latitude;
      lon = position.coords.longitude;
      view.current_coords = new google.maps.LatLng(lat, lon);

      var map = null;
      var service = null;
      
      view.initializeMap();
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
      radius: 1000, 
      query: "restaurant",
      // types: ["restaurant","food"],
      // rankBy: google.maps.places.RankBy.DISTANCE,
      minPriceLevel: 0,
      maxPriceLevel: 4
    };
    var map = this.map
    var view = this;
    service = new google.maps.places.PlacesService(map);
    map.panTo(view.current_coords);
    
    service.textSearch(request, view.suggestPlace.bind(view));
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
