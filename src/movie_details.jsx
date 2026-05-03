import {useEffect, useMemo, useState} from 'react';
import styles from './App.module.css';
import RenderVideo from './fetchvideo';
import { useFetch } from './fetchapi';
import './movie_details.css'
import './fetchapi.jsx'


function useApiHandler(movie) {
  const [casts, setCasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const options = useMemo(() => {
    return {    
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNjk0MjI1NmEwZjg0YjM0ZjlmMmVhMjE4MWZjNzhlMyIsIm5iZiI6MTc3MTkxNzI3MS44NDA5OTk4LCJzdWIiOiI2OTlkNGZkN2Q1NTc5MjJhYmUwNjVkMDciLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.rfnc_0ya1FAP_dJfXqTX6vEEPWnmdu_NJblTMW1ASfI'
      }
    };
  }, []);

  useEffect(() => {
    const useCasts = async () => {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}/credits`, options);
        const data = await response.json();
        setCasts(data);
      } finally {
        setLoading(false);
      }
    }
    useCasts();
  }, [movie, options]);

  return { data: casts, loading };
}
//======Kept for reference================================
function Genre({ movie }) {
   const genres = [28, 18, 27, 35, 10749, 878];
    const verify = (id) => {
      return genres.includes(id);
    };
    const genreLookup = {
      28: "Action",
      18: "Drama",
      27: "Horror",
      35: "Comedy",
      10749: "Romance",
      878: "Science Fiction"
    };
  const genreNames = movie.genre_ids?.map((id) => (verify(id) ? genreLookup[id] : null)).filter((name) => name !== null); //filters the null values
  // So here is the thing charles if you see this in the future. This code does verify if this is a valid genre_id for this app
  //  if the verify id returns false, it will return null, which is then filtered out 

  if (genreNames === null) {
    return <p>Loading...</p>;
  }
  return (
    <div className="genres_container"> 
      {genreNames.map((name, index) => (
        <span key={index}>{name}</span>
      ))}
    </div>
  )
}
//=========================================================

function Casts({movie}) {
  const { data: casts, loading } = useApiHandler(movie);

  if (loading) {
    return <p>Loading...</p>;
  }

    return (
    <div className="casts_container">
      {casts.cast?.filter((person) => person.known_for_department === "Acting")?.map((cast) => (
          <div key={cast.id}>
            <p>{cast.name}</p>   
          </div>
        ))
      }

    </div>
  )

}

function Crew({movie}) {
  const { data: casts, loading } = useApiHandler(movie);

  if (loading) {
    return <p>Loading...</p>;
  }

    return (
    <div className="casts_container">
      {casts.cast?.filter((person) => person.known_for_department === "Directing" || person.known_for_department === "Writing" || 
      person.known_for_department === "Production")?.map((cast) => (
        <>
          <div key={cast.id}>
            {cast.known_for_department === "Directing" ? (
                <>
                  <h3>Director</h3>
                  <p>{cast.name}</p>
                </>
              ) : (
                ""
              )}
           </div>
           <div key={cast.id}>
           {cast.known_for_department === "Writing" ? (
              <>
                <h3>Writer</h3>
                <p>{cast.name}</p>
              </>
            ) : (
              ""
            )}
          </div>
          <div key={cast.id}>
           {cast.known_for_department === "Production" ? (
              <>
                <h3>Producer</h3>
                <p>{cast.name}</p>
              </>
            ) : (
              ""
            )}
          </div>
        </>
          
          ))
      }
 
    </div>
  )

}

function ViewMovieDetails({movie, setShowDetails}) {

  const [index, setIndex] = useState(0);
  const baseUrl = 'https://image.tmdb.org/t/p/w500';
  if (movie == null) {
    console.error("Movie details not found.");
  } else {
    console.log("successfully retrieved movie details:");
  }

  function exit() {
    setShowDetails({show: false});
  }



  return (
    <div className={styles.movie_details_box}>
      <div className={styles.video_container}>
        <RenderVideo movie={movie} />
      </div>
      
      <div className={styles.details_section}>
        <div className={styles.poster_size_details}> 
          <img src={`${baseUrl}${movie.poster_path}`} alt={movie.title} className={styles.box_img} />
        </div>
        
        <div className={styles.details_section_overview}>
          <h2>{movie.title}</h2>
          <p>{movie.overview}</p>
          <p>Release Date: {movie.release_date}</p>
          <p>Rating: {movie.vote_average}</p>
          {//<p>Genres: {movie.genre_ids.map((genre) => <span key={genre}>{genre}</span>)}</p>
          }
          
          <div>
              <button className={index===0 ? "details_button_active" : "details_button"} onClick={() => {setIndex(0)}}>Casts</button>
              <button className={index===1 ? "details_button_active" : "details_button"} onClick={() => {setIndex(1)}}>Genres</button>
              <button className={index===2 ? "details_button_active" : "details_button"} onClick={() => {setIndex(2)}}>Crew</button>
          </div>
          <div className="underlined"></div>
          {index === 0 && <Casts movie={movie} />}
          {index === 1 && <Genre movie={movie} />}
          {index === 2 && <Crew movie={movie} />}
        </div>
        
      </div>

      <div className={styles.exit_button_container}>
        <button className="review_exit_button" onClick={exit}>X</button>
      </div>
    </div>
  )
}

export default ViewMovieDetails;