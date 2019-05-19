
module.exports = {
	up: (queryInterface, Sequelize) => queryInterface.createTable('Sms', {
		id: {
			allowNull: false,
			primaryKey: true,
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4
		},
		message: {
			type: Sequelize.STRING
		},
		sentOn: {
			allowNull: false,
			type: Sequelize.DATE
		},
		receivedOn: {
			allowNull: true,
			type: Sequelize.DATE
		},
		status: {
			allowNull: true,
			type: Sequelize.STRING,
			defaultValue: null
		},
		createdAt: {
			allowNull: false,
			type: Sequelize.DATE
		},
		updatedAt: {
			allowNull: false,
			type: Sequelize.DATE
		},
		senderId: {
			allowNull: false,
			onDelete: 'CASCADE',
			onUpdate: 'CASCADE',
			type: Sequelize.UUID,
			references: {
				model: 'Users',
				key: 'id',
				as: 'sender'
			}
		},
		receiverId: {
			allowNull: false,
			onDelete: 'CASCADE',
			onUpdate: 'CASCADE',
			type: Sequelize.UUID,
			references: {
				model: 'Users',
				key: 'id',
				as: 'receiver'
			}
		}
	}),
	down: (queryInterface, Sequelize) => queryInterface.dropTable('Sms')
};
