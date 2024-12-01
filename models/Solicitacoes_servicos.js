module.exports = (sequelize, DataTypes) => {
    const Solicitacao_servico = sequelize.define('Solicitacao_servico', {
        nome: DataTypes.STRING,
        descricao: DataTypes.STRING,
        preco: DataTypes.DOUBLE,
        status: {
            type: DataTypes.ENUM('pendente', 'aprovado', 'rejeitado'),
            defaultValue: 'pendente'
        }
    }, {});
        Solicitacao_servico.associate = function(models) {
        Solicitacao_servico.belongsTo(models.Mecanico, { foreignKey: 'id_mecanico' });
    };
    return Solicitacao_servico;
};
