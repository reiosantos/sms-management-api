module.exports = {
	up: (queryInterface, Sequelize) => queryInterface.createTable('Users', {
		id: {
			allowNull: false,
			primaryKey: true,
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4
		},
		username: {
			allowNull: false,
			unique: true,
			type: Sequelize.STRING
		},
		password: {
			type: Sequelize.STRING
		},
		contact: {
			type: Sequelize.STRING
		},
		isSuperUser: {
			type: Sequelize.BOOLEAN,
			defaultValue: false
		},
		isAdmin: {
			type: Sequelize.BOOLEAN,
			defaultValue: false
		},
		createdAt: {
			allowNull: false,
			type: Sequelize.DATE
		},
		updatedAt: {
			allowNull: false,
			type: Sequelize.DATE
		}
	}),
	/* eslint-disable no-unused-vars */
	down: (queryInterface, Sequelize) => queryInterface.dropTable('Users')
};
