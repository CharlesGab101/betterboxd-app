import React, { useMemo, useEffect, useState } from 'react'
import { useRef } from 'react'
import  {useFetch, useGenreFetch} from './fetchapi.jsx'
import useMovieSearch from './show_by_search.jsx'
import ViewMovieDetails from './movie_details.jsx'
import styles from './App.module.css'
import { useCallback } from 'react';
import './movie_watchlist.css';
import './review.css';
import './star_rating.jsx';
import Draggable from 'react-draggable';
import StarRating from './star_rating.jsx'
import './animation.css';
import betterboxdImg from './images/betterboxd.png';


function App() {
  const baseUrl = 'https://image.tmdb.org/t/p/w500';
  const [count, setCount] = useState(0);
  const [index, setIndex] = useState(1);
  const [username, setUsername] = useState("")
  const [passwordValue, setPasswordValue] = useState("")
  const [showIsRegistering, setShowIsRegistering] = useState(false)
  const [page, setPage] = useState(1);
  const [criteria, setCriteria] = useState("popularity.desc");
  const [reg_Username, setRegUsername] = useState("")
  const [reg_Password, setRegPassword] = useState("")
  const [loggedInUser, setLoggedInUser] = useState(null); // holds who is current logged in user
  const [searchQuery, setSearchQuery] = useState("");
  const [genre_id, setGenreId] = useState(null);
  const saved_filter = useRef(null);
  const [show_details, setShowDetails] = useState({show: false});
  const [movie_details, setMovieDetails] = useState(null);
  const [comment, setComment] = useState("");
  const commentRef = useRef(null);
  const [rating, setRating] = useState(0);
  const [actionListPosition, setActionListPosition] = useState({x: 0, y: 0});

  //SAVES USESTATE for local storage (json)
  const [savedFavorites, setSavedFavorites] = useState({});
  const [savedWatched, setSavedWatched] = useState({});
  const [savedWatchlist, setSavedWatchlist] = useState({});
  const [savedRating, setSavedRating] = useState({});
  const [savedLiked, setSavedLiked] = useState({});

  const [show_profile, setShowProfile] = useState(false);
  const [show_sign_in_first, setShowSignInFirst] = useState(false);
  const [show_actionlist, setShowActionlist] = useState(false);
 
  const [film_Movie, setMovie] = useState(null);
  const [show_remove_tab, setShowRemoveTab] = useState(false);
  const [show_favorites, setShowFavorites] = useState(false);
  const [show_review, setShowReview] = useState(false);
  //modal    
  const [show_feedback, setShowFeedback] = useState(false);
  const [show_message_feedback, setShowMessageFeedback] = useState("");

  
  //const [actionShown, setActionShown] = useState(false);


    const {data_: browseData, loading: browseLoading} = useFetch(page, criteria);
    const {data_: searchData, loading: searchLoading} = useMovieSearch(searchQuery);
    const {data_: genreData, loading: genreLoading} = useGenreFetch(page, criteria, genre_id);
    // searchQuery is falsy when the input is "" (empty) we use browseData, 
    // otherwise it is truthy when the input has some value then we use searchData
   
    let data_ = searchQuery ? searchData : browseData;
    //when is genreid is present then we use genreData instead of the other two, otherwise we use the searchData or browseData depending on the searchQuery
    if (genre_id) { 
      data_ = genreData;
    }
    let loading = searchQuery ? searchLoading : browseLoading;
    if (genre_id) {
      loading = genreLoading;
    }

    const display_list = useMemo(() => {
      console.log("genre id is " + genre_id);
      console.log("criteria is " + criteria);
      return data_?.results || [];
    }, [data_]);
    const totalPages = data_?.total_pages || 0;
  //==============================Future Use===============================
  //load the saved user and watchlist from localStorage when the app first mounts
  useEffect(() => { 
    const storedLoggedInUser = localStorage.getItem('loggedInUser');
    const storedSavedWatchlist = localStorage.getItem('savedWatchlist');
    const storedSavedFavorites = localStorage.getItem('savedFavorites');
    const storedSavedWatched = localStorage.getItem('savedWatched');
    const storedSavedRating = localStorage.getItem('savedRating');
    const storedLikedMovie = localStorage.getItem('savedLiked');
    if (storedLoggedInUser) {
      setLoggedInUser(storedLoggedInUser);
    } 
    if (storedSavedWatchlist) {
      setSavedWatchlist(JSON.parse(storedSavedWatchlist));
    }
    if (storedSavedFavorites) {
      setSavedFavorites(JSON.parse(storedSavedFavorites));
    }
    if (storedSavedWatched) {
      setSavedWatched(JSON.parse(storedSavedWatched));
    }
    if(storedSavedRating) {
      setSavedRating(JSON.parse(storedSavedRating));
    } 
    if (storedLikedMovie) {
      setSavedLiked(JSON.parse(storedLikedMovie));
    }
  }, []);
  //=========================================================================
  //LOGIN FUNCTION
  const loginHandler = (e) => {
      e.preventDefault();
      const stored_password = localStorage.getItem(username); //retrieve the (value : password) using (key : username)
      if(stored_password && stored_password === passwordValue) { //then checks if the same
      setLoggedInUser(username);
      localStorage.setItem('loggedInUser', username);
      setUsername('');
      setPasswordValue('');
      } else {
        setShowMessageFeedback('Invalid username or password!');
        setShowFeedback(true);
      }
  };


  //REGISTER FUNCTION
  const registerHandler = (e, username, password) => {
  e.preventDefault();

  if (password && username) {
    const isAlready = localStorage.getItem(username);

    if (isAlready) {
      setShowMessageFeedback('Username already exists');
      setShowFeedback(true);
    } else {
      localStorage.setItem(username, password);
      setShowMessageFeedback('Account Successfully Created!');
      setShowFeedback(true);
      setShowIsRegistering(false);

      setShowIsRegistering(false);
      setRegUsername('');
      setRegPassword('');
    }
  } else {
    setShowMessageFeedback('Please enter a valid username and password!');
    setShowFeedback(true);
  }
};
  const RenderBoxWindow = () => {
    return (
      <div className={styles['modal_overlay']}>
        <div className={styles.register_window}>
        <h5>Register</h5>
        <div>
          <div className={styles.username_part}>
            <label className={styles.username_part_label}>Username</label>
            <input
              type="text"
              value={reg_Username}
              onChange={(e) => {
                console.log("username typing:", e.target.value);
                setRegUsername(e.target.value);
              }}
            />
          </div>
          <div className={styles.password_part}>
            <label className={styles.password_part_label}>Password</label>
            <input
              type="password"
              value={reg_Password}
              onChange={(e) => {
                console.log("password typing:", e.target.value);
                setRegPassword(e.target.value);
              }}
            />
          </div>

          

          <div className={styles.buttons_part}>
            <div>
              <button
              className={styles.buttons_part_cancel}
            onClick={() => {
                      setShowIsRegistering(false);
                    }}
              
              >
                Cancel
              </button>
      
              <button
                className={styles.buttons_part_register}
                onClick={(e) => {registerHandler(e, reg_Username, reg_Password);}}
              >
                Register
              </button>
            </div>
            
          </div>
        </div>
      </div>
      {<>
      </>}
      
      </div>
      
    );
  };

  const filterFunction = (criteria) => {
    console.log("filtering by " + criteria);
    setCriteria(criteria);
  }
  const display_details = (bool) => {

      setShowDetails({show: bool});

  }

  const handleProfile = () => {
      setShowProfile(false);
  }

  const handleshowlist = (data) => {
      setShowActionlist(data);
  }

  const RenderSignInFirst = ({sendDataToParent, position}) => {
  const nodeRef = useRef(null);
  return (
    <Draggable nodeRef={nodeRef} handle=".handle" defaultPosition={{ x: position.x - 20, y: position.y - 150 }}>
       
      <div ref={nodeRef} className="action_list">
        
        <div className=" action_list_content">
            <button className="please_sign_in" onMouseEnter={() => {setShowSignInFirst(true)}} onClick={() => {setShowIsRegistering(true), setShowSignInFirst(false)}}>
            Sign in
          </button>
        </div>
          
      </div>
     
    </Draggable> 
  );
};

const RenderWindowFeedback = React.memo(({ message, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose], [setVisible]);

  if (visible) {
   
    return (
    <div className="feedback_window">
      <h2>{message}</h2>
    </div>
  )
   setVisible(false);
  }
  
});


