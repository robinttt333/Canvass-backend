import User from "./User";
import Profile from "./Profile";
import Group from "./Group";
import Post from "./Post";
import Comment from "./Comment";
import Message from "./Message";
import Member from "./Member";
import Friend from "./Friend";
import LastPostSeen from "./LastPostSeen";
import GroupInvite from "./GroupInvite";
import Notification from "./Notification";
import Tag from "./Tag";

const resolvers = [
	User,
	Profile,
	Group,
	Post,
	Comment,
	Message,
	Member,
	Friend,
	LastPostSeen,
	Notification,
	GroupInvite,
	Tag,
];
export default resolvers;
