import { useEffect, useState } from "react"
import DataFetchingFilmes from "../../service/DataFetchingFilmes"
import CardFilme from "../CardFilme/CardFilme"

const HomeFilmes = () => {
    const {loading, error} = DataFetchingFilmes()
    const [showLoading, setShowLoading] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowLoading(false)
        }, 1000)

        return () => clearTimeout(timer)
    }, [])

    if(loading || showLoading){
        return(
            <main>
                <div>
                    <h1>Loading...</h1>
                </div>
            </main>
        )
    }

    if(error){
        return(
            <main>
                <div>
                    <h1>!--Error--!</h1>
                </div>
            </main>
        )
    }

    return(
        <main>
            <h1>App de Filmes</h1>
            <section>
                <CardFilme/>
            </section>
        </main>
    )
}

export default HomeFilmes