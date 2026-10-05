import './About.css'

function About() {
    return (
        <section className="about section" id="about">
            <div className="container">
                <div className="section-heading">
                    <span>Про систему</span>
                    <h2>Один робочий простір для щоденної роботи</h2>
                    <p>
                        DM System створена для того, щоб зібрати
                        товари, замовлення та роботу користувачів
                        в одному зручному застосунку.
                    </p>
                </div>

                <div className="about-grid">
                    <div className="about-card">
                        <h3>Менше хаосу</h3>
                        <p>
                            Уся важлива інформація знаходиться в одному місці,
                            без зайвих таблиць і розкиданих записів.
                        </p>
                    </div>

                    <div className="about-card">
                        <h3>Швидша робота</h3>
                        <p>
                            Користувачі можуть швидко знаходити товари,
                            переглядати замовлення та працювати за своєю роллю.
                        </p>
                    </div>

                    <div className="about-card">
                        <h3>Зрозуміла структура</h3>
                        <p>
                            Система має просту логіку: дані впорядковані,
                            а основні дії доступні без зайвих переходів.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default About