import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const ReactSwal = withReactContent(Swal);

export default function TaskDefault() {
  const [materiaux, setMateriaux] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:8000/api/materiaux");
        const data = await res.json();
        const normalized = Array.isArray(data)
          ? data
          : Array.isArray(data.results)
          ? data.results
          : Array.isArray(data.data)
          ? data.data
          : [];
        setMateriaux(normalized);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const typeOptions = materiaux.map((mat) => ({
    value: mat._id ?? mat.id ?? mat.nom,
    label: mat.nom ?? "Sans nom",
  }));

  const handleClick = async () => {
    let charges = [{ type: "", quantite: "" }]; // start with one charge

    const renderHtml = () => (
      <div>
        {charges.map((c, idx) => (
          <div key={idx} style={{ marginBottom: 10 }}>
            <select
              className="swal-type"
              value={c.type}
              onChange={(e) => (charges[idx].type = e.target.value)}
              style={{ marginRight: 8 }}
            >
              <option value="">Choisir type...</option>
              {typeOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <input
              type="number"
              min="0"
              className="swal-quant"
              value={c.quantite}
              onChange={(e) => (charges[idx].quantite = e.target.value)}
              placeholder="Quantité"
              style={{ width: 80, marginRight: 8 }}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => {
            charges.push({ type: "", quantite: "" });
            ReactSwal.update({ html: renderHtml() });
          }}
          style={{ marginTop: 5 }}
        >
          Add new charge
        </button>
      </div>
    );

    const result = await ReactSwal.fire({
      title: "Charges",
      html: renderHtml(),
      showCancelButton: true,
      confirmButtonText: "Save",
      focusConfirm: false,
      preConfirm: () => {
        // validate all charges
        for (let c of charges) {
          if (!c.type) {
            Swal.showValidationMessage("Veuillez choisir un type pour chaque charge");
            return false;
          }
          if (!c.quantite || Number(c.quantite) <= 0) {
            Swal.showValidationMessage("Veuillez entrer une quantité valide pour chaque charge");
            return false;
          }
        }
        return charges.map((c) => ({ type: c.type, quantite: Number(c.quantite) }));
      },
    });

    if (result.isConfirmed) {
      console.log("All charges:", result.value);
      Swal.fire({ icon: "success", text: "Charges enregistrées !" });
    }
  };

  return (
    <div>
      <button onClick={handleClick} disabled={loading}>
        {loading ? "Chargement..." : "Default Charge"}
      </button>
    </div>
  );
}
