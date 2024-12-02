const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

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
module.exports = router;