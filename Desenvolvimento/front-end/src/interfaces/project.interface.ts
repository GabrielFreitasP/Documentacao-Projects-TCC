export interface ProjectInterface {
    id?: number;
    nome: string;
    id_empresa: number;
    empresa: { id: number; nome: string; };
    palavras_chave: string;
    area_projeto: string;
    data_limite: string;
    descricao: string;
    is_favorite?: boolean;
}