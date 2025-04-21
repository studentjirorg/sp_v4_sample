import { useContext, useState } from 'react'
import { Navigate } from 'react-router';
import { UserContext } from '../userContext';

function AddPhoto(props) {
    const userContext = useContext(UserContext); 
    const[name, setName] = useState('');
    const[file, setFile] = useState('');
    const[message, setMessage] = useState('');
    const[uploaded, setUploaded] = useState(false);

    async function onSubmit(e){
        e.preventDefault();

        if(!name){
            alert("Vnesite ime!");
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('image', file);
        formData.append('message', message);
        const res = await fetch('http://localhost:3001/photos', {
            method: 'POST',
            credentials: 'include',
            body: formData
        });
        const data = await res.json();

        setUploaded(true);
    }

    return (
        <form className="form-group m-5" onSubmit={onSubmit}>
            {!userContext.user ? <Navigate replace to="/login" /> : ""}
            {uploaded ? <Navigate replace to="/" /> : ""}
            <input type="text" className="form-control m-2" name="ime" placeholder="Ime slike" value={name} onChange={(e)=>{setName(e.target.value)}}/>
            <input type="text" className="form-control m-2" name="sporocilo" placeholder="Dodaj sporocilo" value={message} onChange={(e)=>{setMessage(e.target.value)}}/>
            <input type="file" className = "m-2" id="file" onChange={(e)=>{setFile(e.target.files[0])}}/>
            <hr className="m-2" />
            <input className="btn btn-primary m-2" type="submit" name="submit" value="Naloži" />
        </form>
    )
}

export default AddPhoto;