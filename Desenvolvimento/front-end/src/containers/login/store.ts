import { observable, action } from 'mobx';
import Swal from 'sweetalert2';
import { setAuth } from '../../util/auth.util';
import { assign } from '../../util';
import { success, warning } from '../../components/notifications';
import { postLogin } from '../../api/auth.api';

export default class LoginStore {
  @observable user_name = '';
  @observable password = '';
  @observable isLoading = false;

  @action handleChange = (event: any, select?: any) => {
    const { id, value } = select || event.target;
    assign(this, id, value);
  }

  @action handleSubmit = async () => {
    const { user_name, password } = this;
    this.isLoading = true
    try {
      const { data } = await postLogin({ user_name, password })
      if (data) {
        setAuth(JSON.stringify(data));
        success("Seja Bem Vindo!");
      } else {
        warning("Usuário ou Senha incorreta, tente novamente!");
        // eslint-disable-next-line
        throw false
      }
    } catch (error) {
      if (error) {
        Swal.fire({
          text: 'Ocorreu um erro não esperado.',
          type: 'error'
        });
      }
      throw error;
    }
    finally {
      this.isLoading = false;
    }
  }
}
const login = new LoginStore();
export { login };