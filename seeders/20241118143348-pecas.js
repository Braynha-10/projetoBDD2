'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('pecas', [
      {
        nome: 'Filtro de Óleo',
        descricao: 'Filtro de óleo para motores de carros, garantindo que o óleo permaneça limpo e eficaz.',
        preco: 50.00,
        createdAt: Sequelize.fn('NOW'),
        updatedAt: Sequelize.fn('NOW')
      },
      {
        nome: 'Pasta de Freio',
        descricao: 'Pastilhas de freio de alta qualidade para garantir uma frenagem eficiente e segura.',
        preco: 200.00,
        createdAt: Sequelize.fn('NOW'),
        updatedAt: Sequelize.fn('NOW')
      },
      {
        nome: 'Amortecedor',
        descricao: 'Amortecedor para suspensão de veículos, garantindo a estabilidade e o conforto durante a direção.',
        preco: 350.00,
        createdAt: Sequelize.fn('NOW'),
        updatedAt: Sequelize.fn('NOW')
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('pecas', null, {});
  }
};
