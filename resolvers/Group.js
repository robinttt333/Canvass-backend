const ProfileResolvers = {
	Query: {
		getGroup: async (_, { groupId }, { models }) =>
			await models.Group.findOne({ where: { id: groupId }, raw: true }),
		getUserGroups: async (_, __, { models, user: { userId: id } }) => {
			let res;
			try {
				//find all the group names of which current user is a part of
				res = await models.Group.findAll({
					raw: true,
					include: {
						model: models.User,
						required: true,
						where: { id },
						through: models.Member,
					},
				});
			} catch (err) {
				console.log(err);
			}
			console.log(res);
			return res;
		},
	},
	Group: {
		createdAt: ({ createdAt }) => new Date(createdAt).toISOString(),
		image: ({ image }) => `http://127.0.0.1:4000/files/${image}`,
		members: ({ id }, _, { models }) =>
			models.Member.count({ where: { groupId: id } }),
	},
};

export default ProfileResolvers;
