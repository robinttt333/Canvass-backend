import UserSchema from "./User";
import ProfileSchema from "./Profile";
import GroupSchema from "./Group";
import PostSchema from "./Post";
import CommentSchema from "./Comment";
import MessageSchema from "./Message";
import MemberSchema from "./Member";
import FriendSchema from "./Friend";
import NotificationSchema from "./Notification";
import GroupInviteSchema from "./GroupInvite";
import LastPostSeenSchema from "./LastPostSeen";
import TagSchema from "./Tag";

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
	NotificationSchema,
	GroupInviteSchema,
	TagSchema,
];
export default schema;
