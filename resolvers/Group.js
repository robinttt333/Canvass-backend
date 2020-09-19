const ProfileResolvers = {
	Query: {
		getGroup: async (_, { groupId }, { models }) =>
			await models.Group.findOne({ where: { id: groupId }, raw: true }),
	},
	Group: {
		createdAt: ({ createdAt }) => new Date(createdAt).toISOString(),
		image: ({ image }) => `http://127.0.0.1:4000/files/${image}`,
		members: ({ id }, _, { models }) =>
			models.Member.count({ where: { groupId: id } }),
	},
};

export default ProfileResolvers;
