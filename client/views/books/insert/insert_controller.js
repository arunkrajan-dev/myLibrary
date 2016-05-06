this.BooksInsertController = RouteController.extend({
	template: "BooksInsert",
	

	yieldTemplates: {
		/*YIELD_TEMPLATES*/
	},

	onBeforeAction: function() {
		this.next();
	},

	action: function() {
		if(this.isReady()) { this.render(); } else { this.render("loading"); }
		/*ACTION_FUNCTION*/
	},

	isReady: function() {
		

		var subs = [
			Meteor.subscribe("book_empty"),
			Meteor.subscribe("book_list")
		];
		var ready = true;
		_.each(subs, function(sub) {
			if(!sub.ready())
				ready = false;
		});
		return ready;
	},

	data: function() {
		

		var data = {
			params: this.params || {},
			book_empty: Books.findOne({_id:null}, {}),
			book_list: Books.find({}, {sort:[["title","desc"]]})
		};
		

		

		return data;
	},

	onAfterAction: function() {
		
	}
});