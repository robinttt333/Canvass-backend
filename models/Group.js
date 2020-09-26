import { DataTypes } from "sequelize";

const Group = (sequelize) => {
	sequelize.define("Group", {
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		image: {
			type: DataTypes.STRING,
			defaultValue: "Group.jpg",
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		public: {
			// 1: public, 0: private
			type: DataTypes.BOOLEAN,
			defaultValue: true,
		},
	});
};
export default Group;
