import { useState } from 'react'
import './Hero.css'

function Hero() {
    const [activePreview, setActivePreview] = useState('overview')

    return (
        <section className="hero" id="top">
            <div className="hero-container">

                <div className="hero-content">

                    <div className="hero-badge">
                        Робочий простір для дропшипінгу
                    </div>

                    <h1>
                        Керуйте дропшипінгом
                        <span> в одній системі.</span>
                    </h1>

                    <p className="hero-description">
                        DM System об'єднує роботу з товарами,
                        замовленнями та користувачами в одному
                        зрозумілому робочому просторі.
                    </p>

                    <div className="hero-actions">

                        <a
                            className="primary-button"
                            href="#features"
                        >
                            Переглянути можливості
                        </a>

                        <a
                            className="secondary-button"
                            href="#workflow"
                        >
                            Як це працює
                        </a>

                    </div>

                    <div className="hero-note">
                        Для адміністраторів і дропшиперів
                    </div>

                </div>


                <div className="hero-visual">

                    <div className="system-window">

                        <aside className="system-sidebar">

                            <div className="mini-logo">
                                DM
                            </div>

                            <div className="sidebar-items">

                                <button
                                    type="button"
                                    className={
                                        activePreview === 'overview'
                                            ? 'active'
                                            : ''
                                    }
                                    onClick={() =>
                                        setActivePreview('overview')
                                    }
                                    title="Огляд"
                                >
                                    Р
                                </button>

                                <button
                                    type="button"
                                    className={
                                        activePreview === 'products'
                                            ? 'active'
                                            : ''
                                    }
                                    onClick={() =>
                                        setActivePreview('products')
                                    }
                                    title="Товари"
                                >
                                    Т
                                </button>

                                <button
                                    type="button"
                                    className={
                                        activePreview === 'orders'
                                            ? 'active'
                                            : ''
                                    }
                                    onClick={() =>
                                        setActivePreview('orders')
                                    }
                                    title="Замовлення"
                                >
                                    З
                                </button>

                            </div>

                        </aside>


                        <div className="system-content">

                            <div className="system-top">

                                <div>
                                    <small>DM System</small>

                                    <h3>
                                        {activePreview === 'overview' &&
                                            'Робочий простір'}

                                        {activePreview === 'products' &&
                                            'Товари'}

                                        {activePreview === 'orders' &&
                                            'Замовлення'}
                                    </h3>
                                </div>

                                <div className="user-circle">
                                    MM
                                </div>

                            </div>


                            {activePreview === 'overview' && (
                                <div className="preview-content">

                                    <div className="system-stats">

                                        <div>
                                            <span>Товари</span>
                                            <strong>124</strong>
                                            <small>
                                                +8 цього тижня
                                            </small>
                                        </div>

                                        <div>
                                            <span>Замовлення</span>
                                            <strong>38</strong>
                                            <small>
                                                12 активних
                                            </small>
                                        </div>

                                        <div>
                                            <span>Користувачі</span>
                                            <strong>16</strong>
                                            <small>
                                                3 нових
                                            </small>
                                        </div>

                                    </div>


                                    <div className="system-panel">

                                        <div className="panel-title">
                                            <strong>
                                                Поточна робота
                                            </strong>

                                            <span>
                                                Сьогодні
                                            </span>
                                        </div>

                                        <div className="activity-row">

                                            <span className="activity-icon">
                                                01
                                            </span>

                                            <div>
                                                <strong>
                                                    Нове замовлення
                                                </strong>

                                                <small>
                                                    Очікує обробки
                                                </small>
                                            </div>

                                            <span className="activity-status">
                                                Нове
                                            </span>

                                        </div>


                                        <div className="activity-row">

                                            <span className="activity-icon">
                                                02
                                            </span>

                                            <div>
                                                <strong>
                                                    Оновлено товар
                                                </strong>

                                                <small>
                                                    Каталог товарів
                                                </small>
                                            </div>

                                            <span className="activity-status neutral">
                                                Готово
                                            </span>

                                        </div>

                                    </div>

                                </div>
                            )}


                            {activePreview === 'products' && (
                                <div className="preview-page">

                                    <div className="preview-page-title">

                                        <div>
                                            <small>
                                                Каталог
                                            </small>

                                            <h4>
                                                Товари
                                            </h4>
                                        </div>

                                        <button type="button">
                                            + Додати
                                        </button>

                                    </div>


                                    <div className="preview-search">
                                        Пошук товару...
                                    </div>


                                    <div className="preview-product">

                                        <div>
                                            <strong>
                                                Wireless Headphones
                                            </strong>

                                            <span>
                                                Аудіо
                                            </span>
                                        </div>

                                        <strong>
                                            1 499 ₴
                                        </strong>

                                    </div>


                                    <div className="preview-product">

                                        <div>
                                            <strong>
                                                Smart Watch S8
                                            </strong>

                                            <span>
                                                Аксесуари
                                            </span>
                                        </div>

                                        <strong>
                                            2 199 ₴
                                        </strong>

                                    </div>


                                    <div className="preview-product">

                                        <div>
                                            <strong>
                                                Power Bank 20 000
                                            </strong>

                                            <span>
                                                Електроніка
                                            </span>
                                        </div>

                                        <strong>
                                            899 ₴
                                        </strong>

                                    </div>

                                </div>
                            )}


                            {activePreview === 'orders' && (
                                <div className="preview-page">

                                    <div className="preview-page-title">

                                        <div>
                                            <small>
                                                Робота
                                            </small>

                                            <h4>
                                                Замовлення
                                            </h4>
                                        </div>

                                    </div>


                                    <div className="preview-order">

                                        <div>
                                            <strong>
                                                #1048
                                            </strong>

                                            <span>
                                                Wireless Headphones
                                            </span>
                                        </div>

                                        <span className="order-status new">
                                            Нове
                                        </span>

                                    </div>


                                    <div className="preview-order">

                                        <div>
                                            <strong>
                                                #1047
                                            </strong>

                                            <span>
                                                Smart Watch S8
                                            </span>
                                        </div>

                                        <span className="order-status process">
                                            В обробці
                                        </span>

                                    </div>


                                    <div className="preview-order">

                                        <div>
                                            <strong>
                                                #1046
                                            </strong>

                                            <span>
                                                Power Bank 20 000
                                            </span>
                                        </div>

                                        <span className="order-status done">
                                            Виконано
                                        </span>

                                    </div>

                                </div>
                            )}

                        </div>

                    </div>

                </div>

            </div>
        </section>
    )
}

export default Hero