import { useContext, useState } from 'react';
import { UserContext } from '../userContext';

function Photo(props){
    const userContext = useContext(UserContext);
    const [photo, setPhoto] = useState(props.photo);
    const [liking, setLiking] = useState(false);
    const [disliking, setDisliking] = useState(false);
    
    // Helper function to check if user has already liked/disliked
    const hasUserLiked = () => {
        return photo.likedBy && userContext.user && 
               photo.likedBy.includes(userContext.user._id);
    };
    
    const hasUserDisliked = () => {
        return photo.dislikedBy && userContext.user && 
               photo.dislikedBy.includes(userContext.user._id);
    };

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
            
            if (props.onPhotoUpdate) {
                props.onPhotoUpdate(updatedPhoto);
            }
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
            
            if(props.onPhotoUpdate) {
                props.onPhotoUpdate(updatedPhoto);
            }
        } catch(error){
            console.error("Error when disliking photo", error);
            alert(`${error.message}`);
        } finally {
            setDisliking(false);
        }
    }

    return (
        <div className="card bg-dark text-dark mb-2">
            <img className="card-img" src={"http://localhost:3001/"+props.photo.path} alt={props.photo.name}/>
            <div className="card-img-overlay">
                <h5 className="card-title">{props.photo.name}</h5>
                <h5 className="card-title">{props.photo.message}</h5>
                <div className="like-section">
                    <button 
                        className={`btn ${hasUserLiked() ? 'btn-success' : userContext.user ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={handleLike}
                        disabled={!userContext.user || liking || hasUserLiked()}
                    >
                        {liking ? 'Liking...' : `${photo.likes || 0} 👍`}
                    </button>
                    <button
                        className={`btn ${hasUserDisliked() ? 'btn-dark' : 'btn-danger'}`}
                        onClick={handleDislike}
                        disabled={!userContext.user || disliking || hasUserDisliked()}
                    >
                        {disliking ? 'Disliking...' : `${photo.dislikes || 0} 👎`}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Photo;