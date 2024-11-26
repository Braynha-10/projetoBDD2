module.exports = (sequelize, DataTypes) => {
    const Catalogo_Servico = sequelize.define('Catalogo_servico', {
        nome: DataTypes.STRING,
        descricao: DataTypes.STRING,
        preco: DataTypes.DECIMAL
    }, {});
    return Catalogo_Servico;
};
 