const handleRatingChange = (newRating) => {
  console.log("New rating is " + newRating);
  setRating(newRating);
}

const handleCommentChange = (e) => {
  const current = commentRef.current.value;
  setComment(current);
  handleSaveReview(film_Movie, current, rating);
}


const addReview = (movie) => {
  //Handler for add review action
  return (
    <div className={styles['modal_overlay']}>
      
      <div className="review_box">
        <h1>{movie.title}</h1>
      <div>
         <button className="review_exit_button" onClick={() => {setIndex(0); handleProfile(); setShowActionlist(false); setShowReview(false);}}> X</button>
         <img src={`${baseUrl}${movie.poster_path}`} alt={movie.title} className={"box_img"} />
      </div>
      
    </div>
     <div className="review_container">
      {//textarea for user to input comment review
      //future use which is better than input type text
      }
          <textarea 
            type="text"
            ref={commentRef}
            className="review_input" 
            placeholder="Enter your review..."
            wrap="soft" 
          />

         
          <button className="review_submit_button" onClick={() => {handleSubmitReview(); 
            setShowMessageFeedback('Added Review Successfully');
            setShowFeedback(true);
          }}>Submit Review</button>
          <div>
            
            <StarRating sendDataToParent={handleRatingChange}/>
          </div>
      </div> 
    </div>
  )
}

