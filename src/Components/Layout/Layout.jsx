import Appnav from '../Navbar/Navbar'
import { Outlet } from 'react-router-dom'
import Footer from '../Footer/Footer'

export default function Layout() {
  return (
    <>
      <Appnav />
      <div className="pb-16 md:pb-0">
        <Outlet />
      </div>
      <Footer />
    </>
  )
}
