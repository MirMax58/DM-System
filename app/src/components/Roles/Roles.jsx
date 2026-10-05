import { useState } from 'react'
import './Roles.css'

function Roles() {
    const [activeRole, setActiveRole] = useState('admin')

    const roles = {
        admin: {
            title: 'Адміністратор',
            description:
                'Адміністратор керує основними даними системи та контролює роботу користувачів.',
            features: [
                'Додавання та редагування товарів',
                'Видалення товарів',
                'Керування користувачами',
                'Перегляд усіх замовлень',
                'Контроль роботи системи',
            ],
        },

        dropshipper: {
            title: 'Дропшипер',
            description:
                'Дропшипер працює з каталогом і створює замовлення для своїх клієнтів.',
            features: [
                'Перегляд каталогу товарів',
                'Пошук і фільтрація товарів',
                'Перегляд інформації про товар',
                'Створення замовлення',
                'Перегляд власних замовлень',
            ],
        },
    }

    const currentRole = roles[activeRole]

    return (
        <section className="roles section" id="roles">
            <div className="container">

                <div className="section-heading">
                    <span>Ролі в системі</span>

                    <h2>
                        Кожен користувач бачить тільки те,
                        що потрібно для його роботи
                    </h2>

                    <p>
                        Оберіть роль, щоб переглянути доступні
                        для неї можливості в DM System.
                    </p>
                </div>

                <div className="role-switcher">

                    <button
                        className={
                            activeRole === 'admin'
                                ? 'role-tab active'
                                : 'role-tab'
                        }
                        onClick={() => setActiveRole('admin')}
                    >
                        Адміністратор
                    </button>

                    <button
                        className={
                            activeRole === 'dropshipper'
                                ? 'role-tab active'
                                : 'role-tab'
                        }
                        onClick={() => setActiveRole('dropshipper')}
                    >
                        Дропшипер
                    </button>

                </div>

                <div className="role-content">

                    <div className="role-main">

                        <div className="role-label">
                            Активна роль
                        </div>

                        <h3>{currentRole.title}</h3>

                        <p>
                            {currentRole.description}
                        </p>

                    </div>

                    <div className="role-features">

                        {currentRole.features.map((feature, index) => (
                            <div
                                className="role-feature"
                                key={feature}
                            >
                                <span className="role-feature-number">
                                    {String(index + 1).padStart(2, '0')}
                                </span>

                                <span>
                                    {feature}
                                </span>
                            </div>
                        ))}

                    </div>

                </div>

            </div>
        </section>
    )
}

export default Roles