const handleSubmitReview = () => {
  if (!film_Movie) return;

  const currentComment = commentRef.current.value;

  setComment(currentComment);

  handleSaveReview(film_Movie, currentComment, rating);

  setShowReview(false);
};

 const RenderActionList = ({sendDataToParent, position}) => {
  const nodeRef = useRef(null);
  return (
    <Draggable nodeRef={nodeRef} handle=".handle" defaultPosition={{ x: position.x - 20, y: position.y - 150 }}>
       
      <div ref={nodeRef} className="action_list">
        
        <div className="action_list_content" onMouseLeave={() => {setShowActionlist(false)}}>
          {(index !== 5) && (
             <button className="remove_from_watchlist" onClick={() => {handleLikedMovie(film_Movie); setShowActionlist(false);
              setShowMessageFeedback('Added Liked');
              setShowFeedback(true);
             }}> Like </button>
          )}
          {(index !== 3) ? (         
             <button className="remove_from_watchlist" onClick={() => { setShowActionlist(false); setShowReview(true);
              
             }}> Add Review </button>
          ) : (
              <button className="remove_from_watchlist" onClick={() => { setShowActionlist(false); setShowReview(true)}}> Edit Review </button>
          )}
          {(loggedInUser && index !== 4)&& (
              <button className="remove_from_watchlist"
                onClick={() => {
                  handleSaveWatchlist(film_Movie);
                  setShowActionlist(false);
                  setShowMessageFeedback('Saved to Watchlist');
                  setShowFeedback(true);
                }}
              >
              Save to Watchlist
            </button>
          )}
          {index === 4 && (
            <button className="remove_from_watchlist" onClick={() => {removeMovieFromWatchlist(film_Movie); setShowActionlist(false); 
              setShowMessageFeedback('Removed from Watchlist');
              setShowFeedback(true);} } >
              Remove from Watchlist
            </button>
          ) }
          {index !== 2 && (
            <button className="remove_from_watchlist" onClick={()=>{handleSaveWatched(film_Movie); setShowActionlist(false);
              setShowMessageFeedback('Added to Watched');
              setShowFeedback(true);
            }}> 
              Add to Watched
            </button>
          )}
          {index === 2 && (
            <button className="remove_from_watchlist" onClick={() => {removeMovieFromWatchlist(film_Movie); setShowActionlist(false);
              setShowMessageFeedback('Removed from Watched');
              setShowFeedback(true);
            }} >
              Remove from Watched
            </button>
          ) }
          {index !== 1 && (
            <button className="remove_from_watchlist" onClick={() => {handleSaveFavorites(film_Movie); setShowActionlist(false); 
              setShowMessageFeedback('Added to Favorites');
              setShowFeedback(true);}} >
              Add to Favorites
            </button>
          )}
          {index === 1 && (
            <button className="remove_from_watchlist" onClick={() => {removeMovieFromWatchlist(film_Movie); setShowActionlist(false);
              setShowMessageFeedback('Removed from Favorites');
              setShowFeedback(true);
            }} >
              Remove from Favorites
            </button>
          )}
          {index === 3 && (
            <button className="remove_from_watchlist" onClick={() => {removeMovieFromWatchlist(film_Movie); setShowActionlist(false);
              setShowMessageFeedback('Removed from Reviews');
              setShowFeedback(true);
            }} >
              Remove from Reviews
            </button>
          )}
        </div>
          
      </div>
     
    </Draggable> 
  );
};

