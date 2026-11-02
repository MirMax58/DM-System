import styled from 'styled-components'

const Section = styled.section`
  min-width: 0;
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 24px;

  @media (max-width: 1050px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 430px) {
    grid-template-columns: minmax(0, 1fr);
  }
`

const StatCard = styled.div`
  min-width: 0;
  padding: 19px 18px;
  border: 1px solid #e7eaf2;
  border-radius: 15px;
  background: #fff;
  box-shadow: 0 5px 18px rgba(22, 37, 77, 0.025);
`

const StatTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-bottom: 17px;
`

const StatLabel = styled.p`
  margin: 0;
  color: #737e94;
  font-size: 11px;
  line-height: 1.4;
`

const StatIcon = styled.span`
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  flex: 0 0 auto;
  border-radius: 11px;
  background: ${({ $tone }) => $tone || '#efefff'};
  font-size: 17px;
`

const StatValue = styled.p`
  margin: 0;
  color: #17213b;
  font-size: clamp(22px, 2.5vw, 29px);
  font-weight: 750;
  letter-spacing: -0.6px;
`

const Panel = styled.div`
  min-width: 0;
  border: 1px solid #e7eaf2;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 5px 18px rgba(22, 37, 77, 0.025);
`

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  padding: 20px 22px;
  border-bottom: 1px solid #edf0f6;
`

const PanelTitle = styled.h2`
  margin: 0;
  color: #202b45;
  font-size: 15px;
  font-weight: 750;
`

const PanelSubtitle = styled.p`
  margin: 5px 0 0;
  color: #7b859a;
  font-size: 11px;
  line-height: 1.6;
`

const PrimaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 39px;
  padding: 10px 14px;
  border: 1px solid var(--primary, #5b5cf0);
  border-radius: 10px;
  background: var(--primary, #5b5cf0);
  color: #fff;
  font: inherit;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: background 160ms ease, transform 160ms ease;

  &:hover {
    background: var(--primary-hover, #4647d9);
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 2px solid #b8bbff;
    outline-offset: 2px;
  }
`

const SecondaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  min-height: 36px;
  padding: 8px 12px;
  border: 1px solid #dfe4f0;
  border-radius: 9px;
  background: #fff;
  color: #45516b;
  font: inherit;
  font-size: 11px;
  font-weight: 650;
  cursor: pointer;

  &:hover {
    border-color: #c4c8ff;
    background: #f7f7ff;
  }
`

const DangerButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 32px;
  padding: 6px 9px;
  border: 1px solid #f6d8dc;
  border-radius: 8px;
  background: #fff7f8;
  color: #c83e55;
  font: inherit;
  font-size: 11px;
  font-weight: 650;
  cursor: pointer;

  &:hover {
    background: #ffecef;
    border-color: #efb9c2;
  }
`

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  padding: 16px 18px;
  border-bottom: 1px solid #edf0f6;
`

const SearchWrap = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1 1 240px;
  min-height: 40px;
  padding: 0 12px;
  border: 1px solid #e0e5f0;
  border-radius: 10px;
  background: #fff;
  color: #7c879c;

  &:focus-within {
    border-color: #a9abff;
    box-shadow: 0 0 0 3px rgba(91, 92, 240, 0.08);
  }
`

const SearchInput = styled.input`
  width: 100%;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  color: #24304a;
  font: inherit;
  font-size: 12px;

  &::placeholder {
    color: #9aa3b5;
  }
`

const FilterSelect = styled.select`
  min-height: 40px;
  max-width: 100%;
  padding: 0 12px;
  border: 1px solid #e0e5f0;
  border-radius: 10px;
  background: #fff;
  color: #4b5770;
  font: inherit;
  font-size: 12px;
`

const TableScroll = styled.div`
  width: 100%;
  overflow-x: auto;
`

const ProductTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  white-space: nowrap;

  th {
    padding: 13px 16px;
    background: #fafbfe;
    color: #7e899e;
    font-size: 10px;
    font-weight: 750;
    letter-spacing: 0.55px;
    text-align: left;
    text-transform: uppercase;
  }

  td {
    padding: 14px 16px;
    border-top: 1px solid #edf0f6;
    color: #46516a;
    font-size: 12px;
    vertical-align: middle;
  }

  tbody tr:hover {
    background: #fcfcff;
  }
`

const ActionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
`

const FormPanel = styled.div`
  margin: 16px 18px 0;
  padding: 20px;
  border: 1px solid #dfe2ff;
  border-radius: 14px;
  background: #fbfbff;

  @media (max-width: 650px) {
    margin: 12px;
    padding: 15px;
  }
`

const FormHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
`

const FormTitle = styled.h3`
  margin: 0;
  color: #26314a;
  font-size: 14px;
`

const FormHint = styled.p`
  margin: 6px 0 0;
  color: #78839a;
  font-size: 11px;
  line-height: 1.6;
`

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: 600px) {
    grid-template-columns: minmax(0, 1fr);
  }
`

const Field = styled.div`
  min-width: 0;
  display: grid;
  gap: 7px;
`

const FullWidthField = styled(Field)`
  grid-column: 1 / -1;
`

const FieldLabel = styled.label`
  color: #515d76;
  font-size: 11px;
  font-weight: 700;
`

const TextInput = styled.input`
  width: 100%;
  min-height: 41px;
  padding: 10px 12px;
  border: 1px solid #dfe4f0;
  border-radius: 9px;
  background: #fff;
  color: #25304a;
  font: inherit;
  font-size: 12px;

  &:focus {
    outline: none;
    border-color: #a4a6ff;
    box-shadow: 0 0 0 3px rgba(91, 92, 240, 0.08);
  }
`

const TextArea = styled.textarea`
  width: 100%;
  min-height: 78px;
  padding: 10px 12px;
  resize: vertical;
  border: 1px solid #dfe4f0;
  border-radius: 9px;
  background: #fff;
  color: #25304a;
  font: inherit;
  font-size: 12px;

  &:focus {
    outline: none;
    border-color: #a4a6ff;
    box-shadow: 0 0 0 3px rgba(91, 92, 240, 0.08);
  }
`

const FormActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 9px;
  margin-top: 17px;
`

const Feedback = styled.p`
  margin: 16px 18px 0;
  padding: 11px 13px;
  border: 1px solid ${({ $type }) => ($type === 'error' ? '#f4cbd1' : '#cdeedb')};
  border-radius: 10px;
  background: ${({ $type }) => ($type === 'error' ? '#fff5f6' : '#f0fbf5')};
  color: ${({ $type }) => ($type === 'error' ? '#b82f49' : '#207c4e')};
  font-size: 12px;
  line-height: 1.6;
`

const EmptyState = styled.div`
  display: grid;
  justify-items: center;
  gap: 9px;
  padding: 44px 20px;
  text-align: center;

  strong {
    color: #3d4962;
    font-size: 14px;
  }

  p {
    max-width: 360px;
    margin: 0;
    color: #7f899d;
    font-size: 12px;
    line-height: 1.7;
  }
`

const EmptySymbol = styled.span`
  display: grid;
  place-items: center;
  width: 47px;
  height: 47px;
  border-radius: 15px;
  background: #f0f1ff;
  color: var(--primary, #5b5cf0);
  font-size: 23px;
`

export { Section, StatsGrid, StatCard, StatTop, StatLabel, StatIcon, StatValue, Panel, PanelHeader, PanelTitle, PanelSubtitle, PrimaryButton, SecondaryButton, DangerButton, Toolbar, SearchWrap, SearchInput, FilterSelect, TableScroll, ProductTable, ActionGroup, FormPanel, FormHeader, FormTitle, FormHint, FormGrid, Field, FullWidthField, FieldLabel, TextInput, TextArea, FormActions, Feedback, EmptyState, EmptySymbol }
