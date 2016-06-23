var pageSession = new ReactiveDict();

Template.BooksDetailsIssues.rendered = function() {
	
};

Template.BooksDetailsIssues.events({
	
});

Template.BooksDetailsIssues.helpers({
	
});

var BooksDetailsIssuesViewItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("BooksDetailsIssuesViewSearchString");
	var sortBy = pageSession.get("BooksDetailsIssuesViewSortBy");
	var sortAscending = pageSession.get("BooksDetailsIssuesViewSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["issuedTo", "issuedDate", "ExpectedReturnDate", "notes"];
		filtered = _.filter(raw, function(item) {
			var match = false;
			_.each(searchFields, function(field) {
				var value = (getPropertyValue(field, item) || "") + "";

				match = match || (value && value.match(regEx));
				if(match) {
					return false;
				}
			})
			return match;
		});
	}

	// sort
	if(sortBy) {
		filtered = _.sortBy(filtered, sortBy);

		// descending?
		if(!sortAscending) {
			filtered = filtered.reverse();
		}
	}

	return filtered;
};

var BooksDetailsIssuesViewExport = function(cursor, fileType) {
	var data = BooksDetailsIssuesViewItems(cursor);
	var exportFields = ["issuedTo", "issuedDate", "ExpectedReturnDate", "notes"];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.BooksDetailsIssuesView.rendered = function() {
	pageSession.set("BooksDetailsIssuesViewStyle", "table");
	
};

Template.BooksDetailsIssuesView.events({
	"submit #dataview-controls": function(e, t) {
		return false;
	},

	"click #dataview-search-button": function(e, t) {
		e.preventDefault();
		var form = $(e.currentTarget).parent();
		if(form) {
			var searchInput = form.find("#dataview-search-input");
			if(searchInput) {
				searchInput.focus();
				var searchString = searchInput.val();
				pageSession.set("BooksDetailsIssuesViewSearchString", searchString);
			}

		}
		return false;
	},

	"keydown #dataview-search-input": function(e, t) {
		if(e.which === 13)
		{
			e.preventDefault();
			var form = $(e.currentTarget).parent();
			if(form) {
				var searchInput = form.find("#dataview-search-input");
				if(searchInput) {
					var searchString = searchInput.val();
					pageSession.set("BooksDetailsIssuesViewSearchString", searchString);
				}

			}
			return false;
		}

		if(e.which === 27)
		{
			e.preventDefault();
			var form = $(e.currentTarget).parent();
			if(form) {
				var searchInput = form.find("#dataview-search-input");
				if(searchInput) {
					searchInput.val("");
					pageSession.set("BooksDetailsIssuesViewSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		bootbox.dialog({title: "Title", message: '<span/>'});
		Blaze.renderWithData(Template.BooksDetailsInsert, {params:{bookId: this.params.bookId}}, $('.bootbox-body')[0]); 

		//Router.go("books.details.insert", {bookId: this.params.bookId});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		BooksDetailsIssuesViewExport(this.book_issues, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		BooksDetailsIssuesViewExport(this.book_issues, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		BooksDetailsIssuesViewExport(this.book_issues, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		BooksDetailsIssuesViewExport(this.book_issues, "json");
	}

	
});

Template.BooksDetailsIssuesView.helpers({

	"insertButtonClass": function() {
		return BookIssues.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.book_issues || this.book_issues.count() == 0;
	},
	"isNotEmpty": function() {
		return this.book_issues && this.book_issues.count() > 0;
	},
	"isNotFound": function() {
		return this.book_issues && pageSession.get("BooksDetailsIssuesViewSearchString") && BooksDetailsIssuesViewItems(this.book_issues).length == 0;
	},
	"searchString": function() {
		return pageSession.get("BooksDetailsIssuesViewSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("BooksDetailsIssuesViewStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("BooksDetailsIssuesViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("BooksDetailsIssuesViewStyle") == "gallery";
	}

	
});


Template.BooksDetailsIssuesViewTable.rendered = function() {
	
};

Template.BooksDetailsIssuesViewTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("BooksDetailsIssuesViewSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("BooksDetailsIssuesViewSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("BooksDetailsIssuesViewSortAscending") || false;
			pageSession.set("BooksDetailsIssuesViewSortAscending", !sortAscending);
		} else {
			pageSession.set("BooksDetailsIssuesViewSortAscending", true);
		}
	}
});

Template.BooksDetailsIssuesViewTable.helpers({
	"tableItems": function() {
		return BooksDetailsIssuesViewItems(this.book_issues);
	}
});


Template.BooksDetailsIssuesViewTableItems.rendered = function() {
	
};

Template.BooksDetailsIssuesViewTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		
		/**/
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		BookIssues.update({ _id: this._id }, { $set: values });

		return false;
	},

	"click #delete-button": function(e, t) {
		e.preventDefault();
		var me = this;
		bootbox.dialog({
			message: "Delete? Are you sure?",
			title: "Delete",
			animate: false,
			buttons: {
				success: {
					label: "Yes",
					className: "btn-success",
					callback: function() {
						BookIssues.remove({ _id: me._id });
					}
				},
				danger: {
					label: "No",
					className: "btn-default"
				}
			}
		});
		return false;
	},
	"click #edit-button": function(e, t) {
		e.preventDefault();
		Router.go("books.details.edit", {bookId: UI._parentData(1).params.bookId, issueId: this._id});
		return false;
	}
});

Template.BooksDetailsIssuesViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return BookIssues.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return BookIssues.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});
