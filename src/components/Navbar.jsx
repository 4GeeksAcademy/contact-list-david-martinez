import { Link } from "react-router-dom";

export const Navbar = () => {

	return (
		<nav className="navbar navbar-dark bg-dark border-bottom border-secondary">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1 text-info">Contact Agenda</span>
				</Link>
				<div className="ms-auto">
					<Link to="/add">
						<button className="btn btn-outline-info fw-bold">Add Contact</button>
					</Link>
				</div>
			</div>
		</nav>
	);
};
