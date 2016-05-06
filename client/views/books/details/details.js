var pageSession = new ReactiveDict();

Template.BooksDetails.rendered = function() {
	
};

Template.BooksDetails.events({
	
});

Template.BooksDetails.helpers({
	
});

Template.BooksDetailsDetailsForm.rendered = function() {
	

	pageSession.set("booksDetailsDetailsFormInfoMessage", "");
	pageSession.set("booksDetailsDetailsFormErrorMessage", "");

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

Template.BooksDetailsDetailsForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("booksDetailsDetailsFormInfoMessage", "");
		pageSession.set("booksDetailsDetailsFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var booksDetailsDetailsFormMode = "read_only";
			if(!t.find("#form-cancel-button")) {
				switch(booksDetailsDetailsFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("booksDetailsDetailsFormInfoMessage", message);
					}; break;
				}
			}

			/*SUBMIT_REDIRECT*/
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("booksDetailsDetailsFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		/*CANCEL_REDIRECT*/
	},
	"click #form-close-button": function(e, t) {
		e.preventDefault();

		/*CLOSE_REDIRECT*/
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		Router.go("books", {});
	}

	
});

Template.BooksDetailsDetailsForm.helpers({
	"infoMessage": function() {
		return pageSession.get("booksDetailsDetailsFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("booksDetailsDetailsFormErrorMessage");
	}
	
});
