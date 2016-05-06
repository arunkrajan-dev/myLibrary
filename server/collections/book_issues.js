BookIssues.allow({
	insert: function (userId, doc) {
		return BookIssues.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return BookIssues.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return BookIssues.userCanRemove(userId, doc);
	}
});

BookIssues.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;

	
	if(!doc.ownerId) doc.ownerId = userId;
});

BookIssues.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

BookIssues.before.remove(function(userId, doc) {
	
});

BookIssues.after.insert(function(userId, doc) {
	
});

BookIssues.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

BookIssues.after.remove(function(userId, doc) {
	
});
