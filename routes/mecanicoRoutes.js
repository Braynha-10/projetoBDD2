const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, (req, res) => {
    if (req.user.userType !== 'mecanico') {
        return res.status(403).json({ error: 'Acesso negado' });
    }

    // Recupere os dados do mecânico da sessão
    const mecanico = req.session.mecanico;
    res.render('mecanico/painelMecanico', {Mecanico: mecanico});
});

module.exports = router;