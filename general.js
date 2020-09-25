import formatError from "./formatError";
import { randomDescription } from "./constants";
export const makeGroups = async (models) => {
	try {
		await models.Group.create({
			name: "General",
			description: randomDescription,
		});
		await models.Group.create({
			name: "Random",
			description: randomDescription,
		});
	} catch (err) {
		console.log(
			"Something went wrong while creating general and random groups"
		);
		console.log(formatError(err));
	}
};

export const updateLastPostSeen = async ({ models, userId, sequelize, id }) => {
	const seen = await models.LastPostSeen.findOne({
		where: { userId, groupId: id },
		raw: true,
	});

	if (seen) {
		await models.LastPostSeen.update(
			{ timestamp: new Date() },
			{ where: { userId, groupId: id } }
		);
	} else {
		await models.LastPostSeen.create({
			timestamp: new Date(),
			userId,
			groupId: id,
		});
	}
};
