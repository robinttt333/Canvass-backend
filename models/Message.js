import { DataTypes } from "sequelize";

const Message = (sequelize) => {
	sequelize.define("Message", {
		content: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	});
};
export default Message;
