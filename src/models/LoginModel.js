const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const LoginSchema = new mongoose.Schema({
    idLogin: { type: Number, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
});

const LoginModel = mongoose.model('Home', LoginSchema);
let idLogin = 1;

class Login {
    constructor(body, booolean = true) {
        if(booolean) {
            idLogin++;
        }

        this.body = body;
        this.errors = [];
        this.user = null;
    }

    async login() {
        this.valida();
        if(this.errors.length > 0) return;
        this.user = await LoginModel.findOne({ email: this.body.email });

        if(!this.user) {
            this.errors.push('Usuário não existe.');
            return;
        }

        if(!bcryptjs.compareSync(this.body.password, this.user.password)) {
            this.errors.push('Senha inválida.');
            this.user = null;
        return;
        }
    }

    async register() {
        this.valida();
        if(this.errors.length > 0) return;

        await this.userExists();

        if(this.errors.length > 0) return;

        const salt = bcryptjs.genSaltSync();
        this.body.password = bcryptjs.hashSync(this.body.password, salt);

        this.user = await LoginModel.create(this.body);
        
    }

    async userExists() {
        this.user = await LoginModel.findOne({ email: this.body.email });

        if(this.user) {
            this.errors.push('Usuário já existe.');
        }
    }

    valida() {
        this.cleanUp();

        // Validando email
        if(!validator.isEmail(this.body.email)) {
            this.errors.push('Email inválido');
        }

        // A senha precisa ter entre 3 a 50 caracteres
        if(this.body.password.length < 3 || this.body.password.length > 50) {
            this.errors.push('A senha precisa ter entre 3 e 50 caracteres');
        }
    }

    cleanUp() {
        for(let key in this.body) {
            if(typeof this.body[key] !== 'string') {
                this.body[key] = '';
            }
        }

        this.body = {
            idLogin: idLogin,
            email: this.body.email,
            password: this.body.password
        }
    }

    getIdLogin() {
        return idLogin;
    }
}

module.exports = Login;
