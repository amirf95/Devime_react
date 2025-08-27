import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './EntrepreneurPrixPage.css';
import NavBar from '../NavBar';

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

const api = axios.create({
    baseURL: 'http://localhost:8000/api/',
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const csrftoken = getCookie('csrftoken');
    if (csrftoken) {
        config.headers['X-CSRFToken'] = csrftoken;
    }
    return config;
});

function MateriauxEntrepreneur() {
    const [materiaux, setMateriaux] = useState([]);
    const [allMateriaux, setAllMateriaux] = useState([]); // Store all materials for search
    const [isLoading, setIsLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategorie, setSelectedCategorie] = useState('');
    const [field, setField] = useState([]);
    const [selectedField, setSelectedField] = useState('');

    const originalPrices = useRef({});

    useEffect(() => {
        fetchMateriaux();
        fetchAllCategories();
        fetchFields();
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

    useEffect(() => {
        if (selectedField) {
            api.get(`materiaux/categories-liste/${selectedField}/`)
                .then(res => {
                    setCategories(res.data);
                    setSelectedCategorie('');
                })
                .catch(err => console.error('Error fetching categories:', err));
        } else {
            fetchAllCategories();
        }
    }, [selectedField]);

    useEffect(() => {
        fetchFilteredMateriaux();
    }, [selectedField, selectedCategorie]);

    const fetchAllCategories = async () => {
        try {
            const response = await api.get('materiaux/categories-liste/');
            setCategories(response.data);
        } catch (error) {
            console.error("Error loading all categories:", error);
        }
    };

    const fetchMateriaux = async () => {
        try {
            const response = await api.get('materiaux/materiaux-entrepreneur/');
            setMateriaux(response.data);
            setAllMateriaux(response.data); // Store all materials for search
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

    const fetchFields = async () => {
        try {
            const response = await api.get('materiaux/champs-liste/');
            setField(response.data);
        } catch (error) {
            console.error("Erreur chargement des champs :", error);
        }
    };

    const fetchFilteredMateriaux = async () => {
        try {
            let url = 'materiaux/materiaux-entrepreneur/';
            const params = new URLSearchParams();
            if (selectedField) params.append('champ', selectedField);
            if (selectedCategorie) params.append('categorie', selectedCategorie);
            
            if (params.toString()) {
                url += `?${params.toString()}`;
            }
            
            const response = await api.get(url);
            const filteredData = response.data;
            setMateriaux(filteredData);
            
            const pricesMap = {};
            filteredData.forEach(m => {
                pricesMap[m.id] = m.prix_personnalise;
            });
            originalPrices.current = pricesMap;
        } catch (error) {
            console.error("Erreur lors du chargement des matériaux :", error);
        }
    };

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

            await api.post(
                'materiaux/update-prix-personnalises/',
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
            fetchFilteredMateriaux();
        } catch (error) {
            console.error("Erreur lors de l'enregistrement :", error);
            alert("Erreur lors de l'enregistrement.");
        }
    };

    // Filter materials based on search term
    const filteredMateriaux = materiaux.filter(m => {
        const search = searchTerm.toLowerCase();
        return (
            m.nom.toLowerCase().includes(search) ||
            m.categorie.toLowerCase().includes(search) ||
            (m.prix_standard && m.prix_standard.toString().includes(search)) ||
            (m.prix_personnalise && m.prix_personnalise.toString().includes(search))
        );
    });

    if (isLoading) return <p>Chargement...</p>;

    return (
        <div className="entrepreneur-prix-page">
            <NavBar variant="login" />

            <div style={{ maxWidth: '900px', margin: 'auto', padding: '20px' }}>
                <h2>Mes Matériaux</h2>

                <div className="recherche-wrapper">
                    <input
                        type="text"
                        placeholder="🔍 Rechercher par nom, prix ou catégorie"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input-recherche"
                    />
                    <select
                        value={selectedField}
                        onChange={(e) => setSelectedField(e.target.value)}
                    >
                        <option value="">Tous les groupes</option>
                        {field.map((champ) => (
                            <option key={champ.id} value={champ.id}>{champ.nom}</option>
                        ))}
                    </select>

                    <select
                        value={selectedCategorie}
                        onChange={(e) => setSelectedCategorie(e.target.value)}
                        className="select-categorie"
                       
                    >
                        <option value="">Toutes les catégories</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.nom}</option>
                        ))}
                    </select>
                </div>

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
                        {filteredMateriaux.map((m, index) => {
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

export default MateriauxEntrepreneur;