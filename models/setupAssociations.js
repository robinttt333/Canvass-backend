export default (models) => {
	const { User, Profile } = models;
	User.hasOne(Profile, {
		//delete profile once user account is deleted
		onDelete: "CASCADE",
		foreignKey: "userId",
	});
};
