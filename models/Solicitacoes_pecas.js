module.exports = (sequelize, DataTypes) => {
    const Solicitacao_peca = sequelize.define('Solicitacao_peca', {
        nome: DataTypes.STRING,
        descricao: DataTypes.STRING,
        preco: DataTypes.DOUBLE,
        status: {
            type: DataTypes.ENUM('pendente', 'aprovado', 'rejeitado'),
            defaultValue: 'pendente'
        }
    }, {});
        Solicitacao_peca.associate = function(models) {
        Solicitacao_peca.belongsTo(models.Mecanico, { foreignKey: 'id_mecanico' });
    };
    return Solicitacao_peca;
};
