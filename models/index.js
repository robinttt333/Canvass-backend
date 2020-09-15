import { Sequelize } from "sequelize";
import User from "./User";

export const sequelize = new Sequelize("canvass", "postgres", "postgres", {
	host: "localhost",
	dialect: "postgres",
	quoteIdentifiers: false,
});

User(sequelize);
export const models = sequelize.models;
