import { useState } from 'react'
import logo from '../../assets/DM-System_cube_logo_transparent.png'
import './Header.css'

function Header() {
    const [menuOpen, setMenuOpen] = useState(false)

    const closeMenu = () => {
        setMenuOpen(false)
    }

    return (
        <header className="header">
            <div className="header-container">

                <a
                    className="brand"
                    href="#top"
                    onClick={closeMenu}
                >
                    <img
                        className="brand-logo"
                        src={logo}
                        alt="DM System"
                    />

                    <span className="brand-text">
                        DM <strong>System</strong>
                    </span>
                </a>

                <nav className="nav">
                    <a href="#about">Про систему</a>
                    <a href="#features">Можливості</a>
                    <a href="#workflow">Як працює</a>
                    <a href="#roles">Ролі</a>
                </nav>

                <a className="login-button" href="#cta">
                    Увійти
                </a>

                <button
                    type="button"
                    className={`menu-button ${menuOpen ? 'active' : ''}`}
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Відкрити меню"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

            </div>

            <nav className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
                <a href="#about" onClick={closeMenu}>Про систему</a>
                <a href="#features" onClick={closeMenu}>Можливості</a>
                <a href="#workflow" onClick={closeMenu}>Як працює</a>
                <a href="#roles" onClick={closeMenu}>Ролі</a>

                <a
                    className="mobile-login"
                    href="#cta"
                    onClick={closeMenu}
                >
                    Увійти до системи
                </a>
            </nav>
        </header>
    )
}

export default Header