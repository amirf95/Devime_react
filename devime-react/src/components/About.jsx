function About() {
    
    return(
        <section className="page-section" id="about">
            <div className="container">
                <div className="text-center">
                    <h2 className="section-heading text-uppercase">A propos nous</h2>
                    <h3 className="section-subheading text-muted">Un grand remerciement aux participant de ce projet .</h3>
                </div>
                <ul className="timeline">
                    <li>
                        <div className="timeline-image"><img className="rounded-circle img-fluid" src="/src/assets/img/about/1.jpg" alt="..." /></div>
                        <div className="timeline-panel">
                            <div className="timeline-heading">
                                <h4>2024-2025</h4>
                                <h4 className="subheading">Nos débuts</h4>
                            </div>
                            <div className="timeline-body"><p className="text-muted">Étude de projet avec création de cahier des charges détaillé, analyse des besoins, estimation budgétaire, et proposition de solutions techniques adaptées. </p></div>
                        </div>
                    </li>
                    <li className="timeline-inverted">
                        <div className="timeline-image"><img className="rounded-circle img-fluid" src="/src/assets/img/about/2.jpg" alt="..." /></div>
                        <div className="timeline-panel">
                            <div className="timeline-heading">
                                <h4>june 2025</h4>
                                <h4 className="subheading">Debut de réalisation</h4>
                            </div>
                            
                            <div className="timeline-body">
                               <p className="text-muted">
                                    Après plusieurs réunions, notre équipe composée de trois étudiants a commencé la réalisation du projet avec le soutien de Capbon Travaux.
                                    Un grand remerciement aux encadrants du projet, M. John Dohe et Mme Priscilla Olawawe.
                                </p>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="timeline-image"><img className="rounded-circle img-fluid" src="/src/assets/img/about/3.jpg" alt="..." /></div>
                        <div className="timeline-panel">
                            <div className="timeline-heading">
                                <h4>Fin 2025</h4>
                                <h4 className="subheading">Livraison du site</h4>
                            </div>
                            <div className="timeline-body"><p className="text-muted"> 
                                Notre objectif est de livrer un site fonctionnel, moderne et accessible pour faciliter la génération de devis en ligne.</p></div>
                        </div>
                    </li>
                    <li className="timeline-inverted">
                        <div className="timeline-image"><img className="rounded-circle img-fluid" src="/src/assets/img/about/4.jpg" alt="..." /></div>
                        <div className="timeline-panel">
                            <div className="timeline-heading">
                                <h4>Juillet 2026</h4>
                                <h4 className="subheading">Phase d'amélioration</h4>
                            </div>
                            <div className="timeline-body"><p className="text-muted"> Après le lancement initial, nous visons une deuxième phase d’amélioration avec des mises à jour basées sur les retours des utilisateurs et l’intégration de nouvelles fonctionnalités.</p></div>
                        </div>
                    </li>
                    <li className="timeline-inverted">
                        <div className="d-flex align-items-center justify-content-center h-100">
                            <h4>
                                 Faites partie
                                <br />
                                de notre
                                <br />
                                histoire !
                            </h4>
                        </div>
                    </li>
                </ul>
            </div>
        </section>
    )
}
export default About