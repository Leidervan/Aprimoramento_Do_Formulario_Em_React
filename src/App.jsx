import { useState } from "react";
import './App.css';

export default function FormularioADS() {
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    cpf: "",
    landline: "",
    cellPhone: "",
    isMinor: false,
    fatherName: "",
    motherName: "",
    zipCode: "",
    address: "",
    number: "",
    addOn: "",
    city: "",
    state: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState("");

  // Function to format CEP: 99999-999
  const formatCep = (value) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length > 5) {
      return digits.slice(0, 5) + "-" + digits.slice(5, 8);
    }
    return digits;
  };

  // Function to format CPF: 999.999.999-99
  const formatCPF = (value) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length > 9) {
      return digits.slice(0, 3) + "." + digits.slice(3, 6) + "." + digits.slice(6, 9) + "-" + digits.slice(9, 11);
    }
    return digits;
  };

  const validateCPF = (cpf) => {
    cpf = cpf.replace(/\D/g, "");
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    const calcDigit = (factor) => {
      let sum = 0;
      for (let i = 0; i < factor - 1; i++) {
        sum += parseInt(cpf[i]) * (factor - i);
      }
      let digit = (sum * 10) % 11;
      return digit === 10 ? 0 : digit;
    };

    const firstDigit = calcDigit(10);
    const secondDigit = calcDigit(11);

    return firstDigit === parseInt(cpf[9]) && secondDigit === parseInt(cpf[10]);
  };

  // Function to format Landline: (99) 9999-9999
  const formatLandline = (value) => {
    const digits = value.replace(/\D/g, "");
    if (!digits) return "";
    let formatted = "(" + digits.slice(0, 2);
    if (digits.length >= 2) formatted += ") ";
    if (digits.length > 2) {
      if (digits.length > 6) {
        formatted += digits.slice(2, 6) + "-" + digits.slice(6, 10);
      } else {
        formatted += digits.slice(2, 6);
      }
    }
    return formatted;
  };

  // Function to format Cell Phone: (99) 99999-9999
  const formatCellPhone = (value) => {
    const digits = value.replace(/\D/g, "");
    if (!digits) return "";
    let formatted = "(" + digits.slice(0, 2);
    if (digits.length >= 2) formatted += ") ";
    if (digits.length > 2) {
      if (digits.length > 7) {
        formatted += digits.slice(2, 7) + "-" + digits.slice(7, 11);
      } else {
        formatted += digits.slice(2, 7);
      }
    }
    return formatted;
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    let newValue = value;
    if (id === "zipCode") {
      newValue = formatCep(value);
    } else if (id === "cpf") {
      newValue = formatCPF(value);
    } else if (id === "landline") {
      newValue = formatLandline(value);
    } else if (id === "cellPhone") {
      newValue = formatCellPhone(value);
    }

    setFormData(prev => ({
      ...prev,
      [id]: type === "checkbox" ? checked : newValue,
      isMinor:
        id === "dateOfBirth"
          ? new Date().getFullYear() - new Date(value).getFullYear() < 18
          : prev.isMinor
    }));
  };

  const fetchAddress = async () => {
 const cep = formData.zipCode.replace(/\D/g, '');
    if (cep.length !== 8) {
      setCepError("CEP inválido!");
      return;
    }
    setCepLoading(true);
    setCepError("");
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      if (data.erro) {
        setCepError("CEP não encontrado!");
      } else {
        setFormData(prev => ({
          ...prev,
          address: data.logradouro || "",
          city: data.localidade || "",
          state: data.uf || ""
        }));
      }
    } catch (error) {
      setCepError("Erro ao buscar o CEP.");
    } finally {
      setCepLoading(false);
    }
  };

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  
  const validatePhone = (phone) =>
    /\d{10,11}/.test(phone.replace(/\D/g, ""));
  
  const validateCEP = (cep) => 
    /\d{8}/.test(cep.replace(/\D/g, ""));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateEmail(formData.email)) return alert("E-mail inválido!");
    if (!validateCPF(formData.cpf)) return alert("CPF inválido!");
    if (!validatePhone(formData.landline))
      return alert("Telefone fixo inválido!");
    if (!validatePhone(formData.cellPhone))
      return alert("Celular inválido!");
    if (formData.password !== formData.confirmPassword)
      return alert("Senhas não coincidem!");
    if (formData.isMinor && !validateCEP(formData.zipCode))
      return alert("CEP inválido!");

    console.log("Dados do Formulário:", formData);
    alert("Formulário enviado com sucesso!");
  };

  return (
    <div className="container">
      <h1>FORMULÁRIO ACADÊMICO ADS</h1>
      <form onSubmit={handleSubmit}>
        <section>
          <h2>Informações Pessoais</h2>
          <div className="form-group">
            <label htmlFor="fullName">Nome Completo:</label>
            <input
              type="text"
              id="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="dateOfBirth">Data de Nascimento:</label>
            <input
              type="date"
              id="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="cpf">CPF:</label>
            <input
              type="text"
              id="cpf"
              value={formData.cpf}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="landline">Telefone Fixo:</label>
            <input
              type="text"
              id="landline"
              value={formData.landline}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="cellPhone">Número de Celular:</label>
            <input
              type="text"
              id="cellPhone"
              value={formData.cellPhone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="isMinor">Menor de 18 anos?</label>
            <input
              type="checkbox"
              id="isMinor"
              checked={formData.isMinor}
              onChange={handleChange}
            />
          </div>
        </section>

        {formData.isMinor && (
          <section>
            <h2>Informações Adicionais (Para Menores de 18)</h2>
            <div className="form-group">
              <label htmlFor="fatherName">Nome do Pai:</label>
              <input
                type="text"
                id="fatherName"
                value={formData.fatherName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="motherName">Nome da Mãe:</label>
              <input
                type="text"
                id="motherName"
                value={formData.motherName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form -group">
              <label htmlFor="zipCode">CEP:</label>
              <input
                type="text"
                id="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                onBlur={fetchAddress}
                required
              />
              {cepLoading && <p>Carregando...</p>}
              {cepError && <p className="error">{cepError}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="address">Endereço:</label>
              <input
                type="text"
                id="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="number">Número:</label>
              <input
                type="text"
                id="number"
                value={formData.number}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="addOn">Complemento:</label>
              <input
                type="text"
                id="addOn"
                value={formData.addOn}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="city">Cidade:</label>
              <input
                type="text"
                id="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="state">Estado:</label>
              <input
                type="text"
                id="state"
                value={formData.state}
                onChange={handleChange}
                required
              />
            </div>
          </section>
        )}

        <section>
          <h2>Informações da Conta</h2>
          <div className="form-group">
            <label htmlFor="email">E-mail:</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Senha:</label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmação de Senha:</label>
            <input
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
        </section>

        <button type="submit" className="submit-button">
          Finalizar
        </button>
      </form>
    </div>
  );
}