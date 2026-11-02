import cubeLogo from '../../../assets/DM-System_cube_logo_transparent.png'
import {
  Brand,
  BrandLogo,
  Navigation,
  NavigationButton,
  NavigationMark,
  Sidebar,
  SidebarCaption,
} from '../styles/layout.styles.js'

export default function WorkspaceSidebar({
  items,
  activeSection,
  onSectionChange,
}) {
  return (
    <Sidebar>
      <Brand to="/" aria-label="DM System — на головну">
        <BrandLogo src={cubeLogo} alt="" />
        <span>
          DM <strong>System</strong>
        </span>
      </Brand>

      <SidebarCaption>РОБОЧИЙ ПРОСТІР</SidebarCaption>

      <Navigation aria-label="Навігація робочого простору">
        {items.map((item) => (
          <NavigationButton
            key={item.id}
            type="button"
            $active={activeSection === item.id}
            onClick={() => onSectionChange(item.id)}
          >
            <NavigationMark $active={activeSection === item.id} $tone={item.tone}>
              {item.icon}
            </NavigationMark>
            {item.label}
          </NavigationButton>
        ))}
      </Navigation>
    </Sidebar>
  )
}
