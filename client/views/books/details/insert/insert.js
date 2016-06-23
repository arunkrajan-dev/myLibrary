var pageSession = new ReactiveDict();

Template.BooksDetailsInsert.rendered = function() {
	
};

Template.BooksDetailsInsert.events({
	
});

Template.BooksDetailsInsert.helpers({
	
});

Template.BooksDetailsInsertInsertForm.rendered = function() {
	

	pageSession.set("booksDetailsInsertInsertFormInfoMessage", "");
	pageSession.set("booksDetailsInsertInsertFormErrorMessage", "");

	$(".input-group.date").each(function() {
		var format = $(this).find("input[type='text']").attr("data-format");

		if(format) {
			format = format.toLowerCase();
		}
		else {
			format = "mm/dd/yyyy";
		}

		$(this).datepicker({
			autoclose: true,
			todayHighlight: true,
			todayBtn: true,
			forceParse: false,
			keyboardNavigation: false,
			format: format
		});
	});

	$("input[type='file']").fileinput();
	$("select[data-role='tagsinput']").tagsinput();
	$(".bootstrap-tagsinput").addClass("form-control");
	$("input[autofocus]").focus();
};

Template.BooksDetailsInsertInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("booksDetailsInsertInsertFormInfoMessage", "");
		pageSession.set("booksDetailsInsertInsertFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var booksDetailsInsertInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(booksDetailsInsertInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("booksDetailsInsertInsertFormInfoMessage", message);
					}; break;
				}
			}
			
			bootbox.hideAll();
			//Router.go("books.details", {bookId: self.params.bookId});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("booksDetailsInsertInsertFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				debugger;
				values.bookId = self.params.bookId;

				newId = BookIssues.insert(values, function(e) { if(e) errorAction(e); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		
		bootbox.hideAll();
		//Router.go("books.details", {bookId: this.params.bookId});
	},
	"click #form-close-button": function(e, t) {
		e.preventDefault();

		/*CLOSE_REDIRECT*/
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		/*BACK_REDIRECT*/
	}

	
});

Template.BooksDetailsInsertInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("booksDetailsInsertInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("booksDetailsInsertInsertFormErrorMessage");
	}
	
});
