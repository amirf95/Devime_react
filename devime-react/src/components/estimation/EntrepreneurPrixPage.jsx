import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './EntrepreneurPrixPage.css';
import NavBar from '../NavBar';  // <-- ici l'import relatif

// Fonction pour récupérer le cookie CSRF
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
    const [searchTerm, setSearchTerm] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategorie, setSelectedCategorie] = useState('');

    const originalPrices = useRef({});

    useEffect(() => {
        fetchMateriaux();
        fetchCategories();
    }, []);

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (hasUnsavedChanges()) {
                e.preventDefault();
                e.returnValue = '';
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

            setMateriaux(response.data);
            setIsLoading(false);

            const pricesMap = {};
            response.data.forEach(m => {
                pricesMap[m.id] = m.prix_personnalise;
            });
            originalPrices.current = pricesMap;

        } catch (error) {
            console.error("Erreur lors du chargement des matériaux :", error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/materiaux/categories-liste/', {
                withCredentials: true,
            });
            setCategories(response.data);
        } catch (error) {
            console.error("Erreur chargement des catégories :", error);
        }
    };

    const hasUnsavedChanges = () => {
        return materiaux.some(m => originalPrices.current[m.id] !== m.prix_personnalise);
    };

const handleChange = (id, value) => {
    const updated = materiaux.map((m) => {
        if (m.id === id) {
            return { ...m, prix_personnalise: value };
        }
        return m;
    });
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
                          <NavBar variant="login"/>

            <div style={{ maxWidth: '900px', margin: 'auto', padding: '20px' }}>
                <h2>Mes Matériaux</h2>

                {/* ✅ Zone de recherche */}
                <div className="recherche-wrapper">
                    <input
                        type="text"
                        placeholder="🔍 Rechercher par nom, prix ou catégorie"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input-recherche"
                    />
                    <select
                        value={selectedCategorie}
                        onChange={(e) => setSelectedCategorie(e.target.value)}
                        className="select-categorie"
                    >
                        <option value="">Toutes les catégories</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.nom}>{cat.nom}</option>
                        ))}
                    </select>
                </div>

                {/* ✅ Notification */}
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
                        {materiaux
                            .filter(m => {
                                const search = searchTerm.toLowerCase();
                                const matchSearch =
                                    m.nom.toLowerCase().includes(search) ||
                                    m.categorie.toLowerCase().includes(search) ||
                                    (m.prix_standard && m.prix_standard.toString().includes(search)) ||
                                    (m.prix_personnalise && m.prix_personnalise.toString().includes(search));

                                const matchCategorie = selectedCategorie === '' || m.categorie === selectedCategorie;

                                return matchSearch && matchCategorie;
                            })
                            .map((m, index) => {
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
                                                onChange={(e) => handleChange(m.id, e.target.value)}
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

export default MateriauxEntrepreneur;
