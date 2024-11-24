// const {Mecanico} = require('../models');
// const {Router} = require('express');

// const roteador = Router();
// //-------------------------------------------------------------------------------------
// //Pagina home
// roteador.get('/', async(req, res)=>{
//     res.render('home');
// });
// //-------------------------------------------------------------------------------------

// //-------------------------------------------------------------------------------------
// //pagina cadastro
// roteador.get('/novo', (req, res) => {
//     res.render('mecanico/cadastro'); // Exibe o formulário de cadastro
// });

// roteador.post("/novo", async(req, res)=>{
//     const { username, password, patch } = req.body;

//     try {
//         // Salvar no banco de dados
//         await mecanico.create({ username, password, patch });
//         res.redirect('/mecanico/login'); // Redireciona para login após o cadastro
//     } catch (error) {
//         console.error('Erro ao cadastrar mecanico:', error);
//         res.status(500).send('Erro ao cadastrar mecanico');
//     }
// });
// //-------------------------------------------------------------------------------------

// //-------------------------------------------------------------------------------------
// //pagina login
// roteador.get('/login', (req, res) => {
//     res.render('mecanico/login'); // Exibe o formulário de login
// });

// roteador.post("/login", async(req, res)=>{
//     const { nome, telefone } = req.body;
//     console.log(req.body); // Verifica se os valores username e password estão corretos

//     try {
//         // Busca o mecanico no banco
//         const mecanico = await Mecanico.findOne({ where: { nome } });
//         console.log(mecanico);
//         // Verifica se o mecanico existe e a senha está correta
//         if (mecanico && mecanico.telefone === telefone) {
//              // Armazena o mecanico na sessão
//             req.session.mecanico = { 
//                 nome: mecanico.nome,
//                 telefone: mecanico.telefone // Armazena o patch, se necessário
//             };
//             // Verifique se o mecanico está logado
//             if (req.session.mecanico) {
//                 console.log("whaaaa");
//                 res.render('mecanico/perfil', {
//                     mecanico: req.session.mecanico // Passa o mecanico para o template EJS
//             })};
//         } else {
//             res.status(401).send('Credenciais inválidas');
//         }
//     } catch (error) {
//         console.error('Erro ao autenticar mecanico:', error);
//         res.status(500).send('Erro ao autenticar mecanico');
//     }
// });
// //-------------------------------------------------------------------------------------

// //-------------------------------------------------------------------------------------
// //pagina perfil
// roteador.get('/perfil', (req, res) => {
//     console.log(req.session.mecanico);
//     // Verifique se o mecanico está logado
//     if (req.session.mecanico) {
//         res.render('mecanico/perfil', {
//             mecanico: req.session.mecanico // Passa o mecanico para o template EJS
//         });
//     } else {
//         res.status(401).send('Você precisa estar logado para acessar esta página');
//     }});

// roteador.patch("/perfil", async(req, res)=>{

// });
// //-------------------------------------------------------------------------------------