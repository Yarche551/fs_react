import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from '@/app/store';
import { App } from './App';

import '@fortawesome/fontawesome-free/css/all.min.css';
import 'admin-lte/dist/css/adminlte.min.css';
import 'icheck-bootstrap/icheck-bootstrap.min.css';
import 'react-datepicker/dist/react-datepicker.css';
import './styles/styles.scss';

const container = document.getElementById('root');

if (!container) {
    throw new Error('Не найден корневой элемент #root');
}

createRoot(container).render(
    <StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>
    </StrictMode>,
);
