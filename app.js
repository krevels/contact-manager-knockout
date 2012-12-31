$(document).ready(function(){
	var cm = new ContactManager();
	cm.init();
});

function ContactManager(){
	function ContactsView() {
		var self = this;

		var contacts = ko.observableArray([
			{ name: "Contact 1", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "family" },
			{ name: "Contact 2", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "family" },
			{ name: "Contact 3", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "friend" },
			{ name: "Contact 4", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "colleague" },
			{ name: "Contact 5", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "family" },
			{ name: "Contact 6", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "colleague" },
			{ name: "Contact 7", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "friend" },
			{ name: "Contact 8", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "family" }
		]);

		self.selected_type = ko.observable();

		self.hide_contact = function(e){
			if(e.nodeType === 1){
				$(e).fadeOut();
			}
		};

		self.show_contact = function(e){
			if(e.nodeType === 1){
				$(e).fadeIn();
			}
		};

		self.add_contact = function(form) {
			var new_contact = {},
				fields = $(form).serializeArray();

			for(var i=0,j;j = fields[i++]; ){
				new_contact[j.name] = j.value;
			}

			contacts.push(new_contact);
			
			$(form)[0].reset();
			return false;
		};

		self.filtered_contacts = ko.computed(function(){
			return $.map(contacts(), function(v){ 
				if(typeof self.selected_type() == 'undefined' || v.type == self.selected_type()) 
					return v; 
			});
		});

		self.photo = 'placeholder.png',
		self.types = ko.computed(function(){
			return $.unique($.map(contacts(), function(v){ return v.type; }));
		});
	};

	this.init = function(){
		ko.applyBindings(new ContactsView());
	}
}	

