import styled from 'styled-components'
import { Link } from 'react-router-dom'

const Page = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 248px minmax(0, 1fr);
  background: var(--bg, #f5f7fb);
  color: #17213b;

  * {
    box-sizing: border-box;
  }

  @media (max-width: 760px) {
    grid-template-columns: minmax(0, 1fr);
  }
`

const Sidebar = styled.aside`
  min-height: 100vh;
  padding: 26px 16px;
  background: #14264d;
  color: #fff;
  display: flex;
  flex-direction: column;

  @media (max-width: 760px) {
    min-height: 0;
    padding: 14px 14px 12px;
  }
`

const Brand = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 48px;
  margin: 0 8px 34px;
  color: #fff;
  text-decoration: none;
  font-size: 18px;
  letter-spacing: -0.4px;

  strong {
    font-weight: 750;
  }

  @media (max-width: 760px) {
    margin: 0 4px 16px;
  }
`

const BrandLogo = styled.img`
  width: 39px;
  height: 39px;
  flex: 0 0 auto;
  object-fit: contain;
  border-radius: 10px;
  background: #fff;
  padding: 3px;
`

const SidebarCaption = styled.p`
  margin: 0 10px 12px;
  color: #aebde1;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.4px;

  @media (max-width: 760px) {
    margin-bottom: 8px;
  }
`

const Navigation = styled.nav`
  display: grid;
  gap: 6px;

  @media (max-width: 760px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 6px;
  }

  @media (max-width: 430px) {
    grid-template-columns: minmax(0, 1fr);
  }
`

const NavigationButton = styled.button`
  display: flex;
  align-items: center;
  gap: 11px;
  width: 100%;
  min-height: 46px;
  padding: 10px 12px;
  border: 1px solid ${({ $active }) => ($active ? '#6b72ff' : 'transparent')};
  border-radius: 11px;
  background: ${({ $active }) => ($active ? '#5b5cf0' : 'transparent')};
  color: ${({ $active }) => ($active ? '#fff' : '#d6def3')};
  font-size: 13px;
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  text-align: left;
  cursor: pointer;
  transition: background 160ms ease, border-color 160ms ease;

  &:hover {
    background: ${({ $active }) => ($active ? '#5b5cf0' : '#203966')};
  }

  &:focus-visible {
    outline: 2px solid #b8bbff;
    outline-offset: 2px;
  }
`

const NavigationMark = styled.span`
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  flex: 0 0 auto;
  border-radius: 9px;
  background: ${({ $tone }) => $tone || '#eef0ff'};
  color: #26314a;
  font-size: 16px;
`

const Main = styled.main`
  min-width: 0;
  padding: 28px clamp(16px, 3vw, 42px) 48px;

  @media (max-width: 760px) {
    padding-top: 20px;
  }
`

const Topbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  padding-bottom: 22px;
  margin-bottom: 30px;
  border-bottom: 1px solid #e7eaf3;
`

const BackLink = styled(Link)`
  color: #68728a;
  font-size: 12px;
  text-decoration: none;

  &:hover {
    color: var(--primary, #5b5cf0);
  }
`

const TopbarRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 10px;
`

const RoleSelect = styled.select`
  max-width: 100%;
  min-height: 34px;
  padding: 7px 10px;
  border: 1px solid #dfe4f0;
  border-radius: 9px;
  background: #fff;
  color: #24304a;
  font: inherit;
  font-size: 12px;
`

const PageIntro = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 18px;
  flex-wrap: wrap;
  margin-bottom: 24px;
`

const IntroText = styled.div`
  min-width: 0;
`

const Eyebrow = styled.p`
  margin: 0 0 9px;
  color: var(--primary, #5b5cf0);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.35px;
`

const PageTitle = styled.h1`
  margin: 0 0 9px;
  color: #17213b;
  font-size: clamp(25px, 3vw, 34px);
  font-weight: 750;
  line-height: 1.2;
  letter-spacing: -0.8px;
`

const PageDescription = styled.p`
  max-width: 690px;
  margin: 0;
  color: #727d94;
  font-size: 13px;
  line-height: 1.7;
`

export { Page, Sidebar, Brand, BrandLogo, SidebarCaption, Navigation, NavigationButton, NavigationMark, Main, Topbar, BackLink, TopbarRight, RoleSelect, PageIntro, IntroText, Eyebrow, PageTitle, PageDescription }
