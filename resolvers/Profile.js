const ProfileResolvers = {
	Query: {
		getProfile: async (_, { userId }, { models }) =>
			await models.Profile.findOne({ where: { userId }, raw: true }),
	},
	Profile: {
		user: async ({ userId }, _, { models }) =>
			await models.User.findOne({ where: { id: userId }, raw: true }),
		createdAt: ({ createdAt }) => new Date(createdAt).toISOString(),
		dp: ({ dp }) => `http://127.0.0.1:4000/files/${dp}`,
	},
};

export default ProfileResolvers;
