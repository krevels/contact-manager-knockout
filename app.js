$(document).ready(function(){
	var cm = new ContactManager();
	cm.init();
});

function ContactManager(){
	function Contact(o){
		this.name = o.name || null;
		this.address = o.address || null;
		this.tel = o.tel || null;
		this.email = o.email || null;
		this.type = o.type || null;
		
		/* http://stackoverflow.com/a/2117523/118898 */
		this.id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    		var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    		return v.toString(16);
		});
	}

	function ContactList(c){
		this.collection = c || [];
		
		var self = this,
			storage_key = 'krevels-contact-manager:contacts';

		/* 	check localstorage for existing contacts, otherwise
		 *	load the defaults 
		 */
		this.load = function(){
			try{ 
				var stored_contacts = JSON.parse(localStorage.getItem(storage_key));

				$.each(stored_contacts, function(){
					self.collection.push(new Contact(this));
				});
			}
			catch(e){}
		};

		this.save = function(){
			localStorage.setItem(storage_key, JSON.stringify(self.collection));
		}
	}

	function ContactListView(c) {
		var list = c || [],
			self = this;

		self.default_photo = 'placeholder.png'

		self.list = ko.observableArray(list.collection);

		self.list.subscribe(list.save)

		self.selected_type = ko.observable();

		self.filtered_list = ko.computed(function(){
			return $.map(self.list(), function(v){ 
				if(typeof self.selected_type() == 'undefined' || v.type == self.selected_type()) 
					return v; 
			});
		});

		self.types = ko.computed(function(){
			return $.unique($.map(self.list(), function(v){ return v.type; }));
		});

		self.hide = function(e){
			if(e.nodeType === 1) $(e).fadeOut();
		};

		self.show = function(e){
			if(e.nodeType === 1) $(e).fadeIn();
		};

		self.add = function(form) {
			var new_contact = {};

			$.each($(form).serializeArray(), function(){
				new_contact[this.name] = this.value;
			});

			self.list.push(new_contact);
			
			$(form)[0].reset();
			return false;
		};

		self.delete = function(e){
			self.list.remove(function(item){
				return item.id == e.id
			});
		}
		
	};

	this.init = function(){
		var cl = new ContactList();
		cl.load();

		// load in some default stuff if we have an empty list
		if(cl.collection.length == 0){
			var defaults = [
				{ name: "Contact 1", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "family" },
				{ name: "Contact 2", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "family" },
				{ name: "Contact 3", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "friend" },
				{ name: "Contact 4", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "colleague" },
				{ name: "Contact 5", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "family" },
				{ name: "Contact 6", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "colleague" },
				{ name: "Contact 7", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "friend" },
				{ name: "Contact 8", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "family" }
			];

			$.each(defaults, function(){
				cl.collection.push(new Contact(this));
			})
		}

		/* bind views */
		ko.applyBindings(new ContactListView(cl), $('#contact-list').get(0));
	}
}	

