import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function PhotoDetails() {
    const { id } = useParams();
    const [photo, setPhoto] = useState(null);

    useEffect(() => {
        fetchPhoto();
    }, [id]);

    async function fetchPhoto() {
        try {
            const res = await fetch(`http://localhost:3001/photos/${id}`);

            if (!res.ok) {
                const errorData = await res.json();
                console.error("Server error", errorData);
                throw new Error(errorData.error || "Error fetching photo");
            }

            const data = await res.json();
            setPhoto(data);
        } catch (error) {
            console.error("Server error", error);
            alert(`${error.message}`);
        }
    }

    if (!photo) return <div className="text-light">Loading...</div>;

    return (
        <div className="container text-light bg-dark p-4">
            <h2>{photo.name}</h2>
            <img className="img-fluid mb-3" src={`http://localhost:3001/${photo.path}`} alt={photo.name} />
        </div>
    );
}

export default PhotoDetails;
