const ProfileResolvers = {
	Query: {
		getProfile: async (_, { userId }, { models }) =>
			await models.Profile.findOne({ where: { userId }, raw: true }),
	},
	Profile: {
		user: async ({ userId }, args, { models }) =>
			await models.User.findOne({ where: { id: userId }, raw: true }),
		createdAt: ({ createdAt }) => new Date(createdAt).toISOString(),
	},
};

export default ProfileResolvers;
