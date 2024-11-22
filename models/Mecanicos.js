module.exports = (sequelize, DataTypes) => {
    const Mecanico = sequelize.define('Mecanico', {
        nome: DataTypes.STRING,
        telefone: DataTypes.STRING,
        especialidade: DataTypes.STRING,
        salario: DataTypes.DOUBLE,
        comissao: DataTypes.DOUBLE
    }, {});
    return Mecanico;
};
 


