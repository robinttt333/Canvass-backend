const LastPostSeen = {
	Mutation: {
		updateLastPostSeen: async (
			_,
			{ groupId },
			{ models, user: { userId } }
		) => {
			try {
				models.LastPostSeen.update(
					{ timestamp: new Date() },
					{ where: { groupId, userId } }
				);
			} catch (err) {
				console.log(err);
				return { ok: false };
			}
			return { ok: true };
		},
	},
};
export default LastPostSeen;
