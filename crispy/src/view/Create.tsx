import { useEffect, useState } from "react"
import { Movie } from "../model/Movie";

export function Create() {
  const [title, setTitle] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isPrivate, setIsPrivate] = useState(false);

  useEffect(() => {
    if (!searchTerm) {
      setSearchResults([]);
    } else {
        fetch(`https://api.themoviedb.org/3/search/movie?api_key=068120d03377a9539115269490d93a54&query=${searchTerm}`)
        .then((response) => response.json())
        .then((json:{results: Movie[]}) => setSearchResults(json.results));
    }
    
  }, [searchTerm]);

  const addMovie = (movie: Movie) => {
    setMovies([...movies, movie]);
    setSearchTerm('');
  }

  const removeMovie = (index: number) => {
    setMovies([...movies.slice(0, index), ...movies.slice(index + 1)]);
  }

  const save = () => {
    const requestInit = {
      method: "POST",
      headers: {
        'Content-Type': "application/json",
        Authorization: `Bearer ${localStorage.getItem('credential')}`
      },
      body: JSON.stringify({
        collectionTitle: title,
        movieIds: movies.map(m => m.id),
        isPrivate,
      })
    };
    fetch('http://localhost:8080/user/lists', requestInit)
      .then((response) => {
        if (response.ok) {
          setTitle('');
          setMovies([]);
        }
      })
  }

  return (
    <>
    Just regular text on the create page
    <div>
      Title: <input value={title} onChange={e => setTitle(e.target.value)}/>
    </div>
    <div>
      Add movie: <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)}/>
    </div>
    <ul>{searchResults.map(movie => <li><button onClick={() => addMovie(movie)}>{movie.title}</button></li>)}</ul>
    <ul>{movies.map((movie, index) => <li>{movie.title} <button onClick={() => removeMovie(index)}>x</button></li>)}</ul>

    <div>
    Private: <input type="checkbox" checked={isPrivate} onChange={e => setIsPrivate(e.target.checked)}/>
    </div>

    <button onClick={save}>Save</button>
    </>
  )
 
}