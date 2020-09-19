import { DataTypes } from "sequelize";

const Comment = (sequelize) => {
	sequelize.define("Comment", {
		content: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	});
};
export default Comment;
