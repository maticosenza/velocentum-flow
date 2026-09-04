/**
 * Los gradientes de material del Crystal 5, para las piezas sueltas.
 *
 * Se redeclaran acá en vez de importarse de `CrystalFiveApproved.tsx` porque ese
 * archivo está bajo contrato verificado byte a byte y su superficie pública está
 * cerrada. Son los valores publicados de docs/DESIGN_SYSTEM_CRYSTAL.txt sección
 * 3, y `scripts/crystal-five/verify-guide-fragment.ts` comprueba, stop por stop
 * y contra el componente vecino, que sigan coincidiendo.
 *
 * Un solo lugar para las tres piezas que los usan: el fragmento guía
 * (GuideFragment) y las facetas de capacidad de la Sección 06
 * (CrystalFacetPiece).
 *
 * El prefijo `gf-` de los IDs es compartido; el sufijo `uid` lo aporta cada
 * instancia con `useId()` para no colisionar al embeber varias en la página.
 */
export function CrystalPieceDefs({ uid }: { uid: string }) {
  return (
    <defs>
      <linearGradient id={`gf-light-${uid}`} x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#FFF7FA" stopOpacity=".92" />
        <stop offset=".2" stopColor="#FFB1CE" />
        <stop offset=".56" stopColor="#F56B9D" />
        <stop offset="1" stopColor="#B32558" />
      </linearGradient>
      <linearGradient id={`gf-hot-${uid}`} x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#FFB0CC" />
        <stop offset=".3" stopColor="#FF5C96" />
        <stop offset=".62" stopColor="#E82C70" />
        <stop offset="1" stopColor="#7C1C40" />
      </linearGradient>
      <linearGradient id={`gf-rose-${uid}`} x1="1" y1="0" x2="0" y2="1">
        <stop stopColor="#F58FB4" />
        <stop offset=".38" stopColor="#CA3F72" />
        <stop offset="1" stopColor="#5B243B" />
      </linearGradient>
      <linearGradient id={`gf-graphite-${uid}`} x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#5D4C5B" />
        <stop offset=".48" stopColor="#332A37" />
        <stop offset="1" stopColor="#17141D" />
      </linearGradient>
      <linearGradient id={`gf-deep-${uid}`} x1="1" y1="0" x2="0" y2="1">
        <stop stopColor="#9E315E" />
        <stop offset=".42" stopColor="#63213E" />
        <stop offset="1" stopColor="#261A27" />
      </linearGradient>
      <linearGradient id={`gf-glass-${uid}`} x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#FFFFFF" stopOpacity=".82" />
        <stop offset=".3" stopColor="#F6BDD1" stopOpacity=".52" />
        <stop offset="1" stopColor="#6C5364" stopOpacity=".32" />
      </linearGradient>
      <linearGradient id={`gf-edge-${uid}`} x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#FFFFFF" stopOpacity=".78" />
        <stop offset=".45" stopColor="#F4B3CA" stopOpacity=".58" />
        <stop offset="1" stopColor="#FF4B8D" stopOpacity=".46" />
      </linearGradient>
    </defs>
  );
}
