
module.exports = (sequelize, DataTypes) => {
	const Sms = sequelize.define('Sms', {
		id: {
			allowNull: false,
			primaryKey: true,
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4
		},
		message: {
			type: DataTypes.STRING,
			allowNull: false
		},
		sentOn: {
			type: DataTypes.DATE,
			defaultValue: () => new Date()
		},
		receivedOn: {
			type: DataTypes.DATE,
			allowNull: true
		},
		status: {
			type: DataTypes.STRING,
			allowNull: false
		}
	}, {});
	Sms.associate = (models) => {
		// associations can be defined here
		Sms.belongsTo(models.User, {
			foreignKey: 'senderId',
			targetKey: 'id',
			as: 'sender'
		});
		Sms.belongsTo(models.User, {
			foreignKey: 'receiverId',
			targetKey: 'id',
			as: 'receiver'
		});
	};
	return Sms;
};
