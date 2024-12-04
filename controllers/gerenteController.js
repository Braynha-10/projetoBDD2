const { Mecanico, Peca, Servico, Veiculo, Pagamento, Catalogo, Gerente, Cliente, Solicitacoes_peca, Solicitacoes_servico, sequelize } = require('../models');
const { get } = require('../routes/gerenteRoutes');


//Metodos Mecanico
const listarMecanicos = async(req,res) => {
    try{
        const mecanicos = await Mecanico.findAll();
        res.render('mecanico/listar', {mecanicos});
    } catch (error){
        console.error('Erro ao listar mecanicos: ', error);
        res.status(500).json({error: 'Erro ao listar mecanicos'});
    }
}

const getEditarMecanico = async(req, res) => {
    const {id} = req.params;

    try{
        const mecanico = await Mecanico.findByPk(id);
        if(!mecanico){
            return res.status(404).send('Mecanico nao encontrado!');
        }
        
        res.render('mecanico/cadastro', {mecanico});
    } catch (error){
        console.error('Erro ao buscar mecanico: ', error);
        res.status(500).json({error: 'Erro ao buscar mecanico'});
    }
}

const atualizarMecanico = async(req,res) => {
    const {id} = req.params;
    const {nome, telefone, email, senha, salario, comissao, especialidade} = req.body;

    try {
        const mecanico = await Mecanico.findByPk(id);
        if (!mecanico) {
            Mecanico.create({nome, telefone, email, senha, salario, comissao, especialidade});
        }
        await mecanico.update({nome, telefone, email, senha, salario, comissao, especialidade});
        res.render('gerente/painelGerente');
    } catch (error){
        console.error('Erro ao atualizar mecânico: ', error);
        res.status(500).json({ error: 'Erro ao atualizar mecânico' });
    }
}

const deletarMecanico = async (req, res) => {
    const {id} = req.params;
    try {
        Mecanico.destroy({where: {id: id}});
        res.render('gerente/painelGerente');
    } catch (error) { 
        console.error('Erro ao deletar mecanico: ', error);
        res.status(500).json({error: 'Erro ao deletar mecanico'}); 
    }
}


const cadastrarPeca = async(req, res) => {
    const {nome, descricao, preco} = req.body;
    try{
        const user = await Peca.findOne({where: {nome: nome}});
        if(!user){
            await Peca.create({nome, descricao, preco});
            res.render('/gerente/painelGerente.ejs')
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
                {model:Veiculo, include: Cliente},
                {model:Mecanico},
                {model:Peca},
                // {model:Pagamento},
                {model:Catalogo},
            ]
        });
        console.log(JSON.stringify(servicos, null, 2));

        res.render('servicos/listar', {servicos, gerente: false}); 
    } catch(error){
        console.error('Erro ao listar as servicos: ', error);
        res.status(500).json({error: "Erro ao listar Servicos"})
    }
}


//Methods Gerente
const cadastrarGerente = async (req, res) => {
    const {nome, telefone, email, salario, senha} = req.body;
    try{
        const user = await Gerente.findOne({where: {email:email}});
        if(!user){
            await Gerente.create({nome, telefone, email, salario, senha});
            res.render('gerente/painelGerente.ejs');
        } else {
            res.send("<h1>Gerente ja cadastrado com esse email!</h1>")
        }
    } catch (error){
        console.error('Erro ao cadastrar gerente: ', error);
        res.status(500).json({error: 'Erro ao cadastrar gerente'})
    }
}

const deletarGerente = async (req, res) => {
    const {id} = req.params;
    try{
        Gerente.destroy({where: {id: id}})
        res.render('gerente/painelGerente');
    } catch (error) { 
        console.error('Erro ao deletar gerente: ', error);
        res.status(500).json({error: 'Erro ao deletar gerente'}); 
    }
}

const atualizarGerente = async(req,res) => {
    const {id} = req.params;
    const {nome, telefone, email, senha, salario} = req.body;

    try {
        const gerente = await Gerente.findByPk(id);
        if (!gerente) {
            res.status(404).json({error: "Gerente nao encontrado!"})
        }
        await gerente.update({nome, telefone, email, senha, salario});
        res.render('gerente/painelGerente');
    } catch (error){
        console.error('Erro ao atualizar gerente: ', error);
        res.status(500).json({ error: 'Erro ao atualizar gerente' });
    }
}

