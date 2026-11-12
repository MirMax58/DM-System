import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext.jsx'
import logo from '../../assets/DM-System_cube_logo_transparent.png'
import './AuthPage.css'

function getErrorMessage(error) {
  return error?.graphQLErrors?.[0]?.message || error?.message || 'Не вдалося виконати операцію. Спробуй ще раз.'
}

export default function AuthPage({ mode = 'login' }) {
  const isLogin = mode === 'login'
  const navigate = useNavigate()
  const { login, registerCompany, joinCompany } = useAuth()
  const [step, setStep] = useState(isLogin ? 'form' : 'choice')
  const [registrationType, setRegistrationType] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', password: '', companyName: '', invitationCode: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function updateField(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  function chooseRegistration(type) {
    setRegistrationType(type)
    setError('')
    setStep('form')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      if (isLogin) {
        await login({ email: form.email, password: form.password })
      } else if (registrationType === 'create') {
        await registerCompany({
          name: form.name,
          email: form.email,
          password: form.password,
          companyName: form.companyName,
        })
      } else {
        await joinCompany({
          name: form.name,
          email: form.email,
          password: form.password,
          invitationCode: form.invitationCode,
        })
      }
      navigate('/workspace', { replace: true })
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-shell">
        <Link className="auth-back-home" to="/">← На головну</Link>
        <div className="auth-card">
          <div className="auth-brand">
            <img src={logo} alt="DM-System" />
            <h1>DM-System</h1>
            <p>Платформа для дропшипінгу та управління замовленнями</p>
          </div>

          {isLogin ? (
            <>
              <div className="auth-heading">
                <h2>Вхід до системи</h2>
                <p>Увійди до робочого простору своєї компанії.</p>
              </div>
              <form className="auth-form" onSubmit={handleSubmit}>
                <label>
                  Електронна пошта
                  <input name="email" type="email" autoComplete="email" value={form.email} onChange={updateField} placeholder="name@example.com" required />
                </label>
                <label>
                  Пароль
                  <input name="password" type="password" autoComplete="current-password" value={form.password} onChange={updateField} placeholder="Введи пароль" required />
                </label>
                {error && <div className="auth-error" role="alert">{error}</div>}
                <button className="auth-primary" type="submit" disabled={submitting}>{submitting ? 'Вхід…' : 'Увійти'}</button>
              </form>
              <p className="auth-switch">Ще немає облікового запису? <Link to="/register">Зареєструватися</Link></p>
            </>
          ) : (
            <>
              <div className="auth-heading">
                <h2>{step === 'choice' ? 'Як ви хочете розпочати роботу?' : registrationType === 'create' ? 'Створення компанії' : 'Приєднання до компанії'}</h2>
                <p>{step === 'choice' ? 'Оберіть сценарій реєстрації в DM-System.' : 'Заповни дані для створення облікового запису.'}</p>
              </div>

              {step === 'choice' ? (
                <div className="auth-choices">
                  <button className="auth-choice" type="button" onClick={() => chooseRegistration('create')}>
                    <span className="auth-choice-icon">▦</span>
                    <span><strong>Створити власну компанію</strong><small>Зареєструвати компанію та отримати права адміністратора.</small></span>
                    <b>›</b>
                  </button>
                  <button className="auth-choice" type="button" onClick={() => chooseRegistration('join')}>
                    <span className="auth-choice-icon">♧</span>
                    <span><strong>Приєднатися до компанії</strong><small>Використати запрошення від адміністратора компанії.</small></span>
                    <b>›</b>
                  </button>
                </div>
              ) : (
                <>
                  <button className="auth-step-back" type="button" onClick={() => { setStep('choice'); setError('') }}>← Назад до вибору</button>
                  <form className="auth-form" onSubmit={handleSubmit}>
                    <label>
                      Ім’я та прізвище
                      <input name="name" type="text" autoComplete="name" value={form.name} onChange={updateField} placeholder="Твоє ім’я" minLength="2" maxLength="80" required />
                    </label>
                    <label>
                      Електронна пошта
                      <input name="email" type="email" autoComplete="email" value={form.email} onChange={updateField} placeholder="name@example.com" required />
                    </label>
                    <label>
                      Пароль
                      <input name="password" type="password" autoComplete="new-password" value={form.password} onChange={updateField} placeholder="Мінімум 8 символів" minLength="8" required />
                    </label>
                    {registrationType === 'create' ? (
                      <label>
                        Назва компанії
                        <input name="companyName" type="text" value={form.companyName} onChange={updateField} placeholder="Наприклад, My Company" minLength="2" maxLength="100" required />
                      </label>
                    ) : (
                      <label>
                        Код запрошення
                        <input name="invitationCode" type="text" value={form.invitationCode} onChange={updateField} placeholder="XXXXX-XXXXX" autoCapitalize="characters" required />
                      </label>
                    )}
                    {error && <div className="auth-error" role="alert">{error}</div>}
                    <button className="auth-primary" type="submit" disabled={submitting}>{submitting ? 'Створення облікового запису…' : registrationType === 'create' ? 'Створити компанію' : 'Приєднатися до компанії'}</button>
                  </form>
                </>
              )}
              <p className="auth-switch">Вже маєш обліковий запис? <Link to="/login">Увійти</Link></p>
            </>
          )}
        </div>
        <p className="auth-footer">DM-System · Робочий простір для дропшипінгу</p>
      </section>
    </main>
  )
}
