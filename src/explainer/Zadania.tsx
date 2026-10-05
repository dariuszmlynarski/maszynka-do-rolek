// Film 6 serii strefy partnera: „Zadania” (16:9, głos Dariusza z nagrania 03.10.2026).
// Scenariusz: 4-CNW/Admin/czasnawellu.pl/Strefa partnera/Filmy/Film 6 - Zadania - scenariusz.md. Media (poza repo): public/film-zadania/.
import React from "react";
import { AbsoluteFill, Audio, interpolate, staticFile } from "remotion";
import { Check, Coffee } from "lucide-react";
import { Awatar, K, Naglowek, OBSZAR, Tresc, tekst, useT, zrobFilm, type Os } from "./fabryka";
import OS from "./os-zadania.json";

const F = zrobFilm(OS as Os);
export const zadaniaKlatki = F.klatki;
const { kiedy, start, Scena } = F;
const kl = (t: number, a: number, b: number) => interpolate(t, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

type Grupa = { osoba: string; etap: string; kroki: string[] };
const GRUPY: Grupa[] = [
  { osoba: "Anna K.", etap: "Nowy kontakt", kroki: ["Podziękuj za wypełnienie quizu", "Zapytaj, co ją zaskoczyło w wyniku"] },
  { osoba: "Tomek R.", etap: "Zaproszenie", kroki: ["Umów rozmowę po prezentacji", "Wyślij link do rejestracji"] },
  { osoba: "Ewa P.", etap: "FollowUp", kroki: ["Zapytaj o pierwsze wrażenia z produktu"] },
];

const Lista: React.FC<{ odhaczone?: number; nowe?: number; znika?: number; wejscie?: number }> = ({ odhaczone = 0, nowe = 0, znika = 0, wejscie = 1 }) => (
  <div style={{ ...OBSZAR, top: 210, display: "flex", flexDirection: "column", gap: 14 }}>
    {GRUPY.map((g, gi) => {
      const p = kl(wejscie, gi * 0.25, gi * 0.25 + 0.4);
      const ten = gi === 2 ? 1 - znika : 1;
      if (ten <= 0.01) return null;
      const kroki = gi === 0 && nowe > 0 ? [...g.kroki, "Wyślij plan od czego zacząć"] : g.kroki;
      return (
        <div key={g.osoba} style={{ opacity: p * ten, transform: `translateY(${(1 - p) * 20}px) scaleY(${ten})`, transformOrigin: "top", background: K.card, border: `1.5px solid ${K.line}`, borderRadius: 18, padding: "14px 20px" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
            <span style={tekst(22, 800)}>{g.osoba}</span>
            <span style={{ ...tekst(15, 800, K.ad), background: K.tint, borderRadius: 99, padding: "3px 10px" }}>{gi === 0 && nowe > 0.5 ? "Zaproszenie" : g.etap}</span>
          </div>
          {kroki.map((k, ki) => {
            const ok = gi === 0 && ki === 0 && odhaczone > 0.5;
            const nowy = gi === 0 && ki === 2;
            return (
              <div key={k} style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 10, opacity: nowy ? nowe : 1 }}>
                <div style={{ width: 26, height: 26, borderRadius: 7, border: `2.5px solid ${K.a}`, background: ok ? K.a : K.card, display: "flex", alignItems: "center", justifyContent: "center" }}>{ok && <Check size={17} color="#fff" strokeWidth={3} />}</div>
                <span style={{ ...tekst(19, 600, ok ? K.mut : K.ink), textDecoration: ok ? "line-through" : "none" }}>{k}</span>
                {nowy && <span style={{ ...tekst(13, 800, "#fff"), background: K.a, borderRadius: 6, padding: "2px 8px" }}>NOWE</span>}
              </div>
            );
          })}
        </div>
      );
    })}
  </div>
);

const S1: React.FC = () => {
  const t = useT();
  return (
    <>
      <Naglowek eyebrow="Twoje zadania" tytul="Kolejne kroki w jednym miejscu" />
      <Tresc><Lista wejscie={kl(t, kiedy("s1", "zbierają") - 0.2, kiedy("s1", "kontaktów") + 0.6)} /></Tresc>
    </>
  );
};
const S2: React.FC = () => {
  const t = useT();
  const sw = t >= kiedy("s2", "lista");
  return (
    <>
      <Naglowek eyebrow="Przy każdej osobie" tytul="Co zrobić na jej etapie" />
      <Tresc>
        <Lista />
        {sw && <div style={{ position: "absolute", left: 1000, top: 220, ...tekst(18, 800, K.a), display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: kl(t, kiedy("s2", "lista"), kiedy("s2", "lista") + 0.4) }}>od najwcześniejszych<div style={{ width: 4, height: 300, background: K.a, borderRadius: 4 }} />↓</div>}
      </Tresc>
    </>
  );
};
const S3: React.FC = () => {
  const t = useT();
  return (
    <>
      <Naglowek eyebrow="Odhaczasz i jedziesz dalej" tytul="Nowy etap, nowe kroki" />
      <Tresc><Lista odhaczone={kl(t, kiedy("s3", "odhaczasz"), kiedy("s3", "odhaczasz") + 0.3)} nowe={kl(t, kiedy("s3", "nowe"), kiedy("s3", "nowe") + 0.5)} /></Tresc>
    </>
  );
};
const S4: React.FC = () => {
  const t = useT();
  const z = kl(t, kiedy("s4", "znikają") - 0.2, kiedy("s4", "znikają") + 0.8);
  return (
    <>
      <Naglowek eyebrow="Po decyzji" tytul="TAK albo NIE znika z listy" />
      <Tresc>
        <Lista odhaczone={1} nowe={1} znika={z} />
        <div style={{ position: "absolute", left: 960, top: 520, opacity: z, background: "#E3F3E1", border: `2.5px solid ${K.a}`, borderRadius: 16, padding: "12px 18px", ...tekst(20, 800, K.ad) }}>Ewa P. → TAK - klient</div>
      </Tresc>
    </>
  );
};
const S5: React.FC = () => {
  const t = useT();
  const p = kl(t, start("s5"), start("s5") + 0.8);
  return (
    <>
      <Naglowek eyebrow="Każdego ranka" tytul="Twój plan na dziś" />
      <Tresc>
        <div style={{ ...OBSZAR, top: 230, display: "flex", alignItems: "center", gap: 60, opacity: p }}>
          <Coffee size={170} color={K.ad} strokeWidth={1.4} />
          <div style={{ width: 300, height: 520, borderRadius: 40, background: K.ink, padding: 12 }}>
            <div style={{ width: "100%", height: "100%", borderRadius: 30, background: K.card, padding: 22 }}>
              <div style={tekst(22, 800)}>Twoje zadania</div>
              {["Podziękuj Ani za quiz", "Umów rozmowę z Tomkiem", "Wyślij Ani plan"].map((k, i) => (
                <div key={k} style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 16, opacity: kl(t, kiedy("s5", "plan") + i * 0.3, kiedy("s5", "plan") + i * 0.3 + 0.3) }}>
                  <div style={{ width: 22, height: 22, borderRadius: 6, border: `2.5px solid ${K.a}` }} />
                  <span style={tekst(16, 700)}>{k}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Tresc>
    </>
  );
};

export const ZadaniaFilm: React.FC<{ zAwatarem?: boolean; bezNapisow?: boolean }> = ({ zAwatarem, bezNapisow }) => (
  <AbsoluteFill style={{ background: K.bg }}>
    <Audio src={staticFile("film-zadania/lektor.mp3")} />
    <Scena id="s1"><S1 /></Scena>
    <Scena id="s2"><S2 /></Scena>
    <Scena id="s3"><S3 /></Scena>
    <Scena id="s4"><S4 /></Scena>
    <Scena id="s5"><S5 /></Scena>
    {bezNapisow ? null : <F.Napisy />}
    {zAwatarem ? <Awatar src={staticFile("film-zadania/awatar.mp4")} /> : null}
  </AbsoluteFill>
);
