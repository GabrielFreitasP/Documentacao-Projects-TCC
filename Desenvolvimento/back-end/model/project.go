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
	IDDev    int64 `json:"id_dev"`
	IDPessoa int64 `json:"id_pessoa"`
}

//InsertProject ...
func (p *Project) InsertProject(db *sql.DB) (string, error) {
	dateNow := time.Now()

	// verify user_name exist
	count := 0
	err := db.QueryRow(`SELECT COUNT(*)
					FROM usuario
					WHERE user_name = $1`, p.IDEmpresa).Scan(&count)
	if err != nil {
		return "", err
	}
	if count > 0 {
		return "Id Empresa não encontrado", nil
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
									(SELECT COUNT(*) > 0 FROM meusprojetos mp WHERE mp.id_dev = p.id ) as is_favorite
						FROM projetos p
						INNER JOIN pessoa pe ON p.id_empresa = pe.id
						WHERE p.id = $1`, p.ID).Scan(&p.Nome, &p.IDEmpresa, &p.Empresa.Nome, &p.PalavrasChaves, &p.AreaProjeto, &p.DataLimite, &p.Descricao, &p.IsFavorite)
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
					WHERE p.status = 1 AND `+strings.Join(where, " AND "), values...)
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
					WHERE p.status = 1`+and+strings.Join(where, " AND "), values...)
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

// GetMyProjects ...
func (p *MyProject) GetMyProjects(db *sql.DB, idDev int) ([]Project, error) {
	rows, err := db.Query(`SELECT p.id, p.status, p.dt_cadastro, COALESCE(CAST(p.dt_atualizacao as varchar), '') as dt_atualizacao, 
									p.nome, p.id_empresa, pe.apelido, p.palavras_chaves, p.area_projeto, p.data_limite, p.descricao
					FROM projetos p
					INNER JOIN meusprojetos mp ON mp.id_projeto = p.id AND mp.id_dev = $1
					INNER JOIN pessoa pe ON p.id_empresa = pe.id AND pe.tipo_pessoa = 0
					WHERE p.status = 1 `, idDev)
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
