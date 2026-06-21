'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    const salt = await bcrypt.genSalt(10);
    // Default password for admin is 'admin123'
    const hashedPassword = await bcrypt.hash('admin123', salt);

    await queryInterface.bulkInsert('users', [{
      name: 'Super Admin',
      email: 'admin@himup.id',
      phone: '081234567890',
      password: hashedPassword,
      role: 'ADMIN',
      created_at: new Date(),
      updated_at: new Date()
    }], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', { email: 'admin@himup.id' }, {});
  }
};
