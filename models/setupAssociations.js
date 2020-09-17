export default (models) => {
	const { User, Profile, Group, Member, Post } = models;
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
};
