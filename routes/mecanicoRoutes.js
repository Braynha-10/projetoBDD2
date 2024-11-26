const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { Veiculo, Cliente, Pagamento, Servico, Mecanico, Catalogo_servico } = require('../models'); // Importação dos modelos de dados
const { listandoVeiculos, cadastroVeiculo, atualizandoVeiculo, deletaVeiculo } = require('../controllers/mecanicoController');



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
    listandoVeiculos(req, res);
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

    const listarClientesMecanico = async(req, res, id) => {
        try {
            const clientes = await Cliente.findAll({
                include: {
                    model: Pagamento,
                    include: {
                        model: Servico,
                        where: { id_mecanico: id },  // Use o ID do mecânico logado
                        required: true,
                    },
                    required: true
                }
            });
            res.render('cliente/listaClientes', { Cliente: clientes });
        } catch (error) {
            console.error('Erro ao listar os clientes: ', error);
            res.status(500).send("Erro ao listar os Clientes");
        }
    }
    listarClientesMecanico(req, res, id);
});


router.post("/cliente", async(req, res)=>{
    const { nome, telefone, email, endereco } = req.body;

    try {
        // Recupere os dados do mecânico da sessão
        const mecanico = req.session.mecanico;
        // Salvar no banco de dados
        await Cliente.create({  nome, telefone, email, endereco  });
        res.render('mecanico/painelMecanico', {Mecanico: mecanico});  // Redireciona para painel do mecanico
    } catch (error) {
        console.error('Erro ao cadastrar Cliente:', error);
        res.status(500).send('Erro ao cadastrar Cliente');
    }
});

// Atualizar cliente
router.patch('/cliente/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, telefone, email } = req.body;

    try {
        await Cliente.update({ nome, telefone, email }, { where: { id } });
        res.redirect('/mecanico'); // Redireciona para painel do mecânico
    } catch (error) {
        console.error('Erro ao atualizar Cliente:', error);
        res.status(500).send('Erro ao atualizar cliente');
    }
});

// Deletar cliente
router.delete('/cliente/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await Cliente.destroy({ where: { id } });
        res.redirect('/mecanico'); // Redireciona para painel do mecânico
    } catch (error) {
        console.error('Erro ao deletar Cliente:', error);
        res.status(500).send('Erro ao deletar cliente');
    }
});

// Serviços
// Cadastrar serviço
router.get('/servico', (req, res) => {
    res.render('servico/cadastroServico');
});

router.post("/servico", async (req, res) => {
    const { nome_mecanico, modelo_veiculo, nome_servico, nome_peca, id_pagamento, descricao, status } = req.body;

    try {
        // Buscar o ID do mecânico pelo nome
        const mecanico = await Mecanico.findOne({ where: { nome: nome_mecanico } });
        if (!mecanico) {
            return res.status(404).send('Mecânico não encontrado');
        }

        // Buscar o ID do veículo pelo modelo
        const veiculo = await Veiculo.findOne({ where: { modelo: modelo_veiculo } });
        if (!veiculo) {
            return res.status(404).send('Veículo não encontrado');
        }

        // Buscar o ID do serviço pelo nome
        const servicoCatalogo = await Catalogo_servico.findOne({ where: { nome: nome_servico } });
        if (!servicoCatalogo) {
            return res.status(404).send('Serviço não encontrado no catálogo');
        }

        // Buscar o ID da peça pelo nome (se fornecido)
        let peca = null;
        if (nome_peca) {
            peca = await Peca.findOne({ where: { nome: nome_peca } });
            if (!peca) {
                return res.status(404).send('Peça não encontrada');
            }
        }

        // Salvar no banco de dados
        await Servico.create({
            id_mecanico: mecanico.id,
            id_veiculo: veiculo.id,
            id_servico: servicoCatalogo.id,
            id_peca: peca ? peca.id : null, // Se a peça foi encontrada, use o ID dela, caso contrário, use null
            id_pagamento,
            descricao,
            status
        });

        res.render('/');  // Redireciona para painel do mecânico
    } catch (error) {
        console.error('Erro ao cadastrar Serviço:', error);
        res.status(500).send('Erro ao cadastrar Serviço');
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