import UserSchema from "./User";
import ProfileSchema from "./Profile";
import GroupSchema from "./Group";
import PostSchema from "./Post";
import CommentSchema from "./Comment";
import MessageSchema from "./Message";
import MemberSchema from "./Member";
import FriendSchema from "./Friend";
import LastPostSeenSchema from "./LastPostSeen";

const schema = [
	UserSchema,
	ProfileSchema,
	GroupSchema,
	PostSchema,
	CommentSchema,
	MessageSchema,
	MemberSchema,
	FriendSchema,
	LastPostSeenSchema,
];
export default schema;
