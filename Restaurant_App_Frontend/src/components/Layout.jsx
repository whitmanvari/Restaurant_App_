import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer'; 

function Layout() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar/>
            
            {/* Navbar fixed olduğu için içeriğin altında kalmaması adına marginTop veriyoruz 
                veya Hero section kullanıyorsak 0 padding ile başlatıyoruz. 
                Home sayfasında Hero olduğu için padding-top 0 olmalı*/}
            <main style={{ flex: 1 }}> 
                <Outlet />
            </main>
            
            <Footer/>
        </div>
    )
}

export default Layout;