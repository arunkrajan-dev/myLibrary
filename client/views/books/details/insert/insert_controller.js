this.BooksDetailsInsertController = RouteController.extend({
	template: "BooksDetails",
	

	yieldTemplates: {
		'BooksDetailsInsert': { to: 'BooksDetailsSubcontent'}
		
	},

	onBeforeAction: function() {
		this.next();
	},

	action: function() {
		if(this.isReady()) { this.render(); } else { this.render("BooksDetails"); this.render("loading", { to: "BooksDetailsSubcontent" });}
		/*ACTION_FUNCTION*/
	},

	isReady: function() {
		

		var subs = [
			Meteor.subscribe("book_issues_empty"),
			Meteor.subscribe("book_details", this.params.bookId)
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
			book_issues_empty: BookIssues.findOne({_id:null}, {}),
			book_details: Books.findOne({_id:this.params.bookId}, {})
		};
		

		

		return data;
	},

	onAfterAction: function() {
		
	}
});