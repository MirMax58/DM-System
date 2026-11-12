import styled from 'styled-components'

const RoleBadge = styled.span`
  display: inline-flex;
  padding: 6px 9px;
  border-radius: 999px;
  background: ${({ $role }) => $role === 'ADMIN' ? '#efefff' : $role === 'INACTIVE' ? '#fff0f0' : '#e8f7ef'};
  color: ${({ $role }) => $role === 'ADMIN' ? '#5655c8' : $role === 'INACTIVE' ? '#b53b4d' : '#24794d'};
  font-size: 10px;
  font-weight: 750;
`

const UserNameCell = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  > span:first-child { display: grid; place-items: center; width: 35px; height: 35px; border-radius: 11px; background: #f0eaff; font-size: 17px; }
  strong { display: block; color: #28334d; font-size: 12px; }
  small { display: block; margin-top: 4px; color: #8992a5; font-size: 10px; }
`

export { RoleBadge, UserNameCell }
