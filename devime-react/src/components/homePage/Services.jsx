function Services() {
    return(
        <section id="services">
            <div className="container">
                <div className="text-center">
                    <h2 className="section-heading text-uppercase">Nos services</h2>
                    <h3 className="typewriter">Choisissez le type de devis qui vous convient.</h3>
                </div>
                <div className="row text-center justify-content-center">
                    <div className="col-md-6">
                        <div className="estimation-card">
                            <span className="fa-stack fa-4x">
                                <i className="fas fa-circle fa-stack-2x text-warning"></i>
                                <i className="fas fa-calculator fa-stack-1x fa-inverse"></i>
                            </span>
                            <h4 className="my-3">Estimation de devis</h4>
                            <p className="text-muted">Obtenez une estimation rapide de votre projet en quelques clics sans entrer dans les détails.</p>
                        </div>
                    </div>

      
                    <div className="col-md-6">
                        <div className="devis-card">
                            <span className="fa-stack fa-4x">
                                <i className="fas fa-circle fa-stack-2x text-warning"></i>
                                <i className="fas fa-file-invoice-dollar fa-stack-1x fa-inverse"></i>
                            </span>
                            <h4 className="my-3">Devis professionelle </h4>
                            <p className="text-muted">Recevez un devis détaillé et précis basé sur des informations complètes et spécifiques à votre projet.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
    
}
export default Services