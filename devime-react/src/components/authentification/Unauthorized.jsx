// src/components/authentification/Unauthorized.jsx

import React from 'react';

function Unauthorized() {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Accès non autorisé</h1>
      <p>Vous n'avez pas la permission d'accéder à cette page.</p>
    </div>
  );
}

export default Unauthorized;
