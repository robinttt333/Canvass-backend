import { Sequelize } from "sequelize";
import User from "./User";
import Profile from "./Profile";
import Group from "./Group";
import Member from "./Member";
import Like from "./Like";
import Post from "./Post";
import Comment from "./Comment";
import Message from "./Message";
import Friend from "./Friend";
import LastPostSeen from "./LastPostSeen";
import Notification from "./Notification";
import GroupInvite from "./GroupInvite";
import setupAssociations from "./setupAssociations";

export const sequelize = new Sequelize("canvass", "postgres", "postgres", {
	host: "localhost",
	dialect: "postgres",
});

User(sequelize);
Profile(sequelize);
Group(sequelize);
Member(sequelize);
Post(sequelize);
Comment(sequelize);
Like(sequelize);
Message(sequelize);
Friend(sequelize);
LastPostSeen(sequelize);
Notification(sequelize);
GroupInvite(sequelize);

export const models = sequelize.models;
setupAssociations(models);
