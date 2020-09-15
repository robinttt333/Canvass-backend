const UserResolvers = {
	Query: {},
	Mutation: {
		createUser: async (_, args, { models }) => {
			try {
				const res = await models.User.create(args);
				console.log(res);
			} catch (err) {
				console.log(err);
				return {
					ok: false,
				};
			}
			return {
				ok: true,
			};
		},
	},
};
export default UserResolvers;
