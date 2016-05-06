this.BookIssues = new Mongo.Collection("book_issues");

this.BookIssues.userCanInsert = function(userId, doc) {
	return true;
};

this.BookIssues.userCanUpdate = function(userId, doc) {
	return userId && doc.ownerId == userId;
};

this.BookIssues.userCanRemove = function(userId, doc) {
	return userId && doc.ownerId == userId;
};
