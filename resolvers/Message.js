import formatErrors from "../formatError";
const Message = {
	Mutation: {
		createMessage: async (_, { userId: receiver, content }, { models }) => {
			try {
				await models.Message.create({ sender: 1, receiver, content });
			} catch (err) {
				console.log(err);
				return { ok: false, error: formatErrors(err) };
			}
			return { ok: true };
		},
	},
	Query: {
		getChatMembers: async (_, __, { sequelize, user: { userId } }) => {
			//We join Message and User using the fact that whether
			//current user is either the sender and receiver
			//Thus we get all conversations in which he/she is involved
			//Note the distinct in the beginning of the query
			console.log(userId);
			const res = await sequelize.query(
				`
		Select distinct Users.id,Users.username
			from "Users" as Users, "Messages" as Messages
			where(
					(Users.id = Messages.sender and :userId= Messages.receiver)
					or
					(Users.id = Messages.receiver and :userId = Messages.sender)
				) and Users.id <> :userId`,
				{
					replacements: { userId },
				}
			);
			return res[0];
		},
	},
};
export default Message;
