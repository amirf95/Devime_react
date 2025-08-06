import React, { useEffect, useState } from 'react';
import './EstimationSemelles.css';
import NavBar from '../NavBar';
import Chatbot from '../Chatbot/ChatBot';
import Footer from '../Footer';
import NavigationArrows from '../NavigationArrows';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Select from 'react-select'

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

export default function SemelleGroup() {
    const [typesBeton, setTypesBeton] = useState([]);
    const [formulaires, setFormulaires] = useState([]);
    const [materiaux, setMateriaux] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [typesSemelle, setTypesSemelle] = useState([]);
    // const [formesComplexes, setFormesComplexes] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const resTypes = await fetch('http://localhost:8000/api/fondation/types-beton/', {
                    credentials: 'include',
                    headers: { 'X-CSRFToken': getCookie('csrftoken') },
                });
                const data = await resTypes.json();
                const typesSemelle = data.find(type => type.nom.toLowerCase().includes('semelle'));

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

                if (typesSemelle) {
                    const formulaireInitial = createFormulaire(typesSemelle, matData);
                    formulaireInitial.form.prix_main_oeuvre = prixMO; // injection prix main oeuvre dynamique
                    setTypesBeton([typesSemelle]);
                    setFormulaires([formulaireInitial]);

                }

                const resTypesSemelle = await fetch('http://localhost:8000/api/fondation/types-semelle/', {
                    credentials: 'include',
                    headers: { 'X-CSRFToken': getCookie('csrftoken') },
                });
                const dataSemelle = await resTypesSemelle.json();
                setTypesSemelle(dataSemelle);


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
                epaisseur: 0,
                prix_transport: 0,
                prix_main_oeuvre: 30,
                type_semelle: "Semelle Isolée",
                largeur_b2: 0,    // <-- ajouté pour "Double Semelle"
                l_t: 0,           // <-- ajouté pour "Semelle Complexe"
                l_t2: 0,          // idem
                e_t: 0,           // idem
                formes_complexes: [], // Liste des formes (rectangle, cercle, triangle)

                materiau_ciment_id: ciment?.id || '',
                materiau_sable_id: sable?.id || '',
                materiau_gravier_id: gravier?.id || '',
            },
            result: null,
        };
    };

    // Options pour les types de semelles
    const TypeSemelleOptions = [
        { value: '', label: 'Choisir un type' },
        { value: 'Semelle Isolée', label: 'Semelle Isolée' },
        { value: 'Semelle Radiée', label: 'Semelle Radiée' },
        { value: 'Semelle Filante', label: 'Semelle Filante' },
        { value: 'Semelle de Répartition', label: 'Semelle de Répartition' },
        { value: 'Semelle à Double Semelle', label: 'Semelle à Double Semelle' },
        { value: 'Semelle Complexe', label: 'Semelle Complexe' }
    ];

    // Options pour les types de sable
    const sables = getMateriauxParCategorie('sable');
    const TypeSable = sables.map((mat) => ({
        value: mat.id,
        label: `${mat.nom} - ${mat.prix} TND/${mat.unite}`
    }));
    // Options pour les types de ciments
    const ciments = getMateriauxParCategorie('ciment');
    const TypeCiment = ciments.map(mat => ({
        value: mat.id,
        label: `${mat.nom} – ${mat.prix} TND/${mat.unite}`
    }));
    // Options pour les types de Gravier
    const graviers = getMateriauxParCategorie('gravier');
    const TypeGravier = graviers.map((mat) => ({
        value: mat.id,
        label: `${mat.nom} - ${mat.prix} TND/${mat.unite}`
    }));

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
        newFormulaires[index].form[field] = value;
        setFormulaires(newFormulaires);
    };

    const getPrixMateriau = (id) => {
        const m = materiaux.find((m) => m.id.toString() === id.toString());
        return m ? parseFloat(m.prix) || 0 : 0;
    };

    const calculer = (index) => {
        const f = formulaires[index].form;
        let volume = 0;
        const toFloat = (v) => parseFloat(v) || 0; switch (f.type_semelle) {
            case 'Semelle Isolée':
            case 'Semelle Radiée':
            case 'Semelle Filante':
            case 'Semelle de Répartition':
                volume = toFloat(f.longueur) * toFloat(f.largeur) * toFloat(f.epaisseur);
                break;
            case 'Semelle à Double Semelle':
                volume = 0.5 * (toFloat(f.largeur) + toFloat(f.largeur_b2)) * toFloat(f.longueur) * toFloat(f.epaisseur);
                break;
            case 'Semelle Complexe':
                volume = f.formes_complexes.reduce((acc, form) => {
                    const d = form.dimensions;
                    switch (form.type) {
                        case 'rectangle':
                            return acc + (toFloat(d.longueur) * toFloat(d.largeur) * toFloat(d.hauteur));
                        case 'cercle':
                            return acc + (Math.PI * Math.pow(toFloat(d.rayon), 2) * toFloat(d.hauteur));
                        case 'triangle':
                            return acc + (0.5 * toFloat(d.base) * toFloat(d.hauteur) * toFloat(d.profondeur)); // si profondeur = longueur
                        default:
                            return acc;
                    }
                }, 0);
                break;
            default:
                volume = 0;
        }
        const prix_ciment = toFloat(f.nb_sacs_ciment) * getPrixMateriau(f.materiau_ciment_id);
        const prix_sable = toFloat(f.quantite_sable_m3) * getPrixMateriau(f.materiau_sable_id);
        const prix_gravier = toFloat(f.quantite_gravier_m3) * getPrixMateriau(f.materiau_gravier_id);

        const prix_total_m3 = prix_ciment + prix_sable + prix_gravier + toFloat(f.prix_main_oeuvre) + toFloat(f.prix_transport);
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


    /*const ajouterFormeComplexe = () => {
      const nouvelleForme = {
        id: formesComplexes.length + 1, // Numérotation automatique
        type: "rectangle",
        dimensions: {
          longueur: 0,
          largeur: 0,
          hauteur: 0,
          rayon: 0,
          base: 0
        }
      };
    
      setFormesComplexes((prev) => [...prev, nouvelleForme]);
    };
    */



    const renderChampsSemelle = (formulaire, index) => {
        const { type_semelle } = formulaire.form;

        const champs = [];

        const champ = (label, field) => (
            <label key={field}>
                {label} :
                <input
                    type="number"
                    value={formulaire.form[field]}
                    onChange={(e) => handleChange(index, field, e.target.value)}
                />
            </label>
        );

        if (type_semelle === 'Semelle Isolée' || type_semelle === 'Semelle Radiée' || type_semelle === 'Semelle Filante' || type_semelle === 'Semelle de Répartition') {
            champs.push(champ('Longueur (m)', 'longueur'));
            champs.push(champ('Largeur (m)', 'largeur'));
            champs.push(champ('Epaisseur (m)', 'epaisseur'));
        } else if (type_semelle === 'Semelle à Double Semelle') {
            champs.push(champ('Longueur (m)', 'longueur'));
            champs.push(champ('Largeur B1 (m)', 'largeur'));
            champs.push(champ('Largeur B2 (m)', 'largeur_b2'));
            champs.push(champ('Epaisseur (m)', 'epaisseur'));
        } else if (type_semelle === 'Semelle Complexe') {
            const formes = formulaire.form.formes_complexes;

            champs.push(
                <div key="formes-complexes">
                    <h5>Formes complexes :</h5>
                    {formes.map((forme, idx) => (
                        <div key={idx} className="forme-complexe">
                            <label>
                                Type :
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

                                options={TypeSemelleOptions}

                                    value={forme.type}
                                    onChange={(e) => {
                                        const newFormulaires = [...formulaires];
                                        newFormulaires[index].form.formes_complexes[idx].type = e.target.value;
                                        setFormulaires(newFormulaires);
                                    }}
                                >

                                </Select>
                            </label>

                            {/* Champs selon type */}
                            {(() => {
                                const d = forme.dimensions;
                                const makeInput = (label, key) => (
                                    <label>
                                        {label} :
                                        <input
                                            type="number"
                                            value={d[key]}
                                            onChange={(e) => {
                                                const newFormulaires = [...formulaires];
                                                newFormulaires[index].form.formes_complexes[idx].dimensions[key] = e.target.value;
                                                setFormulaires(newFormulaires);
                                            }}
                                        />
                                    </label>
                                );
                                switch (forme.type) {
                                    case 'rectangle':
                                        return <>
                                            {makeInput("Longueur (m)", "longueur")}
                                            {makeInput("Largeur (m)", "largeur")}
                                            {makeInput("Hauteur (m)", "hauteur")}
                                        </>;
                                    case 'cercle':
                                        return <>
                                            {makeInput("Rayon (m)", "rayon")}
                                            {makeInput("Hauteur (m)", "hauteur")}
                                        </>;
                                    case 'triangle':
                                        return <>
                                            {makeInput("Base (m)", "base")}
                                            {makeInput("Hauteur (m)", "hauteur")}
                                            {makeInput("Profondeur (m)", "profondeur")}
                                        </>;
                                    default:
                                        return null;
                                }
                            })()}

                            <button
                                type="button"
                                onClick={() => {
                                    const newFormulaires = [...formulaires];
                                    newFormulaires[index].form.formes_complexes.splice(idx, 1);
                                    setFormulaires(newFormulaires);
                                }}
                                style={{ backgroundColor: '#ffaaaa', border: 'none', padding: '2px 6px', marginLeft: '10px', cursor: 'pointer' }}
                            >
                                ❌ Supprimer
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => {
                            const newFormulaires = [...formulaires];
                            newFormulaires[index].form.formes_complexes.push({
                                type: 'rectangle',
                                dimensions: {
                                    longueur: 0,
                                    largeur: 0,
                                    hauteur: 0,
                                    rayon: 0,
                                    base: 0,
                                    profondeur: 0
                                }
                            });
                            setFormulaires(newFormulaires);
                        }}
                        style={{ marginTop: '10px' }}
                    >
                        ➕ Ajouter une forme
                    </button>
                </div>
            );
        }

        return champs;
    };

    {/* here the true html starts all above is just functionalityy :) */ }
    return (
        <>
            <NavBar variant="login" />
            <Chatbot />
            <div className='alignment'>
                <CircularProgressbar value={percentage} text={`${percentage}%`} styles={buildStyles({
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
                })} />
                <div className="form-container">
                    <h1>Estimation de travaux</h1>
                    <p><b>Note : </b>Veuillez remplir le formulaire ci-dessous pour estimer le coût de vos travaux.</p>
                    <p>Tous les champs sont obligatoires.</p>
                    <h2>II) Semelles - Tâche 1</h2>
                    {/*
                    <form >
                        <fieldset>
                    */ }

                    {(() => {
                        const elements = [];
                        for (let index = 0; index < formulaires.length; index++) {
                            const formulaire = formulaires[index];
                            elements.push(
                                <div key={formulaire.id} >
                                    <h4>Semelle {index + 1}</h4>

                                    {/* Bouton supprimer ajouté 
                                    <button
                                        className="btn-supprimer"
                                        style={{ marginBottom: '10px', backgroundColor: '#f44336', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}
                                        onClick={() => supprimerFormulaire(index)}
                                        aria-label={`Supprimer formulaire ${index + 1}`}
                                    >
                                        ❌ Supprimer
                                    </button>
                                    */}

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
                                        Nombre de sacs de ciment (m³):
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
                                        Type de semelle :
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

                                            options={TypeSemelleOptions}
                                            value={
                                                TypeSemelleOptions.find(opt => opt.value === formulaire.form.type_semelle) || null
                                            }
                                            onChange={(selectedOption) =>
                                                handleChange(index, 'type_semelle', selectedOption.value)
                                            }
                                            placeholder="Choisir un type"
                                            isClearable
                                        />
                                    </label>
                                    {/* Affichage dynamique des champs selon le type sélectionné */}
                                    {renderChampsSemelle(formulaire, index)}

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
                                    <button
                                        className="btn-supprimer"
                                        style={{ marginBottom: '10px', backgroundColor: '#f44336', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}
                                        onClick={() => supprimerFormulaire(index)}
                                        aria-label={`Supprimer formulaire ${index + 1}`}
                                    >
                                        ❌ Supprimer
                                    </button>

                                    {formulaire.result && (
                                        <div className="result-box">
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

                    {/*
                        </fieldset>
                    </form>
*/ }


                    <button className="btn-ajouter" onClick={addFormulaire}>
                        Ajouter une semelle
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
