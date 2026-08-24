import { Route, Routes } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { PrivateRoute } from '@/components/routing/PrivateRoute';
import { PublicRoute } from '@/components/routing/PublicRoute';
import { LoginPage } from '@/pages/auth/LoginPage';
import { SignUpPage } from '@/pages/auth/SignUpPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { FreelancersListPage } from '@/pages/freelancers/FreelancersListPage';
import { FreelancerViewPage } from '@/pages/freelancers/FreelancerViewPage';
import { FreelancerCreatePage } from '@/pages/freelancers/FreelancerCreatePage';
import { FreelancerEditPage } from '@/pages/freelancers/FreelancerEditPage';
import { OrdersListPage } from '@/pages/orders/OrdersListPage';
import { OrderViewPage } from '@/pages/orders/OrderViewPage';
import { OrderCreatePage } from '@/pages/orders/OrderCreatePage';
import { OrderEditPage } from '@/pages/orders/OrderEditPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export function App() {
    return (
        <Routes>
            <Route element={<PublicRoute />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/sign-up" element={<SignUpPage />} />
            </Route>

            <Route element={<PrivateRoute />}>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<DashboardPage />} />

                    <Route path="/freelancers" element={<FreelancersListPage />} />
                    <Route path="/freelancers/create" element={<FreelancerCreatePage />} />
                    <Route path="/freelancers/:id" element={<FreelancerViewPage />} />
                    <Route path="/freelancers/:id/edit" element={<FreelancerEditPage />} />

                    <Route path="/orders" element={<OrdersListPage />} />
                    <Route path="/orders/create" element={<OrderCreatePage />} />
                    <Route path="/orders/:id" element={<OrderViewPage />} />
                    <Route path="/orders/:id/edit" element={<OrderEditPage />} />

                    <Route path="*" element={<NotFoundPage />} />
                </Route>
            </Route>
        </Routes>
    );
}
