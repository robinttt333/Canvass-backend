import { Op } from "sequelize";

const Friend = {
	// we have combined friend and friend request into a single model
	FriendshipStatus: {
		PENDING: "pending",
		ACCEPT: "accept",
		CONFIRMED: "confirmed",
		NONE: "none",
	},
	Query: {
		getFriendshipStatus: async (
			_,
			{ friendId },
			{ models, user: { userId: me } }
		) => {
			let friend;
			try {
				friend = await models.Friend.findOne({
					raw: true,
					where: {
						[Op.or]: [
							{ [Op.and]: [{ friendId }, { userId: me }] },
							{ [Op.and]: [{ friendId: me }, { userId: friendId }] },
						],
					},
				});
			} catch (err) {
				console.log(err);
				return { ok: false, status: "none" };
			}
			if (!friend) {
				return { ok: true, status: "none" };
			}
			//if status is pending in models we have 2 possibilities in schema
			// these are required as pending state can be only manipulated by the person to whom request
			// is sent so we need to add a new state called  accept to differentiate between the 2 but
			// in the model this is not required
			if (friend.status === "pending") {
				if (friend.userId === me) return { ok: false, status: "pending" };
				return { ok: false, status: "accept" };
			}
			return { ok: false, status: "confirmed" };
		},
	},
	Mutation: {
		sendFriendRequest: (_, { friendId }, { models, user: { userId } }) => {
			try {
				models.Friend.create({
					userId,
					friendId,
					status: "pending",
				});
			} catch (err) {
				console.log(err);
				return { ok: false };
			}
			return { ok: true };
		},

		acceptFriendRequest: async (
			_,
			{ userId },
			{ models, user: { userId: friendId } }
		) => {
			try {
				await models.Friend.update(
					{ status: "confirmed" },
					{ where: { userId, friendId } }
				);
			} catch (err) {
				console.log(err);
				return { ok: false };
			}
			return { ok: true };
		},
		cancelFriendRequest: async (
			_,
			{ userId },
			{ models, user: { userId: friendId } }
		) => {
			try {
				await models.Friend.destroy({
					where: {
						userId,
						friendId,
					},
				});
			} catch (err) {
				console.log(err);
				return { ok: false };
			}
			return { ok: true };
		},
	},
};
export default Friend;
