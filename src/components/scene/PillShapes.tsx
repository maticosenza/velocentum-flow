// La geometría oficial de la píldora, extraída una sola vez de
// public/brand-approved/official/pills/*.svg. Todos los SVG maestros comparten
// exactamente el mismo cuerpo y el mismo aro; lo único que cambia entre ellos
// es el glifo del icono y la palabra.
//
// Se reparte en dos piezas porque las secciones necesitan poder separarlas:
// en el plano lejano de las Secciones 02 y 03 el cuerpo va desenfocado y la
// etiqueta nítida, en dos SVG HERMANOS (ver ScenePill).

/** Cápsula y aro del icono. Valores exactos del asset maestro. */
export function PillCapsule() {
  return (
    <>
      <rect
        x="1"
        y="1"
        width="298"
        height="70"
        rx="34"
        fill="#0E0E13"
        fillOpacity=".85"
        stroke="#FF4B8D"
        strokeOpacity=".75"
      />
      <circle
        cx="40"
        cy="36"
        r="16"
        fill="#FF4B8D"
        fillOpacity=".12"
        stroke="#FF4B8D"
        strokeOpacity=".8"
      />
    </>
  );
}

/**
 * El glifo del icono, tal cual está en el maestro.
 *
 * Es la única excepción a "nada de texto tipografiado dentro de un SVG": el
 * glifo es geometría del asset aprobado, no copy, y su `font-family="Arial"`
 * es el del maestro, que no se modifica.
 */
export function PillIcon({ glyph }: { glyph: string }) {
  return (
    <text x="40" y="42" textAnchor="middle" fontSize="20" fill="#FF4B8D" fontFamily="Arial">
      {glyph}
    </text>
  );
}
