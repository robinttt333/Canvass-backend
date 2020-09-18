import { Sequelize } from "sequelize";
import User from "./User";
import Profile from "./Profile";
import Group from "./Group";
import Member from "./Member";
import Like from "./Like";
import Post from "./Post";
import setupAssociations from "./setupAssociations";

export const sequelize = new Sequelize("canvass", "postgres", "postgres", {
	host: "localhost",
	dialect: "postgres",
});

User(sequelize);
Profile(sequelize);
Group(sequelize);
Member(sequelize);
Like(sequelize);
Post(sequelize);

export const models = sequelize.models;
setupAssociations(models);
