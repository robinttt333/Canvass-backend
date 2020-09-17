const ProfileResolvers = {
	Query: {
		getGroup: async (_, { groupId }, { models }) =>
			await models.Group.findOne({ where: { id: groupId }, raw: true }),
	},
	Group: {
		members: async ({ id }, _, { models }) => {
			let res;
			try {
				res = await models.Group.findAll({
					attributes: ["Users.username", "Users.email", "Users.id"],
					raw: true,
					where: { id },
					include: [
						{
							model: models.User,
							through: {
								model: models.Member,
								attributes: [],
							},
						},
					],
				});
			} catch (err) {
				console.log(err);
			}
			return res;
		},
		createdAt: ({ createdAt }) => new Date(createdAt).toISOString(),
		image: ({ image }) => `http://127.0.0.1:4000/files/${image}`,
	},
};

export default ProfileResolvers;
