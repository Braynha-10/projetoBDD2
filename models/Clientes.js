module.exports = (sequelize, DataTypes) => {
    const Cliente = sequelize.define('Cliente', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        nome: DataTypes.STRING,
        telefone: DataTypes.STRING,
        email: DataTypes.STRING,
        endereco: DataTypes.STRING
    }, {});
    return Cliente;
};
 


