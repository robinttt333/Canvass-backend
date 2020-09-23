import { DataTypes } from "sequelize";

const Message = (sequelize) => {
	sequelize.define("Message", {
		content: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		read: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
	});
};
export default Message;
