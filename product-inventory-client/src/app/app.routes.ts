import { Products } from './Components/products/products';
import { Routes } from '@angular/router';
import { Login } from './Components/login/login';
import { Register } from './Components/register/register';
import { AuthGuard } from './guards/auth.guard';



const routes: Routes = [
  // Route for the Login component
  { path: 'login', component: Login },

  // Route for the Register component
  { path: 'register', component: Register },

  // Route for the Orders component
  { path: 'components/products', component: Products, canActivate: [AuthGuard] },

  // Default route: Redirects the empty path (root URL) to '/login'
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
export default routes;
