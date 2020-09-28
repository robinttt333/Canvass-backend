import { DataTypes } from "sequelize";

const Notification = (sequelize) => {
	sequelize.define("Notification", {
		read: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		verb: {
			type: DataTypes.ENUM,
			values: ["liked", "commented", "posted", "accepted", "sent"],
		},
		object: {
			type: DataTypes.ENUM,
			values: ["post", "comment", "friend request", "invitation"],
		},
		text: {
			type: DataTypes.ENUM,
			values: [
				"liked your",
				"commented on your",
				"posted in",
				"accepted your",
				"sent you a",
				"sent you an",
			],
		},
		target: {
			type: DataTypes.ENUM,
			values: ["group"],
		},
		objectId: {
			type: DataTypes.INTEGER,
		},
		targetId: {
			type: DataTypes.INTEGER,
		},
	});
};
export default Notification;
