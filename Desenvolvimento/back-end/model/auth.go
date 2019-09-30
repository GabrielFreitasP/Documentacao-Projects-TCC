package model

import "database/sql"

//User struct
type User struct {
	UserName string `json:"user_name"`
	Password string `json:"password"`
}

//LoginResponse struct
type LoginResponse struct {
	UserName   string `json:"user_name"`
	IDPessoa   int64  `json:"id_pessoa"`
	Token      string `json:"token"`
	TipoPessoa int64  `json:"tipo_pessoa"`
}

//Login ...
func (u *User) Login(db *sql.DB) (interface{}, error) {
	// verify user credentials
	var user LoginResponse
	err := db.QueryRow(`SELECT u.user_name, u.id_pessoa, MD5(CONCAT(u.password, u.id, 'project')) as token, p.tipo_pessoa
					FROM usuario u
					INNER JOIN pessoa p ON (u.id_pessoa = p.id)
					WHERE u.user_name = $1 AND u.password = MD5($2)`, u.UserName, u.Password).Scan(&user.UserName, &user.IDPessoa, &user.Token, &user.TipoPessoa)
	if err != nil {
		return nil, err
	}
	return user, nil
}
