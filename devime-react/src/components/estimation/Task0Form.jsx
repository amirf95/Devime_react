import React, { useState } from 'react';
import axios from 'axios';
import './Task0Form.css';

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
  { value: 'argile', label: 'Argile' },
  { value: 'sable', label: 'Sable' },
  { value: 'limon', label: 'Limon' },
  { value: 'roche', label: 'Roche' },
  { value: 'compact_meuble', label: 'Sol compact/meuble' },
];

const terrassementOptions = [
  { value: 'deblais', label: 'Déblais' },
  { value: 'remblais', label: 'Remblais' },
  { value: 'mixte', label: 'Mixte' },
  { value: 'modelage', label: 'Modelage de terrain' },
];

export default function Task0Form() {
  const [fouilles, setFouilles] = useState([
    { type_fouille: '', longueur: '', largeur: '', profondeur: '', diametre: '', prix_unitaire: '', nombre: 1 }
  ]);
  const [sol, setSol] = useState('');
  const [terrassement, setTerrassement] = useState({ type_terrassement: '', prix_terrassement: '', description: '' });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFouilleChange = (index, field, value) => {
    const newFouilles = [...fouilles];
    newFouilles[index][field] = value;
    setFouilles(newFouilles);
  };

  const addFouille = () => {
    setFouilles([...fouilles, { type_fouille: '', longueur: '', largeur: '', profondeur: '', diametre: '', prix_unitaire: '', nombre: 1 }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Formatage des fouilles (parse float/int)
      const formattedFouilles = fouilles.map(f => ({
        type_fouille: f.type_fouille,
        longueur: f.longueur ? parseFloat(f.longueur) : null,
        largeur: f.largeur ? parseFloat(f.largeur) : null,
        profondeur: parseFloat(f.profondeur),
        diametre: f.diametre ? parseFloat(f.diametre) : null,
        prix_unitaire: parseFloat(f.prix_unitaire),
        nombre: parseInt(f.nombre),
        // **NE PAS envoyer `estimation` ici**
      }));

      // Payload avec noms attendus côté backend
      const payload = {
        sol,
        fouilles: formattedFouilles,
        type_terrassement: terrassement.type_terrassement,
        prix_terrassement: parseFloat(terrassement.prix_terrassement),
        description: terrassement.description
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
          <legend>Type de sol</legend>
          <select required value={sol} onChange={e => setSol(e.target.value)}>
            <option value="">-- Choisir un sol --</option>
            {solOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </fieldset>

        <fieldset>
          <legend>Fouilles</legend>
          {fouilles.map((fouille, index) => (
            <div key={index} className="fouille-group">
              <h4>Fouille #{index + 1}</h4>

              <label>Type:</label>
              <select
                required
                value={fouille.type_fouille}
                onChange={e => handleFouilleChange(index, 'type_fouille', e.target.value)}
              >
                <option value="">-- Choisir un type --</option>
                {fouilleTypes.map(ft => <option key={ft.value} value={ft.value}>{ft.label}</option>)}
              </select>

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

              <label>Profondeur (m):</label>
              <input
                type="number" min="0" step="0.01" required
                value={fouille.profondeur}
                onChange={e => handleFouilleChange(index, 'profondeur', e.target.value)}
              />

              {['pieux', 'puits'].includes(fouille.type_fouille) && (
                <>
                  <label>Diamètre (m):</label>
                  <input
                    type="number" min="0" step="0.01" required
                    value={fouille.diametre}
                    onChange={e => handleFouilleChange(index, 'diametre', e.target.value)}
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
          ))}
          <button type="button" onClick={addFouille}>+ Ajouter une fouille</button>
        </fieldset>

        <fieldset>
          <legend>Terrassement</legend>

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

        <button type="submit">💰 Calculer</button>
      </form>

      {error && <div className="error-message" style={{ color: 'red', marginTop: 10 }}>{error}</div>}

      {result && (
        <div className="result-box" style={{ marginTop: 20, padding: 10, border: '1px solid #ccc' }}>
          <h3>Résultat de l’estimation</h3>
          <p>Volume total de fouilles : {result.volume_total_fouilles} m³</p>
          <p>Prix total fouilles : {result.prix_total_fouilles} €</p>
          <p>Prix total estimation : {result.prix_total} €</p>
        </div>
      )}
    </div>
  );
}
