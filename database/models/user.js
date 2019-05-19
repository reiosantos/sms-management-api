module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define('User', {
		id: {
			allowNull: false,
			primaryKey: true,
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4
		},
		username: {
			allowNull: false,
			unique: true,
			type: DataTypes.STRING
		},
		password: {
			type: DataTypes.STRING
		},
		contact: {
			type: DataTypes.STRING
		},
		isAdmin: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		}
	}, {});
	User.associate = (models) => {
		// associations can be defined here
		User.hasMany(models.Sms, {
			foreignKey: 'senderId',
			sourceKey: 'id',
			onDelete: 'CASCADE',
			onUpdate: 'CASCADE',
			allowNull: false
		});
		User.hasMany(models.Sms, {
			foreignKey: 'receiverId',
			sourceKey: 'id',
			onDelete: 'SET NULL',
			onUpdate: 'CASCADE',
			allowNull: false
		});
	};
	return User;
};
