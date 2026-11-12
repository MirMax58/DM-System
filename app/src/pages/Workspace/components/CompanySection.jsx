import styled from 'styled-components'
import { Feedback, Field, FieldLabel, Panel, PrimaryButton, Section, TextInput } from '../styles/common.styles.js'

const CompanyLayout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(240px, .8fr);
  gap: 18px;
  @media (max-width: 760px) { grid-template-columns: 1fr; }
`
const CompanyMeta = styled.div`
  display: grid;
  gap: 14px;
  padding: 20px;
  border: 1px solid #e8edf5;
  border-radius: 14px;
  background: #fbfcff;
`
const MetaItem = styled.div`
  display: grid;
  gap: 4px;
  span { color: #8792a6; font-size: 11px; }
  strong { color: #26324b; font-size: 13px; overflow-wrap: anywhere; }
`

export default function CompanySection({ company, companyName, setCompanyName, handleCompanySubmit, savingCompany, feedback }) {
  return (
    <Section>
      <CompanyLayout>
        <Panel style={{ padding: 22 }}>
          <h2 style={{ margin: '0 0 8px', fontSize: 17, color: '#25314a' }}>Профіль компанії</h2>
          <p style={{ margin: '0 0 22px', color: '#7c879b', fontSize: 12, lineHeight: 1.6 }}>Ці дані використовуються для ідентифікації вашого робочого простору.</p>
          {feedback && <Feedback $type={feedback.type} role="status">{feedback.text}</Feedback>}
          <form onSubmit={handleCompanySubmit} style={{ display: 'grid', gap: 15 }}>
            <Field>
              <FieldLabel htmlFor="company-name">Назва компанії</FieldLabel>
              <TextInput id="company-name" value={companyName} onChange={(event) => setCompanyName(event.target.value)} minLength="2" maxLength="100" required />
            </Field>
            <PrimaryButton type="submit" disabled={savingCompany}>{savingCompany ? 'Збереження…' : 'Зберегти зміни'}</PrimaryButton>
          </form>
        </Panel>
        <CompanyMeta>
          <MetaItem><span>Ідентифікатор компанії</span><strong>{company?.id || '—'}</strong></MetaItem>
          <MetaItem><span>Дата створення</span><strong>{company?.createdAt ? new Date(company.createdAt).toLocaleDateString('uk-UA') : '—'}</strong></MetaItem>
          <MetaItem><span>Власник робочого простору</span><strong>{company?.ownerName || '—'}</strong></MetaItem>
        </CompanyMeta>
      </CompanyLayout>
    </Section>
  )
}
