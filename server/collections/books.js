Books.allow({
	insert: function (userId, doc) {
		return Books.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return Books.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return Books.userCanRemove(userId, doc);
	}
});

Books.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;

	
	if(!doc.ownerId) doc.ownerId = userId;
});

Books.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

Books.before.remove(function(userId, doc) {
	
});

Books.after.insert(function(userId, doc) {
	
});

Books.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

Books.after.remove(function(userId, doc) {
	
});
