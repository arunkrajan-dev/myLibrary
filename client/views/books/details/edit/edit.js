var pageSession = new ReactiveDict();

Template.BooksDetailsEdit.rendered = function() {
	
};

Template.BooksDetailsEdit.events({
	
});

Template.BooksDetailsEdit.helpers({
	
});

Template.BooksDetailsEditEditForm.rendered = function() {
	

	pageSession.set("booksDetailsEditEditFormInfoMessage", "");
	pageSession.set("booksDetailsEditEditFormErrorMessage", "");

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

Template.BooksDetailsEditEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("booksDetailsEditEditFormInfoMessage", "");
		pageSession.set("booksDetailsEditEditFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var booksDetailsEditEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(booksDetailsEditEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("booksDetailsEditEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("books.details", {bookId: self.params.bookId});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("booksDetailsEditEditFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				BookIssues.update({ _id: t.data.book_issue._id }, { $set: values }, function(e) { if(e) errorAction(e); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		Router.go("books.details", {bookId: this.params.bookId});
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

Template.BooksDetailsEditEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("booksDetailsEditEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("booksDetailsEditEditFormErrorMessage");
	}
	
});
