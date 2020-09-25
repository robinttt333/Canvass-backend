export default (models) => {
	const {
		User,
		Profile,
		Group,
		Member,
		Post,
		Comment,
		Like,
		Message,
		Friend,
		LastPostSeen,
		Notification,
	} = models;
	// one to one mapping of user and profile, foreign key will be in profile
	User.hasOne(Profile, {
		//delete profile once user account is deleted
		onDelete: "CASCADE",
		foreignKey: "userId",
	});

	// one to many mapping of user and group, foreign key will be in group
	// admin association
	User.hasMany(Group, {
		//delete profile once user account is deleted
		onDelete: "CASCADE",
		foreignKey: "admin",
	});

	//many to many mapping of user and group for members table
	User.belongsToMany(Group, {
		through: Member,
		foreignKey: "userId",
	});
	Group.belongsToMany(User, {
		through: Member,
		foreignKey: "groupId",
	});

	//one to many mapping from user to post
	User.hasMany(Post, {
		foreignKey: "author",
	});
	//one to many mapping from group to post
	Group.hasMany(Post, {
		foreignKey: "groupId",
	});
	//many to many mapping from post to user
	User.belongsToMany(Post, {
		through: Like,
		foreignKey: "userId",
	});
	Post.belongsToMany(User, {
		through: Like,
		foreignKey: "postId",
	});

	//one to many mapping from post and comment
	Post.hasMany(Comment, {
		foreignKey: "postId",
	});
	//one to many mapping from user and comment
	User.hasMany(Comment, {
		foreignKey: "userId",
	});

	//sender and receiver for a message mapping
	User.hasMany(Message, {
		foreignKey: "sender",
	});
	User.hasMany(Message, {
		foreignKey: "receiver",
	});

	// many to many mapping from user to user
	User.belongsToMany(User, {
		through: Friend,
		as: "friend",
		foreignKey: "userId",
	});
	// many to many mapping from user to group
	// This mapping keeps track of the last posts of each group
	// seen by the user
	User.belongsToMany(Group, {
		through: LastPostSeen,
		foreignKey: "userId",
	});
	Group.belongsToMany(User, {
		through: LastPostSeen,
		foreignKey: "groupId",
	});

	// Notification many to many mapping
	User.hasMany(Notification, {
		foreignKey: "sender",
	});
	User.hasMany(Notification, {
		foreignKey: "receiver",
	});
};
