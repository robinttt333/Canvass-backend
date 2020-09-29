const Tag = {
	Query: {
		getAllTags: (_, __, { models }) =>
			models.Tag.findAll({
				where: {},
			}),
	},
};
export default Tag;
