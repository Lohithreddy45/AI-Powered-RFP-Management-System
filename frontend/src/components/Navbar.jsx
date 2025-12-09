import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-title">AI RFP System</div>
      <nav className="navbar-links">
        <Link className="navbar-link" to="/">
          Create RFP
        </Link>
        <Link className="navbar-link" to="/rfps">
          RFP List
        </Link>
        <Link className="navbar-link" to="/vendors">
          Vendors
        </Link>
        <Link className="navbar-link" to="/proposals">
          Proposals
        </Link>
      </nav>
    </header>
  );
}
