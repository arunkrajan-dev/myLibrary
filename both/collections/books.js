this.Books = new Mongo.Collection("books");

this.Books.userCanInsert = function(userId, doc) {
	return true;
};

this.Books.userCanUpdate = function(userId, doc) {
	return userId && doc.ownerId == userId;
};

this.Books.userCanRemove = function(userId, doc) {
	return userId && doc.ownerId == userId;
};
