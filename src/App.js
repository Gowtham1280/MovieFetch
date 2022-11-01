import React, { useCallback, useEffect, useState } from 'react';
import MoviesList from './components/MoviesList';
import './App.css';
import AddMovie from './components/AddMovie';

function App() {
 
  const [movies,setMovies]=useState([]);
  const [initialLoading,setInitialLoading]=useState(false);
  const [error,setError]=useState(null);

  const fetchMoviesHandler= useCallback(async ()=>{
    setInitialLoading(true);
    try{
      const response=await fetch('https://react-http-f7479-default-rtdb.firebaseio.com/Movies.json');
      setError(null);
      if(!response.ok){
        throw new Error('something went wrong please try again!..');
      }
      const data= await response.json();
      const loadedMovies=[];
      for(const key in data){
        loadedMovies.push({
          id:key,
          title:data[key].title,
          openingText:data[key].openingText,
          releaseDate:data[key].releaseDate
        })
      }
        // const namecorrecting=data.map(movieData=>{
        //   return{ 
        //     id:movieData.episode_id,
        //     title:movieData.title,
        //     openingText:movieData.opening_crawl,
        //     releaseDate:movieData.release_date
        //   }
        // })
        // setMovies(namecorrecting);
        setMovies(loadedMovies);  
      }catch(error){
        setError(error.message);
      }
      setInitialLoading(false);
  },[]);
  useEffect(()=>{
    fetchMoviesHandler()
  },[fetchMoviesHandler]);

  async function addMovieHandler(movies){
    const response=await fetch('https://react-http-f7479-default-rtdb.firebaseio.com/Movies.json',{
      method:'POST',
      body:JSON.stringify(movies),
      headers:{
        'content-Type':'application/json'
      }
    });
    const data=await response.json();
    console.log(data);
  }
  let content=<p>No movies found..</p>;
  if(movies.length>0){
    content=<MoviesList movies={movies} />;
  }
  if(error){
    content=<p>{error}</p>
  }
  if(initialLoading){
    content=<h1>Loading...</h1>
  }
  return (
    <React.Fragment>
       <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={addMovieHandler}>Fetch Movies</button>
      </section>
      <section>
        {content}
      </section>
    </React.Fragment>
  );
}

export default App;
