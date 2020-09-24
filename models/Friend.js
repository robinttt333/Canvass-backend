import { DataTypes } from "sequelize";

const Friend = (sequelize) => {
	sequelize.define("Friend", {
		status: {
			type: DataTypes.ENUM,
			values: ["pending", "confirmed"],
		},
	});
};
export default Friend;
