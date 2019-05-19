
module.exports = (sequelize, DataTypes) => {
	const Sms = sequelize.define('Sms', {
		id: {
			allowNull: false,
			primaryKey: true,
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4
		},
		message: DataTypes.STRING,
		sentOn: DataTypes.DATE,
		receivedOn: DataTypes.DATE,
		status: DataTypes.STRING
	}, {});
	Sms.associate = (models) => {
		// associations can be defined here
		Sms.belongsTo(models.User, {
			foreignKey: 'senderId',
			targetKey: 'id'
		});
		Sms.belongsTo(models.User, {
			foreignKey: 'receiverId',
			targetKey: 'id'
		});
	};
	return Sms;
};
