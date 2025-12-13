import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { authService } from '../../services/authService'; 

export default function UserProfileForm() {
    const { user } = useSelector(state => state.auth);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Form state'i
    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        address: '',
        city: ''
    });

    // Sayfa açılınca verileri servisten çek
    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                // TOKEN'dan değil, VERİTABANINDAN çekiyoruz
                const profileData = await authService.getProfile();
                
                setFormData({
                    fullName: profileData.fullName || '',
                    phoneNumber: profileData.phoneNumber || '',
                    address: profileData.address || '',
                    city: profileData.city || ''
                });
            } catch (error) {
                console.error("Profil çekilemedi, Redux verisi kullanılıyor:", error);
                // Hata olursa Redux'taki temel veriyle doldur (fallback)
                if (user) {
                    setFormData(prev => ({
                        ...prev,
                        fullName: user.fullName || ''
                    }));
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfileData();
    }, [user]); 

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await authService.updateProfile(formData);
            toast.success("Profil bilgileriniz güncellendi.");
        } catch (error) {
            console.error(error);
            toast.error("Güncelleme başarısız oldu.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div className="text-center p-3">Yükleniyor...</div>;

    return (
        <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-bottom-0 pt-4 px-4">
                <h5 className="mb-0" style={{ fontFamily: 'Playfair Display' }}>Profil Bilgilerim</h5>
            </div>
            <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label small text-muted">Ad Soyad</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            name="fullName" 
                            value={formData.fullName} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className="row g-3 mb-3">
                        <div className="col-md-6">
                            <label className="form-label small text-muted">Telefon</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                name="phoneNumber" 
                                value={formData.phoneNumber} 
                                onChange={handleChange} 
                                placeholder="05XX..." 
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label small text-muted">Şehir</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                name="city" 
                                value={formData.city} 
                                onChange={handleChange} 
                                placeholder="Şehir"
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="form-label small text-muted">Adres</label>
                        <textarea 
                            className="form-control" 
                            rows="3" 
                            name="address" 
                            value={formData.address} 
                            onChange={handleChange}
                            placeholder="Adres detayları"
                        ></textarea>
                    </div>
                    <button type="submit" className="btn btn-dark w-100" disabled={isSubmitting}>
                        {isSubmitting ? 'Güncelleniyor...' : 'Bilgileri Kaydet'}
                    </button>
                </form>
            </div>
        </div>
    );
}