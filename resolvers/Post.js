import formatErrors from "../formatError";
import pubsub from "../pubsub";
import { POST_ADDED_TO_MY_GROUP, POST_ADDED } from "../events";
import { withFilter } from "apollo-server";
import { deleteLikeNotification, createLikeNotification } from "../general";

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
		// required for left side bar
		postAddedToMyGroup: {
			subscribe: withFilter(
				() => pubsub.asyncIterator(POST_ADDED_TO_MY_GROUP),
				async ({ postAddedToMyGroup }, _, { user: { userId }, models }) => {
					// check if current user is a member of group
					let res;
					try {
						res = await models.Member.findOne({
							where: { userId, groupId: postAddedToMyGroup.groupId },
							raw: true,
						});
					} catch (err) {
						console.log(err);
						return false;
					}
					if (!res) return false;
					//if (postAdded.groupId !== groupId) return false;
					return true;
				}
			),
		},
	},
	Post: {
		author: ({ author }, _, { models }) =>
			models.User.findOne({ where: { id: author }, raw: true }),
		createdAt: ({ createdAt }) => new Date(createdAt).toISOString(),
		likes: async ({ id }, _, { models }) => {
			const res = await models.Like.count({ where: { postId: id } });
			return res;
		},
		liked: async ({ id }, _, { models, user: { userId } }) =>
			(await models.Like.findOne({ where: { userId, postId: id } })) !== null,
	},
	Query: {
		getPosts: (_, { groupId }, { models }) =>
			models.Post.findAll({
				where: { groupId },
				order: [["createdAt", "DESC"]],
			}),
	},
	Mutation: {
		createPost: async (_, args, { models, user }) => {
			let post;
			try {
				post = (
					await models.Post.create({ ...args, author: user.userId })
				).get({ plain: true });

				pubsub.publish(POST_ADDED, { postAdded: post });
				pubsub.publish(POST_ADDED_TO_MY_GROUP, { postAddedToMyGroup: post });
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

		toggleLike: async (_, { postId }, { models, user: { userId } }) => {
			try {
				const like = await models.Like.findOne({ where: { postId, userId } });
				if (like) {
					await models.Like.destroy({ where: { postId, userId } });
					deleteLikeNotification({ sender: userId, models, postId });
				} else {
					await models.Like.create({ postId, userId });
					createLikeNotification({ sender: userId, models, postId });
				}
			} catch (err) {
				console.log(err);
				return {
					ok: false,
				};
			}
			return { ok: true };
		},
	},
};
export default ProfileResolvers;
