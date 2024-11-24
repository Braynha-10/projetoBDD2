const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { Veiculo } = require('../models'); // mportar o modelo Veiculo
const { Cliente } = require('../models'); // Certifique-se de importar o modelo Veiculo



router.get('/', authMiddleware, (req, res) => {
    if (req.user.userType !== 'mecanico') {
        return res.status(403).json({ error: 'Acesso negado' });
    }

    // Recupere os dados do mecânico da sessão
    const mecanico = req.session.mecanico;
    res.render('mecanico/painelMecanico', {Mecanico: mecanico});
});

router.get('/veiculo', (req, res) => {
    res.render('veiculo/cadastroVeiculo');
});

router.post("/veiculo", async(req, res)=>{
    const { modelo, marca, ano, id_cliente } = req.body;

    try {
        // Recupere os dados do mecânico da sessão
        const mecanico = req.session.mecanico;
        // Salvar no banco de dados
        await Veiculo.create({  modelo, marca, ano, id_cliente });
        res.render('mecanico/painelMecanico', {Mecanico: mecanico});  // Redireciona para painel do mecanico
    } catch (error) {
        console.error('Erro ao cadastrar Veiculo:', error);
        res.status(500).send('Erro ao cadastrar veiculo');
    }
});

router.get('/cliente', (req, res) => {
    res.render('cliente/cadastroCliente');
});
module.exports = router;