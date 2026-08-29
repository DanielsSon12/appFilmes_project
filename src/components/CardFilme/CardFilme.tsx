import DataFetchingFilmes from "../../service/DataFetchingFilmes"

const CardFilme = () => {
    const {filmes, loading, error} = DataFetchingFilmes()
    
    return(
        <>
        {filmes.map((filme) => {
           return (
            <div>
                {/* Informação dos cards */}
            </div>
           )                                                                                               
        })}
        </>
    )
}

export default CardFilme