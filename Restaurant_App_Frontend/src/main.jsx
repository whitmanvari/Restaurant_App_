import './styles/main.scss';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import {Provider} from 'react-redux';
import {store} from './store/store.js';
import {BrowserRouter} from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import '@fortawesome/fontawesome-free/css/all.min.css';

createRoot(document.getElementById('root')).render(
  <Provider store ={store}>
    <ThemeProvider> 
      <BrowserRouter>  
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </Provider>
)
