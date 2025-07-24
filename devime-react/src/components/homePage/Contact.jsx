import { useState } from 'react';

function Contact() {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus(null);
        setLoading(true);

        const newErrors = {};

        // Validation manuelle des champs
        if (!formData.name.trim()) {
            newErrors.name = 'Le champ nom est requis.';
        } else if (formData.name.trim().length < 3) {
            newErrors.name = 'Le nom doit contenir au moins 3 caractères.';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Le champ email est requis.';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Adresse email invalide.';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Le champ téléphone est requis.';
        } else if (!/^\d+$/.test(formData.phone.trim())) {
            newErrors.phone = 'Le numéro doit contenir uniquement des chiffres.';
        }

        if (!formData.message.trim()) {
            newErrors.message = 'Le message est requis.';
        } else if (formData.message.trim().length < 10) {
            newErrors.message = 'Le message doit contenir au moins 10 caractères.';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setLoading(false);
            return;
        }

        setErrors({});

        try {
            const res = await fetch('http://localhost:8000/api/contact/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (data.success) {
                setStatus('success');
                setFormData({ name: '', email: '', phone: '', message: '' });
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error');
        }

        setLoading(false);
    };

    return (
        <section className="page-section" id="contact">
            <div className="container">
                <div className="text-center">
                    <h2 className="section-heading text-uppercase">Contact Us</h2>
                    <h3 className="section-subheading text-muted">Lorem ipsum dolor sit amet consectetur.</h3>
                </div>
                <form id="contactForm" onSubmit={handleSubmit} noValidate>
                    <div className="row align-items-stretch mb-5">
                        <div className="col-md-6">
                            <div className="form-group">
                                <input
                                    className="form-control"
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Your Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                                {errors.name && <small className="text-danger">{errors.name}</small>}
                            </div>
                            <div className="form-group">
                                <input
                                    className="form-control"
                                    id="email"
                                    name="email"
                                    type="text"
                                    placeholder="Your Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                                {errors.email && <small className="text-danger">{errors.email}</small>}
                            </div>
                            <div className="form-group mb-md-0">
                                <input
                                    className="form-control"
                                    id="phone"
                                    name="phone"
                                    type="text"
                                    placeholder="Your Phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                                {errors.phone && <small className="text-danger">{errors.phone}</small>}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group form-group-textarea mb-md-0">
                                <textarea
                                    className="form-control"
                                    id="message"
                                    name="message"
                                    placeholder="Your Message"
                                    value={formData.message}
                                    onChange={handleChange}
                                ></textarea>
                                {errors.message && <small className="text-danger">{errors.message}</small>}
                            </div>
                        </div>
                    </div>

                    {loading && (
                        <div className="text-center mb-3">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="text-center text-success mb-3">
                            Votre message a été envoyé avec succès !
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="text-center text-danger mb-3">
                            Une erreur est survenue. Veuillez réessayer.
                        </div>
                    )}

                    <div className="text-center">
                        <button
                            className="btn btn-primary btn-xl text-uppercase"
                            id="submitButton"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Envoi...
                                </>
                            ) : (
                                'Envoyer le message'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}

export default Contact;