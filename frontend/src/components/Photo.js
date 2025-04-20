import { useContext, useState } from 'react';
import { UserContext } from '../userContext';
import { Link } from 'react-router-dom';


function Photo(props){
    const [photo, setPhoto] = useState(props.photo);


    return (
        <div className="card bg-dark text-light mb-2">
        <img className="card-img-top w-25" src={`http://localhost:3001/${props.photo.path}`} alt={props.photo.name} />
        
        <div className="card-body">
            <h5 className="card-title">{props.photo.name}</h5>
            <div className="mb-3">
                <button 
                    className='btn-success'
                    disabled={true}
                >
                    {photo.likes}
                </button>
                <button
                    className= 'btn-danger'
                    disabled={true}
                >
                    {photo.dislikes}
                    </button>
            </div>

           

            <text>{props.photo.createdAt}</text>
            <hr></hr>
            <text>{props.photo.postedBy.username}</text>

            <hr></hr>

            <Link to={`/photos/${photo._id}`} className="btn btn-outline-light btn-sm ms-auto">
                                View Details
            </Link>
        </div>
    </div>


    );
}

export default Photo;