const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { Veiculo, Cliente, Pagamento, Servico, Peca, Mecanico, Catalogo, Solicitacoes_servico, Solicitacoes_peca} = require('../models'); // Importação dos modelos de dados
const { listandoVeiculos, cadastroVeiculo, atualizandoVeiculo, deletaVeiculo, cadastroCliente, atualizandoCliente, deletaCliente, editarVeiculo, listarClientesMecanico, listarServicos, listandoSolicitacoesServicos } = require('../controllers/mecanicoController');



router.get('/', authMiddleware, (req, res) => {
    if (req.user.userType !== 'mecanico') {
        return res.status(403).json({ error: 'Acesso negado' });
    }

    // Recupere os dados do mecânico da sessão
    const mecanico = req.session.mecanico;
    res.render('mecanico/painelMecanico', {Mecanico: mecanico});
});

// Veiculos --------------------------------------------------------------------------------------------------------------------------------------

// Home veiculo
router.get('/veiculo', (req, res) => {
    res.render('veiculo/cadastroVeiculo');
});

// listar veiculos
router.get('/veiculos', (req, res) => {
    // Recupere os dados do mecânico da sessão
    const {id} = req.session.mecanico;
    
    listandoVeiculos(req, res, id);
});

// modificar veiculos
router.get('/veiculos/:id/editar', async (req, res) => {
    editarVeiculo(req, res);
});

//cadastro veiculo
router.post("/veiculo", async(req, res)=>{
    cadastroVeiculo(req, res);
});

// Atualizar veiculo
router.patch('/veiculo/:id', async (req, res) => {
    atualizandoVeiculo(req, res);
});

// Deletar veiculo
router.delete('/veiculos/:id', async (req, res) => {
    deletaVeiculo(req, res);
});

// Clientes
// Cadastrar cliente
router.get('/cliente', (req, res) => {
    res.render('cliente/cadastroCliente');
});

// listar clientes
router.get('/clientes', (req, res) => {
    // Recupere os dados do mecânico da sessão
    const {id} = req.session.mecanico;
    
    listarClientesMecanico(req, res, id);
});

// cadastro clientes
router.post("/cliente", async(req, res)=>{
    cadastroCliente(req, res);
});

// Atualizar cliente
router.patch('/cliente/:id', async (req, res) => {
    atualizandoCliente(req, res);
});

// Deletar cliente
router.delete('/cliente/:id', async (req, res) => {
    deletaCliente(req, res);
});

// Serviços
// Cadastrar serviço
router.get('/servico', async(req, res) => {
    const {id} = req.session.mecanico; // Assume que o usuário está autenticado
    listarServicos(req, res, id);
});

//Listando solicitações de serviço
router.get('/servicos', async(req, res) => {
    const {id} = req.session.mecanico; // Assume que o usuário está autenticado
    listandoSolicitacoesServicos(req, res, id);    
});

// Solicitar servico
router.post("/servico", async (req, res) => {
    const { id_mecanico, id_catalogo, id_veiculo, id_peca, pagamento, desconto, descricao } = req.body;
    const mecanico = req.session.mecanico; // Assume que o usuário está autenticado
    try {
        await Solicitacoes_servico.create({
            id_mecanico,
            id_veiculo,
            id_peca,
            id_catalogo,
            tipo_pagamento: pagamento,
            desconto,
            descricao,
            status: 'PENDENTE' // Sempre começa como pendente
        });
        res.render('mecanico/painelMecanico', {Mecanico:mecanico}); // Redireciona para a listagem
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao criar a solicitação de serviço');
    }
});

// Atualizar serviço
router.patch('/servicos/:id', async (req, res) => {
    const { id } = req.params;
    const { id_mecanico, id_veiculo, id_servico, id_peca, id_pagamento, descricao, status } = req.body;

    try {
        await Servico.update({ id_mecanico, id_veiculo, id_servico, id_peca, id_pagamento, descricao, status }, { where: { id } });
        res.redirect('/mecanico'); // Redireciona para painel do mecânico
    } catch (error) {
        console.error('Erro ao atualizar Serviço:', error);
        res.status(500).send('Erro ao atualizar serviço');
    }
});

// Deletar serviço
router.delete('/servicos/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await Servico.destroy({ where: { id } });
        res.redirect('/mecanico'); // Redireciona para painel do mecânico
    } catch (error) {
        console.error('Erro ao deletar Serviço:', error);
        res.status(500).send('Erro ao deletar serviço');
    }
});

module.exports = router;