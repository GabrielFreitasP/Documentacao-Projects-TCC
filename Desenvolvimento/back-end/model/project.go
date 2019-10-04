package model

import (
	"database/sql"
	"fmt"
	"strings"
	"time"
)

// CompanyProject struct
type CompanyProject struct {
	ID   int64  `json:"id"`
	Nome string `json:"nome"`
}

//Project struct
type Project struct {
	ID             int64          `json:"id"`
	Status         int64          `json:"status"`
	DtCadastro     string         `json:"dt_cadastro"`
	DtAtualizacao  string         `json:"dt_atualizacao"`
	Nome           string         `json:"nome"`
	IDEmpresa      int64          `json:"id_empresa"`
	Empresa        CompanyProject `json:"empresa"`
	PalavrasChaves string         `json:"palavras_chaves"`
	AreaProjeto    string         `json:"area_projeto"`
	DataLimite     string         `json:"data_limite"`
	Descricao      string         `json:"descricao"`
	IsFavorite     bool           `json:"is_favorite"`
}

//ProjectFilter struct
type ProjectFilter struct {
	NomeProjeto    string `json:"nome_projeto"`
	NomeEmpresa    string `json:"nome_empresa"`
	PalavrasChaves string `json:"palavras_chaves"`
	AreaProjeto    string `json:"area_projeto"`
	DataLimite     string `json:"data_limite"`
}

// MyProject struct
type MyProject struct {
	IDDev     int64 `json:"id_dev"`
	IDProjeto int64 `json:"id_projeto"`
}

//InsertProject ...
func (p *Project) InsertProject(db *sql.DB) (string, error) {
	dateNow := time.Now()

	// verify company exist
	count := 0
	err := db.QueryRow(`SELECT COUNT(*)
					FROM pessoa
					WHERE id = $1 AND tipo_pessoa = 0`, p.IDEmpresa).Scan(&count)
	if err != nil {
		return "", err
	}
	if count <= 0 {
		return "Empresa não encontrada", nil
	}
	// create pessoa
	statement, err := db.Prepare(`INSERT INTO projetos(id, status, dt_cadastro, nome, id_empresa, palavras_chaves, area_projeto, data_limite, descricao)
								VALUES (DEFAULT, DEFAULT, $1, $2, $3, $4, $5, $6, $7)
								RETURNING id, status, dt_cadastro`)
	if err != nil {
		return "", err
	}
	err = statement.QueryRow(dateNow, p.Nome, p.IDEmpresa, p.PalavrasChaves, p.AreaProjeto, p.DataLimite, p.Descricao).Scan(&p.ID, &p.Status, &p.DtCadastro)
	if err != nil {
		return "", err
	}
	return "", nil
}

//UpdateProject ...
func (p *Project) UpdateProject(db *sql.DB) error {
	dateNow := time.Now()
	statement, err := db.Prepare(`UPDATE projetos
									 SET dt_atualizacao=$1, 
										 nome=$2, 
										 palavras_chaves=$3, 
										 area_projeto=$4, 
										 data_limite=$5, 
										 descricao=$6
								   WHERE id=$7 AND id_empresa=$8
								RETURNING status, dt_cadastro, dt_atualizacao, (SELECT apelido FROM pessoa WHERE id = 1);`)

	if err != nil {
		return err
	}

	err = statement.QueryRow(dateNow, p.Nome, p.PalavrasChaves, p.AreaProjeto, p.DataLimite, p.Descricao, p.ID, p.IDEmpresa).Scan(&p.Status, &p.DtCadastro, &p.DtAtualizacao, &p.Empresa.Nome)
	p.Empresa.ID = p.IDEmpresa
	return err
}

//GetProject ...
func (p *Project) GetProject(db *sql.DB, idPessoa int) error {
	var isCompany bool
	err := db.QueryRow(`SELECT COUNT(*) > 0
					FROM pessoa pe
					WHERE pe.id = $1 AND pe.tipo_pessoa = 0`, idPessoa).Scan(&isCompany)

	if isCompany {
		err = db.QueryRow(`SELECT p.nome, p.id_empresa, pe.apelido, p.palavras_chaves, p.area_projeto, p.data_limite, p.descricao
						FROM projetos p
						INNER JOIN pessoa pe ON p.id_empresa = pe.id
						WHERE p.id = $1`, p.ID).Scan(&p.Nome, &p.IDEmpresa, &p.Empresa.Nome, &p.PalavrasChaves, &p.AreaProjeto, &p.DataLimite, &p.Descricao)
		p.Empresa.ID = p.IDEmpresa
	} else {
		err = db.QueryRow(`SELECT p.nome, p.id_empresa, pe.apelido, p.palavras_chaves, p.area_projeto, p.data_limite, p.descricao,
								(SELECT COUNT(*) > 0 FROM meusprojetos mp 
									WHERE mp.id_projeto = p.id AND mp.id_dev = $2
										AND mp.status = 1) as is_favorite
						FROM projetos p
						INNER JOIN pessoa pe ON p.id_empresa = pe.id
						WHERE p.id = $1`, p.ID, idPessoa).Scan(&p.Nome, &p.IDEmpresa, &p.Empresa.Nome, &p.PalavrasChaves, &p.AreaProjeto, &p.DataLimite, &p.Descricao, &p.IsFavorite)
		p.Empresa.ID = p.IDEmpresa
	}

	return err
}

