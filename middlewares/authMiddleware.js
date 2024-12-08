const authMiddleware = (req, res, next) => {
    if (!req.session.mecanico) {
        mecanico = false;
        res.render("errorPage", {mecanico});
        // return res.status(401).json({ error: 'Acesso negado para mecanico. Por favor, faça login.' });
    }
    if (!req.session.gerente) {
        gerente = false;
        res.render("errorPage", {gerente});
        // return res.status(401).json({ message: 'Acesso negado para gerente. Por favor, faça login.' });
    }
    next();
};

module.exports = authMiddleware;