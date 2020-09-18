import formatErrors from "../formatError";
import pubsub from "../pubsub";
import { POST_ADDED } from "../events";
import { withFilter } from "apollo-server";

const ProfileResolvers = {
	Subscription: {
		postAdded: {
			subscribe: withFilter(
				() => pubsub.asyncIterator(POST_ADDED),
				async ({ postAdded }, { groupId }, { user: { userId }, models }) => {
					// check if current user is a member of group
					let res;
					try {
						res = await models.Member.findOne({
							where: { userId, groupId: postAdded.groupId },
							raw: true,
						});
					} catch (err) {
						console.log(err);
						return false;
					}
					if (!res) return false;
					if (postAdded.groupId !== groupId) return false;
					return true;
				}
			),
		},
	},
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
		createPost: async (_, args, { models, user }) => {
			let post;
			try {
				post = (
					await models.Post.create({ ...args, author: user.userId })
				).get({ plain: true });

				pubsub.publish(POST_ADDED, { postAdded: post });
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
