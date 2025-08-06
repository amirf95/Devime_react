import React, { useEffect, useState } from 'react';
import './EstimationGrosBetonForm.css';

// Utilitaire pour lire le cookie CSRF
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

export default function GrosBetonGroup() {
  const [typesBeton, setTypesBeton] = useState([]);
  const [formulaires, setFormulaires] = useState([]);
  const [materiaux, setMateriaux] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const resTypes = await fetch('http://localhost:8000/api/fondation/types-beton/', {
          credentials: 'include',
          headers: { 'X-CSRFToken': getCookie('csrftoken') },
        });
        const data = await resTypes.json();
        const typeGrosBeton = data.find(type => type.nom.toLowerCase().includes('gros béton'));

        const resMateriaux = await fetch('http://localhost:8000/api/materiaux/materiaux-avec-prix/', {
          credentials: 'include',
          headers: { 'X-CSRFToken': getCookie('csrftoken') },
        });

        if (resMateriaux.status === 403 || resMateriaux.status === 401) {
          alert("Vous devez vous connecter pour accéder aux matériaux.");
          setIsAuthenticated(false);
          return;
        }

        const matData = await resMateriaux.json();
        setMateriaux(matData);

        // Fetch prix main d'oeuvre dynamique
        const resMO = await fetch('http://localhost:8000/api/materiaux/main-oeuvre-prix/', {
          credentials: 'include',
          headers: { 'X-CSRFToken': getCookie('csrftoken') },
        });

        let prixMO = 11; // valeur par défaut
        if (resMO.ok) {
          const moData = await resMO.json();
          if (moData.prix !== undefined) {
            prixMO = parseFloat(moData.prix);
          }
        }

        if (typeGrosBeton) {
          const formulaireInitial = createFormulaire(typeGrosBeton, matData);
          formulaireInitial.form.prix_main_oeuvre = prixMO; // injection prix main oeuvre dynamique
          setTypesBeton([typeGrosBeton]);
          setFormulaires([formulaireInitial]);
        }

      } catch (error) {
        console.error('Erreur fetch générale :', error);
        alert("Une erreur est survenue lors du chargement des données.");
        setIsAuthenticated(false);
      }
    }
    fetchData();
  }, []);

  const getMateriauxParCategorie = (nomCategorie) => {
    return materiaux.filter((mat) => mat.categorie.toLowerCase() === nomCategorie.toLowerCase());
  };

  const createFormulaire = (type, data = materiaux) => {
    const ciments = data.filter((m) => m.categorie.toLowerCase() === 'ciment');
    const sables = data.filter((m) => m.categorie.toLowerCase() === 'sable');
    const graviers = data.filter((m) => m.categorie.toLowerCase() === 'gravier');

    const ciment = ciments[0] || null;
    const sable = sables[0] || null;
    const gravier = graviers[0] || null;

    return {
      id: Date.now(),
      type_beton: type,
      form: {
        nb_sacs_ciment: type.nb_sacs_ciment,
        quantite_sable_m3: type.quantite_sable_m3,
        quantite_gravier_m3: type.quantite_gravier_m3,
        quantite_eau_litres: type.quantite_eau_litres,
        longueur: 0,
        largeur: 0,
        hauteur: 0,
        prix_transport: 0,
        prix_main_oeuvre: 30,
        materiau_ciment_id: ciment?.id || '',
        materiau_sable_id: sable?.id || '',
        materiau_gravier_id: gravier?.id || '',
      },
      result: null,
    };
  };

