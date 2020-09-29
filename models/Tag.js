import { DataTypes } from "sequelize";

const Tag = (sequelize) => {
	sequelize.define("Tag", {
		value: {
			type: DataTypes.STRING,
			unique: true,
		},
	});
};
export default Tag;
