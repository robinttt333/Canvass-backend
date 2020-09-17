import formatErrors from "../formatError";
const ProfileResolvers = {
	Post: {
		author: ({ author }, _, { models }) =>
			models.User.findOne({ where: { id: author }, raw: true }),
		createdAt: ({ createdAt }) => new Date(createdAt).toISOString(),
	},
	Query: {
		getPosts: (_, { groupId }, { models }) =>
			models.Post.findAll({ where: { groupId } }),
	},
	Mutation: {
		createPost: async (_, args, { models, user: { userId } }) => {
			let post;
			try {
				post = await models.Post.create({ ...args, author: userId });
			} catch (err) {
				console.log(err);
				return {
					ok: false,
					error: formatErrors(err),
				};
			}
			return {
				ok: true,
				post,
			};
		},
	},
};
export default ProfileResolvers;
