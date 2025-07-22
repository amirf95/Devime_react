import React, { useState } from 'react';
import axios from 'axios';
import './Task0Form.css';

const fouilleOptions = [
    {
        value: 'pleine_masse',
        label: 'Fouilles en pleine masse',
        description: "Exécutées à l’aide d'un engin mécanique, à toute profondeur.",
    },
    {
        value: 'puits',
        label: 'Fouilles en puits',
        description: 'Fondations profondes de forme carrée ou circulaire.',
    },
    {
        value: 'pieux',
        label: 'Fouilles en pieux',
        description: 'Pour fondations spéciales ou ancrages.',
    },
    {
        value: 'talus',
        label: 'Fouilles en talus',
        description: 'Fouilles inclinées avec pente naturelle du sol.',
    },

    { value: 'rigole', label: 'Fouille en rigole' },
    { value: 'tranchee', label: 'Fouille en tranchée' },
    { value: 'semelles_isolees', label: 'Fouille pour semelles isolées' },
    { value: 'decapage_terre_vegetale', label: 'Décapage de terre végétale' },

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

    const handleSolChange = (value) => {
        setSelectedSols(prev =>
            prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
        );
    };

    const handleFouilleChange = (index, field, value) => {
        const newFouilles = [...fouilles];
        newFouilles[index][field] = value;
        setFouilles(newFouilles);
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

            const res = await axios.post('http://localhost:8000/api/estimations/', payload);
            setResult(res.data);
        } catch (err) {
            console.error('Erreur détaillée :', err);
            if (err.response) {
                setError(`Erreur ${err.response.status} : ${JSON.stringify(err.response.data)}`);
            } else if (err.request) {
                setError("Le serveur n'est pas joignable.");
            } else {
                setError("Erreur inconnue : " + err.message);
            }
        }
    };

    return (
        <div className="form-container">
            <h2>Estimation - Tâche 0</h2>
            <form onSubmit={handleSubmit}>

                <fieldset>
                    <legend>Types de sol</legend>
                    {solOptions.map(opt => (
                        <label key={opt.value} style={{ display: 'block' }}>
                            <input
                                type="checkbox"
                                checked={selectedSols.includes(opt.value)}
                                onChange={() => handleSolChange(opt.value)}
                            />
                            {opt.label}
                        </label>
                    ))}
                </fieldset>

                <fieldset>
                    <legend>Fouilles</legend>
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
                                    {fouilleOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label} -- {option.description}
                                        </option>))}
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
                    <button type="button" onClick={addFouille}>+ Ajouter une fouille</button>
                </fieldset>

                <fieldset>
                    <legend>Terrassement</legend>

                    <label>Type de terrassement:</label>
                    <select
                        required
                        value={terrassement.type_terrassement}
                        onChange={e => {
                            const selectedValue = e.target.value;
                            setTerrassement({ ...terrassement, type_terrassement: selectedValue });
                        }}
                    >
                        <option value="">-- Choisir un type de terrassement --</option>
                        {terrassementOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label} –- {opt.description}
                            </option>
                        ))}
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

                <button type="submit">💰 Calculer</button>
            </form>

            {error && <div className="error-message" style={{ color: 'red', marginTop: 10 }}>{error}</div>}

            {result && (
                <div className="result-box" style={{ marginTop: 20, padding: 10, border: '1px solid #ccc' }}>
                    <h3>📋 Bilan de l’estimation</h3>
                    <p>🧱 <strong>Types de sol :</strong> {result.sols.join(', ')}</p>
                    <p>🚧 <strong>Type de terrassement :</strong> {result.type_terrassement}</p>
                    <p>📝 <strong>Description terrassement :</strong> {result.description_terrassement}</p>
                    <p>💰 <strong>Prix terrassement :</strong> {result.prix_terrassement} €</p>

                    <h4>🕳️ Fouilles :</h4>
                    <ul>
                        {result.fouilles.map((f, i) => (
                            <li key={i}>
                                - Fouille #{i + 1} : {f.type_fouille} (x{f.nombre}) — volume {f.volume.toFixed(2)} m³, prix total {f.prix_total.toFixed(2)} €
                            </li>
                        ))}
                    </ul>

                    <p>💰 <strong>Total fouilles :</strong> {result.prix_total_fouilles} €</p>
                    <p>💵 <strong>Total estimation :</strong> {result.prix_total} €</p>
                </div>
            )}
        </div>
    );
}
