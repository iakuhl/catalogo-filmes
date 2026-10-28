import React from "react";
import { corDoGenero } from "../../utilitarios/coresGeneros";
import "./EtiquetasGeneros.css";

// Gêneros do filme em etiquetas coloridas (cada gênero tem sua cor)
const EtiquetasGeneros = (props) => {
  return (
    <ul className="etiquetas-generos" aria-label="Gêneros">
      {props.generos.map((genero) => (
        <li key={genero} className="etiqueta" style={{ "--cor-genero": corDoGenero(genero) }}>
          {genero}
        </li>
      ))}
    </ul>
  );
};

export default EtiquetasGeneros;
