import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../userContext';
import { Navigate } from 'react-router-dom';

function Profile(){
    const userContext = useContext(UserContext); 
    const [profile, setProfile] = useState({});

    useEffect(function(){
        const getProfile = async function(){
            const res = await fetch("http://localhost:3001/users/profile", {credentials: "include"});
            const data = await res.json();
            setProfile(data);
        }
        getProfile();
    }, []);

    return (
        <>
            {!userContext.user ? <Navigate replace to="/login" /> : ""}
            <div class="row d-flex justify-content-center">
            <div class="col col-md-9 col-lg-7 col-xl-6">
            <div class="card" >
                <div class="card-body p-4">
                    <div class="d-flex">
                            <div class="flex-grow-1 ms-3">
                                <h2 className="mb-1">User profile</h2>
                                <h5 class="mb-1">{profile.username}</h5>
                                <h5 class="mb-1">{profile.email}</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

            
        </>
    );
}

export default Profile;