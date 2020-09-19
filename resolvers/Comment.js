import formatErrors from "../formatError";
import pubsub from "../pubsub";
import { withFilter } from "apollo-server";
import { COMMENT_ADDED } from "../events";
import { checkGroupMemberShip } from "../auth";

const Comment = {
	Query: {
		getComments: (_, { postId }, { models }) =>
			models.Comment.findAll({
				where: { postId },
				raw: true,
				order: [["createdAt", "DESC"]],
			}),
	},
	Mutation: {
		createComment: async (_, args, { models, user: { userId } }) => {
			let comment;
			try {
				comment = (await models.Comment.create({ ...args, userId })).get({
					plain: true,
				});
			} catch (err) {
				return { ok: false, error: formatErrors(err) };
			}
			pubsub.publish(COMMENT_ADDED, { commentAdded: comment });
			return { ok: true };
		},
	},
	Comment: {
		author: ({ userId }, _, { models }) =>
			models.User.findOne({ where: { id: userId }, raw: true }),
		createdAt: ({ createdAt }) => new Date(createdAt).toISOString(),
	},
	Subscription: {
		commentAdded: {
			subscribe: withFilter(
				() => pubsub.asyncIterator(COMMENT_ADDED),
				async ({ commentAdded }, { postId }, { user: { userId }, models }) => {
					//find the group to which created post belongs to
					const post = await models.Post.findOne({
						where: { id: commentAdded.postId },
						raw: true,
					});
					// check if current user is a member of group
					if (!(await checkGroupMemberShip(userId, post.groupId))) return false;
					if (commentAdded.postId !== postId) return false;
					return true;
				}
			),
		},
	},
};
export default Comment;
