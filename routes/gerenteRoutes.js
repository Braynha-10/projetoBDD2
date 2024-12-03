const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { Mecanico, Solicitacoes_peca } = require('../models');
const gerenteController = require('../controllers/gerenteController')


router.get('/', authMiddleware, (req, res) => {
    if (req.user.userType !== 'gerente') {
        return res.status(403).json({ error: 'Acesso negado' });
    }

    res.render('gerente/painelGerente');
});


//Rotas Controle do Mecanico
router.get('/mecanico/cadastro', async (req, res) => {
    res.render('mecanico/cadastro', {mecanico: null}); 
});

router.get('/mecanico/editar/:id', gerenteController.getEditarMecanico);
router.patch('/mecanicos/:id', gerenteController.atualizarMecanico);
router.delete('/mecanicos/:id', gerenteController.deletarMecanico);

router.post('/mecanico/cadastro', async (req,res) => {
    const {nome, email, telefone, senha, especialidade, salario, comissao} = req.body;

    const user = await Mecanico.findOne({
        where: {email: email}
    });

    if(!user){
        await Mecanico.create({nome, email, telefone, senha, especialidade, salario, comissao})
        res.render('gerente/painelGerente.ejs')
    } else {
        res.send('<h1>Ja existe um usuario com este email<h1>'); //deixar como unique
    }

})

router.get('/mecanico/listar', gerenteController.listarMecanicos);

//Rotas Controle das Pecas
router.get('/pecas/cadastro', async (req, res) => {
    res.render('pecas/cadastro');
});

router.get('/pecas/solicitacoes', async (req, res) => { 
    try {
        const pecas = await Solicitacoes_peca.findAll({
            include: [
                { model: Mecanico },
            ]
        });
        const gerente = true
        res.render('peca/listaPeca', { pecas, gerente });
    } catch (error) {
        console.error('Erro ao listar as solicitações de peças: ', error);
        res.status(500).send('Erro ao listar as solicitações de peças');
    }
});

router.post('/pecas/cadastro', gerenteController.cadastrarPeca);

router.get('/pecas/listar', gerenteController.listarPeca);


//Rotas Controle Servicos
router.get('/servicos/listar', gerenteController.listarServico);

//Rotas Controle Gerente
router.get('/gerentes/listar', gerenteController.listarGerente);

router.get('/gerentes/cadastro', async (req, res) => {
    res.render('gerente/cadastro');
});
router.post('/gerentes/cadastro', gerenteController.cadastrarGerente);
router.delete('/gerentes/deletar/:id', gerenteController.deletarGerente);
router.get('/gerentes/editar/:id', gerenteController.getEditarGerente);
router.patch('/gerentes/:id', gerenteController.atualizarGerente);




module.exports = router;
