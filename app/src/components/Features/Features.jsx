import './Features.css'

function Features() {
    return (
        <section className="features section" id="features">
            <div className="container">
                <div className="section-heading">
                    <span>Можливості</span>
                    <h2>Усе необхідне для роботи в одній системі</h2>
                    <p>
                        DM System охоплює ключові процеси, які потрібні
                        для щоденної роботи адміністратора та дропшипера.
                    </p>
                </div>

                <div className="features-grid">
                    <article className="feature-card">
                        <h3>Робота з товарами</h3>
                        <p>
                            Додавання, редагування, перегляд і пошук товарів
                            у спільному каталозі.
                        </p>
                    </article>

                    <article className="feature-card">
                        <h3>Обробка замовлень</h3>
                        <p>
                            Перегляд замовлень, відстеження статусів і
                            контроль поточних операцій.
                        </p>
                    </article>

                    <article className="feature-card">
                        <h3>Користувачі та ролі</h3>
                        <p>
                            Розподіл доступу між адміністраторами та
                            дропшиперами відповідно до їхніх задач.
                        </p>
                    </article>

                    <article className="feature-card">
                        <h3>Пошук і фільтрація</h3>
                        <p>
                            Швидкий доступ до потрібних товарів та даних
                            за допомогою пошуку й фільтрів.
                        </p>
                    </article>

                    <article className="feature-card">
                        <h3>Єдиний інтерфейс</h3>
                        <p>
                            Усі основні дії виконуються в одному
                            робочому середовищі.
                        </p>
                    </article>

                    <article className="feature-card">
                        <h3>Зрозуміла структура</h3>
                        <p>
                            Простий інтерфейс, який дозволяє швидко
                            орієнтуватися в системі.
                        </p>
                    </article>
                </div>
            </div>
        </section>
    )
}

export default Features