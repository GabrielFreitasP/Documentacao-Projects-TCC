package handler

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"projects/desenvolvimento/back-end/api/db"
	"projects/desenvolvimento/back-end/model"
	"projects/desenvolvimento/back-end/util"
)

//Login ...
func Login(w http.ResponseWriter, r *http.Request) {
	var t util.App
	var d db.DB
	var u model.User

	err := d.Connection()
	if err != nil {
		t.ResponseWithError(w, http.StatusInternalServerError, "Banco de Dados offline", "")
		return
	}
	db := d.DB
	defer db.Close()

	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&u); err != nil {
		t.ResponseWithError(w, http.StatusBadRequest, "Invalid request payload", err.Error())
		return
	}
	defer r.Body.Close()
	user, err := u.Login(db)
	if err != nil {
		if err == sql.ErrNoRows {
			t.ResponsePostWithJSON(w, http.StatusOK, user)
		} else {
			t.ResponseWithError(w, http.StatusInternalServerError, "Erro ao validar Usuário", err.Error())
		}
		return
	}
	t.ResponsePostWithJSON(w, http.StatusOK, user)
}
