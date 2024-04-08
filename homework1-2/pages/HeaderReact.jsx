function HeaderReact() {
    function logout() {
        localStorage.removeItem('jpToken');
        sessionStorage.removeItem('jpToken');
    }
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid" style={{ width: "100%" }}>
                <a href="/" className="navbar-brand"><i className="fas fa-code me-2"></i>JP Computer Systems</a>
                <button className="navbar-toggler" data-bs-target="#my-nav" data-bs-toggle="collapse" aria-controls="my-nav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div id="my-nav" className="collapse navbar-collapse">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item active">
                            <a href="/" className="nav-link"><i className="fas fa-home me-1"></i>Home</a>
                        </li>
                        <li className="nav-item active">
                            <a href="/register" className="nav-link"><i className="fa-solid fa-id-card me-1"></i>Register</a>
                        </li>
                        <li className="nav-item active">
                            <a href="/members" className="nav-link"><i className="fas fa-user-plus me-1"></i>Users</a>
                        </li>
                        <li className="nav-item active">
                            <a href="/reviews" className="nav-link"><i className="fa-solid fa-book"></i>&nbsp;Look at Reviews</a>
                        </li>
                        <li className="nav-item active">
                            <form className="d-flex" role="search" id="reviewForm" action="/reviews" method="GET">
                                <input className="form-control me-2" id="reviewInput" name="review" type="text" placeholder="Search For Movie Reviews" aria-label="Search" />
                                <button className="btn btn-outline-info" id="reviewButton" type="submit">Search For Movie Reviews</button>
                            </form>
                        </li>
                        <li className="nav-item active">
                            <a href="/about" className="nav-link"><i className="fas fa-globe me-1"></i>About</a>
                        </li>
                        <li className="nav-item active">
                            <a href="/contact" className="nav-link"><i className="fas fa-envelope me-1"></i>Contact</a>
                        </li>
                        <li className="nav-item active">
                            <a href="/login" className="nav-link"><i className="fa-solid fa-arrow-right-to-bracket me-1"></i>Login</a>
                        </li>
                        <li className="nav-item active">
                            <a href="#" onClick={logout} className="nav-link"><i className="fa-solid fa-person-walking-arrow-right"></i>&nbsp;Logout</a>
                        </li>
                        <li className="nav-item active">
                            <form className="d-flex" role="search" id="searchForm" action="/api-data" method="GET">
                                <input className="form-control me-2" id="searchInput" name="query" type="text" placeholder="Search For Movies..." aria-label="Search" />
                                <button className="btn btn-outline-info" id="searchButton" type="submit">Search For Movies</button>
                            </form>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default HeaderReact;
