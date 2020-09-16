import { DataTypes } from "sequelize";

const Profile = (sequelize) => {
	sequelize.define("Profile", {
		firstName: {
			type: DataTypes.STRING,
			defaultValue: "Unknown",
		},
		lastName: {
			type: DataTypes.STRING,
			defaultValue: "Unknown",
		},
		status: {
			type: DataTypes.STRING,
			defaultValue: "Update your profile to change this",
		},
		dob: {
			type: DataTypes.DATEONLY,
			defaultValue: DataTypes.NOW,
		},
		dp: {
			type: DataTypes.STRING,
			defaultValue: "anonymous.png",
		},
		sex: {
			// true : male, false : female
			type: DataTypes.BOOLEAN,
			defaultValue: true,
		},
	});
};
export default Profile;
