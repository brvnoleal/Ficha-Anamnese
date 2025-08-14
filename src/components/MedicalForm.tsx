import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ProgressBar } from './form/ProgressBar';
import { FormInput } from './form/FormInput';
import { FormSelect } from './form/FormSelect';
import { FormRadio } from './form/FormRadio';
import { FormTextarea } from './form/FormTextarea';
import { FormCheckbox } from './form/FormCheckbox';
import { FormData, ValidationErrors } from '@/types/form';
import { applyMask, extractDigits, validateCPF, validateCEP, validateWhatsApp, getCurrentDate } from '@/utils/masks';
import { 
  User, IdCard, BadgeCheck, Calendar, Phone, MapPin, 
  Locate, Home, Building2, ChevronLeft, ChevronRight, 
  Send, CheckCircle2, AlertCircle, Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TOTAL_STEPS = 6;
const WEBHOOK_URL = 'https://evolution-n8n.igatwi.easypanel.host/webhook/damskiodonto';

// Estados brasileiros
const STATES = [
  { value: 'AC', label: 'AC' }, { value: 'AL', label: 'AL' }, { value: 'AP', label: 'AP' },
  { value: 'AM', label: 'AM' }, { value: 'BA', label: 'BA' }, { value: 'CE', label: 'CE' },
  { value: 'DF', label: 'DF' }, { value: 'ES', label: 'ES' }, { value: 'GO', label: 'GO' },
  { value: 'MA', label: 'MA' }, { value: 'MT', label: 'MT' }, { value: 'MS', label: 'MS' },
  { value: 'MG', label: 'MG' }, { value: 'PA', label: 'PA' }, { value: 'PB', label: 'PB' },
  { value: 'PR', label: 'PR' }, { value: 'PE', label: 'PE' }, { value: 'PI', label: 'PI' },
  { value: 'RJ', label: 'RJ' }, { value: 'RN', label: 'RN' }, { value: 'RS', label: 'RS' },
  { value: 'RO', label: 'RO' }, { value: 'RR', label: 'RR' }, { value: 'SC', label: 'SC' },
  { value: 'SP', label: 'SP' }, { value: 'SE', label: 'SE' }, { value: 'TO', label: 'TO' }
];

const SEX_OPTIONS = [
  { value: 'Masculino', label: 'Masculino' },
  { value: 'Feminino', label: 'Feminino' },
  { value: 'Outro', label: 'Outro' }
];

const CIVIL_STATUS_OPTIONS = [
  { value: 'Solteiro(a)', label: 'Solteiro(a)' },
  { value: 'Casado(a)', label: 'Casado(a)' },
  { value: 'Divorciado(a)', label: 'Divorciado(a)' },
  { value: 'Viúvo(a)', label: 'Viúvo(a)' },
  { value: 'União Estável', label: 'União Estável' }
];

const YES_NO_OPTIONS = [
  { value: 'sim', label: 'Sim' },
  { value: 'nao', label: 'Não' }
];

const PRESSURE_OPTIONS = [
  { value: 'baixa', label: 'Baixa' },
  { value: 'normal', label: 'Normal' },
  { value: 'alta', label: 'Alta' }
];

const BLEEDING_OPTIONS = [
  { value: 'normal', label: 'Normal' },
  { value: 'excessivo', label: 'Excessivo' }
];

export const MedicalForm: React.FC = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  
  // Estado inicial do formulário
  const [formData, setFormData] = useState<FormData>({
    // Página 1
    nome_completo: '', rg: '', orgao_expedidor: '', cpf: '', data_nascimento: '',
    sexo: '', estado_civil: '', nacionalidade: 'Brasileira', data_consulta: getCurrentDate(),
    whatsapp: '', indicado_por: '', nome_rua: '', numero: '', complemento: '',
    bairro: '', cidade: '', estado: '', cep: '',
    
    // Página 2
    tratamento_medico: '', tratamento_medico_detalhes: '', alergico_medicamento: '',
    alergico_medicamento_detalhes: '', alergia: '', alergia_detalhes: '',
    gestando: '', gestando_detalhes: '', diabetes: '', diabetes_detalhes: '',
    hepatite: '', hepatite_detalhes: '',
    
    // Página 3
    muita_sede: '', problemas_cardiacos: '', problemas_cardiacos_detalhes: '',
    hiv_sifilis_chagas: '', hiv_sifilis_chagas_detalhes: '', drogas: '',
    drogas_detalhes: '', fumante: '', fumante_detalhes: '',
    
    // Página 4
    pressao_arterial: '', controla_pressao: '', controla_pressao_detalhes: '',
    historico_familia: '', historico_familia_detalhes: '', sangramento: '',
    cirurgia: '', cirurgia_detalhes: '',
    
    // Página 5
    sangra_dente: '', dor_dentes: '', gengiva_sangra: '', anestesia: '',
    anestesia_mal_estar: '', satisfacao_dentes: '', principal_queixa: '',
    
    // Página 6
    termo_responsabilidade: false, termo_consentimento: false, termo_imagem: false,
    termo_lgpd: false, nome_responsavel: '', nome_menor: '', data_hoje: getCurrentDate()
  });

  // Carregar dados do localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('damski-form-data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData({ ...formData, ...parsed });
      } catch (error) {
        console.error('Erro ao carregar dados salvos:', error);
      }
    }
  }, []);

  // Salvar dados no localStorage
  useEffect(() => {
    localStorage.setItem('damski-form-data', JSON.stringify(formData));
  }, [formData]);

  const updateField = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erro do campo quando modificado
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: ValidationErrors = {};
    
    switch (step) {
      case 1:
        if (!formData.nome_completo.trim()) newErrors.nome_completo = 'Nome é obrigatório';
        if (!formData.rg.trim()) newErrors.rg = 'RG é obrigatório';
        if (!formData.orgao_expedidor.trim()) newErrors.orgao_expedidor = 'Órgão expedidor é obrigatório';
        if (!formData.cpf.trim()) newErrors.cpf = 'CPF é obrigatório';
        else if (!validateCPF(formData.cpf)) newErrors.cpf = 'CPF inválido';
        if (!formData.data_nascimento) newErrors.data_nascimento = 'Data de nascimento é obrigatória';
        if (!formData.sexo) newErrors.sexo = 'Sexo é obrigatório';
        if (!formData.estado_civil) newErrors.estado_civil = 'Estado civil é obrigatório';
        if (!formData.nacionalidade.trim()) newErrors.nacionalidade = 'Nacionalidade é obrigatória';
        if (!formData.data_consulta) newErrors.data_consulta = 'Data da consulta é obrigatória';
        if (!formData.whatsapp.trim()) newErrors.whatsapp = 'WhatsApp é obrigatório';
        else if (!validateWhatsApp(formData.whatsapp)) newErrors.whatsapp = 'WhatsApp deve ter 11 dígitos e começar com 11';
        if (!formData.nome_rua.trim()) newErrors.nome_rua = 'Nome da rua é obrigatório';
        if (!formData.numero.trim()) newErrors.numero = 'Número é obrigatório';
        if (!formData.bairro.trim()) newErrors.bairro = 'Bairro é obrigatório';
        if (!formData.cidade.trim()) newErrors.cidade = 'Cidade é obrigatória';
        if (!formData.estado) newErrors.estado = 'Estado é obrigatório';
        if (!formData.cep.trim()) newErrors.cep = 'CEP é obrigatório';
        else if (!validateCEP(formData.cep)) newErrors.cep = 'CEP inválido';
        break;
        
      case 6:
        if (!formData.termo_responsabilidade) newErrors.termo_responsabilidade = 'Este termo é obrigatório';
        if (!formData.termo_consentimento) newErrors.termo_consentimento = 'Este termo é obrigatório';
        if (!formData.termo_imagem) newErrors.termo_imagem = 'Este termo é obrigatório';
        if (!formData.termo_lgpd) newErrors.termo_lgpd = 'Este termo é obrigatório';
        if (!formData.nome_responsavel.trim()) newErrors.nome_responsavel = 'Nome do responsável é obrigatório';
        if (!formData.data_hoje) newErrors.data_hoje = 'Data é obrigatória';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, TOTAL_STEPS));
    } else {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios antes de continuar.",
        variant: "destructive"
      });
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const submitForm = async () => {
    if (!validateStep(currentStep)) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios antes de finalizar.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Preparar dados para envio (extrair apenas dígitos dos campos mascarados)
      const submitData = {
        ...formData,
        cpf: extractDigits(formData.cpf),
        cep: extractDigits(formData.cep),
        whatsapp: extractDigits(formData.whatsapp)
      };

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar formulário');
      }

      setIsCompleted(true);
      localStorage.removeItem('damski-form-data'); // Limpar dados salvos
      
      toast({
        title: "Sucesso!",
        description: "Ficha enviada com sucesso!"
      });

    } catch (error) {
      console.error('Erro ao enviar:', error);
      toast({
        title: "Erro ao enviar",
        description: "Ocorreu um erro ao enviar a ficha. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const pageVariants = {
    initial: { opacity: 0, x: 50 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -50 }
  };

  const pageTransition = {
    type: "tween" as const,
    ease: [0.4, 0.0, 0.2, 1] as const,
    duration: 0.4
  };

  if (isCompleted) {
    return (
      <div className="medical-container">
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-6"
          >
            <div className="w-20 h-20 bg-gradient-success rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={40} className="text-white" />
            </div>
            
            <div className="space-y-2">
              <h1 className="medical-title text-2xl">Ficha Enviada!</h1>
              <p className="text-muted-foreground">
                Sua ficha de anamnese foi enviada com sucesso para a clínica Damski Odonto.
              </p>
            </div>
            
            <Button 
              onClick={() => window.location.reload()}
              className="medical-button-primary"
            >
              Fechar
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="medical-container safe-area">
      {/* Header */}
      <div className="space-y-6 mb-8">
        <div className="text-center space-y-2">
          <h1 className="medical-title">Damski Odonto</h1>
          <p className="medical-subtitle">
            CIRURGIÃ - DENTISTA – CLÍNICO GERAL E ODONTO CROSP N.º 134818
          </p>
        </div>
        
        <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />
      </div>

      {/* Form Content */}
      <div className="flex-1">
        <Card className="medical-card">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              className="space-y-6"
            >
              {/* Página 1 - Informações Pessoais */}
              {currentStep === 1 && (
                <>
                  <h2 className="text-xl font-semibold text-foreground mb-6">Informações Pessoais</h2>
                  
                  <div className="space-y-4">
                    <FormInput
                      id="nome_completo"
                      name="nome_completo"
                      label="Nome Completo"
                      value={formData.nome_completo}
                      onChange={(value) => updateField('nome_completo', value)}
                      icon={User}
                      required
                      error={errors.nome_completo}
                    />
                    
                    <FormInput
                      id="rg"
                      name="rg"
                      label="RG"
                      value={formData.rg}
                      onChange={(value) => updateField('rg', value)}
                      icon={IdCard}
                      required
                      error={errors.rg}
                    />
                    
                    <FormInput
                      id="orgao_expedidor"
                      name="orgao_expedidor"
                      label="Órgão Expedidor"
                      value={formData.orgao_expedidor}
                      onChange={(value) => updateField('orgao_expedidor', value)}
                      icon={BadgeCheck}
                      required
                      error={errors.orgao_expedidor}
                    />
                    
                    <FormInput
                      id="cpf"
                      name="cpf"
                      label="CPF"
                      value={formData.cpf}
                      onChange={(value) => updateField('cpf', value)}
                      type="tel"
                      inputMode="numeric"
                      mask={applyMask.cpf}
                      placeholder="000.000.000-00"
                      required
                      error={errors.cpf}
                    />
                    
                    <FormInput
                      id="data_nascimento"
                      name="data_nascimento"
                      label="Data de Nascimento"
                      value={formData.data_nascimento}
                      onChange={(value) => updateField('data_nascimento', value)}
                      type="date"
                      icon={Calendar}
                      required
                      error={errors.data_nascimento}
                    />
                    
                    <FormSelect
                      id="sexo"
                      name="sexo"
                      label="Sexo"
                      value={formData.sexo}
                      onChange={(value) => updateField('sexo', value)}
                      options={SEX_OPTIONS}
                      required
                      error={errors.sexo}
                    />
                    
                    <FormSelect
                      id="estado_civil"
                      name="estado_civil"
                      label="Estado Civil"
                      value={formData.estado_civil}
                      onChange={(value) => updateField('estado_civil', value)}
                      options={CIVIL_STATUS_OPTIONS}
                      required
                      error={errors.estado_civil}
                    />
                    
                    <FormInput
                      id="nacionalidade"
                      name="nacionalidade"
                      label="Nacionalidade"
                      value={formData.nacionalidade}
                      onChange={(value) => updateField('nacionalidade', value)}
                      required
                      error={errors.nacionalidade}
                    />
                    
                    <FormInput
                      id="data_consulta"
                      name="data_consulta"
                      label="Data da Consulta"
                      value={formData.data_consulta}
                      onChange={(value) => updateField('data_consulta', value)}
                      type="date"
                      icon={Calendar}
                      required
                      error={errors.data_consulta}
                    />
                    
                    <FormInput
                      id="whatsapp"
                      name="whatsapp"
                      label="WhatsApp"
                      value={formData.whatsapp}
                      onChange={(value) => updateField('whatsapp', value)}
                      type="tel"
                      inputMode="numeric"
                      mask={applyMask.whatsapp}
                      placeholder="(11) 99999-9999"
                      icon={Phone}
                      required
                      error={errors.whatsapp}
                    />
                    
                    <FormInput
                      id="indicado_por"
                      name="indicado_por"
                      label="Indicado por"
                      value={formData.indicado_por}
                      onChange={(value) => updateField('indicado_por', value)}
                      error={errors.indicado_por}
                    />
                    
                    <div className="pt-4 border-t border-border">
                      <h3 className="text-lg font-medium text-foreground mb-4">Endereço</h3>
                      
                      <div className="space-y-4">
                        <FormInput
                          id="nome_rua"
                          name="nome_rua"
                          label="Nome da Rua"
                          value={formData.nome_rua}
                          onChange={(value) => updateField('nome_rua', value)}
                          icon={MapPin}
                          required
                          error={errors.nome_rua}
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormInput
                            id="numero"
                            name="numero"
                            label="Número"
                            value={formData.numero}
                            onChange={(value) => updateField('numero', value)}
                            icon={Home}
                            required
                            error={errors.numero}
                          />
                          
                          <FormInput
                            id="complemento"
                            name="complemento"
                            label="Complemento"
                            value={formData.complemento}
                            onChange={(value) => updateField('complemento', value)}
                            error={errors.complemento}
                          />
                        </div>
                        
                        <FormInput
                          id="bairro"
                          name="bairro"
                          label="Bairro"
                          value={formData.bairro}
                          onChange={(value) => updateField('bairro', value)}
                          icon={Locate}
                          required
                          error={errors.bairro}
                        />
                        
                        <FormInput
                          id="cidade"
                          name="cidade"
                          label="Cidade"
                          value={formData.cidade}
                          onChange={(value) => updateField('cidade', value)}
                          icon={Building2}
                          required
                          error={errors.cidade}
                        />
                        
                        <FormSelect
                          id="estado"
                          name="estado"
                          label="Estado"
                          value={formData.estado}
                          onChange={(value) => updateField('estado', value)}
                          options={STATES}
                          required
                          error={errors.estado}
                        />
                        
                        <FormInput
                          id="cep"
                          name="cep"
                          label="CEP"
                          value={formData.cep}
                          onChange={(value) => updateField('cep', value)}
                          type="tel"
                          inputMode="numeric"
                          mask={applyMask.cep}
                          placeholder="00000-000"
                          required
                          error={errors.cep}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Página 2 - Anamnese Parte 1 */}
              {currentStep === 2 && (
                <>
                  <h2 className="text-xl font-semibold text-foreground mb-6">FICHA DE ANAMNESE</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <FormRadio
                        id="tratamento_medico"
                        name="tratamento_medico"
                        label="Está em tratamento médico?"
                        value={formData.tratamento_medico}
                        onChange={(value) => updateField('tratamento_medico', value)}
                        options={YES_NO_OPTIONS}
                        error={errors.tratamento_medico}
                      />
                      
                      {formData.tratamento_medico === 'sim' && (
                        <div className="mt-4">
                          <FormInput
                            id="tratamento_medico_detalhes"
                            name="tratamento_medico_detalhes"
                            label="Se sim, qual?"
                            value={formData.tratamento_medico_detalhes}
                            onChange={(value) => updateField('tratamento_medico_detalhes', value)}
                            error={errors.tratamento_medico_detalhes}
                          />
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <FormRadio
                        id="alergico_medicamento"
                        name="alergico_medicamento"
                        label="Alérgico a algum medicamento?"
                        value={formData.alergico_medicamento}
                        onChange={(value) => updateField('alergico_medicamento', value)}
                        options={YES_NO_OPTIONS}
                        error={errors.alergico_medicamento}
                      />
                      
                      {formData.alergico_medicamento === 'sim' && (
                        <div className="mt-4">
                          <FormInput
                            id="alergico_medicamento_detalhes"
                            name="alergico_medicamento_detalhes"
                            label="Se sim, qual?"
                            value={formData.alergico_medicamento_detalhes}
                            onChange={(value) => updateField('alergico_medicamento_detalhes', value)}
                            error={errors.alergico_medicamento_detalhes}
                          />
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <FormRadio
                        id="alergia"
                        name="alergia"
                        label="Tem algum tipo de alergia?"
                        value={formData.alergia}
                        onChange={(value) => updateField('alergia', value)}
                        options={YES_NO_OPTIONS}
                        error={errors.alergia}
                      />
                      
                      {formData.alergia === 'sim' && (
                        <div className="mt-4">
                          <FormInput
                            id="alergia_detalhes"
                            name="alergia_detalhes"
                            label="Se sim, qual?"
                            value={formData.alergia_detalhes}
                            onChange={(value) => updateField('alergia_detalhes', value)}
                            error={errors.alergia_detalhes}
                          />
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <FormRadio
                        id="gestando"
                        name="gestando"
                        label="Está gestando?"
                        value={formData.gestando}
                        onChange={(value) => updateField('gestando', value)}
                        options={YES_NO_OPTIONS}
                        error={errors.gestando}
                      />
                      
                      {formData.gestando === 'sim' && (
                        <div className="mt-4">
                          <FormInput
                            id="gestando_detalhes"
                            name="gestando_detalhes"
                            label="Se sim, quantos meses?"
                            value={formData.gestando_detalhes}
                            onChange={(value) => updateField('gestando_detalhes', value)}
                            error={errors.gestando_detalhes}
                          />
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <FormRadio
                        id="diabetes"
                        name="diabetes"
                        label="Tem diabetes?"
                        value={formData.diabetes}
                        onChange={(value) => updateField('diabetes', value)}
                        options={YES_NO_OPTIONS}
                        error={errors.diabetes}
                      />
                      
                      {formData.diabetes === 'sim' && (
                        <div className="mt-4">
                          <FormInput
                            id="diabetes_detalhes"
                            name="diabetes_detalhes"
                            label="Se sim, qual medicamento toma?"
                            value={formData.diabetes_detalhes}
                            onChange={(value) => updateField('diabetes_detalhes', value)}
                            error={errors.diabetes_detalhes}
                          />
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <FormRadio
                        id="hepatite"
                        name="hepatite"
                        label="Teve Hepatite?"
                        value={formData.hepatite}
                        onChange={(value) => updateField('hepatite', value)}
                        options={YES_NO_OPTIONS}
                        error={errors.hepatite}
                      />
                      
                      {formData.hepatite === 'sim' && (
                        <div className="mt-4">
                          <FormInput
                            id="hepatite_detalhes"
                            name="hepatite_detalhes"
                            label="Se sim, há quanto tempo?"
                            value={formData.hepatite_detalhes}
                            onChange={(value) => updateField('hepatite_detalhes', value)}
                            error={errors.hepatite_detalhes}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Página 3 - Anamnese Parte 2 */}
              {currentStep === 3 && (
                <>
                  <h2 className="text-xl font-semibold text-foreground mb-6">FICHA DE ANAMNESE</h2>
                  
                  <div className="space-y-6">
                    <FormRadio
                      id="muita_sede"
                      name="muita_sede"
                      label="Costuma sentir muita sede?"
                      value={formData.muita_sede}
                      onChange={(value) => updateField('muita_sede', value)}
                      options={YES_NO_OPTIONS}
                      error={errors.muita_sede}
                    />
                    
                    <div>
                      <FormRadio
                        id="problemas_cardiacos"
                        name="problemas_cardiacos"
                        label="Teve problemas cardíacos, circulatórios ou respiratórios?"
                        value={formData.problemas_cardiacos}
                        onChange={(value) => updateField('problemas_cardiacos', value)}
                        options={YES_NO_OPTIONS}
                        error={errors.problemas_cardiacos}
                      />
                      
                      {formData.problemas_cardiacos === 'sim' && (
                        <div className="mt-4">
                          <FormInput
                            id="problemas_cardiacos_detalhes"
                            name="problemas_cardiacos_detalhes"
                            label="Se sim, qual?"
                            value={formData.problemas_cardiacos_detalhes}
                            onChange={(value) => updateField('problemas_cardiacos_detalhes', value)}
                            error={errors.problemas_cardiacos_detalhes}
                          />
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <FormRadio
                        id="hiv_sifilis_chagas"
                        name="hiv_sifilis_chagas"
                        label="É portador de HIV, Sífilis ou Chagas?"
                        value={formData.hiv_sifilis_chagas}
                        onChange={(value) => updateField('hiv_sifilis_chagas', value)}
                        options={YES_NO_OPTIONS}
                        error={errors.hiv_sifilis_chagas}
                      />
                      
                      {formData.hiv_sifilis_chagas === 'sim' && (
                        <div className="mt-4">
                          <FormInput
                            id="hiv_sifilis_chagas_detalhes"
                            name="hiv_sifilis_chagas_detalhes"
                            label="Se sim, qual?"
                            value={formData.hiv_sifilis_chagas_detalhes}
                            onChange={(value) => updateField('hiv_sifilis_chagas_detalhes', value)}
                            error={errors.hiv_sifilis_chagas_detalhes}
                          />
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <FormRadio
                        id="drogas"
                        name="drogas"
                        label="Já usou drogas?"
                        value={formData.drogas}
                        onChange={(value) => updateField('drogas', value)}
                        options={YES_NO_OPTIONS}
                        error={errors.drogas}
                      />
                      
                      {formData.drogas === 'sim' && (
                        <div className="mt-4">
                          <FormInput
                            id="drogas_detalhes"
                            name="drogas_detalhes"
                            label="Se sim, quais?"
                            value={formData.drogas_detalhes}
                            onChange={(value) => updateField('drogas_detalhes', value)}
                            error={errors.drogas_detalhes}
                          />
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <FormRadio
                        id="fumante"
                        name="fumante"
                        label="É fumante?"
                        value={formData.fumante}
                        onChange={(value) => updateField('fumante', value)}
                        options={YES_NO_OPTIONS}
                        error={errors.fumante}
                      />
                      
                      {formData.fumante === 'sim' && (
                        <div className="mt-4">
                          <FormInput
                            id="fumante_detalhes"
                            name="fumante_detalhes"
                            label="Se sim, fuma há quanto tempo?"
                            value={formData.fumante_detalhes}
                            onChange={(value) => updateField('fumante_detalhes', value)}
                            error={errors.fumante_detalhes}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Página 4 - Anamnese Parte 3 */}
              {currentStep === 4 && (
                <>
                  <h2 className="text-xl font-semibold text-foreground mb-6">FICHA DE ANAMNESE</h2>
                  
                  <div className="space-y-6">
                    <FormRadio
                      id="pressao_arterial"
                      name="pressao_arterial"
                      label="Pressão arterial"
                      value={formData.pressao_arterial}
                      onChange={(value) => updateField('pressao_arterial', value)}
                      options={PRESSURE_OPTIONS}
                      error={errors.pressao_arterial}
                    />
                    
                    <div>
                      <FormRadio
                        id="controla_pressao"
                        name="controla_pressao"
                        label="Controla a pressão com medicamentos?"
                        value={formData.controla_pressao}
                        onChange={(value) => updateField('controla_pressao', value)}
                        options={YES_NO_OPTIONS}
                        error={errors.controla_pressao}
                      />
                      
                      {formData.controla_pressao === 'sim' && (
                        <div className="mt-4">
                          <FormInput
                            id="controla_pressao_detalhes"
                            name="controla_pressao_detalhes"
                            label="Se sim, quais?"
                            value={formData.controla_pressao_detalhes}
                            onChange={(value) => updateField('controla_pressao_detalhes', value)}
                            error={errors.controla_pressao_detalhes}
                          />
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <FormRadio
                        id="historico_familia"
                        name="historico_familia"
                        label="Há histórico de doenças na família?"
                        value={formData.historico_familia}
                        onChange={(value) => updateField('historico_familia', value)}
                        options={YES_NO_OPTIONS}
                        error={errors.historico_familia}
                      />
                      
                      {formData.historico_familia === 'sim' && (
                        <div className="mt-4">
                          <FormInput
                            id="historico_familia_detalhes"
                            name="historico_familia_detalhes"
                            label="Se sim, quais?"
                            value={formData.historico_familia_detalhes}
                            onChange={(value) => updateField('historico_familia_detalhes', value)}
                            error={errors.historico_familia_detalhes}
                          />
                        </div>
                      )}
                    </div>
                    
                    <FormRadio
                      id="sangramento"
                      name="sangramento"
                      label="Quando ocorre um sangramento, ele é"
                      value={formData.sangramento}
                      onChange={(value) => updateField('sangramento', value)}
                      options={BLEEDING_OPTIONS}
                      error={errors.sangramento}
                    />
                    
                    <div>
                      <FormRadio
                        id="cirurgia"
                        name="cirurgia"
                        label="Já passou por cirurgia?"
                        value={formData.cirurgia}
                        onChange={(value) => updateField('cirurgia', value)}
                        options={YES_NO_OPTIONS}
                        error={errors.cirurgia}
                      />
                      
                      {formData.cirurgia === 'sim' && (
                        <div className="mt-4">
                          <FormInput
                            id="cirurgia_detalhes"
                            name="cirurgia_detalhes"
                            label="Se sim, qual?"
                            value={formData.cirurgia_detalhes}
                            onChange={(value) => updateField('cirurgia_detalhes', value)}
                            error={errors.cirurgia_detalhes}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Página 5 - Anamnese Parte 4 */}
              {currentStep === 5 && (
                <>
                  <h2 className="text-xl font-semibold text-foreground mb-6">FICHA DE ANAMNESE</h2>
                  
                  <div className="space-y-6">
                    <FormRadio
                      id="sangra_dente"
                      name="sangra_dente"
                      label="Sangra muito quando extrai um dente?"
                      value={formData.sangra_dente}
                      onChange={(value) => updateField('sangra_dente', value)}
                      options={YES_NO_OPTIONS}
                      error={errors.sangra_dente}
                    />
                    
                    <FormRadio
                      id="dor_dentes"
                      name="dor_dentes"
                      label="Está com dor nos dentes ou gengiva?"
                      value={formData.dor_dentes}
                      onChange={(value) => updateField('dor_dentes', value)}
                      options={YES_NO_OPTIONS}
                      error={errors.dor_dentes}
                    />
                    
                    <FormRadio
                      id="gengiva_sangra"
                      name="gengiva_sangra"
                      label="A gengiva sangra com facilidade?"
                      value={formData.gengiva_sangra}
                      onChange={(value) => updateField('gengiva_sangra', value)}
                      options={YES_NO_OPTIONS}
                      error={errors.gengiva_sangra}
                    />
                    
                    <div>
                      <FormRadio
                        id="anestesia"
                        name="anestesia"
                        label="Já necessitou de anestesia em tratamento dentário?"
                        value={formData.anestesia}
                        onChange={(value) => updateField('anestesia', value)}
                        options={YES_NO_OPTIONS}
                        error={errors.anestesia}
                      />
                      
                      {formData.anestesia === 'sim' && (
                        <div className="mt-4">
                          <FormRadio
                            id="anestesia_mal_estar"
                            name="anestesia_mal_estar"
                            label="Se sim, teve mal estar?"
                            value={formData.anestesia_mal_estar}
                            onChange={(value) => updateField('anestesia_mal_estar', value)}
                            options={YES_NO_OPTIONS}
                            error={errors.anestesia_mal_estar}
                          />
                        </div>
                      )}
                    </div>
                    
                    <FormTextarea
                      id="satisfacao_dentes"
                      name="satisfacao_dentes"
                      label="Está satisfeito(a) com a aparência de seus dentes?"
                      value={formData.satisfacao_dentes}
                      onChange={(value) => updateField('satisfacao_dentes', value)}
                      placeholder="Descreva como se sente em relação aos seus dentes..."
                      error={errors.satisfacao_dentes}
                    />
                    
                    <FormTextarea
                      id="principal_queixa"
                      name="principal_queixa"
                      label="Qual sua principal queixa?"
                      value={formData.principal_queixa}
                      onChange={(value) => updateField('principal_queixa', value)}
                      placeholder="Descreva o que mais te incomoda ou te trouxe aqui..."
                      error={errors.principal_queixa}
                    />
                  </div>
                </>
              )}

              {/* Página 6 - Termos e LGPD */}
              {currentStep === 6 && (
                <>
                  <h2 className="text-xl font-semibold text-foreground mb-6">Termos e Consentimentos</h2>
                  
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <FormCheckbox
                        id="termo_responsabilidade"
                        name="termo_responsabilidade"
                        label="Declaro que todas as informações prestadas são verdadeiras e autorizo os procedimentos odontológicos necessários. Comprometo-me a atualizar dados de saúde sempre que houver mudanças."
                        checked={formData.termo_responsabilidade}
                        onChange={(checked) => updateField('termo_responsabilidade', checked)}
                        required
                        error={errors.termo_responsabilidade}
                      />
                      
                      <FormCheckbox
                        id="termo_consentimento"
                        name="termo_consentimento"
                        label="Declaro estar ciente dos procedimentos, riscos e alternativas, e autorizo a execução do tratamento proposto pelo profissional."
                        checked={formData.termo_consentimento}
                        onChange={(checked) => updateField('termo_consentimento', checked)}
                        required
                        error={errors.termo_consentimento}
                      />
                      
                      <FormCheckbox
                        id="termo_imagem"
                        name="termo_imagem"
                        label="Permito o uso de fotos intra/extra-bucais para fins científicos, acadêmicos e documentais, mantendo o anonimato do paciente."
                        checked={formData.termo_imagem}
                        onChange={(checked) => updateField('termo_imagem', checked)}
                        required
                        error={errors.termo_imagem}
                      />
                      
                      <FormCheckbox
                        id="termo_lgpd"
                        name="termo_lgpd"
                        label="Autorizo o uso dos meus dados pessoais conforme a Lei Geral de Proteção de Dados (LGPD), podendo revogar o consentimento a qualquer momento."
                        checked={formData.termo_lgpd}
                        onChange={(checked) => updateField('termo_lgpd', checked)}
                        required
                        error={errors.termo_lgpd}
                      />
                    </div>
                    
                    <div className="pt-4 border-t border-border space-y-4">
                      <h3 className="text-lg font-medium text-foreground">Assinatura Digital</h3>
                      
                      <FormInput
                        id="nome_responsavel"
                        name="nome_responsavel"
                        label="Nome do Responsável"
                        value={formData.nome_responsavel}
                        onChange={(value) => updateField('nome_responsavel', value)}
                        icon={User}
                        required
                        error={errors.nome_responsavel}
                      />
                      
                      <FormInput
                        id="nome_menor"
                        name="nome_menor"
                        label="Nome do Menor (se aplicável)"
                        value={formData.nome_menor}
                        onChange={(value) => updateField('nome_menor', value)}
                        icon={User}
                        error={errors.nome_menor}
                      />
                      
                      <FormInput
                        id="data_hoje"
                        name="data_hoje"
                        label="Data de Hoje"
                        value={formData.data_hoje}
                        onChange={(value) => updateField('data_hoje', value)}
                        type="date"
                        icon={Calendar}
                        required
                        error={errors.data_hoje}
                      />
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </Card>
      </div>

      {/* Errors Summary */}
      {Object.keys(errors).length > 0 && (
        <Alert className="mt-4" variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Por favor, corrija os campos destacados em vermelho antes de continuar.
          </AlertDescription>
        </Alert>
      )}

      {/* Navigation Buttons */}
      <div className="mt-8 pt-6 border-t border-border/30">
        <div className="flex gap-4 w-full">
          <Button
            onClick={prevStep}
            disabled={currentStep === 1}
            variant="outline"
            className="medical-button-secondary flex-1 min-w-0"
          >
            <ChevronLeft size={20} className="mr-2 flex-shrink-0" />
            <span className="truncate">Voltar</span>
          </Button>
          
          {currentStep < TOTAL_STEPS ? (
            <Button
              onClick={nextStep}
              className="medical-button-primary flex-1 min-w-0"
            >
              <span className="truncate">Próximo</span>
              <ChevronRight size={20} className="ml-2 flex-shrink-0" />
            </Button>
          ) : (
            <Button
              onClick={submitForm}
              disabled={isSubmitting}
              className="medical-button-primary flex-1 min-w-0"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="mr-2 flex-shrink-0 animate-spin" />
                  <span className="truncate">Enviando...</span>
                </>
              ) : (
                <>
                  <Send size={20} className="mr-2 flex-shrink-0" />
                  <span className="truncate">Finalizar</span>
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};