// GetProjectsByCompany ...
func (p *ProjectFilter) GetProjectsByCompany(db *sql.DB, IDEmpresa int) ([]Project, error) {
	var values []interface{}
	var where []string

	i := 1
	where = append(where, fmt.Sprintf("pe.id = $%d", i))
	values = append(values, IDEmpresa)
	i++
	if p.NomeProjeto != "" {
		where = append(where, fmt.Sprintf("p.nome LIKE $%d", i))
		values = append(values, "%"+p.NomeProjeto+"%")
		i++
	}
	if p.PalavrasChaves != "" {
		palavras := strings.Join(strings.Split(p.PalavrasChaves, ","), "|")
		where = append(where, fmt.Sprintf("p.palavras_chaves SIMILAR TO $%d", i))
		values = append(values, "("+palavras+")%")
		i++
	}
	if p.AreaProjeto != "" {
		where = append(where, fmt.Sprintf("p.area_projeto LIKE $%d", i))
		values = append(values, "%"+p.AreaProjeto+"%")
		i++
	}
	if p.DataLimite != "" {
		where = append(where, fmt.Sprintf("to_date(p.data_limite, 'DD/MM/YYYY') <= to_date($%d, 'DD/MM/YYYY')", i))
		values = append(values, p.DataLimite)
	}

	rows, err := db.Query(`SELECT p.id, p.status, p.dt_cadastro, COALESCE(CAST(p.dt_atualizacao as varchar), '') as dt_atualizacao, 
									p.nome, p.id_empresa, pe.apelido, p.palavras_chaves, p.area_projeto, p.data_limite, p.descricao
							FROM projetos p
							INNER JOIN pessoa pe ON p.id_empresa = pe.id AND pe.tipo_pessoa = 0
							WHERE p.status = 1 AND `+strings.Join(where, " AND ")+`
							ORDER BY p.id`, values...)
	if err != nil {
		return nil, err
	}

	projects := []Project{}
	defer rows.Close()
	for rows.Next() {
		var project Project
		var nomeEmpresa string
		if err = rows.Scan(&project.ID, &project.Status, &project.DtCadastro, &project.DtAtualizacao, &project.Nome, &project.IDEmpresa, &nomeEmpresa,
			&project.PalavrasChaves, &project.AreaProjeto, &project.DataLimite, &project.Descricao); err != nil {
			return nil, err
		}
		project.Empresa.ID = project.IDEmpresa
		project.Empresa.Nome = nomeEmpresa
		projects = append(projects, project)
	}
	return projects, nil
}

// GetProjects ...
func (p *ProjectFilter) GetProjects(db *sql.DB) ([]Project, error) {
	var values []interface{}
	var where []string

	i := 1
	if p.NomeProjeto != "" {
		where = append(where, fmt.Sprintf("p.nome LIKE $%d", i))
		values = append(values, "%"+p.NomeProjeto+"%")
		i++
	}
	if p.NomeEmpresa != "" {
		where = append(where, fmt.Sprintf("pe.nome LIKE $%d", i))
		values = append(values, "%"+p.NomeEmpresa+"%")
		i++
	}
	if p.PalavrasChaves != "" {
		palavras := strings.Join(strings.Split(p.PalavrasChaves, ","), "|")
		where = append(where, fmt.Sprintf("p.palavras_chaves SIMILAR TO $%d", i))
		values = append(values, "("+palavras+")%")
		i++
	}
	if p.AreaProjeto != "" {
		where = append(where, fmt.Sprintf("p.area_projeto LIKE $%d", i))
		values = append(values, "%"+p.AreaProjeto+"%")
		i++
	}
	if p.DataLimite != "" {
		where = append(where, fmt.Sprintf("to_date(p.data_limite, 'DD/MM/YYYY') <= to_date($%d, 'DD/MM/YYYY')", i))
		values = append(values, p.DataLimite)
		i++
	}
	and := ""
	if i > 1 {
		and = " AND "
	}
	rows, err := db.Query(`SELECT p.id, p.status, p.dt_cadastro, COALESCE(CAST(p.dt_atualizacao as varchar), '') as dt_atualizacao, 
									p.nome, p.id_empresa, pe.apelido, p.palavras_chaves, p.area_projeto, p.data_limite, p.descricao
					FROM projetos p
					INNER JOIN pessoa pe ON p.id_empresa = pe.id AND pe.tipo_pessoa = 0
					WHERE p.status = 1`+and+strings.Join(where, " AND ")+`
					ORDER BY p.id`, values...)
	if err != nil {
		return nil, err
	}

	projects := []Project{}
	defer rows.Close()
	for rows.Next() {
		var project Project
		var nomeEmpresa string
		if err = rows.Scan(&project.ID, &project.Status, &project.DtCadastro, &project.DtAtualizacao, &project.Nome, &project.IDEmpresa, &nomeEmpresa,
			&project.PalavrasChaves, &project.AreaProjeto, &project.DataLimite, &project.Descricao); err != nil {
			return nil, err
		}
		project.Empresa.ID = project.IDEmpresa
		project.Empresa.Nome = nomeEmpresa
		projects = append(projects, project)
	}
	return projects, nil
}

