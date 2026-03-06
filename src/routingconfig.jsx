import Login from './Pages/LOGIN/Login'
import Layout from './Components/Layout/Layout'
import Posts from './Pages/Posts/Posts'
import Register from './Pages/Register/Register'
import Profail from './Pages/Profail/Profail'
import Notifications from './Pages/Notifications/Notifications'
import FriendRequests from './Pages/FriendRequests/FriendRequests'
import {createBrowserRouter} from 'react-router-dom'
import AuthGuard from './Guards/AuthGuard'
import PostGuard from './Guards/PostGuard'
import PostDetails from './Pages/PostDetails/PostDetails'
import ChangePassword from './Components/changePassword/ChangePassword'
import Bookmarks from './Pages/Bookmarks/Bookmarks'
import UserProfile from './Pages/UserProfile/UserProfile'

export const routes = createBrowserRouter([
  {path:'/',element:<Layout/>,children:[
    {index:true,element:<PostGuard><Posts/></PostGuard>},
    {path:'login',element:<AuthGuard><Login/></AuthGuard>},
    {path:'register',element:<AuthGuard><Register/></AuthGuard>},
    {path:'profail',element:<PostGuard><Profail/></PostGuard>},
    {path:'user/:id',element:<PostGuard><UserProfile/></PostGuard>},
    {path:'bookmarks',element:<PostGuard><Bookmarks/></PostGuard>},
    {path:'notifications',element:<PostGuard><Notifications/></PostGuard>},
    {path:'requests',element:<PostGuard><FriendRequests/></PostGuard>},
    {path:'postDetails/:id',element:<PostGuard><PostDetails/></PostGuard>},
    {path:'changePassword',element:<PostGuard><ChangePassword/></PostGuard>},
  ]}
])