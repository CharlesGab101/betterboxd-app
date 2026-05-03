import { useEffect, useState } from "react";
import { useMemo } from "react";

function useApiVideoKey(movie) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const bearer = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNjk0MjI1NmEwZjg0YjM0ZjlmMmVhMjE4MWZjNzhlMyIsIm5iZiI6MTc3MTkxNzI3MS40NDA5OTk4LCJzdWIiOiI2OTlkNGZkN2Q1NTc5MjJhYmUwNjVkMDciLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.rfnc_0ya1FAP_dJfXqTX6vEEPWnmdu_NJblTMW1ASfI'
    const options = useMemo(() => ({
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNjk0MjI1NmEwZjg0YjM0ZjlmMmVhMjE4MWZjNzhlMyIsIm5iZiI6MTc3MTkxNzI3MS44NDA5OTk4LCJzdWIiOiI2OTlkNGZkN2Q1NTc5MjJhYmUwNjVkMDciLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.rfnc_0ya1FAP_dJfXqTX6vEEPWnmdu_NJblTMW1ASfI'
    }
    }), []);

    useEffect(() => {
        const fetchvideo  = async () => {
            try {
            const response = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}/videos?language=en-US`, options);
            const data = await response.json();
            setData(data)
        } finally {
            setLoading(false);
        } 
    };
    fetchvideo(); 
    },[options, movie.id]);

    return { data, loading };
}

function RenderVideo({ movie }) {
    const { data: videoData, loading } = useApiVideoKey(movie);
    
    if (loading || !videoData.results || videoData.results.length === 0) {
        return <div>Loading video...</div>;
    }

    const videoKey = videoData.results[0].key;
    return (
        <div>
            <div>
                <iframe 
                width="700" 
                height="450" 
                src={`https://www.youtube.com/embed/${videoKey}`} 
                allowFullScreen 
                title="Video player"/>
            </div>
        </div>
    )

}

export default RenderVideo;