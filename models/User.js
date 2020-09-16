import { DataTypes } from "sequelize";

const User = (sequelize) => {
	sequelize.define("User", {
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		username: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		count: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0,
		},
	});
};
export default User;
