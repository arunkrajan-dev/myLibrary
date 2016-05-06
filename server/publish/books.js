Meteor.publish("book_list", function() {
	return Books.find({ownerId:this.userId}, {sort:[["title","desc"]]});
});

Meteor.publish("book_empty", function() {
	return Books.find({_id:null,ownerId:this.userId}, {});
});

Meteor.publish("book_details", function(bookId) {
	return Books.find({_id:bookId,ownerId:this.userId}, {});
});

