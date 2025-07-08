import './header.css'
function Header() {
    return (
        <header className="masthead">
            <div className="container">
                <div className="masthead-subheading">
                    Devemi premier calculateur du devis en{" "}
                    
                        <b>Tunisie</b>
                    
                </div>
                <div className="masthead-heading text-uppercase">
                    Bienvenue chez Devime
                </div>
                <a className="btn btn-primary btn-xl text-uppercase" href="#services">
                    Découvrez nos services
                </a>
            </div>
        </header>
    );
}

export default Header;
