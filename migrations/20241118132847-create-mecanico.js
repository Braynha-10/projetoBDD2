'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('mecanico', [
      {
        nome: 'Carlos Souza',
        telefone: '11987654321',
        especialidade: 'Retifica',
        salario: 3000.00,
        comissao: 500.00
      },
      {
        nome: 'Luciana Oliveira',
        telefone: '11976543210',
        especialidade: 'Suspensão e Direção',
        salario: 3500.00,
        comissao: 600.00
      },
      {
        nome: 'Roberto Lima',
        telefone: '11965432109',
        especialidade: 'Elétrica Automotiva',
        salario: 2800.00,
        comissao: 400.00
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('mecanico', null, {});
  }
};