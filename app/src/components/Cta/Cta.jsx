import './Cta.css'
import {Link} from 'react-router-dom'

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
                    <Link className="cta-button" to="/workspace">
                        Увійти до системи
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default Cta