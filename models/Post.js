import { DataTypes } from "sequelize";

const Post = (sequelize) => {
	sequelize.define("Post", {
		//title: {
		//type: DataTypes.STRING,
		//allowNull: false,
		//},
		//image: {
		//type: DataTypes.STRING,
		//defaultValue: "Group.jpg",
		//},
		content: {
			type: DataTypes.TEXT(),
			allowNull: false,
		},
		pinned: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
	});
};
export default Post;
