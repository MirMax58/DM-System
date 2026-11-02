import styled from 'styled-components'
import { ORDER_STATUSES } from '../constants/workspace.constants.js'

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 10px;
  border-radius: 999px;
  background: ${({ $status }) => ORDER_STATUSES[$status]?.background || '#f0f1f5'};
  color: ${({ $status }) => ORDER_STATUSES[$status]?.color || '#4b5563'};
  font-size: 11px;
  font-weight: 750;
  white-space: nowrap;
`

const OrderMeta = styled.div`
  display: grid;
  gap: 5px;
  min-width: 0;

  strong {
    color: #28334d;
    font-size: 12px;
  }

  span {
    color: #858fa3;
    font-size: 10px;
    line-height: 1.5;
  }
`

const InlineTotal = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 15px;
  padding: 13px 15px;
  border-radius: 11px;
  background: #f0f1ff;
  color: #4d50bd;

  span {
    font-size: 12px;
    font-weight: 650;
  }

  strong {
    font-size: 18px;
    font-weight: 800;
  }
`

const StatusSelect = styled.select`
  min-height: 34px;
  max-width: 160px;
  padding: 6px 9px;
  border: 1px solid #dfe4f0;
  border-radius: 9px;
  background: #fff;
  color: #47516b;
  font: inherit;
  font-size: 11px;
`

export { StatusBadge, OrderMeta, InlineTotal, StatusSelect }
