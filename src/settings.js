export const API_URL_FILMES = "https://api.themoviedb.org/3/discover/movie"
// Token da API: a4e3c053e886d058c883d9106e5892cc
// Instalar o Axios
// const getMovies = () => {
//     axios({
//         method:'get',
//         url: 'https://api.themoviedb.org/3/discover/movie',
//         params: {
//             api_key: 'a4e3c053e886d058c883d9106e5892cc',
//             language: 'pt-br',
//         }
//     }).then(response => {
//         console.log(response)
//         setMovies(response.data.results);
//     })
// }