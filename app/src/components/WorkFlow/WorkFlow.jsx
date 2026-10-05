import './Workflow.css'

function Workflow() {
    return (
        <section className="workflow section" id="workflow">
            <div className="container">
                <div className="section-heading">
                    <span>Як працює</span>
                    <h2>Проста логіка роботи без зайвих кроків</h2>
                    <p>
                        Система побудована так, щоб користувач швидко
                        заходив у свій робочий процес і працював у межах
                        своєї ролі.
                    </p>
                </div>

                <div className="workflow-steps">
                    <div className="workflow-step">
                        <div className="step-number">01</div>
                        <h3>Вхід до системи</h3>
                        <p>
                            Користувач авторизується та отримує доступ
                            до свого робочого простору.
                        </p>
                    </div>

                    <div className="workflow-step">
                        <div className="step-number">02</div>
                        <h3>Робота за роллю</h3>
                        <p>
                            Адміністратор і дропшипер працюють із
                            тими функціями, які відповідають їхнім задачам.
                        </p>
                    </div>

                    <div className="workflow-step">
                        <div className="step-number">03</div>
                        <h3>Контроль процесів</h3>
                        <p>
                            Товари, замовлення та інша інформація
                            залишаються впорядкованими в одному місці.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Workflow