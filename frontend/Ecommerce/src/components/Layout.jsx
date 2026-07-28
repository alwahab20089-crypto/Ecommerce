import Header from "./Header";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({ children, searchValue = "", onSearchChange = () => {} }) => {
  return (
    <>
    <div className="pt-10 pr-4 pl-4 md:pr-13 md:pl-13">
      <Navbar />
      <Header value={searchValue} onChange={onSearchChange} />
      {children}
      <Footer />
    </div>
    </>
  );
};

export default Layout;