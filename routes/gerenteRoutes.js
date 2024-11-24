const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, (req, res) => {
    if (req.user.userType !== 'gerente') {
        return res.status(403).json({ error: 'Acesso negado' });
    }
    res.render('gerente/painelGerente');
});

module.exports = router;