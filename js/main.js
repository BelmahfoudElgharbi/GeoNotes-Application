(function(){

//Application initialization
window.App = {
		views: {},
		models : {},
		collections: {},
		Router: {},
		utils:{},
		stores: {},
	}

//Initialize localStorage Data Store
App.stores.Geonotes = new Store('geonotes');
	
//--------------------------------------- Models ------------------------------------------------

//--------------------------------------Note Model-----------------------------------------------
App.models.NoteModel = Backbone.Model.extend({
		
		defaults: {
		    id: null,
			name: null,
			Description: null,
			latitude: null,
			longitude: null,
		},
		localStorage: App.stores.Geonotes, //Use localStorage datastore

		initialize: function(){
		
		console.log("l'initialisation de  NoteModel");
		
			if (!this.get('name')) {
				this.set({name: "Note @ " + Date()})
			};

			if (!this.get('Description')) {
				this.set({Description: "No Content"})
			};
			
		}

});

//--------------------------------Note collection------------------------------

App.collections.NoteCollection = Backbone.Collection.extend({
	   		
		model: App.models.NoteModel,
		
		localStorage: App.stores.Geonotes,
		
		initialize: function(){
		
			console.log("l'initialisation de  NoteCollection");
			console.log(this);
			var collection = this;
		// When localStorage updates, fetch data from the store
			//this.localStorage.bind('update', function(){
			collection.fetch();
			//})
		}
	});	
	
//--------------------------------Path Model------------------------------

	App.models.PathModel = Backbone.Model.extend({
	
		defaults:{
		name: null,
		description : null,
		notes : null
		},
	
		localStorage: App.stores.Geonotes,
		
		initialize: function(){
		//this.notes.fetch();
		console.log("l'initialisation de  PathModel");		
		}
	});
	
//--------------------------------Path collection----------------------------------

    App.collections.PathCollection = Backbone.Collection.extend({
	   		
		model: App.models.PathModel,
		
		localStorage: App.stores.Geonotes,
		
		initialize: function(){
		console.log("l'initialisation de  PathCollection");
			
			var collection = this;

		// When localStorage updates, fetch data from the store
			//this.localStorage.bind('update', function(){
			collection.fetch();
			//})
		}
	});


//---------------------------------------------------------------------------------------------

//------------------------------------Template loader------------------------------------------

App.utils.templateLoader = {

    templates: {},

    load: function(names, callback) {

        var deferreds = [],
            self = this;

        $.each(names, function(index, name) {
            deferreds.push($.get('tpl/' + name + '.html', function(data) {
                self.templates[name] = data;
            }));
        });

        $.when.apply(null, deferreds).done(callback);
    },

    // Get template by name from hash of preloaded templates
    get: function(name) {
        return this.templates[name];
    }

};

//---------------------------------------------------------------------------------------------

//----------------------------------------Application Views------------------------------------

//------------------------------------------Home View------------------------------------------
App.views.Home = Backbone.View.extend({

    templateLoader: App.utils.templateLoader,       

    initialize: function() {
    this.template = _.template(this.templateLoader.get('home'));     
    },
        
    render: function(eventName) {
        $(this.el).html(this.template());    
        return this;
    }
    });
//---------------------------------------------------------------------------------------------

//------------------------------------- Admin Page --------------------------------------------

App.views.AdminPage = Backbone.View.extend({

	templateLoader: App.utils.templateLoader,

    initialize: function() {
        this.template = _.template(this.templateLoader.get("admin-page"));        
    },

    render: function(eventName) {
        $(this.el).html(this.template());
        return this;
    }
});

//---------------------------------------------------------------------------------------------

//------------------------------------- User Page --------------------------------------------

App.views.UserPage = Backbone.View.extend({

	templateLoader: App.utils.templateLoader,

    initialize: function() {
        this.template = _.template(this.templateLoader.get("user-page"));        
    },

    render: function(eventName) {
        $(this.el).html(this.template());
        return this;
    }
});

//---------------------------------------------------------------------------------------------

//-------------------------------------- Admin Note Page ---------------------------------------

App.views.AdminNotePage = Backbone.View.extend({
    templateLoader: App.utils.templateLoader,
    initialize: function() {
		console.log("l'initialisation de  AdminNotePage");
		this.template = _.template(this.templateLoader.get('admin-note-page'));
    },

    render: function(eventName) {
	    console.log("dans la fonction render de admin note page");
        $(this.el).html(this.template(this.model.toJSON()));
		console.log(this.model);
		console.log("dans la fonction render de note page Admin 2");
        this.listView = new App.views.AdminNoteList({el: $('ul', this.el), model: this.model});
        this.listView.render();
        return this;
    },
	
	events:{
        'click #btn': 'addNote',
    },
	
    addNote : function(){
	    console.log("dans la fonction addNote de admin note page");
		self=this;
		var Latitude, Longitude;
		console.log("avant la localisation");
		if (!navigator.geolocation) {
			alert('Erreur : votre navigateur ne supporte pas Geolocation');
			return;
		}
		else navigator.geolocation.getCurrentPosition(function(position)
            { 	
				console.log("dans la localisation");			
				self.Longitude = position.coords.longitude;
				self.Latitude = position.coords.latitude;
				var name = $('#notename').val();
			    var description = $('#Description').val();
				var note= new App.models.NoteModel({name: name,Description:description,longitude:self.Longitude, latitude:self.Latitude });
				note.save();
				console.log("Lat:"+self.Latitude+"    Lon:"+self.Longitude);
				self.model.add(note);
				console.log(note.get("id"));
				console.log("à la fin de la fonction add note");
			});
    }
});
//---------------------------------------------------------------------------------------------

//----------------------------------- Admin Note List View-------------------------------------

App.views.AdminNoteList = Backbone.View.extend({
	tagName: "ul",
    initialize: function() {
        this.model.bind("reset", this.render, this);
        this.model.on('add',this.addOne,this);
    },
    render: function(eventName) {
        $(this.el).empty();
        console.log(this.model);
        _.each(this.model.models, function(note) {
            $(this.el).prepend(new App.views.AdminNoteItem({model: note}).render().el);
        }, this);
		console.log("render admin  note list");
        return this;
    },
    addOne: function(note){
        console.log('ajout view note ');
        var noteView = new App.views.AdminNoteItem({ model: note });
        this.$el.prepend(noteView.render().el);
    }
});
//---------------------------------------------------------------------------------------------

//-----------------------------------Admin Note Item ------------------------------------------
App.views.AdminNoteItem = Backbone.View.extend({
    tagName: "li",
    events: {
        'click #delete': 'destroy',
		'click #save' : 'save',
    },
    initialize: function() {
        this.template = _.template(App.utils.templateLoader.get('admin-note-item'));
        this.model.on('change', this.render, this);
        this.model.on('destroy', this.remove, this);
    },
    render: function(eventName) {
	
		$(this.el).html(this.template(this.model.toJSON()));
		return this; 

    },
	
	save: function(){

	     NewName = document.getElementById("name "+this.model.get('id')).value;
		 NewDescription = document.getElementById("description "+this.model.get('id')).value;
         /*this.model.save({
             name: NewName,
			 Description : NewDescription
         });*/
		 this.model.set('name',NewName);
		 this.model.set('Description',NewDescription);
		 this.model.save();
		 alert("Note updates were successful");
	},
    destroy: function() {
        this.model.destroy();
    },
    remove: function() {
        this.$el.remove();
    }

});
//---------------------------------------------------------------------------------------------

//----------------------------------------- Admin Path Page -----------------------------------
App.views.AdminPathPage = Backbone.View.extend({
    templateLoader: App.utils.templateLoader,
    initialize: function() {
		console.log("l'initialisation de  AdminNotePage");
		this.template = _.template(this.templateLoader.get('admin-path-page'));
    },

    render: function(eventName) {
	    console.log("dans la fonction render de admin path page");
        $(this.el).html(this.template(this.model.toJSON()));
        this.listView = new App.views.AdminPathList({el: $('ul', this.el), model: this.model});
        this.listView.render();
        return this;
    },
	
	events:{
        'click #btn': 'addPath',
    },
	
    addPath : function(){
	    console.log("dans la fonction addPath de admin note page");
		self=this;
		var name = $('#pathname').val();
	    var description = $('#Description').val();
		var path= new App.models.PathModel({name: name,Description:description});
		path.save();
		self.model.add(path);
		console.log("à la fin de la fonction add note");
		}
	});

//---------------------------------------------------------------------------------------------

//----------------------------------------- Admin Path List View ------------------------------
App.views.AdminPathList = Backbone.View.extend({
	tagName: "ul",
    initialize: function() {
        this.model.bind("reset", this.render, this);
        this.model.on('add',this.addOne,this);
    },
    render: function(eventName) {
        $(this.el).empty();
        console.log(this.model);
        _.each(this.model.models, function(path) {
            $(this.el).prepend(new App.views.AdminPathItem({model: path}).render().el);
        }, this);
		console.log("render admin  note list");
        return this;
    },
    addOne: function(path){
        console.log('ajout view path ');
        var pathView = new App.views.AdminPathItem({ model: path });
        this.$el.prepend(pathView.render().el);
    }
});
//---------------------------------------------------------------------------------------------

//----------------------------------------- Admin Path Item -----------------------------------
App.views.AdminPathItem = Backbone.View.extend({
    tagName: "li",
    events: {
        'click #delete': 'destroy',
		'click #save' : 'save',
    },
    initialize: function() {
        this.template = _.template(App.utils.templateLoader.get('admin-path-item'));
        this.model.on('change', this.render, this);
        this.model.on('destroy', this.remove, this);
    },
    render: function(eventName) {
	
		$(this.el).html(this.template(this.model.toJSON()));
		return this; 

    },
	
	save: function(){

	     NewName = document.getElementById("name "+this.model.get('id')).value;
		 NewDescription = document.getElementById("description "+this.model.get('id')).value;
		 this.model.set('name',NewName);
		 this.model.set('Description',NewDescription);
		 this.model.save();
		 alert("Path updates : successful");
	},
    destroy: function() {
        this.model.destroy();
    },
    remove: function() {
        this.$el.remove();
    }

});
//---------------------------------------------------------------------------------------------

//--------------------------------------Map View-----------------------------------------------
/*
App.views.Map  = Backbone.View.extend({
    
        initialize: function() {
            _.bindAll(this, 'render');//associe la methode 
            this.render();
           // console.log(this.collection);
        },

        render: function(parcours) {
            
            var title = "Your Location";
            var content = "You are here: ";
            var latlng;
            this.collection.each(function(note, index) {
            //console.log(note.get('latitude'));
            latlng = new google.maps.LatLng(note.get('latitude'),note.get('longitude'));
            }, this);

             var options = {
                zoom: 10,
                center: latlng,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            this.map = new google.maps.Map(this.el, options);
            
            this.collection.each(function(note, index) {
            latlng = new google.maps.LatLng(note.get('latitude'),note.get('longitude'));
            //console.log(note.get('latitude'),note.get('latitude'));
            this.addMarker(this.map,latlng, title, content);
            }, this);

            this.addMarker(this.map,latlng, title, content);
            return this;
        },

        addMarker: function (map, latlong, title, content) {
  
                                            var markerOptions = {
                                                position: latlong,
                                                map: map,
                                                title: title,
                                                clickable: true
                                                };
                                            var marker = new google.maps.Marker(markerOptions);
                                                 
                                            var infoWindowOptions = { 
                                            content: content,
                                            position: latlong
                                            };
                                            var infoWindow = new google.maps.InfoWindow(infoWindowOptions);
                                            
                                            google.maps.event.addListener(marker, "click", function() { infoWindow.open(map);});
                                                 
                                            
  
                                                }   



    });*/

//---------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------

//--------------------------------------Router-----------------------------------------------


App.Router = Backbone.Router.extend({

	routes: {
		"": "Home",
		"Home": "Home",
		"admin-page": "adminpage",
		"user-page": "userpage",
		"noteAdmin": "noteAdmin",
		"pathAdmin": "pathAdmin"
	},
	
	initialize: function() {

        var self = this;

        // Keep track of the history of pages (we only store the page URL). Used to identify the direction
        // (left or right) of the sliding transition between pages.
        this.pageHistory = [];

        // Register event listener for back button troughout the app
        $('#MainPage').on('click', '.header-back-button', function(event) {
            window.history.back();
            return false;
        });

        // Check of browser supports touch events...
        /*if (document.documentElement.hasOwnProperty('ontouchstart')) {
            // ... if yes: register touch event listener to change the "selected" state of the item
            $('#MainPage').on('touchstart', 'a', function(event) {
                self.selectItem(event);
            });
            $('#MainPage').on('touchend', 'a', function(event) {
                self.deselectItem(event);
            });
        } else {
            // ... if not: register mouse events instead
            $('#MainPage').on('mousedown', 'a', function(event) {
                self.selectItem(event);
            });
            $('#MainPage').on('mouseup', 'a', function(event) {
                self.deselectItem(event);
            });
        }*/

        // We keep a single instance of the SearchPage and its associated Employee collection throughout the app
        //this.searchResults = new App.models.ParcoursCollection();
        //this.searchPage = new directory.views.SearchPage({model: this.searchResults});
        //this.searchPage.render();
        //$(this.searchPage.el).attr('id', 'searchPage');
        this.home = new App.views.Home();
        this.home.render();
    },
	
	presentation: function(){
		this.presentation = new directory.views.Presentation();
        this.presentation.render();
        var self = this;
        self.slidePage( this.presentation);
    },
		
	slidePage: function(page) {
	
			$('#MainPage').html("");
            $('#MainPage').append(page.el);
            this.pageHistory = [window.location.hash];
            this.currentPage = page;
			return;		
    },
		
	Home: function() {
		console.log("Dans la fonction home");
		self=this;
		self.slidePage(this.home);
	},
	
	adminpage: function() {	
		console.log("Dans la fonction adminpage");
		self = this;
		this.admin= new App.views.AdminPage();
		console.log("Dans la fonction adminpage");
		this.admin.render();
        self.slidePage(this.admin);
	},
	
	userpage: function() {	
		console.log("Dans la fonction userpage");
		//self = this;
		this.user= new App.views.UserPage();
		console.log("Dans la fonction userpage");
		this.user.render();
        self.slidePage(this.user);
	},
	
	noteAdmin: function(){
        console.log("dans la fonction router de note page admin");     
        self = this;
		var collection = new App.collections.NoteCollection(App.stores.Geonotes.findAll());
		console.log("après new NoteCollection");
		console.log(collection);
		this.noteadm= new App.views.AdminNotePage({model: collection});
		console.log(this.noteadm);
		this.noteadm.render();
        self.slidePage(this.noteadm);
    },
	pathAdmin: function(){
        console.log("dans la fonction router de path page admin");     
        self = this;
		var collection = new App.collections.PathCollection(App.stores.Geonotes.findAll());
		console.log("après new pathCollection");
		console.log(collection);
		this.pathadm= new App.views.AdminPathPage({model: collection});
		console.log(this.pathadm);
		this.pathadm.render();
        self.slidePage(this.pathadm);
    }
	
});
//-------------------------------------------------------------------------------------------

App.utils.templateLoader.load(['home','admin-page','user-page','admin-note-page','admin-note-item','admin-path-page','admin-path-item'],
        function() {
            App.app = new App.Router();
            Backbone.history.start();
			console.log("après history start");
        });

return App;
})();