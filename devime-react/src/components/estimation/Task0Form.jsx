    import React, { useState } from 'react';
    import axios from 'axios';
    import './Task0Form.css';
    import NavBar from '../NavBar';
    import Chatbot from '../Chatbot/ChatBot';
    import Footer from '../Footer';
    import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
    import 'react-circular-progressbar/dist/styles.css';
    import NavigationArrows from '../NavigationArrows';
    import { useNavigate } from 'react-router-dom';
    import Swal from 'sweetalert2';

    
    const percentage = 10;

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


    const fouilleTypes = [
        { value: 'pleine_masse', label: 'Fouille en pleine masse' },
        { value: 'rigole', label: 'Fouille en rigole' },
        { value: 'tranchee', label: 'Fouille en tranchée' },
        { value: 'semelles_isolees', label: 'Fouille pour semelles isolées' },
        { value: 'puits', label: 'Fouille en puits' },
        { value: 'decapage_terre_vegetale', label: 'Décapage de terre végétale' },
        { value: 'talus', label: 'Fouille en talus' },
        { value: 'pieux', label: 'Fouille en pieux' },
    ];

    const solOptions = [
        //   { value: 'terre_molle', label: 'Terre molle (5 – 18 €/m³)' },
        //   { value: 'terre_compacte', label: 'Terre compacte (10 – 25 €/m³)' },
        //   { value: 'roche_froide', label: 'Roche froide (60 – 240 €/m³)' },
        //   { value: 'sol_contamine', label: 'Sol contaminé (+10 – 30 €/m³)' },
        //   { value: 'transport_longue_distance', label: 'Transport longue distance (+5 – 20 €/m³)' },
        { value: 'argile', label: 'Argile' },
        { value: 'sable', label: 'Sable' },
        { value: 'limon', label: 'Limon' },
        { value: 'roche', label: 'Roche' },
        { value: 'compact_meuble', label: 'Sol compact/meuble' },
    ];

    const terrassementOptions = [
        {
            value: 'deblais',
            label: 'Déblais',
            description: 'Enlèvement de terre pour abaisser le niveau du terrain',
        },
        {
            value: 'remblais',
            label: 'Remblais',
            description: 'Apport de matériaux pour surélever ou combler une zone',
        },
        {
            value: 'mixte',
            label: 'Mixte',
            description: 'Association de déblais et remblais',
        },
        {
            value: 'modelage',
            label: 'Modelage de terrain',
            description: 'Mise en forme finale (pente, drainage, accès)',
        },
    ];


    export default function Task0Form() {
        const navigate = useNavigate();
        const [isAuthenticated, setIsAuthenticated] = useState(true);
        const [selectedSols, setSelectedSols] = useState([]);
        const [fouilles, setFouilles] = useState([
            {
                type_fouille: '',
                longueur: '',
                largeur: '',
                profondeur: '',
                diametre: '',
                volume_supplementaire: '',
                prix_unitaire: '',
                nombre: 1
            }
        ]);
        const [terrassement, setTerrassement] = useState({ type_terrassement: '', prix_terrassement: '', description: '' });
        const [result, setResult] = useState(null);
        const [error, setError] = useState('');

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

        const handleSolChange = (value) => {
            setSelectedSols(prev =>
                prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
            );
        };

    const handleFouilleChange = (index, field, value) => {
    const updatedFouilles = [...fouilles];
    updatedFouilles[index][field] = value; // ici on garde value = type.value
    setFouilles(updatedFouilles);
    };

        const addFouille = () => {
            setFouilles([
                ...fouilles,
                {
                    type_fouille: '',
                    longueur: '',
                    largeur: '',
                    profondeur: '',
                    diametre: '',
                    volume_supplementaire: '',
                    prix_unitaire: '',
                    nombre: 1
                }
            ]);
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            setError('');
            try {
                const formattedFouilles = fouilles.map(f => ({
                    type_fouille: f.type_fouille,
                    longueur: f.longueur ? parseFloat(f.longueur) : null,
                    largeur: f.largeur ? parseFloat(f.largeur) : null,
                    profondeur: parseFloat(f.profondeur),
                    diametre: f.diametre ? parseFloat(f.diametre) : null,
                    volume_supplementaire: f.volume_supplementaire ? parseFloat(f.volume_supplementaire) : null,
                    prix_unitaire: parseFloat(f.prix_unitaire),
                    nombre: parseInt(f.nombre),
                }));

                const payload = {
                    sols: selectedSols,
                    fouilles: formattedFouilles,
                    type_terrassement: terrassement.type_terrassement,
                    prix_terrassement: parseFloat(terrassement.prix_terrassement),
                    description_terrassement: terrassement.description
                };

                const csrfToken = getCookie('csrftoken');

                const res = await axios.post(
                    'http://localhost:8000/api/estimations/',
                    payload,
                    { headers: { 'X-CSRFToken': csrfToken } }
                );
                setResult(res.data);
            } catch (err) {
                if (err.response) {
                    if ([401, 403].includes(err.response.status)) {
                        setIsAuthenticated(false);
                        Swal.fire({
                            icon: "warning",
                            title: "⚠️ Session expirée",
                            text: "Veuillez vous reconnecter.",
                            confirmButtonText: "OK"
                        }).then(() => navigate("/login"));
                        return;
                    }
                    setError(`Erreur ${err.response.status} : ${JSON.stringify(err.response.data)}`);
                } else if (err.request) {
                    showToast("error", "Le serveur n'est pas joignable.");
                } else {
                    showToast("error", "Erreur inconnue : " + err.message);
                }
                if (!isAuthenticated) {
                    Swal.fire({
                        icon: "warning",
                        title: "⚠️ Vous devez vous connecter",
                        text: "Veuillez vous connecter pour accéder à cette page.",
                        confirmButtonText: "OK"
                    }).then(() => {
                        navigate("/login");//redirect to login page
                    });


                    return null; // or redirect to login
                }
            }
        };

        return (
            <>
                <NavBar variant="login" />
                <Chatbot />
                
                <div className='alignment content' >
                    {/* <CircularProgressbar value={percentage} text={`${percentage}%`} styles={buildStyles({
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
                    })} /> */}
                    <div className="form-container">
                        <h1>Estimation de travaux</h1>
                        <p><b>Note : </b>Veuillez remplir le formulaire ci-dessous pour estimer le coût de vos travaux.</p>
                        <p>Tous les champs sont obligatoires.</p>
                        <h2>I) Fouilles - Tâche 0</h2>
                        <form onSubmit={handleSubmit}>
                            <fieldset>
                                <legend>1) Types de sol</legend>
                                {solOptions.map(opt => (
                                    <div className="checkbox-group" key={opt.value}>
                                        <label className="checkbox-label">
                                            {opt.label}
                                            <input
                                                type="checkbox"
                                                checked={selectedSols.includes(opt.value)}
                                                onChange={(e) => handleSolChange(opt.value)}

                                            />
                                        </label>
                                    </div>
                                ))}
                            </fieldset>
                            <fieldset>
                                <legend>2) Fouilles</legend>
                                {fouilles.map((fouille, index) => {
                                    const isPieuxOuPuits = ['pieux', 'puits'].includes(fouille.type_fouille);
                                    const isTalus = fouille.type_fouille === 'talus';
                                    return (
                                        <div key={index} className="fouille-group">
                                            <h4>Fouille #{index + 1}</h4>
                                            <label>Type:</label>
                                            <select
                                                required
                                                value={fouille.type_fouille}
                                                onChange={e => handleFouilleChange(index, 'type_fouille', e.target.value)}
                                            >
                                                <option value="">-- Choisir un type de fouille --</option>
                                                {fouilleTypes.map(option => (
                                                    <option key={option.value} value={option.value}>{option.label}</option>
                                                ))}
                                            </select>
                                            {!isPieuxOuPuits && (
                                                <>
                                                    <label>Longueur (m):</label>
                                                    <input
                                                        type="number" min="0" step="0.01"
                                                        value={fouille.longueur}
                                                        onChange={e => handleFouilleChange(index, 'longueur', e.target.value)}
                                                    />
                                                    <label>Largeur (m):</label>
                                                    <input
                                                        type="number" min="0" step="0.01"
                                                        value={fouille.largeur}
                                                        onChange={e => handleFouilleChange(index, 'largeur', e.target.value)}
                                                    />
                                                </>
                                            )}
                                            <label>Profondeur (m):</label>
                                            <input
                                                type="number" min="0" step="0.01" required
                                                value={fouille.profondeur}
                                                onChange={e => handleFouilleChange(index, 'profondeur', e.target.value)}
                                            />
                                            {isPieuxOuPuits && (
                                                <>
                                                    <label>Diamètre (m):</label>
                                                    <input
                                                        type="number" min="0" step="0.01" required
                                                        value={fouille.diametre}
                                                        onChange={e => handleFouilleChange(index, 'diametre', e.target.value)}
                                                    />
                                                </>
                                            )}
                                            {isTalus && (
                                                <>
                                                    <label>Volume supplémentaire selon pente (m³):</label>
                                                    <input
                                                        type="number" min="0" step="0.01"
                                                        value={fouille.volume_supplementaire}
                                                        onChange={e => handleFouilleChange(index, 'volume_supplementaire', e.target.value)}
                                                    />
                                                </>
                                            )}
                                            <label>Prix unitaire (€):</label>
                                            <input
                                                type="number" min="0" step="0.01" required
                                                value={fouille.prix_unitaire}
                                                onChange={e => handleFouilleChange(index, 'prix_unitaire', e.target.value)}
                                            />
                                            <label>Nombre:</label>
                                            <input
                                                type="number" min="1"
                                                value={fouille.nombre}
                                                onChange={e => handleFouilleChange(index, 'nombre', e.target.value)}
                                            />
                                        </div>
                                    );
                                })}
                                <button className='Mybutton' type="button" onClick={addFouille}>+ Ajouter une fouille</button>
                            </fieldset>
                            <fieldset>
                                <legend>3) Terrassement</legend>
                                <label>Type de terrassement:</label>
                                <select
                                    required
                                    value={terrassement.type_terrassement}
                                    onChange={e => setTerrassement({ ...terrassement, type_terrassement: e.target.value })}
                                >

                                    <option value="">-- Choisir un type --</option>
                                    {terrassementOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                </select>
                                <label>Prix total terrassement (€):</label>
                                <input
                                    type="number" min="0" step="0.01" required
                                    value={terrassement.prix_terrassement}
                                    onChange={e => setTerrassement({ ...terrassement, prix_terrassement: e.target.value })}
                                />
                                <label>Description:</label>
                                <textarea
                                    value={terrassement.description}
                                    onChange={e => setTerrassement({ ...terrassement, description: e.target.value })}
                                />
                            </fieldset>
                            <button type="submit" className='Mybutton'>💰 Calculer</button>
                        </form>
                        {error && <div className="error-message" style={{ color: 'red', marginTop: 10 }}>{error}</div>}
                        {result && (
                            <div className="result-box" style={{ marginTop: 20, padding: 10, border: '1px solid #ccc' }}>
                                <h3>Bilan de l’estimation</h3>
                                <p><strong>Types de sol :</strong> {result.sols.join(', ')}</p>
                                <p><strong>Type de terrassement :</strong> {result.type_terrassement}</p>
                                <p><strong>Description terrassement :</strong> {result.description_terrassement}</p>
                                <p><strong>Prix terrassement :</strong> {result.prix_terrassement} €</p>
                                <h4>Fouilles :</h4>
                                <ul>
                                    {result.fouilles.map((f, i) => (
                                        <li key={i}>
                                            Fouille {i + 1} : {f.type_fouille} (x{f.nombre}) — volume {f.volume.toFixed(2)} m³, prix total {f.prix_total.toFixed(2)} €
                                        </li>
                                    ))}
                                </ul>
                                <p><strong>Cout total fouilles :</strong> {result.prix_total_fouilles} €</p>
                                <p><strong>Total estimation :</strong> {result.prix_total} €</p>
                            </div>
                        )}
                    </div>
                    <NavigationArrows />
                </div>
                <Footer />
            </>
        );
    }
