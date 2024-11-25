const { Mecanico, Peca, Servico, Veiculo, Pagamento, Catalogo_Servico, Gerente, Cliente } = require('../models');


const listarMecanicos = async(req,res) => {
    try{
        const mecanicos = await Mecanico.findAll();
        res.render('mecanico/listar', {mecanicos});
    } catch (error){
        console.error('Erro ao listar mecanicos: ', error);
        res.status(500).json({error: 'Erro ao listar mecanicos'});
    }
}


const cadastrarPeca = async(req, res) => {
    const {nome, descricao, preco} = req.body;
    try{
        const user = await Peca.findOne({where: {nome: nome}});
        if(!user){
            await Peca.create({nome, descricao, preco});
            res.render('gerente/painelGerente.ejs')
        } else {
            res.send('<h1>Ja existe uma peca cadastrada com esse nome!</h1>')
        }
    } catch(error){
        console.error('Erro ao cadastrar peca: ', error);
        res.status(500).json({error: 'Erro ao cadastrar peca'})
    }
};

const listarPeca = async (req, res) => {
    try{
        const pecas = await Peca.findAll();
        res.render('pecas/listar', {pecas});
    } catch(error){
        console.error('Erro ao listar as pecas: ', error);
        res.status(500).json({error: "Erro ao listar Pecas"})
    }
}



const listarServico = async(req,res) => {
    try{
        const servicos = await Servico.findAll({
            include: [
                {model:Mecanico},
                {model:Veiculo},
                {model:Catalogo_Servico},
                {model:Peca},
                {model:Pagamento}
            ]
        });
        res.render('servicos/listar', {servicos}); 
    } catch(error){
        console.error('Erro ao listar as servicos: ', error);
        res.status(500).json({error: "Erro ao listar Servicos"})
    }
}

const listarGerente = async (req, res) => {
    try{
        const gerentes = await Gerente.findAll();
        res.render("gerente/listar");
    } catch(error) {
        console.error('Erro ao listar Gerentes: ', error);
        res.status(500).json({error: "Erro ao listar Gerentes"})
    }
}

module.exports = {listarMecanicos, cadastrarPeca, listarPeca, listarServico, listarGerente};