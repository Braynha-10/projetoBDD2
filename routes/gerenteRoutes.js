const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { Veiculo, Cliente, Pagamento, Servico, Peca, Mecanico, Catalogo, Solicitacoes_servico, Solicitacoes_peca} = require('../models'); // Importação dos modelos de dados

router.get('/', authMiddleware, (req, res) => {
    if (req.user.userType !== 'gerente') {
        return res.status(403).json({ error: 'Acesso negado' });
    }
    res.render('gerente/painelGerente');
});

router.get('/servicos', authMiddleware, (req, res) => {
    const user = req.user.userType;
    if (user !== 'gerente') {
        return res.status(403).json({ error: 'Acesso negado' });
    }
    const gerente = req.session.gerente;
    res.render('servico/listaServicos', gerente);
});

router.get('/pecas', (req, res) => {
    const user = req.user.userType;
    if (user !== 'gerente') {
        return res.status(403).json({ error: 'Acesso negado' });
    }
    const gerente = req.session.gerente;
    res.render('peca/listaPecas', gerente);
});

router.get('/veiculos', (req, res) => {
    const Veiculo = Veiculo.findAll();
    
    res.render('veiculos/listaVeiculos', Veiculo);
});

module.exports = router;