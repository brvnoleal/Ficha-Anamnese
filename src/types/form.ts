// Tipos TypeScript para o formulário de anamnese

export interface FormData {
  // Página 1 - Informações Pessoais
  nome_completo: string;
  rg: string;
  orgao_expedidor: string;
  cpf: string;
  data_nascimento: string;
  sexo: string;
  estado_civil: string;
  nacionalidade: string;
  data_consulta: string;
  whatsapp: string;
  indicado_por: string;
  nome_rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;

  // Página 2 - Anamnese Parte 1
  tratamento_medico: string;
  tratamento_medico_detalhes: string;
  alergico_medicamento: string;
  alergico_medicamento_detalhes: string;
  alergia: string;
  alergia_detalhes: string;
  gestando: string;
  gestando_detalhes: string;
  diabetes: string;
  diabetes_detalhes: string;
  hepatite: string;
  hepatite_detalhes: string;

  // Página 3 - Anamnese Parte 2
  muita_sede: string;
  problemas_cardiacos: string;
  problemas_cardiacos_detalhes: string;
  hiv_sifilis_chagas: string;
  hiv_sifilis_chagas_detalhes: string;
  drogas: string;
  drogas_detalhes: string;
  fumante: string;
  fumante_detalhes: string;

  // Página 4 - Anamnese Parte 3
  pressao_arterial: string;
  controla_pressao: string;
  controla_pressao_detalhes: string;
  historico_familia: string;
  historico_familia_detalhes: string;
  sangramento: string;
  cirurgia: string;
  cirurgia_detalhes: string;

  // Página 5 - Anamnese Parte 4
  sangra_dente: string;
  dor_dentes: string;
  gengiva_sangra: string;
  anestesia: string;
  anestesia_mal_estar: string;
  satisfacao_dentes: string;
  principal_queixa: string;

  // Página 6 - Termos e LGPD
  termo_responsabilidade: boolean;
  termo_consentimento: boolean;
  termo_imagem: boolean;
  termo_lgpd: boolean;
  nome_responsavel: string;
  nome_menor: string;
  data_hoje: string;
}

export interface ValidationErrors {
  [key: string]: string;
}

export interface FormStep {
  title: string;
  subtitle?: string;
  fields: string[];
}