
import {ADMIN_ROUTE, BASKET_ROUTE, DEVICE_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE, FAMILIES_ROUTE,FAMILY,USERS} from "./utils/consts";
import Families from "./pages/Families";
import Auth from "./pages/Auth";
import Family from "./pages/Family";
import Users from "./pages/Users";
import FamilyTree from "./pages/FamilyTree";

export const authRoutes = [
    {
        path: FAMILY+ '/:id',
        Component: Family
    },
    {
        path: USERS,
        Component: Users
    },
]

export const publicRoutes = [
    {
        path: FAMILIES_ROUTE,
        Component: Families
    },
    {
        path: LOGIN_ROUTE,
        Component: Auth
    },
    {
        path: REGISTRATION_ROUTE,
        Component: Auth
    },
    {
        path: DEVICE_ROUTE + '/:id',
        Component: FamilyTree
    },
]
