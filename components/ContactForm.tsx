"use client";

import { FormEvent, useState } from "react";
import { ContactPayload, submitContact } from "../lib/contact";

type FieldName = keyof ContactPayload;
type FormErrors = Partial<Record<FieldName, string>>;

const initialForm: ContactPayload = {
  name: "",
  phone: "",
  email: "",
  message: "",
};

function validateField(name: FieldName, value: string) {
  const cleanValue = value.trim();

  if (name === "name" && cleanValue.length < 2) return "Informe seu nome.";
  if (name === "phone" && value.replace(/\D/g, "").length < 10)
    return "Informe um WhatsApp válido com DDD.";
  if (name === "email" && cleanValue && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanValue))
    return "Informe um e-mail válido.";
  if (name === "message" && cleanValue.length < 10)
    return "Conte um pouco mais sobre o serviço desejado.";

  return "";
}

function validateForm(form: ContactPayload) {
  return (Object.keys(form) as FieldName[]).reduce<FormErrors>((errors, field) => {
    const error = validateField(field, form[field] ?? "");
    if (error) errors[field] = error;
    return errors;
  }, {});
}

export function ContactForm() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success">("idle");
  const [successMessage, setSuccessMessage] = useState("");

  const updateField = (field: FieldName, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (touched[field]) {
      setErrors((current) => ({ ...current, [field]: validateField(field, value) }));
    }
    if (status === "success") setStatus("idle");
  };

  const touchField = (field: FieldName) => {
    setTouched((current) => ({ ...current, [field]: true }));
    setErrors((current) => ({ ...current, [field]: validateField(field, form[field] ?? "") }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateForm(form);
    setTouched({ name: true, phone: true, email: true, message: true });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setStatus("sending");
    try {
      const result = await submitContact(form);
      setSuccessMessage(result.message);
      setStatus("success");
      setForm(initialForm);
      setTouched({});
    } catch {
      setStatus("idle");
      setSuccessMessage("");
      setErrors({ message: "Não foi possível enviar agora. Tente novamente pelo WhatsApp." });
    }
  };

  const fieldProps = (field: FieldName) => ({
    value: form[field] ?? "",
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      updateField(field, event.target.value),
    onBlur: () => touchField(field),
    "aria-invalid": Boolean(errors[field]),
    "aria-describedby": errors[field] ? `${field}-error` : undefined,
  });

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="form-row">
        <div className="form-field">
          <label htmlFor="name">Nome <span>*</span></label>
          <input id="name" name="name" autoComplete="name" placeholder="Como podemos chamar você?" {...fieldProps("name")} />
          {errors.name && <small id="name-error" className="field-error">{errors.name}</small>}
        </div>
        <div className="form-field">
          <label htmlFor="phone">Telefone / WhatsApp <span>*</span></label>
          <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="(48) 99999-9999" {...fieldProps("phone")} />
          {errors.phone && <small id="phone-error" className="field-error">{errors.phone}</small>}
        </div>
      </div>
      <div className="form-field">
        <label htmlFor="email">E-mail <small>opcional</small></label>
        <input id="email" name="email" type="email" autoComplete="email" placeholder="voce@exemplo.com" {...fieldProps("email")} />
        {errors.email && <small id="email-error" className="field-error">{errors.email}</small>}
      </div>
      <div className="form-field">
        <label htmlFor="message">Mensagem <span>*</span></label>
        <textarea id="message" name="message" rows={5} placeholder="Conte sobre seu projeto, medidas e o serviço que precisa." {...fieldProps("message")} />
        {errors.message && <small id="message-error" className="field-error">{errors.message}</small>}
      </div>
      <button className="button contact-submit" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Enviando..." : "Enviar solicitação"}
        <span aria-hidden="true">{status === "sending" ? "···" : "↗"}</span>
      </button>
      <div className="form-status" aria-live="polite">
        {status === "success" && <p className="success-message"><span>✓</span>{successMessage}</p>}
      </div>
    </form>
  );
}
