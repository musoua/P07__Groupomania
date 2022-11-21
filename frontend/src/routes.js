import Landing from './views/Landing';
import Connection from './views/Connection';
import MainPage from './views/Main-page';
import Profile from './views/Profile';
import Users from './views/Users';
import User from './views/User';
import Page404 from './views/Page404';
import store from './store';

export default [
    {
        path: '/', 
        component: Landing
    },
    {
        path: '/signup', 
        component: Landing
    },
    {
        path: '/login', 
        component: Connection
    },
    {
        path: '/fil', 
        component: MainPage,
        beforeEnter(route, redirect, next){
            redirect = '/login';
            if(store.state.token === null) {
                next(redirect);
            } else {
                next();
            }
        }
    },
    {
        path: '/profile', 
        component: Profile,
        beforeEnter(route, redirect, next){
            redirect = '/login';
            if(store.state.token === null) {
                next(redirect);
            } else {
                next();
            }
        }
    },
    {
        path: '/utilisateurs', 
        component: Users,
        beforeEnter(route, redirect, next){
            redirect = '/login';
            if(store.state.token === null) {
                next(redirect);
            } else {
                next();
            }
        }
    },
    {
        path: '/utilisateur/:id', 
        component: User,
        beforeEnter(route, redirect, next){
            redirect = '/login';
            if(store.state.token === null) {
                next(redirect);
            } else {
                next();
            }
        }
    },
    {
        path: '/introuvable', 
        component: Page404,
        beforeEnter(route, redirect, next){
            redirect = '/login';
            if(store.state.token === null) {
                next(redirect);
            } else {
                next();
            }
        }
    },
    {
        path: '*', 
        component: Page404,
        beforeEnter(route, redirect, next){
            redirect = '/login';
            if(store.state.token === null) {
                next(redirect);
            } else {
                next();
            }
        }
    }
];