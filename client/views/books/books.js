var pageSession = new ReactiveDict();

Template.Books.rendered = function() {
	
};

Template.Books.events({
	
});

Template.Books.helpers({
	
});

var BooksViewItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("BooksViewSearchString");
	var sortBy = pageSession.get("BooksViewSortBy");
	var sortAscending = pageSession.get("BooksViewSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["title", "author", "publish", "owner", "Notes", "act", "sec"];
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

var BooksViewExport = function(cursor, fileType) {
	var data = BooksViewItems(cursor);
	var exportFields = ["title", "author", "publish", "owner", "Notes"];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.BooksView.rendered = function() {
	pageSession.set("BooksViewStyle", "table");
	
};

Template.BooksView.events({
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
				pageSession.set("BooksViewSearchString", searchString);
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
					pageSession.set("BooksViewSearchString", searchString);
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
					pageSession.set("BooksViewSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("books.insert", {});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		BooksViewExport(this.book_list, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		BooksViewExport(this.book_list, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		BooksViewExport(this.book_list, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		BooksViewExport(this.book_list, "json");
	}

	
});

Template.BooksView.helpers({

	"insertButtonClass": function() {
		return Books.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.book_list || this.book_list.count() == 0;
	},
	"isNotEmpty": function() {
		return this.book_list && this.book_list.count() > 0;
	},
	"isNotFound": function() {
		return this.book_list && pageSession.get("BooksViewSearchString") && BooksViewItems(this.book_list).length == 0;
	},
	"searchString": function() {
		return pageSession.get("BooksViewSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("BooksViewStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("BooksViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("BooksViewStyle") == "gallery";
	}

	
});


Template.BooksViewTable.rendered = function() {
	
};

Template.BooksViewTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("BooksViewSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("BooksViewSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("BooksViewSortAscending") || false;
			pageSession.set("BooksViewSortAscending", !sortAscending);
		} else {
			pageSession.set("BooksViewSortAscending", true);
		}
	}
});

Template.BooksViewTable.helpers({
	"tableItems": function() {
		return BooksViewItems(this.book_list);
	}
});


Template.BooksViewTableItems.rendered = function() {
	
};

Template.BooksViewTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		
		Router.go("books.details", {bookId: this._id});
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		Books.update({ _id: this._id }, { $set: values });

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
						Books.remove({ _id: me._id });
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
		Router.go("books.edit", {bookId: this._id});
		return false;
	},
	"click #receive-button": function(e, t) {
		e.preventDefault();
		var me = this;
		bootbox.dialog({
			message: "Received? Please confirm?",
			title: "Received",
			animate: false,
			buttons: {
				success: {
					label: "Yes",
					className: "btn-success",
					callback: function() {
						Books.update({ _id: me._id }, {$set:{status: "", expectedReturnDate: "", issuedTo: ""}});
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
	"click #issue-button": function(e, t) {
		e.preventDefault();
		bootbox.dialog({title: "Title", message: '<span/>'});
		Blaze.renderWithData(Template.BooksDetailsInsert, {params:{bookId: this._id}}, $('.bootbox-body')[0]); 
		return false;
		
	},
	"click #notes-button": function(e, t) {
		e.preventDefault();
		return false;
	}
	
});

Template.BooksViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return Books.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return Books.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	},
	
	"getAction": function(status) {
		if(status == "issued") {
			return '<a href="#" id="receive-button">Receive</a>';
		} else {
			return '<a href="#" id="issue-button">Issue</a>';
		}
	}
	
});
