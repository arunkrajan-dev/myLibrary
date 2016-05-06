var pageSession = new ReactiveDict();

Template.BooksInsert.rendered = function() {
	
};

Template.BooksInsert.events({
	
});

Template.BooksInsert.helpers({
	
});

Template.BooksInsertInsertForm.rendered = function() {
	

	pageSession.set("booksInsertInsertFormInfoMessage", "");
	pageSession.set("booksInsertInsertFormErrorMessage", "");

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

Template.BooksInsertInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("booksInsertInsertFormInfoMessage", "");
		pageSession.set("booksInsertInsertFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var booksInsertInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(booksInsertInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("booksInsertInsertFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("books.details", {bookId: newId});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("booksInsertInsertFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				newId = Books.insert(values, function(e) { if(e) errorAction(e); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		Router.go("books", {});
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

Template.BooksInsertInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("booksInsertInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("booksInsertInsertFormErrorMessage");
	}
	
});
