import { DataTypes } from "sequelize";

const User = (sequelize) => {
	sequelize.define("User", {
		email: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		username: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	});
};
export default User;
