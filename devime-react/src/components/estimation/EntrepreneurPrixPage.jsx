import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './EntrepreneurPrixPage.css';


// Fonction pour récupérer le cookie csrf token
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let c of cookies) {
            const cookie = c.trim();
            if (cookie.startsWith(name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function MateriauxEntrepreneur() {
    const [materiaux, setMateriaux] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState('');

    // On garde une copie des prix initiaux pour comparer les modifs
    const originalPrices = useRef({});

    useEffect(() => {
        fetchMateriaux();
    }, []);

    useEffect(() => {
        // Avant de quitter la page, on vérifie si des modifs non sauvegardées existent
        const handleBeforeUnload = (e) => {
            if (hasUnsavedChanges()) {
                e.preventDefault();
                e.returnValue = ''; // Nécessaire pour certains navigateurs
                return '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [materiaux]);

    const fetchMateriaux = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/materiaux/materiaux-entrepreneur/', {
                withCredentials: true,
            });
            console.log(response.data);


            setMateriaux(response.data);
            setIsLoading(false);

            // Initialiser la copie des prix initiaux
            const pricesMap = {};
            response.data.forEach(m => {
                pricesMap[m.id] = m.prix_personnalise;
            });
            originalPrices.current = pricesMap;

        } catch (error) {
            console.error("Erreur lors du chargement des matériaux :", error);
        }
    };

    // Vérifie s'il y a des prix personnalisés modifiés non enregistrés
    const hasUnsavedChanges = () => {
        return materiaux.some(m => originalPrices.current[m.id] !== m.prix_personnalise);
    };

    const handleChange = (index, value) => {
        const updated = [...materiaux];
        updated[index].prix_personnalise = value;
        setMateriaux(updated);
    };

    const handleSave = async (materiau) => {
        try {
            const csrftoken = getCookie('csrftoken');

            await axios.post(
                'http://localhost:8000/api/materiaux/update-prix-personnalises/',
                {
                    updates: [
                        {
                            materiau_id: materiau.id,
                            prix_personnalise: materiau.prix_personnalise,
                        }
                    ]
                },
                {
                    withCredentials: true,
                    headers: {
                        'X-CSRFToken': csrftoken,
                    }
                }
            );
            // Mettre à jour le prix original après sauvegarde
            originalPrices.current[materiau.id] = materiau.prix_personnalise;

            setSuccessMessage(`✅ Prix personnalisé enregistré pour "${materiau.nom}"`);
            setTimeout(() => setSuccessMessage(''), 3000);
            fetchMateriaux();
        } catch (error) {
            console.error("Erreur lors de l'enregistrement :", error);
            alert("Erreur lors de l'enregistrement.");
        }
    };

    if (isLoading) return <p>Chargement...</p>;

    return (
        <div className="entrepreneur-prix-page">

            <div style={{ maxWidth: '900px', margin: 'auto', padding: '20px' }}>
                <h2>Mes Matériaux</h2>

                {/* Toast notification en haut à droite */}
                {successMessage && (
                    <div style={{
                        position: 'fixed',
                        top: 20,
                        right: 20,
                        backgroundColor: '#4BB543',
                        color: 'white',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                        zIndex: 9999,
                        fontWeight: 'bold',
                    }}>
                        {successMessage}
                    </div>
                )}

                <table className="materiaux-table">
                    <thead>
                        <tr>
                            <th>Matériau</th>
                            <th>Catégorie</th>
                            <th>Prix standard</th>
                            <th>Prix personnalisé</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {materiaux.map((m, index) => {
                            const isModified = originalPrices.current[m.id] !== m.prix_personnalise;
                            return (
                                <tr key={m.id} className={isModified ? "modified" : ""}>
                                    <td>{m.nom}</td>
                                    <td>{m.categorie}</td>
                                    <td>{m.prix_standard} DT</td>
                                    <td>
                                        <input
                                            type="number"
                                            value={m.prix_personnalise !== null ? m.prix_personnalise : ''}
                                            onChange={(e) => handleChange(index, e.target.value)}
                                            className="input-prix"
                                        />
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => handleSave(m)}
                                            disabled={!isModified}
                                            className="btn-enregistrer"
                                        >
                                            Enregistrer
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>

    );
}

const th = { padding: '10px', borderBottom: '1px solid #ccc' };
const td = { padding: '10px', borderBottom: '1px solid #eee' };

export default MateriauxEntrepreneur;
