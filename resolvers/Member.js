const Member = {
	Query: {
		getGroupMembers: async (_, { groupId }, { models }) => {
			let res;
			try {
				res = await models.Group.findAll({
					attributes: [
						"Users.username",
						"Users.email",
						"Users.id",
						"Users.Member.createdAt",
					],
					raw: true,
					where: { id: groupId },
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
	},
	Member: {
		user: (parent) => {
			return parent;
		},
		memberSince: ({ createdAt }) => new Date(createdAt).toISOString(),
	},
};
export default Member;
