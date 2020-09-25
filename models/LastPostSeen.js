import { DataTypes } from "sequelize";

const LastPostSeen = (sequelize) => {
	sequelize.define("LastPostSeen", {
		timestamp: {
			type: DataTypes.DATE,
		},
	});
};
export default LastPostSeen;
