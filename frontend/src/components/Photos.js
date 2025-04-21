import { useState, useEffect } from 'react';
import Photo from './Photo';

function Photos(){
    const [photos, setPhotos] = useState([]);

    useEffect(function(){
        fetchPhotos();
    }, [])

    async function fetchPhotos(){
        try {
            const res = await fetch("http://localhost:3001/photos");
            const data = await res.json();
            setPhotos(data);
        } catch (error) {
            console.error("Error fetching photos", error)
        }
        
    }

    function handlePhotoUpdate(updatedPhoto){
        setPhotos(photos.map(photo =>
            photo._id === updatedPhoto._id ? updatedPhoto : photo
        ))
    }

   

    return(
        <div className="container my-4">
        <div className="row">
          <div className="col">
            <div className="d-flex flex-row flex-wrap justify-content-center gap-4">
              {photos.map(photo => (
                <Photo 
                  photo={photo} 
                  key={photo._id} 
                  onPhotoUpdate={handlePhotoUpdate}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
}

export default Photos;