//InsertMyProject ...
func (p *MyProject) InsertMyProject(db *sql.DB) (string, error) {
	dateNow := time.Now()

	// verify user_name exist
	count := 0
	err := db.QueryRow(`SELECT COUNT(*)
					FROM pessoa
					WHERE id = $1 AND tipo_pessoa = 1`, p.IDDev).Scan(&count)
	if err != nil {
		return "", err
	}
	if count <= 0 {
		return "Id Dev não encontrado", nil
	}
	// add to my projects
	statement, err := db.Prepare(`INSERT INTO meusprojetos(id_projeto, id_dev, status, dt_cadastro)
								VALUES ($1, $2, DEFAULT, $3)
								ON CONFLICT (id_projeto, id_dev)
								DO 
									UPDATE
										SET status = 1, dt_atualizacao = $3;`)
	if err != nil {
		return "", err
	}
	_, err = statement.Exec(p.IDProjeto, p.IDDev, dateNow)
	if err != nil {
		return "", err
	}
	return "", nil
}

//RemoveMyProject ...
func (p *MyProject) RemoveMyProject(db *sql.DB) (string, error) {
	dateNow := time.Now()

	// verify user_name exist
	count := 0
	err := db.QueryRow(`SELECT COUNT(*)
					FROM pessoa
					WHERE id = $1 AND tipo_pessoa = 1`, p.IDDev).Scan(&count)
	if err != nil {
		return "", err
	}
	if count <= 0 {
		return "Id Dev não encontrado", nil
	}
	// add to my projects
	statement, err := db.Prepare(`UPDATE meusprojetos
									 SET status = 0, 
										 dt_atualizacao = $3
								   WHERE id_projeto = $1 AND id_dev = $2;`)
	if err != nil {
		return "", err
	}
	_, err = statement.Exec(p.IDProjeto, p.IDDev, dateNow)
	if err != nil {
		return "", err
	}
	return "", nil
}

// GetMyProjects ...
func (p *MyProject) GetMyProjects(db *sql.DB, idDev int) ([]Project, error) {
	rows, err := db.Query(`SELECT p.id, p.status, p.dt_cadastro, COALESCE(CAST(p.dt_atualizacao as varchar), '') as dt_atualizacao, 
							p.nome, p.id_empresa, pe.apelido, p.palavras_chaves, p.area_projeto, p.data_limite, p.descricao
						FROM meusprojetos mp
						INNER JOIN projetos p ON mp.id_projeto = p.id
						INNER JOIN pessoa pe ON p.id_empresa = pe.id AND pe.tipo_pessoa = 0
						WHERE mp.id_dev = $1 AND p.status = 1 AND mp.status = 1
						ORDER BY p.id`, idDev)
	if err != nil {
		return nil, err
	}

	projects := []Project{}
	defer rows.Close()
	for rows.Next() {
		var project Project
		var nomeEmpresa string
		if err = rows.Scan(&project.ID, &project.Status, &project.DtCadastro, &project.DtAtualizacao, &project.Nome, &project.IDEmpresa, &nomeEmpresa,
			&project.PalavrasChaves, &project.AreaProjeto, &project.DataLimite, &project.Descricao); err != nil {
			return nil, err
		}
		project.IsFavorite = true
		project.Empresa.ID = project.IDEmpresa
		project.Empresa.Nome = nomeEmpresa
		projects = append(projects, project)
	}
	return projects, nil
}
