import {Outlet} from 'react-router-dom';
import Navbar from './Navbar';

function Layout() {
    return (
        <div>
            <Navbar/>
            <main className='container mt-4'>
                <Outlet />
            </main>
            {/*<Footer/>*/}
        </div>
    )
}

export default Layout;