import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import './EstimationGrosBetonForm.css';
import Chatbot from '../Chatbot/ChatBot';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Select from 'react-select';
import NavBar from '../NavBar';
import Footer from '../Footer';
import NavigationArrows from '../NavigationArrows';
import { useNavigate } from 'react-router-dom';
const percentage = 20;


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
  const navigate = useNavigate();
  const [typesBeton, setTypesBeton] = useState([]);
  const [formulaires, setFormulaires] = useState([]);
  const [materiaux, setMateriaux] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(true);


  // Définir showToast en dehors du useEffect pour qu'il soit accessible partout
  const showToast = (icon, title) => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 5000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
    Toast.fire({ icon, title });
  };

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
          showToast('error', "⚠️ Vous devez vous connecter pour accéder à cette page.");
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
        showToast('error', "Une erreur est survenue lors du chargement des données.");
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


  // Options pour les types de ciments
  const ciments = getMateriauxParCategorie('ciment');
  const TypeCiment = ciments.map(mat => ({
    value: mat.id,
    label: `${mat.nom} – ${mat.prix} TND/${mat.unite}`
  }));
  // Options pour les types de sable
  const sables = getMateriauxParCategorie('sable');
  const TypeSable = sables.map((mat) => ({
    value: mat.id,
    label: `${mat.nom} - ${mat.prix} TND/${mat.unite}`
  }));
  // Options pour les types de Gravier
  const graviers = getMateriauxParCategorie('gravier');
  const TypeGravier = graviers.map((mat) => ({
    value: mat.id,
    label: `${mat.nom} - ${mat.prix} TND/${mat.unite}`
  }));

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
  Swal.fire({
    icon: "warning",
    title: "⚠️ Vous devez vous connecter",
    text: "Veuillez vous connecter pour accéder à cette page.",
    confirmButtonText: "OK"
  }).then(() => {
        navigate("/login");//redirect to login page
  });

  return null; // DON T RENDER THE PAGE IF NOT AUTHENTICATED
}
  

  return (
    <>
      <NavBar variant="login" />
      <Chatbot />
      <div className="alignment">
        <CircularProgressbar
          value={percentage}
          text={`${percentage}%`}
          styles={buildStyles({
            pathTransitionDuration: 0.5,
            pathColor: '#ffc800',
            textColor: '#ffc800',
            backgroundColor: '#ffc800',
            trail: {
              stroke: '#d6d6d6',
              strokeLinecap: 'butt',
              transform: 'rotate(0.25turn)',
              transformOrigin: 'center center',
            },
          })}
        />
        <div className="form-container">
          <h1>Estimation de Traveaux</h1>
          <p><b>Note : </b>Veuillez remplir le formulaire ci-dessous pour estimer le coût de vos travaux.</p>
          <p className="disclaimer">
    ⚠️ Les informations saisies dans ce formulaire pourront être collectées anonymement afin d’améliorer notre modèle d’estimation.
    <br />  
    Le coût final pourra varier en fonction des conditions réelles du chantier et des matériaux choisis.
  </p>
          <p>Tous les champs sont obligatoires.</p>
           <br />
                    <p> Tous les prix sont exprimés en Dinar Tunisien (TND).</p>
          <h2>II) Gros Béton - Tâche 1.1</h2>
          {(() => {
            const elements = [];
            for (let index = 0; index < formulaires.length; index++) {
              const formulaire = formulaires[index];
              elements.push(
                <div key={formulaire.id} className="formulaire-beton">
                  <h4>Gros Béton {index + 1}</h4>



                  <label key={formulaire.id}>
                    Type de ciment :
                    <Select
                      styles={{
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          borderColor: state.isFocused ? '#ffc800' : baseStyles.borderColor,
                          boxShadow: state.isFocused ? '0 0 0 2px rgba(255, 200, 0, 0.3)' : baseStyles.boxShadow,
                          '&:hover': {
                            borderColor: '#ffc800',
                            boxShadow: '0 0 0 2px rgba(255, 200, 0, 0.3)',
                          },

                        }),

                      }}
                      theme={(theme) => ({
                        ...theme,
                        colors: {
                          ...theme.colors,
                          primary: '#ffc800',
                          primary25: 'rgba(255, 200, 0, 0.25)', // Optional: hovered option bg
                        },
                      })}

                      options={TypeCiment}
                      // find the option object whose value (mat.id) matches the stored ID
                      value={TypeCiment.find(opt => opt.value === formulaire.form.materiau_ciment_id) || null}
                      onChange={selectedOption =>
                        handleChange(index, 'materiau_ciment_id', selectedOption.value)
                      }
                      placeholder="Sélectionnez un ciment…"
                      isClearable
                    />
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
                    <Select
                      styles={{
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          borderColor: state.isFocused ? '#ffc800' : baseStyles.borderColor,
                          boxShadow: state.isFocused ? '0 0 0 2px rgba(255, 200, 0, 0.3)' : baseStyles.boxShadow,
                          '&:hover': {
                            borderColor: '#ffc800',
                            boxShadow: '0 0 0 2px rgba(255, 200, 0, 0.3)',
                          },

                        }),

                      }}
                      theme={(theme) => ({
                        ...theme,
                        colors: {
                          ...theme.colors,
                          primary: '#ffc800',
                          primary25: 'rgba(255, 200, 0, 0.25)', // Optional: hovered option bg
                        },
                      })}
                      isClearable
                      options={TypeSable}
                      value={TypeSable.find(option => option.value === formulaire.form.materiau_sable_id)}
                      onChange={(selectedOption) =>
                        handleChange(index, 'materiau_sable_id', selectedOption.value)
                      }
                    />
                  </label>

                  <label>
                    Quantité sable (m³) :
                    <input
                      type="number"
                      value={formulaire.form.quantite_sable_m3}
                      onChange={(e) => handleChange(index, 'quantite_sable_m3', e.target.value)}
                    />
                  </label>

                  <label key={`${formulaire.id},${index}`}>
                    Type de gravier :
                    <Select
                      styles={{
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          borderColor: state.isFocused ? '#ffc800' : baseStyles.borderColor,
                          boxShadow: state.isFocused ? '0 0 0 2px rgba(255, 200, 0, 0.3)' : baseStyles.boxShadow,
                          '&:hover': {
                            borderColor: '#ffc800',
                            boxShadow: '0 0 0 2px rgba(255, 200, 0, 0.3)',
                          },

                        }),

                      }}
                      theme={(theme) => ({
                        ...theme,
                        colors: {
                          ...theme.colors,
                          primary: '#ffc800',
                          primary25: 'rgba(255, 200, 0, 0.25)', // Optional: hovered option bg
                        },
                      })}

                      options={TypeGravier}
                      value={TypeGravier.find(opt => opt.value === formulaire.form.materiau_gravier_id)}
                      onChange={(selectedOption) =>
                        handleChange(index, 'materiau_gravier_id', selectedOption.value)
                      }
                      placeholder="Sélectionnez un gravier…"
                      isClearable
                    />
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
                  <div className="btn-container">
                    <button className="Mybutton" onClick={() => calculer(index)}>
                    💰 Calculer
                  </button>
                  <button
                    className="Mybutton"
                    type="button"
                    onClick={() => supprimerFormulaire(index)}
                    aria-label={`Supprimer formulaire ${index + 1}`}
                  >
                     Supprimer
                  </button>

                  
                  </div>
                  {formulaire.result && (
                    <div className="resultat">
                      <h4>Résultat pour Gros Béton {index + 1}</h4>
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

          <button className="Mybutton" onClick={addFormulaire}>
            + Ajouter gros béton
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
        <NavigationArrows />
      </div>
      <Footer />
    </>
  );
}
