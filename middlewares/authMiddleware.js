const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // const token = req.header('Authorization')?.replace('Bearer ', '');
    const token = req.query.token;

    if (!token) {
        return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });
    }

    try {
        const decoded = jwt.verify(token, 'seu_segredo_jwt');
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ error: 'Token inválido.' });
    }
};

module.exports = authMiddleware;