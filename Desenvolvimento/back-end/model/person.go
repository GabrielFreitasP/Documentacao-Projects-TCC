package model

import (
	"database/sql"
	"time"
)

//Address struct
type Address struct {
	ID            int64  `json:"id"`
	Status        int64  `json:"status"`
	DtCadastro    string `json:"dt_cadastro"`
	DtAtualizacao string `json:"dt_atualizacao"`
	Rua           string `json:"rua"`
	Numero        string `json:"numero"`
	Complemento   string `json:"complemento"`
	Bairro        string `json:"bairro"`
	Cidade        string `json:"cidade"`
	Estado        int64  `json:"estado"`
	Pais          int64  `json:"pais"`
}

//Person struct
type Person struct {
	ID            int64  `json:"id"`
	Status        int64  `json:"status"`
	DtCadastro    string `json:"dt_cadastro"`
	DtAtualizacao string `json:"dt_atualizacao"`
	TipoPessoa    int64  `json:"tipo_pessoa"`
	Nome          string `json:"nome"`
	Apelido       string `json:"apelido"`
	Email         string `json:"email"`
	Telefone      string `json:"telefone"`
	Celular       string `json:"celular"`
	Facebook      string `json:"facebook"`
	Twitter       string `json:"twitter"`
	Instagram     string `json:"instagram"`
	Linkedin      string `json:"linkedin"`
}

//PersonUser struct
type PersonUser struct {
	ID       int64  `json:"id"`
	UserName string `json:"user_name"`
	Password string `json:"password"`
	Person   Person `json:"person"`
}

//InsertPerson ...
func (u *PersonUser) InsertPerson(db *sql.DB) (string, error) {
	dateNow := time.Now()

	tx, err := db.Begin()
	if err != nil {
		return "", err
	}

	// verify user_name exist
	count := 0
	err = tx.QueryRow(`SELECT COUNT(*)
					FROM usuario
					WHERE user_name = $1`, u.UserName).Scan(&count)
	if err != nil {
		tx.Rollback()
		return "", err
	}
	if count > 0 {
		tx.Rollback()
		return "Nome de usuário já cadastrado", nil
	}
	// create pessoa
	statement, err := tx.Prepare(`INSERT INTO pessoa(id, status, dt_cadastro, tipo_pessoa, nome, apelido, email, 
														telefone, celular, facebook, twitter, instagram, linkedin)
								VALUES (DEFAULT, DEFAULT, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
								RETURNING id`)
	if err != nil {
		tx.Rollback()
		return "", err
	}
	err = statement.QueryRow(dateNow, u.Person.TipoPessoa, u.Person.Nome, u.Person.Apelido, u.Person.Email, u.Person.Telefone,
		u.Person.Celular, u.Person.Facebook, u.Person.Twitter, u.Person.Instagram, u.Person.Linkedin).Scan(&u.Person.ID)
	if err != nil {
		tx.Rollback()
		return "", err
	}
	// create usuario
	statement, err = tx.Prepare(`INSERT INTO usuario(id, status, dt_cadastro, id_pessoa, user_name, password)
								VALUES (DEFAULT, DEFAULT, $1, $2, $3, MD5($4))
								RETURNING id`)
	if err != nil {
		tx.Rollback()
		return "", err
	}
	err = statement.QueryRow(dateNow, u.Person.ID, u.UserName, u.Password).Scan(&u.ID)
	if err != nil {
		tx.Rollback()
		return "", err
	}
	tx.Commit()
	return "", nil
}

//UpdatePerson ...
// func (c *Person) UpdatePerson(db *sql.DB) error {
// 	statement, err := db.Prepare(`UPDATE CIDADAO
// 									SET NOME = ?,
// 										CPF = ?,
// 										DATANASCIMENTO = ?,
// 										TELEFONE = ?,
// 									WHERE CODIGO = ?`)

// 	if err != nil {
// 		return err
// 	}

// 	_, err = statement.Exec(c.Nome, c.Cpf, c.DataNascimento, c.Telefone, c.StatusPerson, c.CodigoPerson)

// 	return err
// }

//GetPerson ...
func (p *Person) GetPerson(db *sql.DB) error {
	err := db.QueryRow(`SELECT p.status, p.dt_cadastro, COALESCE(CAST(p.dt_atualizacao as varchar), '') as dt_atualizacao, p.tipo_pessoa, 
							p.nome, p.apelido, p.email, p.telefone, p.celular, p.facebook, p.twitter, p.instagram, p.linkedin
					FROM pessoa p
					WHERE id =  $1`, p.ID).Scan(&p.Status, &p.DtCadastro, &p.DtAtualizacao, &p.TipoPessoa, &p.Nome, &p.Apelido, &p.Email,
		&p.Telefone, &p.Celular, &p.Facebook, &p.Twitter, &p.Instagram, &p.Linkedin)
	return err
}

//GetPersons ...
// func (c *Person) GetPersons(db *sql.DB) ([]Person, error) {
// 	var values []interface{}
// 	var where []string

// 	if c.CodigoPerson != 0 {
// 		where = append(where, "CODIGO = ?")
// 		values = append(values, c.CodigoPerson)
// 	}

// 	if c.Nome != "" {
// 		where = append(where, "DESCRICAO = ?")
// 		values = append(values, c.Nome)
// 	}

// 	rows, err := db.Query(`SELECT CODIGO, NOME, CPF, DATANASCIMENTO, TELEFONE, STATUS
// 					FROM CIDADAO
// 					WHERE STATUS = 1 `+strings.Join(where, " AND "), values...)

// 	if err != nil {
// 		return nil, err
// 	}

// 	projects := []Person{}
// 	defer rows.Close()
// 	for rows.Next() {
// 		var cid Person
// 		if err = rows.Scan(&cid.CodigoPerson, &cid.Nome, &cid.Cpf, &cid.DataNascimento, &cid.Telefone, &cid.StatusPerson); err != nil {
// 			return nil, err
// 		}
// 		projects = append(projects, cid)
// 	}
// 	return projects, nil
// }

//DeletePerson ...
// func (c *Person) DeletePerson(db *sql.DB) error {
// 	statement, err := db.Prepare(`UPDATE CIDADAO
// 									SET STATUS = 1
// 									WHERE CODIGO = ?`)

// 	if err != nil {
// 		return err
// 	}

// 	_, err = statement.Exec(0, c.CodigoPerson)

// 	return err
// }
