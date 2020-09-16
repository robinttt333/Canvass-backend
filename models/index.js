import { Sequelize } from "sequelize";
import User from "./User";
import Profile from "./Profile";
import setupAssociations from "./setupAssociations";

export const sequelize = new Sequelize("canvass", "postgres", "postgres", {
	host: "localhost",
	dialect: "postgres",
});

User(sequelize);
Profile(sequelize);
export const models = sequelize.models;
setupAssociations(models);
