Meteor.publish("book_issues", function(bookId) {
	return BookIssues.find({bookId:bookId,ownerId:this.userId}, {});
});

Meteor.publish("book_issues_empty", function() {
	return BookIssues.find({_id:null,ownerId:this.userId}, {});
});

Meteor.publish("book_issue", function(issueId) {
	return BookIssues.find({_id:issueId,ownerId:this.userId}, {});
});

