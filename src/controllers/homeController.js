const Contato = require('../models/ContatoModel');
const Login = require('../models/LoginModel');

exports.index = async (req, res) => {
  const contatos = await Contato.buscaContatos();
  const idLogin = new Login(null, false).getIdLogin();

  let novosContatos = [];

  contatos.forEach(contato => {
    if(contato.idLogin === idLogin) {
      novosContatos.push(contato);
    }
  });

  res.render('index', { contatos: novosContatos });
};
