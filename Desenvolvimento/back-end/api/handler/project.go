package handler

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"projects/desenvolvimento/back-end/api/db"
	"projects/desenvolvimento/back-end/model"
	"projects/desenvolvimento/back-end/util"
	"strconv"

	"github.com/gorilla/mux"
)

//InsertProject ...
func InsertProject(w http.ResponseWriter, r *http.Request) {
	var t util.App
	var d db.DB
	var p model.Project

	err := d.Connection()
	if err != nil {
		t.ResponseWithError(w, http.StatusInternalServerError, "Banco de Dados offline", "")
		return
	}
	db := d.DB
	defer db.Close()

	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&p); err != nil {
		t.ResponseWithError(w, http.StatusBadRequest, "Invalid request payload", err.Error())
		return
	}
	defer r.Body.Close()
	msg, err := p.InsertProject(db)
	if err != nil {
		t.ResponseWithError(w, http.StatusBadRequest, "Erro ao inserir Projeto", err.Error())
		return
	}
	if msg != "" {
		t.ResponseWithError(w, http.StatusOK, "Erro ao inserir Projeto", msg)
		return
	}
	t.ResponsePostWithJSON(w, http.StatusOK, p)
}

//UpdateProject ...
func UpdateProject(w http.ResponseWriter, r *http.Request) {
	var t util.App
	var d db.DB
	var p model.Project
	err := d.Connection()
	if err != nil {
		log.Printf("[handler/UpdateProject] -  Erro ao tentar abrir conexão. Erro: %s", err.Error())
		return
	}
	db := d.DB
	defer db.Close()

	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		t.ResponseWithError(w, http.StatusBadRequest, "Invalid id", "")
		return
	}

	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&p); err != nil {
		t.ResponseWithError(w, http.StatusBadRequest, "Invalid request payload", "")
		return
	}
	defer r.Body.Close()
	p.ID = int64(id)
	if err := p.UpdateProject(db); err != nil {
		t.ResponseWithError(w, http.StatusInternalServerError, err.Error(), "")
		return
	}
	t.ResponsePostWithJSON(w, http.StatusOK, p)
}

//DeleteProject ...
func DeleteProject(w http.ResponseWriter, r *http.Request) {
	var t util.App
	var d db.DB
	var p model.Project
	err := d.Connection()
	if err != nil {
		log.Printf("[handler/DeleteProject -  Erro ao tentar abrir conexao. Erro: %s", err.Error())
		return
	}
	db := d.DB
	defer db.Close()

	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		t.ResponseWithError(w, http.StatusBadRequest, "Invalid id", "")
		return
	}

	p.ID = int64(id)
	// if err := p.DeleteProject(db); err != nil {
	// 	log.Printf("[handler/DeleteProject -  Erro ao tentar deletar Cidadao. Erro: %s", err.Error())
	// 	t.ResponseWithError(w, http.StatusInternalServerError, err.Error(), "")
	// 	return
	// }
	t.ResponseWithJSON(w, http.StatusOK, p, 0, 0)
}

//GetProject ...
func GetProject(w http.ResponseWriter, r *http.Request) {
	var t util.App
	var d db.DB
	var p model.Project
	err := d.Connection()
	if err != nil {
		log.Printf("[handler/GetProject] -  Erro ao tentar abrir conexao. Erro: %s", err.Error())
		return
	}
	db := d.DB
	defer db.Close()

	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		t.ResponseWithError(w, http.StatusBadRequest, "Invalid id", "")
		return
	}
	idPessoa, err := strconv.Atoi(vars["id_pessoa"])
	if err != nil {
		t.ResponseWithError(w, http.StatusBadRequest, "Invalid id_pessoa", "")
		return
	}

	p.ID = int64(id)
	err = p.GetProject(db, idPessoa)
	if err != nil {
		if err == sql.ErrNoRows {
			log.Printf("[handler/GetProject -  Nao ha Projeto com este ID para está pessoa.")
			t.ResponseWithError(w, http.StatusNotFound, "Nao ha projeto com este id.", err.Error())
		} else {
			log.Printf("[handler/GetProject -  Erro ao tentar buscar Projeto. Erro: %s", err.Error())
			t.ResponseWithError(w, http.StatusInternalServerError, err.Error(), "")
		}
		return
	}
	t.ResponsePostWithJSON(w, http.StatusOK, p)
}

