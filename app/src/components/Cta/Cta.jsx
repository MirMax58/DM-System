import './Cta.css'

function Cta() {
    return (
        <section className="cta section" id="cta">
            <div className="container">
                <div className="cta-box">
                    <h2>Готові почати роботу в DM System?</h2>
                    <p>
                        Увійдіть до системи та перейдіть до свого
                        робочого простору.
                    </p>
                    <button
                        type="button"
                        className="cta-button"
                    >
                        Увійти до системи
                    </button>
                </div>
            </div>
        </section>
    )
}

export default Cta