import React, { useState } from 'react';
import './star_rating.css';


const StarRating = ({sendDataToParent}) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const handleRatingChange = (newRating) => {
    setRating(newRating);
    sendDataToParent(newRating);
  }
  return (
    <div className="star_rating">
      <span className='star_text'>Rating        </span>
      <span className='star_text2'>{rating} out of 5 </span>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          //star <= (hover || rating) ? "star_filled" : "star_empty"
          className={star <= (hover || rating) ? "star_filled" : "star_empty"}
          onClick={() => handleRatingChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
        >
          <span className="star">&#9733;</span>                                 
        </button>
      ))}
    </div>
  );
};

export default StarRating;