//GetProjectsByCompany ...
func GetProjectsByCompany(w http.ResponseWriter, r *http.Request) {
	var p model.ProjectFilter
	var t util.App
	var d db.DB
	err := d.Connection()
	if err != nil {
		log.Printf("[handler/GetProjectsByCompany] -  Erro ao tentar abrir conexao. Erro: %s", err.Error())
		return
	}
	db := d.DB
	defer db.Close()

	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		t.ResponseWithError(w, http.StatusBadRequest, "Invalid id", "")
		return
	}

	p.NomeProjeto = r.FormValue("nome_projeto")
	p.PalavrasChaves = r.FormValue("palavras_chaves")
	p.AreaProjeto = r.FormValue("area_projeto")
	p.DataLimite = r.FormValue("data_limite")

	projects, err := p.GetProjectsByCompany(db, id)
	if err != nil {
		if err == sql.ErrNoRows {
			log.Printf("[handler/GetProjects -  Nao ha Projeto com este filtro.")
			t.ResponseWithJSON(w, http.StatusOK, []model.Project{}, 0, 0)
		} else {
			log.Printf("[handler/GetProjects -  Erro ao tentar buscar Projeto. Erro: %s", err.Error())
			t.ResponseWithError(w, http.StatusInternalServerError, err.Error(), "")
		}
		return
	}
	t.ResponseWithJSON(w, http.StatusOK, projects, 0, 0)
}

//GetProjects ...
func GetProjects(w http.ResponseWriter, r *http.Request) {
	var p model.ProjectFilter
	var t util.App
	var d db.DB
	err := d.Connection()
	if err != nil {
		log.Printf("[handler/GetProjects] -  Erro ao tentar abrir conexao. Erro: %s", err.Error())
		return
	}
	db := d.DB
	defer db.Close()

	p.NomeProjeto = r.FormValue("nome_projeto")
	p.NomeEmpresa = r.FormValue("nome_empresa")
	p.PalavrasChaves = r.FormValue("palavras_chaves")
	p.AreaProjeto = r.FormValue("area_projeto")
	p.DataLimite = r.FormValue("data_limite")

	projects, err := p.GetProjects(db)
	if err != nil {
		if err == sql.ErrNoRows {
			log.Printf("[handler/GetProjects -  Nao ha Projeto com este filtro.")
			t.ResponseWithJSON(w, http.StatusOK, []model.Project{}, 0, 0)
		} else {
			log.Printf("[handler/GetProjects -  Erro ao tentar buscar Projeto. Erro: %s", err.Error())
			t.ResponseWithError(w, http.StatusInternalServerError, "", err.Error())
		}
		return
	}
	t.ResponseWithJSON(w, http.StatusOK, projects, 0, 0)
}

//InsertMyProject ...
func InsertMyProject(w http.ResponseWriter, r *http.Request) {
	var p model.MyProject
	var t util.App
	var d db.DB
	err := d.Connection()
	if err != nil {
		log.Printf("[handler/InsertMyProjects] -  Erro ao tentar abrir conexao. Erro: %s", err.Error())
		return
	}
	db := d.DB
	defer db.Close()

	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&p); err != nil {
		t.ResponseWithError(w, http.StatusBadRequest, "Invalid request payload", err.Error())
		return
	}
	defer r.Body.Close()
	msg, err := p.InsertMyProject(db)
	if err != nil {
		t.ResponseWithError(w, http.StatusBadRequest, "Erro ao adicionar aos meus projetos", err.Error())
		return
	}
	if msg != "" {
		t.ResponseWithError(w, http.StatusBadRequest, "Erro ao adicionar aos meus projetos", msg)
		return
	}
	t.ResponsePostWithJSON(w, http.StatusOK, p)
}

//GetMyProjects ...
func GetMyProjects(w http.ResponseWriter, r *http.Request) {
	var p model.MyProject
	var t util.App
	var d db.DB
	err := d.Connection()
	if err != nil {
		log.Printf("[handler/GetMyProjects] -  Erro ao tentar abrir conexao. Erro: %s", err.Error())
		return
	}
	db := d.DB
	defer db.Close()

	vars := mux.Vars(r)
	idDev, err := strconv.Atoi(vars["id_dev"])
	if err != nil {
		t.ResponseWithError(w, http.StatusBadRequest, "Invalid id_pessoa", "")
		return
	}

	projects, err := p.GetMyProjects(db, idDev)
	if err != nil {
		if err == sql.ErrNoRows {
			log.Printf("[handler/GetMyProjects -  Nao ha Projetos para este usuário.")
			t.ResponseWithJSON(w, http.StatusOK, []model.Project{}, 0, 0)
		} else {
			log.Printf("[handler/GetMyProjects -  Erro ao tentar buscar meus Projeto. Erro: %s", err.Error())
			t.ResponseWithError(w, http.StatusInternalServerError, "", err.Error())
		}
		return
	}
	t.ResponseWithJSON(w, http.StatusOK, projects, 0, 0)
}
