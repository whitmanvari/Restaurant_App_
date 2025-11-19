import React from 'react';
import { useSelector } from 'react-redux';

function UserProfilePage() {
    const { user } = useSelector(state => state.auth);

    return (
        <div className="container mt-5 pt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow-sm border-0">
                        <div className="card-body text-center p-5">
                            <img
                                src={`https://ui-avatars.com/api/?name=${user?.email}&size=128&background=c5a059&color=fff`}
                                className="rounded-circle mb-3"
                                alt="Profile"
                            />
                            <h2>{user?.fullName || 'Lezzet Tutkunu'}</h2>
                            <p className="text-muted">{user?.email}</p>
                            <p className="badge bg-secondary">{user?.role === 'User' ? 'Müşteri' : user?.role}</p>

                            <hr className="my-4" />

                            <div className="d-grid gap-2 col-6 mx-auto">
                                <button className="btn btn-outline-dark">Tüm Masa Siparişleri</button>
                                <button className="btn btn-outline-dark">Rezervasyonlar</button>
                                <button className="btn btn-outline-dark">Adres Bilgilerim</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default UserProfilePage;