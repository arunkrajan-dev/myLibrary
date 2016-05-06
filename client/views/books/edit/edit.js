var pageSession = new ReactiveDict();

Template.BooksEdit.rendered = function() {
	
};

Template.BooksEdit.events({
	
});

Template.BooksEdit.helpers({
	
});

Template.BooksEditEditForm.rendered = function() {
	

	pageSession.set("booksEditEditFormInfoMessage", "");
	pageSession.set("booksEditEditFormErrorMessage", "");

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

Template.BooksEditEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("booksEditEditFormInfoMessage", "");
		pageSession.set("booksEditEditFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var booksEditEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(booksEditEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("booksEditEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("books", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("booksEditEditFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				Books.update({ _id: t.data.book_details._id }, { $set: values }, function(e) { if(e) errorAction(e); else submitAction(); });
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

Template.BooksEditEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("booksEditEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("booksEditEditFormErrorMessage");
	}
	
});
