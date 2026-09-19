import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import type { Ekran } from "../typy";
import { CZCIONKA, KOLOR, PISMO } from "../marka";
import { E, postep, wjazd } from "../ruch";
import { Tresc, useKotwice } from "./wspolne";
import { NaglowekDuzy } from "./Ekrany";

type Ek = Extract<Ekran, { typ: "wykres" }>;

/** Liczba na wykresie: ułamek zapisujemy po polsku, całość bez zbędnego przecinka. */
function liczba(n: number, miejsca: number) {
  return n.toLocaleString("pl-PL", { minimumFractionDigits: miejsca, maximumFractionDigits: miejsca });
}

/**
 * Słupki: porównanie kilku rzeczy obok siebie. Rosną w rytm lektora — kolejny
 * słupek wystrzeliwuje wtedy, kiedy pada jego nazwa, bo kotwice biorą czasy słów.
 */
const Slupki: React.FC<{ ekran: Ek }> = ({ ekran }) => {
  const frame = useCurrentFrame();
  const wejscia = useKotwice(ekran.punkty.length, { start: 8, odstep: 12 });
  const maks = Math.max(...ekran.punkty.map((p) => p.wartosc));
  const miejsca = Math.max(...ekran.punkty.map((p) => (String(p.wartosc).split(".")[1] ?? "").length));
  const WYSOKOSC = 520;

  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 34, height: WYSOKOSC + 130 }}>
      {ekran.punkty.map((p, i) => {
        const r = postep(frame, wejscia[i], wejscia[i] + 18, E.outQuint);
        const h = Math.max(6, (p.wartosc / maks) * WYSOKOSC * r);
        const mocny = p.wyroznij ?? i === ekran.punkty.length - 1;
        const o = postep(frame, wejscia[i], wejscia[i] + 8, E.lin);
        return (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, maxWidth: 190 }}>
            <div
              style={{
                opacity: o,
                fontFamily: CZCIONKA.naglowek,
                fontSize: 52,
                color: mocny ? KOLOR.accent : KOLOR.inkSoft,
                marginBottom: 14,
              }}
            >
              {liczba(p.wartosc * r, miejsca)}
              {ekran.sufiks}
            </div>
            <div
              style={{
                width: "100%",
                height: h,
                borderRadius: "14px 14px 6px 6px",
                background: mocny
                  ? `linear-gradient(180deg, ${KOLOR.accent} 0%, #C43F00 100%)`
                  : `linear-gradient(180deg, ${KOLOR.lineStrong} 0%, ${KOLOR.line} 100%)`,
                boxShadow: mocny ? "0 10px 34px rgba(252,84,0,.28)" : "0 8px 24px rgba(0,0,0,.4)",
                border: `2px solid ${mocny ? KOLOR.accent : KOLOR.lineStrong}`,
                borderBottom: "none",
              }}
            />
            <div
              style={{
                opacity: o,
                marginTop: 18,
                fontSize: PISMO.meta,
                fontWeight: 600,
                color: mocny ? KOLOR.ink : KOLOR.muted,
                textAlign: "center",
                lineHeight: 1.2,
              }}
            >
              {p.etykieta}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/**
 * Linia: zmiana jednej rzeczy w czasie. Rysuje się od lewej, a punkt końcowy
 * dostaje pierścień, żeby oko wiedziało, gdzie jest „teraz".
 */
const Linia: React.FC<{ ekran: Ek }> = ({ ekran }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = postep(frame, 10, Math.round(fps * 1.6), E.outQuint);
  const W = 860;
  const H = 460;
  const maks = Math.max(...ekran.punkty.map((x) => x.wartosc));
  const min = Math.min(...ekran.punkty.map((x) => x.wartosc));
  const rozpietosc = maks - min || 1;
  const miejsca = Math.max(...ekran.punkty.map((x) => (String(x.wartosc).split(".")[1] ?? "").length));

  // Zapas u góry i dołu, żeby linia nie kleiła się do krawędzi kadru.
  const xy = ekran.punkty.map((x, i) => ({
    x: (i / Math.max(1, ekran.punkty.length - 1)) * W,
    y: H - 70 - ((x.wartosc - min) / rozpietosc) * (H - 150),
  }));
  const sciezka = xy.map((q, i) => `${i === 0 ? "M" : "L"} ${q.x} ${q.y}`).join(" ");
  const widoczne = Math.max(1, Math.round(p * xy.length));
  const ostatni = xy[Math.min(widoczne, xy.length) - 1];
  const ostatniaWartosc = ekran.punkty[Math.min(widoczne, xy.length) - 1];

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <svg width={W} height={H} style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id="podLinia" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={KOLOR.accent} stopOpacity="0.34" />
            <stop offset="100%" stopColor={KOLOR.accent} stopOpacity="0" />
          </linearGradient>
          <clipPath id="odslon">
            <rect x="0" y="-60" width={W * p} height={H + 120} />
          </clipPath>
        </defs>

        {/* Siatka pozioma — daje skalę bez wypisywania liczb. */}
        {[0, 1, 2, 3].map((i) => (
          <line key={i} x1="0" y1={30 + i * ((H - 100) / 3)} x2={W} y2={30 + i * ((H - 100) / 3)} stroke={KOLOR.line} strokeWidth="2" />
        ))}

        <g clipPath="url(#odslon)">
          <path d={`${sciezka} L ${W} ${H - 70} L 0 ${H - 70} Z`} fill="url(#podLinia)" />
          <path d={sciezka} fill="none" stroke={KOLOR.accent} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {xy.slice(0, widoczne).map((q, i) => (
          <circle key={i} cx={q.x} cy={q.y} r={i === widoczne - 1 ? 16 : 9} fill={KOLOR.accent} stroke={KOLOR.paper} strokeWidth="5" />
        ))}

        {ostatni && ostatniaWartosc && (
          <text
            x={Math.min(ostatni.x, W - 90)}
            y={ostatni.y - 34}
            fill={KOLOR.accent}
            fontFamily={CZCIONKA.naglowek}
            fontSize="54"
            textAnchor="middle"
          >
            {liczba(ostatniaWartosc.wartosc, miejsca)}
            {ekran.sufiks}
          </text>
        )}

        {ekran.punkty.map((x, i) => (
          <text
            key={i}
            x={xy[i].x}
            y={H - 20}
            fill={i === ekran.punkty.length - 1 ? KOLOR.ink : KOLOR.muted}
            fontSize="30"
            fontWeight="600"
            textAnchor={i === 0 ? "start" : i === ekran.punkty.length - 1 ? "end" : "middle"}
            opacity={postep(frame, 10 + i * 6, 20 + i * 6, E.lin)}
          >
            {x.etykieta}
          </text>
        ))}
      </svg>
    </div>
  );
};

export const EkranWykres: React.FC<{ ekran: Ek }> = ({ ekran }) => {
  const frame = useCurrentFrame();
  const nag = wjazd(frame, 0, 60);
  const pod = wjazd(frame, 26, 40);
  return (
    <Tresc style={{ alignItems: "center", textAlign: "center" }}>
      {ekran.naglowek && (
        <div style={{ ...nag, marginBottom: 44 }}>
          <NaglowekDuzy tekst={ekran.naglowek} rozmiar={PISMO.naglowekMaly} />
        </div>
      )}
      {ekran.rodzaj === "linia" ? <Linia ekran={ekran} /> : <Slupki ekran={ekran} />}
      {ekran.podpis && (
        <div style={{ ...pod, marginTop: 34, fontSize: PISMO.tresc, fontWeight: 600, color: KOLOR.inkSoft, maxWidth: 880 }}>
          {ekran.podpis}
        </div>
      )}
    </Tresc>
  );
};