const handleFeedback = (data) => {
  setShowFeedback(data);
}

  //=========================================================================
  //Draggable floating window
  const ProfileWindow = ({sendDataToParent}) => {
  const nodeRef = useRef(null);
  const [position, setPosition] = useState(() => {
    const savedPos = localStorage.getItem('windowPos');
    return savedPos ? JSON.parse(savedPos) : { x: 0, y: 0 };
  });

  useEffect(() => {
    localStorage.setItem('windowPos', JSON.stringify(position));
  }, [position]);

  const handlestop = (e, data) => {
    setPosition({ x: data.x, y: data.y });
  }

  const handleShowWatchlist = (data) => {
    sendDataToParent(data);
  }


  return (

    <div className={styles['modal_overlay']}>
    <Draggable nodeRef={nodeRef} handle=".handle" onStop={handlestop} defaultPosition={position}>
      <div ref={nodeRef}>
        <div className="handle">
        <div>
          <div className={styles.bigger_profile_window}>
          <div className={styles.profile_window}>
           
            <h3>Dashboard</h3>
            <button className={styles.exit_button} onClick={() => {setIndex(0); handleProfile(); handleShowWatchlist(false); setShowActionlist(false);}}> X</button>
            <div className={styles.profile_box_selection}>
              <button className={index === 1 ? styles.filter_button_alt : styles.filter_button} onClick={() => {setIndex(1); handleShowWatchlist(false); setShowActionlist(false)}}>Profile</button>
              <button className={index === 2 ? styles.filter_button_alt : styles.filter_button} onClick={() => {setIndex(2); handleShowWatchlist(false); setShowActionlist(false)}}>Films</button>
              <button className={index === 3 ? styles.filter_button_alt : styles.filter_button} onClick={() => {setIndex(3); handleShowWatchlist(false); setShowActionlist(false)}}>Reviews</button>
              <button className={index === 4 ? styles.filter_button_alt : styles.filter_button} onClick={() => {setIndex(4); handleShowWatchlist(true); setShowActionlist(false)}}>Watchlist</button>
              <button className={index === 5 ? styles.filter_button_alt : styles.filter_button} onClick={() => {setIndex(5); handleShowWatchlist(false); setShowActionlist(false)}}>Likes</button>
            </div>
             {index === 5 && <h2 className="watchlist_title_liked">Liked</h2>}
             {index === 4 && <h2 className="watchlist_title_w">My Watchlist</h2>}
             {index === 1 && <h2 className="watchlist_title">My Favorites</h2>}
             {index === 2 && <h2 className="watchlist_title">My Watched</h2>}
             {index === 3 && <h2 className="watchlist_title_rating">My Reviews</h2>}
            <div>
              <div className="profile_content_scroll">
              <div className="list_watchlist">
                {index === 4 && Array.isArray(savedWatchlist[loggedInUser]) && savedWatchlist[loggedInUser].map((movie) => (
                  
                  <div key={movie.id} className={"box_movies"}>
                    <button className={"box_img_button"}>
                    <img src={`${baseUrl}${movie.poster_path}`} alt={movie.title} className={"box_img"} />
                    </button>
                    
                    <button className={"hover_button"} onClick={(e) => {
                      const x = e.clientX;
                      const y = e.clientY;
                      setActionListPosition({x, y});
                      setShowActionlist(true)
                      setMovie(movie);
                    }}>● ● ●</button>
                    
                    <div className={"movie_details_column"}>
                    </div>
                  </div>
                ))}
              </div>
             
              <div className="list_profile">
                {index === 1 && Array.isArray(savedFavorites[loggedInUser]) && savedFavorites[loggedInUser].map((movie) => (
                   console.log(index),
                  <div key={movie.id} className={"box_movies"}>
                    <button className={"box_img_button"}>
                    <img src={`${baseUrl}${movie.poster_path}`} alt={movie.title} className={"box_img"} />
                    </button>
                    
                    <button className={"hover_button"} onClick={(e) => {
                      const x = e.clientX;
                      const y = e.clientY;
                      setActionListPosition({x, y});
                      setShowActionlist(true)
                      setMovie(movie);
                    }}>● ● ●</button>
                    
                    <div className="movie_details_column">
                    </div>
                </div>
               ))}
              </div>
              <div className="list_profile">
                {index === 2 && Array.isArray(savedWatched[loggedInUser]) && savedWatched[loggedInUser].map((movie) => (
                   console.log(index),
                  <div key={movie.id} className={"box_movies"}>
                    <button className={"box_img_button"}>
                    <img src={`${baseUrl}${movie.poster_path}`} alt={movie.title} className={"box_img"} />
                    </button>
                    
                    <button className={"hover_button"} onClick={(e) => {
                      const x = e.clientX;
                      const y = e.clientY;
                      setActionListPosition({x, y});
                      setShowActionlist(true)
                      setMovie(movie);
                    }}>● ● ●</button>
                    
                    <div className="movie_details_column">
                    </div>
                </div>
               ))}
              </div>
              <div className="list_rating">
              {index === 3 && Array.isArray(savedRating[loggedInUser]) && savedRating[loggedInUser].map((movie) => {
                return (
                  <div key={movie.id} className="review_card">

                    <img
                      src={`${baseUrl}${movie.poster_path}`}
                      alt={movie.title}
                      className="review_poster"
                    />

                    <div className="review_content">
                      <span className="review_title">{movie.title}</span>

                      <span className="review_comment">
                        {movie.comment || "No comment provided."}
                      </span>

                      <span className="review_rating">
                        ⭐ {movie.rating} / 5
                      </span>
                    </div>

                    <button
                      className="review_menu"
                      onClick={(e) => {
                        const x = e.clientX;
                        const y = e.clientY;
                        setActionListPosition({ x, y });
                        setShowActionlist(true);
                        setMovie(movie);
                      }}
                    >
                      ● ● ●
                    </button>

                  </div>
                );
              })}
            </div>
            <div className="list_profile">
               {index === 5 &&
                  Array.isArray(savedLiked[loggedInUser]) &&
                  savedLiked[loggedInUser].map((movie) => (
                   console.log(index),
                  <div key={movie.id} className={"box_movies"}>
                    <button className={"box_img_button"}>
                    <img src={`${baseUrl}${movie.poster_path}`} alt={movie.title} className={"box_img"} />
                    </button>
                    
                    <button className={"hover_button"} onClick={(e) => {
                      const x = e.clientX;
                      const y = e.clientY;
                      setActionListPosition({x, y});
                      setShowActionlist(true)
                      setMovie(movie);
                    }}>● ● ●</button>
                    
                    <div className="movie_details_column">
                    </div>
                </div>
               ))}
              </div>
            </div>
            </div>
          </div>
          </div>
        </div>
        

         </div>
      </div>
    </Draggable>
    </div>
  );
};
//=========================================================================
const handleMenuAction = (e) => {
  const choice = e.target.value;

  if (choice === "profile") {
    setShowProfile(true);
  } else if (choice === "logout") {
    setShowActionlist(false);
    localStorage.removeItem('loggedInUser');
    setLoggedInUser(null);
    console.log("logged out");
  }
};
//========================================================================

  const handleSaveWatchlist = (movie) => {
    if (!loggedInUser || !movie) return;
    //saveWatchlist[loggedInUser] is the array (key: loggedInUser, value: array of movie) when the key is given then the retuns the array of movie.
    const updatedUserSaves = { ...savedWatchlist };
    if (!updatedUserSaves[loggedInUser]) {
      updatedUserSaves[loggedInUser] = []; //initialize if the user's list is empty
    }
    if (!updatedUserSaves[loggedInUser].some(r => r.id === movie.id)) { // check if the user has already the movie 
      updatedUserSaves[loggedInUser].push(movie); // push the movie in user's list
      console.log("Movie");
      setSavedWatchlist(updatedUserSaves); //updateSaveDRestaurants
      localStorage.setItem('savedWatchlist', JSON.stringify(updatedUserSaves)); //Saves in browser's localstorage 
    }
  };

  const handleSaveFavorites = (movie) => {
    if (!loggedInUser) return;
    //saveWatchlist[loggedInUser] is the array (key: loggedInUser, value: array of movie) when the key is given then the retuns the array of movie.
    console.log("index is " + index);
    
    const updatedUserSaves = { ...savedFavorites };
   
    if (!updatedUserSaves[loggedInUser]) {
      updatedUserSaves[loggedInUser] = []; //initialize if the user's list is empty
    }
    if (!updatedUserSaves[loggedInUser]?.some(r => r.id === movie.id)) { // check if the user has already the movie 
      updatedUserSaves[loggedInUser].push(movie); // push the movie in user's list
    }
   
    setSavedFavorites(updatedUserSaves); //updateSaveDRestaurants
    localStorage.setItem('savedFavorites', JSON.stringify(updatedUserSaves)); //Saves in browser's localstorage
  };

  const handleSaveWatched = (movie) => {
    if (!loggedInUser) return;
    //saveWatchlist[loggedInUser] is the array (key: loggedInUser, value: array of movie) when the key is given then the retuns the array of movie.
    const updatedUserSaves = { ...savedWatched };
    if (!updatedUserSaves[loggedInUser]) {
      updatedUserSaves[loggedInUser] = []; //initialize if the user's list is empty
    }
    if (!updatedUserSaves[loggedInUser].some(r => r.id === movie.id)) { // check if the user has already the movie 
      updatedUserSaves[loggedInUser].push(movie); // push the movie in user's list
      setSavedWatched(updatedUserSaves); //updateSaveDRestaurants
      localStorage.setItem('savedWatched', JSON.stringify(updatedUserSaves)); //Saves in browser's localstorage 
    }
  };

    const handleSaveReview = (movie, comment, rating) => {
    if (!loggedInUser) return;
    //saveWatchlist[loggedInUser] is the array (key: loggedInUser, value: array of movie) when the key is given then the retuns the array of movie.

    
    const updatedUserSaves = { ...savedRating };
    if (!updatedUserSaves[loggedInUser]) {
      updatedUserSaves[loggedInUser] = []; //initialize if the user's list is empty
    }
    const exist = updatedUserSaves[loggedInUser].some(r => r.id === movie.id); // check if the user has already the movie 
    if (!exist) {
      const review = { ...movie, comment, rating };
      updatedUserSaves[loggedInUser].push(review);
    } else {
       const index = updatedUserSaves[loggedInUser].findIndex(r => r.id === movie.id);
       updatedUserSaves[loggedInUser].splice(index, 1);
       const review = { ...movie, comment, rating };
       updatedUserSaves[loggedInUser].push(review);

    }
    setSavedRating(updatedUserSaves); //updateSaveDRestaurants
    localStorage.setItem('savedRating', JSON.stringify(updatedUserSaves)); //Saves in browser's localstorage 
  };

  const handleLikedMovie = (movie) => {
  if (!loggedInUser || !movie) return;

  const updatedUserSaves = { ...savedLiked };

  if (!updatedUserSaves[loggedInUser]) {
    updatedUserSaves[loggedInUser] = [];
  }

  const exists = updatedUserSaves[loggedInUser].some(r => r.id === movie.id);

  if (!exists) {
    updatedUserSaves[loggedInUser].push(movie);
  } else {
    updatedUserSaves[loggedInUser] =
      updatedUserSaves[loggedInUser].filter(r => r.id !== movie.id);
  }

  setSavedLiked(updatedUserSaves);
  localStorage.setItem('savedLiked', JSON.stringify(updatedUserSaves));
};


  const removeMovieFromWatchlist = (movie) => {
  if (!loggedInUser || !movie) return;
  let updatedUserSaves;
  if (index === 4) {
    updatedUserSaves = { ...savedWatchlist };
  } else if (index === 1) {
    updatedUserSaves = { ...savedFavorites };
  } else if (index === 2) {
    updatedUserSaves = { ...savedWatched };
  } else if (index === 3) {
    updatedUserSaves = { ...savedRating};
  }
  
  if (!updatedUserSaves[loggedInUser]) {
    updatedUserSaves[loggedInUser] = [];
  }
  if (updatedUserSaves[loggedInUser].some(r => r.id === movie.id)) {
    const index = updatedUserSaves[loggedInUser].findIndex(r => r.id === movie.id);
    updatedUserSaves[loggedInUser].splice(index, 1);
  }
  if (index === 4) {
    setSavedWatchlist(updatedUserSaves);
    localStorage.setItem('savedWatchlist', JSON.stringify(updatedUserSaves));
  } else if (index === 1) {
    setSavedFavorites(updatedUserSaves);
    localStorage.setItem('savedFavorites', JSON.stringify(updatedUserSaves));
  } else if (index === 2) {
    setSavedWatched(updatedUserSaves);
    localStorage.setItem('savedWatched', JSON.stringify(updatedUserSaves));
    } else if(index === 3) {
    localStorage.setItem('savedRating', JSON.stringify(updatedUserSaves));
    } else if (index === 5) {
      setSavedLiked(updatedUserSaves);
      localStorage.setItem('savedLiked', JSON.stringify(updatedUserSaves));
    }
  };

  const nextPage = () => {
    if (page < totalPages) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const previousPage = () => {
    if (page > 1) {
      setPage(prevPage => prevPage - 1);
    }
  }
return (
  <>
   
   <div className={styles.title_design_box}>
    <div>
      <div>
        <div className={styles.title}>
          <div><img src={betterboxdImg} alt="Betterboxd" width={250}/></div>
          {loggedInUser && (
            <h3>Welcome, {loggedInUser}</h3>

          )}
          
          {loggedInUser ? (
          <div >
        
            <select  className={styles.title}value={loggedInUser} onChange={(e) => {
            handleMenuAction(e)
            const current = e.target.value;

            if (current === "profile") {
              setIndex(1);
            }
              
            }}>
              <option value={loggedInUser}>{loggedInUser}!</option>
              <option value="profile"> Profile</option>
              <option value="logout"> Logout </option>
            </select>
        
           
           
          </div>)
        : (
          <div className={styles.login_container}>
            {!loggedInUser && (


             <div className={styles.login_letter}>            
                <h1>Login</h1>
             </div>
    
            )}
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" value={passwordValue} onChange={(e) => setPasswordValue(e.target.value)} />
             
             <button type="button" onClick={(e) => {loginHandler(e), setShowSignInFirst(false)}}>Login</button>
             <button type="button" onClick={() => setShowIsRegistering(true)}>Register</button>
          </div>
        )}
        </div>

        
        <div>
          <input className={styles.search_input} type="text" placeholder="Search movies.." value={searchQuery} 
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }} />
         </div>
        </div>
        <div className={styles.filter_section}>
        <div>
          <button className={styles.popularity_button} ref={saved_filter} value="popularity.desc" onClick={(e) => {filterFunction(e.target.value); setGenreId(null)}}> Popularity </button> 
          <select className={styles.filter_genre} ref={saved_filter} value="Sort by"onChange={(e) => {filterFunction(e.target.value); setGenreId(null)}}>
            <option value="Sort by"> Release by</option>
            <option value="release_date.desc">Newest</option>
            <option value="release_date.asc">Oldest</option>
          </select>

        </div>
        <div>
          <select className={styles.filter_genre} value="Genre" onChange={(e) => {
            setGenreId(e.target.value);
          }}>
              <option value="Genre">Genre</option>
              <option value="28"> Action </option>
              <option value="35"> Comedy </option>
              <option value="18"> Drama </option>
              <option value="27"> Horror </option>
              <option value="10749"> Romance </option>
              <option value="878"> Science Fiction </option>
          </select>
          
        </div>
        <div>
          <select className={styles.filter_genre} value="Ratings" onChange={(e) => {
            filterFunction(e.target.value);
            }}>
            <option value="Ratings">Ratings</option>
             <option value="vote_average.asc">Lowest Rating</option>
             <option value="vote_average.desc">Highest Rating</option>
          </select>
        </div>
        <div className={styles.pagination_container}>
          <button className={styles.pagination} onClick={previousPage}>Previous</button>
          
          <button className={styles.pagination} onClick={nextPage}>Next</button>
        </div>
        </div>
      {loggedInUser && <p>Current user: {loggedInUser}</p>}
   
    <div className={styles.movies_selection}>
         {loading ? <p>Loading movies...</p> : display_list.map((movie) => (
          <div key={movie.id} className={styles.box_movies}>
            <button className={styles.box_img_button }>
            <img src={`${baseUrl}${movie.poster_path}`} alt={movie.title} className={styles.box_img} />
            </button>
            {}
            
            <button className={styles.hover_button} onMouseEnter={() => setShowSignInFirst(false)} onClick={(e) => {
              const x = e.clientX;
              const y = e.clientY;
              setActionListPosition({x, y});
              {loggedInUser ? setShowActionlist(true) : setShowSignInFirst(true)};
              setMovie(movie);
            }}>● ● ●</button>
    
            <div className={styles.movie_details_column}>
                <h3>{movie.title}</h3>
              <button 
              className={styles.details_button} 
              onClick={() => {
                display_details(true);       
                setMovieDetails(movie);
             }}>
              View Details
             
            </button>
            
            </div>
          </div>
         ))}
         
      </div>
     </div>
    {(show_details.show && !showIsRegistering) && <ViewMovieDetails movie={movie_details} setShowDetails={setShowDetails} />}
    <div>
        {showIsRegistering && RenderBoxWindow()}
    </div>
    <div>

    </div>
     {show_profile && <ProfileWindow 
      sendDataToParent={handleshowlist}
      />}  
      {show_actionlist && <RenderActionList 
      sendDataToParent={handleshowlist}
      position={actionListPosition}
      />}
      {show_sign_in_first && <RenderSignInFirst
      sendDataToParent={handleshowlist}
      position={actionListPosition}
      />}
      {show_review && addReview(film_Movie)}
      
        {show_feedback && (
          <RenderWindowFeedback
            key={show_message_feedback}
            message={show_message_feedback}
            onClose={setShowFeedback}
          />
        )}
      
      
   </div>
    </>
   
  )
}

export default App