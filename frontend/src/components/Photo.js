import { useContext, useState, useEffect } from 'react';
import { UserContext } from '../userContext';
import { Link } from 'react-router-dom';


function Photo(props){



    const [photo, setPhoto] = useState(props.photo);
    const userContext = useContext(UserContext);
    const [liking, setLiking] = useState(false);
    const [disliking, setDisliking] = useState(false);

    const hasUserLiked = () => {
        return photo.likedBy && userContext.user && 
               photo.likedBy.includes(userContext.user._id);
    };
    
    const hasUserDisliked = () => {
        return photo.dislikedBy && userContext.user && 
               photo.dislikedBy.includes(userContext.user._id);
    };

    useEffect(() => {
        if (photo.reports && photo.reports.length >= 3 && props.onPhotoUpdate) {
            props.onPhotoUpdate(photo);
        }
    }, [photo, props.onPhotoUpdate]);

    async function handleLike(e){
        if (liking) return;
        
        if (!userContext.user) {
            alert("Please log in to like photos");
            return;
        }
        
        try {
            setLiking(true);
            
            const response = await fetch(`http://localhost:3001/photos/${photo._id}/like`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Server error:", errorData);
                throw new Error(errorData.error || "Error liking photo");
            }
            
            const updatedPhoto = await response.json();
            setPhoto(updatedPhoto);
            

        } catch (error) {
            console.error("Error liking photo:", error);
            alert(`${error.message}`);
        } finally {
            setLiking(false);
        }
    }
    
    async function handleDislike(e){
        if (disliking) return;
        
        if(!userContext.user){
            alert("Please login to dislike photos");
            return;
        }
        
        try{
            setDisliking(true);
            
            const response = await fetch(`http://localhost:3001/photos/${photo._id}/dislike`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if(!response.ok){
                const errorData = await response.json();
                console.error("Server error:", errorData);
                throw new Error(errorData.error || "Error when disliking photo");
            }
            
            const updatedPhoto = await response.json();
            setPhoto(updatedPhoto);
            

        } catch(error){
            console.error("Error when disliking photo", error);
            alert(`${error.message}`);
        } finally {
            setDisliking(false);
        }
    }


    return (
            <div className="card bg-white text-dark shadow-sm rounded-4 mb-4 mx-2" style={{ width: '22rem' }}>
            <img 
            className="card-img-top rounded-top" 
            style={{ objectFit: 'contain', height: 300  }}
            src={`http://localhost:3001/${props.photo.path}`} 
            alt={props.photo.name} 
            />
        
            <div className="card-body d-flex flex-column">
            <h5 className="card-title fw-semibold text-center mb-3">{props.photo.name}</h5>
        
            <div className="d-flex justify-content-around mb-3">
            <button 
                        className={`btn ${hasUserLiked() ? 'btn-success' : userContext.user ? 'btn-primary' : 'btn-secondary'} me-2`}
                        onClick={handleLike}
                        disabled={!userContext.user || liking || hasUserLiked()}
                    >
                        {liking ? 'Liking...' : `${photo.likes || 0} 👍`}
            </button>
            <button
                className={`btn ${hasUserDisliked() ? 'btn-dark' : 'btn-danger'}`}
                onClick={handleDislike}
                disabled={!userContext.user || disliking || hasUserDisliked()}>
                {disliking ? 'Disliking...' : `${photo.dislikes || 0} 👎`}
            </button>
            </div>
        
            <div className="text-muted small mb-2 text-center">
                <i className="bi bi-clock"></i> {new Date(props.photo.createdAt).toLocaleString()}
            </div>
            
            <div className="text-muted small text-center mb-3">
                <i className="bi bi-person-circle"></i> {props.photo.postedBy.username}
            </div>
        
            <Link 
                to={`/photos/${props.photo._id}`} 
                className="btn btn-outline-primary btn-sm mt-auto align-self-end"
            >
                View Details
            </Link>
            </div>
        </div>


    );
}

export default Photo;