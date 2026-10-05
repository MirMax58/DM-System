import Header from '../../components/Header/Header'
import Hero from '../../components/Hero/Hero'
import About from '../../components/About/About'
import Features from '../../components/Features/Features'
import Workflow from '../../components/Workflow/Workflow'
import Roles from '../../components/Roles/Roles'
import Cta from '../../components/Cta/Cta'

function Home() {
    return (
        <>
            <Header />

            <main>
                <Hero />
                <About />
                <Features />
                <Workflow />
                <Roles />
                <Cta />
            </main>
        </>
    )
}

export default Home