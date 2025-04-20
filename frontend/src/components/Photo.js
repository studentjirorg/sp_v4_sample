import { useContext, useState } from 'react';
import { UserContext } from '../userContext';
import { Link } from 'react-router-dom';


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

    async function onComment(e){
        e.preventDefault(); // Prevent the default form submission
    
        if (!userContext.user) {
            alert("Please log in to comment on photos");
            return;
        }
    
        const commentText = e.target.elements.commentText.value.trim();
        
        if (!commentText) {
            alert("Comment cannot be empty");
            return;
        }
    
        try {
            const response = await fetch(`http://localhost:3001/photos/${photo._id}/comment`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: commentText })
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Server error:", errorData);
                throw new Error(errorData.error || "Error when commenting photo");
            }
            
            const updatedPhoto = await response.json();
            setPhoto(updatedPhoto);
            
            if (props.onPhotoUpdate) {
                props.onPhotoUpdate(updatedPhoto);
            }
            
            e.target.elements.commentText.value = '';
        } catch (error) {
            console.error("Error when commenting photo", error);
            alert(`${error.message}`);
        }
    }

    return (
        <div className="card bg-dark text-light mb-2">
        <img className="card-img-top w-25" src={`http://localhost:3001/${props.photo.path}`} alt={props.photo.name} />
        
        <div className="card-body">
            <h5 className="card-title">{props.photo.name}</h5>
            <p>{props.photo.message}</p>

            <div className="mb-3">
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
                    disabled={!userContext.user || disliking || hasUserDisliked()}
                >
                    {disliking ? 'Disliking...' : `${photo.dislikes || 0} 👎`}
                </button>
            </div>

            <h5>Comments</h5>
            {photo.comments && photo.comments.length > 0 ? (
                <div className="comments-list mb-3">
                    {photo.comments.map((comment, index) => (
                        <div key={index} className="comment">
                            <strong>{comment.postedBy?.username || 'User'}:</strong> {comment.text}
                        </div>
                    ))}
                </div>
            ) : (
                <p>No comments yet</p>
            )}

            <form onSubmit={onComment}>
                <div className="form-group">
                    <label>Add a comment:</label>
                    <input 
                        name="commentText"
                        type="text" 
                        className="form-control"
                    />
                </div>
                <button className="btn btn-primary mt-2" type="submit">
                    Submit
                </button>
            </form>

            <Link to={`/photos/${photo._id}`} className="btn btn-outline-light btn-sm ms-auto">
                                View Details
            </Link>
        </div>
    </div>


    );
}

export default Photo;