const getEditarGerente = async(req, res) => {
    const {id} = req.params;
    if(!id){
        return res.render('gerente/cadastro');
    }
    try{
        const gerente = await Gerente.findByPk(id);
        
        if(!gerente){
            return res.status(404).send('Gerente nao encontrado!');
        }
        console.log(gerente.id)
        res.render('gerente/cadastro', {gerente});
    } catch (error){
        console.error('Erro ao buscar gerente: ', error);
        res.status(500).json({error: 'Erro ao buscar gerente'});
    }
}


const listarGerente = async (req, res) => {
    try{
        const gerentes = await Gerente.findAll();
        res.render("gerente/listar", {gerentes: gerentes});
    } catch(error) {
        console.error('Erro ao listar Gerentes: ', error);
        res.status(500).json({error: "Erro ao listar Gerentes"})
    }
}



const processarSolicitacaoPeca = async (req, res) => {
    const {solicitacaoId, status} = req.body;
    // console.log(id);

    const transaction = await sequelize.transaction();
    const solicitacao = await Solicitacoes_peca.findByPk(solicitacaoId);
    // console.log(solicitacao)
    if (!solicitacao){
        return res.status(404).send('Solicitacao nao encontrada!');
    }
    if(status === "Aprovar"){
        try {

            const novaPeca = await Peca.create({
                nome: solicitacao.nome,
                descricao: solicitacao.descricao,
                preco: solicitacao.preco
            },
            { transaction }
        );

        solicitacao.status = 'aprovado';
        await solicitacao.save({transaction});

        await transaction.commit();

        res.redirect("/gerente/pecas/solicitacoes")
            

        } catch (error) {
            await transaction.rollback();
            return res.status(500).json({error: error.message})
        }
    } else {
        solicitacao.status = 'recusado';
        await solicitacao.save({transaction});
        await transaction.commit();
        res.redirect("/gerente/pecas/solicitacoes");
    }
}


const listarSolicitacoesServicos = async (req, res) =>{
    try {
        const servicos = await Solicitacoes_servico.findAll({
            include: [
                { model: Veiculo, include: Cliente },
                {model: Catalogo},
                {model: Peca},
                {model: Mecanico},
            ]
        });
        const gerente = true
        res.render('servico/listaServicos', { Servico: servicos, gerente });
    } catch (error) {
        console.error('Erro ao listar as solicitações de serviço: ', error);
        res.status(500).send("Erro ao listar as solicitações de serviço");
    }
}

const processarSolicitacaoServicos = async (req, res) => {
    const {idServico, status} = req.body;

    const transaction = await sequelize.transaction();
    const solicitacaoServico = await Solicitacoes_servico.findByPk(idServico, {
        include: [
            {model: Veiculo, include: Cliente},
            {model: Catalogo},
            {model: Peca},
            {model: Mecanico},
        ]
    });
    if(!solicitacaoServico){
        return res.status(404).send('Solicitacao de Servico nao encontrada!');
    }
    if(status === "APROVADO"){
        try {
            const novoPagamento = await Pagamento.create({
                /*tipoPagamento, valor, desconto, id_cliente, status(boolean)*/
                tipo: solicitacaoServico.tipo_pagamento,
                valor: parseFloat(solicitacaoServico.Peca.preco) + parseFloat(solicitacaoServico.Catalogo.preco),
                desconto: solicitacaoServico.desconto,
                id_cliente: solicitacaoServico.Veiculo.id_cliente,
                status: false,
            }, {transaction})

            const novoServico = await Servico.create({
                id_mecanico: solicitacaoServico.id_mecanico,
                id_veiculo: solicitacaoServico.id_veiculo,
                id_catalogo: solicitacaoServico.id_catalogo,
                id_peca:solicitacaoServico.id_peca || null,
                id_pagamento: novoPagamento.id,
                descricao: solicitacaoServico.descricao,
                status: 'Pendente',
            })

            solicitacaoServico.status = 'APROVADO';
            await solicitacaoServico.save({transaction});
            await transaction.commit();
            
            res.redirect("/gerente/servicos/solicitacoes");

        } catch (error) {
            await transaction.rollback();
                return res.status(500).json({error: error.message})
        } 
    } else {
        solicitacaoServico.status = 'RECUSADO';
        await solicitacaoServico.save({transaction});
        await transaction.commit();
        res.redirect("/gerente/servicos/solicitacoes");
    }
}





module.exports = {
    listarMecanicos, 
    atualizarMecanico, 
    getEditarMecanico, 
    deletarMecanico, 
    cadastrarPeca, 
    listarPeca, 
    listarServico, 
    listarGerente, 
    cadastrarGerente, 
    atualizarGerente, 
    getEditarGerente, 
    deletarGerente,
    processarSolicitacaoPeca,
    listarSolicitacoesServicos,
    processarSolicitacaoServicos,
};