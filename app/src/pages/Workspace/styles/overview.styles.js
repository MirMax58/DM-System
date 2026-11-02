import styled from 'styled-components'

const QuickActions = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
`

const SimpleRows = styled.div`
  padding: 3px 20px 8px;
`

const SimpleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 13px 0;
  border-bottom: 1px solid #edf0f6;

  &:last-child {
    border-bottom: none;
  }
`

const SimpleRowText = styled.div`
  min-width: 0;

  strong {
    display: block;
    overflow: hidden;
    color: #34405a;
    font-size: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  span {
    display: block;
    margin-top: 4px;
    color: #8a94a7;
    font-size: 10px;
  }
`

export { QuickActions, SimpleRows, SimpleRow, SimpleRowText }