const addFormulaire = () => {
  if (formulaires.length > 0) {
    const premierFormulaire = formulaires[0];
    const formCopie = { ...premierFormulaire.form };
    const newForm = {
      id: Date.now(),
      type_beton: premierFormulaire.type_beton,
      form: formCopie,
      result: null,
    };
    setFormulaires([...formulaires, newForm]);
  } else if (typesBeton.length > 0) {
    // Pas de formulaire existant, on recrée un formulaire initial à partir du type beton
    const nouveauFormulaire = createFormulaire(typesBeton[0], materiaux);
    setFormulaires([nouveauFormulaire]);
  }
};

  const supprimerFormulaire = (index) => {
    const newFormulaires = [...formulaires];
    newFormulaires.splice(index, 1);
    setFormulaires(newFormulaires);
  };

  const handleChange = (index, field, value) => {
    const newFormulaires = [...formulaires];
    newFormulaires[index].form[field] = field.includes('id') ? value : parseFloat(value) || 0;
    setFormulaires(newFormulaires);
  };

  const getPrixMateriau = (id) => {
    const m = materiaux.find((m) => m.id.toString() === id.toString());
    return m ? parseFloat(m.prix) || 0 : 0;
  };

  const calculer = (index) => {
    const f = formulaires[index].form;
    const volume = f.longueur * f.largeur * f.hauteur;

    const prix_ciment = f.nb_sacs_ciment * getPrixMateriau(f.materiau_ciment_id);
    const prix_sable = f.quantite_sable_m3 * getPrixMateriau(f.materiau_sable_id);
    const prix_gravier = f.quantite_gravier_m3 * getPrixMateriau(f.materiau_gravier_id);
    const prix_total_m3 = prix_ciment + prix_sable + prix_gravier + f.prix_main_oeuvre + f.prix_transport;
    const prix_total = volume * prix_total_m3;

    const newFormulaires = [...formulaires];
    newFormulaires[index].result = {
      volume,
      prix_m3: prix_total_m3.toFixed(2),
      prix_total: prix_total.toFixed(2),
    };
    setFormulaires(newFormulaires);
  };

  const prixTotalGeneral = formulaires.reduce(
    (acc, f) => acc + (f.result ? parseFloat(f.result.prix_total) : 0),
    0
  );

  if (!isAuthenticated) {
    return <p style={{ color: 'red' }}>⚠️ Vous devez vous connecter pour accéder à cette page.</p>;
  }

  return (
    <div className="gros-beton-wrapper">
      <h2>Estimation de Gros Béton</h2>
      {(() => {
        const elements = [];
        for (let index = 0; index < formulaires.length; index++) {
          const formulaire = formulaires[index];
          elements.push(
            <div key={formulaire.id} className="formulaire-beton">
              <h4>Formulaire {index + 1}</h4>

              {/* Bouton supprimer ajouté */}
              <button
                className="btn-supprimer"
                style={{ marginBottom: '10px', backgroundColor: '#f44336', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}
                onClick={() => supprimerFormulaire(index)}
                aria-label={`Supprimer formulaire ${index + 1}`}
              >
                ❌ Supprimer
              </button>

              <label>
                Type de ciment :
                <select
                  value={formulaire.form.materiau_ciment_id}
                  onChange={(e) => handleChange(index, 'materiau_ciment_id', e.target.value)}
                >
                  {(() => {
                    const options = [];
                    const ciments = getMateriauxParCategorie('ciment');
                    for (let i = 0; i < ciments.length; i++) {
                      const mat = ciments[i];
                      options.push(
                        <option key={mat.id} value={mat.id}>
                          {mat.nom} - {mat.prix} TND/{mat.unite}
                        </option>
                      );
                    }
                    return options;
                  })()}
                </select>
              </label>

              {/* ... le reste des labels inchangé ... */}

              <label>
                Nombre de sacs de ciment :
                <input
                  type="number"
                  value={formulaire.form.nb_sacs_ciment}
                  onChange={(e) => handleChange(index, 'nb_sacs_ciment', e.target.value)}
                />
              </label>

              <label>
                Type de sable :
                <select
                  value={formulaire.form.materiau_sable_id}
                  onChange={(e) => handleChange(index, 'materiau_sable_id', e.target.value)}
                >
                  {(() => {
                    const options = [];
                    const sables = getMateriauxParCategorie('sable');
                    for (let i = 0; i < sables.length; i++) {
                      const mat = sables[i];
                      options.push(
                        <option key={mat.id} value={mat.id}>
                          {mat.nom} - {mat.prix} TND/{mat.unite}
                        </option>
                      );
                    }
                    return options;
                  })()}
                </select>
              </label>

              <label>
                Quantité sable (m³) :
                <input
                  type="number"
                  value={formulaire.form.quantite_sable_m3}
                  onChange={(e) => handleChange(index, 'quantite_sable_m3', e.target.value)}
                />
              </label>

              <label>
                Type de gravier :
                <select
                  value={formulaire.form.materiau_gravier_id}
                  onChange={(e) => handleChange(index, 'materiau_gravier_id', e.target.value)}
                >
                  {(() => {
                    const options = [];
                    const graviers = getMateriauxParCategorie('gravier');
                    for (let i = 0; i < graviers.length; i++) {
                      const mat = graviers[i];
                      options.push(
                        <option key={mat.id} value={mat.id}>
                          {mat.nom} - {mat.prix} TND/{mat.unite}
                        </option>
                      );
                    }
                    return options;
                  })()}
                </select>
              </label>

              <label>
                Quantité gravier (m³) :
                <input
                  type="number"
                  value={formulaire.form.quantite_gravier_m3}
                  onChange={(e) => handleChange(index, 'quantite_gravier_m3', e.target.value)}
                />
              </label>

              <label>
                Quantité d'eau (litres) :
                <input
                  type="number"
                  value={formulaire.form.quantite_eau_litres}
                  onChange={(e) => handleChange(index, 'quantite_eau_litres', e.target.value)}
                />
              </label>

              <label>
                Longueur (m) :
                <input
                  type="number"
                  value={formulaire.form.longueur}
                  onChange={(e) => handleChange(index, 'longueur', e.target.value)}
                />
              </label>

              <label>
                Largeur (m) :
                <input
                  type="number"
                  value={formulaire.form.largeur}
                  onChange={(e) => handleChange(index, 'largeur', e.target.value)}
                />
              </label>

              <label>
                Hauteur (m) :
                <input
                  type="number"
                  value={formulaire.form.hauteur}
                  onChange={(e) => handleChange(index, 'hauteur', e.target.value)}
                />
              </label>

              <label>
                Prix de transport (TND) :
                <input
                  type="number"
                  value={formulaire.form.prix_transport}
                  onChange={(e) => handleChange(index, 'prix_transport', e.target.value)}
                />
              </label>

              <label>
                Prix main d'œuvre (TND) :
                <input
                  type="number"
                  value={formulaire.form.prix_main_oeuvre}
                  onChange={(e) => handleChange(index, 'prix_main_oeuvre', e.target.value)}
                />
              </label>

              <button className="btn-calculer" onClick={() => calculer(index)}>
                Calculer
              </button>

              {formulaire.result && (
                <div className="resultat">
                  <p>
                    <strong>Volume :</strong> {formulaire.result.volume.toFixed(2)} m³
                  </p>
                  <p>
                    <strong>Prix par m³ :</strong> {formulaire.result.prix_m3} TND
                  </p>
                  <p>
                    <strong>Prix total :</strong> {formulaire.result.prix_total} TND
                  </p>
                </div>
              )}
            </div>
          );
        }
        return elements;
      })()}

      <button className="btn-ajouter" onClick={addFormulaire}>
        ➕ Ajouter un gros béton
      </button>

      <div className="recapitulatif">
        <h3>Récapitulatif général</h3>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Volume (m³)</th>
              <th>Prix/m³ (TND)</th>
              <th>Prix total (TND)</th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              const rows = [];
              for (let i = 0; i < formulaires.length; i++) {
                const f = formulaires[i];
                if (f.result) {
                  rows.push(
                    <tr key={f.id}>
                      <td>{i + 1}</td>
                      <td>{f.result.volume.toFixed(2)}</td>
                      <td>{f.result.prix_m3}</td>
                      <td>{f.result.prix_total}</td>
                    </tr>
                  );
                }
              }
              return rows;
            })()}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3">Prix total général</td>
              <td>{prixTotalGeneral.toFixed(2)} TND</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
