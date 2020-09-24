import formatErrors from "../formatError";
import { Op } from "sequelize";
import { createWriteStream, unlink } from "fs";

const fileUpload = async (createReadStream, filename) => {
	const stream = createReadStream();
	const path = `files/${filename}`;
	await new Promise((resolve, reject) => {
		const writeStream = createWriteStream(path, { flags: "a" });
		writeStream.on("finish", resolve);
		writeStream.on("error", (error) => {
			unlink(path, () => {
				reject(error);
			});
		});
		writeStream.on("pipe", (src) => {
			console.log(src);
		});
		stream.on("error", (error) => writeStream.destroy(error));
		stream.pipe(writeStream);
	});
};

const ProfileResolvers = {
	Query: {
		getProfile: async (_, { userId }, { models }) =>
			await models.Profile.findOne({ where: { userId }, raw: true }),
	},
	Profile: {
		user: async ({ userId }, _, { models }) =>
			await models.User.findOne({ where: { id: userId }, raw: true }),
		createdAt: ({ createdAt }) => new Date(createdAt).toISOString(),
		dp: ({ dp }) => `http://127.0.0.1:4000/files/${dp}`,
		friends: async ({ userId }, _, { models }) => {
			const res = await models.Friend.count({
				where: {
					[Op.or]: [{ userId }, { friendId: userId }],
					status: "confirmed",
				},
			});
			return res;
		},
	},
	Mutation: {
		updateImage: async (_, { file }, { models, user: { userId } }) => {
			const { createReadStream, filename } = await file;
			try {
				await fileUpload(createReadStream, filename);
				models.Profile.update({ dp: filename }, { where: { userId } });
			} catch (err) {
				return { ok: false };
			}

			return { ok: true };
		},
		updateProfile: async (_, args, { models, user: { userId } }) => {
			try {
				await models.Profile.update({ ...args }, { where: { userId } });
			} catch (err) {
				return {
					ok: false,
					error: formatErrors(err),
				};
			}
			return {
				ok: true,
			};
		},
	},
};

export default ProfileResolvers;
