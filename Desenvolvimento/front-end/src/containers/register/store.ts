import { observable, action } from "mobx";
import { User } from "../../interfaces/user.interface";
import { assign } from "../../util";
import { postPerson } from "../../api/auth.api";
import { success } from "../../components/notifications";
import Swal from "sweetalert2";

const initialPerson = {
    tipo_pessoa: 0,
    nome: '',
    apelido: '',
    email: '',
    telefone: '',
    celular: '',
    facebook: '',
    twitter: '',
    instagram: '',
    linkedin: ''
}

const initialUser = {
    user_name: '',
    password: '',
    person: initialPerson
}

export default class RegisterStore {
    @observable user: User = initialUser;
    @observable isLoading = false;

    @action handleChange = (event: any, select?: any) => {
        const { id, value } = select || event.target;
        assign(this.user, id, value);
    }

    @action handleSubmit = async () => {
        this.isLoading = true;
        try {
            await postPerson(this.user);
            success("Parabéns! Agora você está cadastrado.");
        } 
        catch (error) {
            if (error) {
                Swal.fire({
                    text: 'Ocorreu um erro não esperado.',
                    type: 'error'
                });
            }
            throw error;
        }
        finally {
            this.user = initialUser;
            this.isLoading = false;
        }
    }
}

const register = new RegisterStore();
export { register };
