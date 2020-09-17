import { Sequelize } from "sequelize";
import User from "./User";
import Profile from "./Profile";
import Group from "./Group";
import Member from "./Member";
import setupAssociations from "./setupAssociations";

export const sequelize = new Sequelize("canvass", "postgres", "postgres", {
	host: "localhost",
	dialect: "postgres",
});

User(sequelize);
Profile(sequelize);
Group(sequelize);
Member(sequelize);

export const models = sequelize.models;
setupAssociations(models);
