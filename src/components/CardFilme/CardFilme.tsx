import DataFetchingFilmes from "../../service/DataFetchingFilmes"

const CardFilme = () => {
    const {filmes} = DataFetchingFilmes()

    return(
        <>
        {filmes.map((filme) => {
           return (
            <div key={filme.id}>
                <img src={filme.poster_path} alt={filme.title}/>
                <h1>{filme.title} - <span>{filme.vote_average}</span></h1>
                <p>{filme.overview}</p>
            </div>
           )                                                                                               
        })}
        </>
    )
}

export default CardFilme