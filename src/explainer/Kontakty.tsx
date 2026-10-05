// Film 5 serii strefy partnera: „Kontakty” (16:9, głos Dariusza z nagrania 03.10.2026).
// Scenariusz: 4-CNW/Admin/czasnawellu.pl/Strefa partnera/Filmy/Film 5 - Kontakty - scenariusz.md. Media (poza repo): public/film-kontakty/.
import React from "react";
import { AbsoluteFill, Audio, interpolate, staticFile } from "remotion";
import { Check, Pin, Plus } from "lucide-react";
import { Awatar, K, Naglowek, OBSZAR, Tresc, tekst, useT, zrobFilm, type Os } from "./fabryka";
import OS from "./os-kontakty.json";

const F = zrobFilm(OS as Os);
export const kontaktyKlatki = F.klatki;
const { kiedy, Scena } = F;
const kl = (t: number, a: number, b: number) => interpolate(t, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const KOL = [
  { n: "Nowy kontakt", s: "nowy" },
  { n: "Zaproszenie", s: "zaproszenie" },
  { n: "FollowUp", s: "follow" },
  { n: "TAK - partner", s: "partner", kon: true },
  { n: "TAK - klient", s: "klient", kon: true },
  { n: "NIE", s: "nie", kon: true },
];
type Karta = { imie: string; zr: string; kol: number };
const KARTY: Karta[] = [
  { imie: "Anna K.", zr: "Quiz Longevity", kol: 0 },
  { imie: "Marta W.", zr: "Dobór produktów", kol: 0 },
  { imie: "Tomek R.", zr: "Zaproszenie do WellU", kol: 1 },
  { imie: "Ewa P.", zr: "Dodany ręcznie", kol: 2 },
  { imie: "Piotr S.", zr: "Quiz Longevity", kol: 4 },
];

const Tablica: React.FC<{ swiec?: (i: number) => number; karty?: Karta[]; ruch?: { idx: number; p: number; do: number }; nowa?: number; klik?: number }> = ({ swiec, karty = KARTY, ruch, nowa = 0, klik = 0 }) => {
  const W = 165;
  return (
    <div style={{ ...OBSZAR, top: 230 }}>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(6, ${W}px)`, gap: 10 }}>
        {KOL.map((k, i) => {
          const sw = swiec ? swiec(i) : 0;
          return (
            <div key={k.n} style={{ background: k.kon ? "#E3F3E1" : K.tint, borderRadius: 16, padding: 10, height: 420, border: `2.5px solid ${sw > 0.5 ? K.a : "transparent"}`, transform: `translateY(${-8 * sw}px)` }}>
              <div style={tekst(16, 800, k.n === "NIE" ? K.mut : K.ink)}>{k.n}</div>
            </div>
          );
        })}
      </div>
      {karty.map((c, j) => {
        const nr = karty.filter((x, y) => x.kol === c.kol && y < j).length;
        let x = 10 + c.kol * (W + 10);
        let y = 42 + nr * 78;
        if (ruch && ruch.idx === j) {
          const x2 = 10 + ruch.do * (W + 10);
          const y2 = 42 + karty.filter((z) => z.kol === ruch.do).length * 78;
          x = x + (x2 - x) * ruch.p;
          y = y + (y2 - y) * ruch.p - Math.sin(Math.PI * ruch.p) * 30;
        }
        const aktywna = klik > 0 && j === 0;
        return (
          <div key={c.imie} style={{ position: "absolute", left: x, top: y, width: W - 20, background: K.card, borderRadius: 12, padding: "8px 10px", border: `2px solid ${aktywna ? K.a : K.line}`, boxShadow: ruch && ruch.idx === j && ruch.p > 0 && ruch.p < 1 ? "0 16px 30px rgba(14,36,18,.2)" : "0 4px 10px rgba(14,36,18,.06)" }}>
            <div style={tekst(16, 800)}>{c.imie}</div>
            <div style={tekst(12, 600, K.mut)}>{c.zr}</div>
          </div>
        );
      })}
      {nowa > 0 && (
        <div style={{ position: "absolute", left: 10, top: 42 + 2 * 78, width: W - 20, opacity: nowa, transform: `scale(${0.8 + 0.2 * nowa})`, background: K.card, borderRadius: 12, padding: "8px 10px", border: `2px solid ${K.a}` }}>
          <div style={tekst(16, 800)}>Kasia N.</div>
          <div style={tekst(12, 600, K.mut)}>Dodany ręcznie</div>
        </div>
      )}
    </div>
  );
};

const Okno: React.FC<{ zakl: number; children: React.ReactNode; p: number }> = ({ zakl, children, p }) => (
  <div style={{ position: "absolute", left: 230, top: 230, width: 700, opacity: p, transform: `scale(${0.92 + 0.08 * p})`, background: K.card, borderRadius: 24, border: `1.5px solid ${K.line}`, boxShadow: "0 30px 70px rgba(14,36,18,.25)", padding: "24px 28px" }}>
    <div style={tekst(30, 800)}>Anna K.</div>
    <div style={{ display: "flex", gap: 8, marginTop: 14, borderBottom: `1.5px solid ${K.line}` }}>
      {["Szczegóły", "Notatki", "Kolejne kroki"].map((z, i) => (
        <div key={z} style={{ padding: "8px 14px", ...tekst(17, 800, i === zakl ? K.a : K.mut), borderBottom: `3px solid ${i === zakl ? K.a : "transparent"}` }}>{z}</div>
      ))}
    </div>
    <div style={{ marginTop: 16 }}>{children}</div>
  </div>
);

const S1: React.FC = () => {
  const t = useT();
  return (
    <>
      <Naglowek eyebrow="Kontakty" tytul="Twoja tablica rozmów" />
      <Tresc><Tablica karty={KARTY.filter((_, i) => t >= 0.8 + i * 0.35)} /></Tresc>
    </>
  );
};
const S2: React.FC = () => {
  const t = useT();
  const sw = (i: number) => {
    const t0 = kiedy("s2", KOL[i].s);
    const t1 = i < KOL.length - 1 ? kiedy("s2", KOL[i + 1].s) : t0 + 1.2;
    return t >= t0 - 0.05 && t < Math.max(t1, t0 + 0.6) ? 1 : 0;
  };
  return (
    <>
      <Naglowek eyebrow="Etapy rozmowy" tytul="Trzy w toku, trzy końcowe" />
      <Tresc><Tablica swiec={sw} /></Tresc>
    </>
  );
};
const S3: React.FC = () => {
  const t = useT();
  const p = kl(t, kiedy("s3", "przeciągasz"), kiedy("s3", "przeciągasz") + 1.1);
  const zap = kl(t, kiedy("s3", "zapamiętuje") - 0.1, kiedy("s3", "zapamiętuje") + 0.4);
  return (
    <>
      <Naglowek eyebrow="Rozmowa idzie dalej" tytul="Przeciągasz kartę" />
      <Tresc>
        <Tablica ruch={{ idx: 2, p, do: 2 }} />
        <div style={{ position: "absolute", left: 100 + 2 * 175 + 10, top: 680, opacity: zap, background: K.ink, borderRadius: 10, padding: "8px 14px", ...tekst(16, 700, "#fff") }}>Przesunięto: dziś, 18:42</div>
      </Tresc>
    </>
  );
};
const S4: React.FC = () => {
  const t = useT();
  const p = kl(t, kiedy("s4", "kliknij") + 0.2, kiedy("s4", "kliknij") + 0.6);
  const W = [["kim", "Anna K.", "anna@poczta.pl · 600 123 456"], ["skąd", "Źródło", "Quiz Longevity · link od Ciebie"], ["wynikiem", "Wynik", "Spokojny Strateg · indeks 78"]];
  return (
    <>
      <Naglowek eyebrow="Karta kontaktu" tytul="Szczegóły jednym kliknięciem" />
      <Tresc>
        <div style={{ opacity: 1 - 0.6 * p }}><Tablica klik={kl(t, kiedy("s4", "kliknij"), kiedy("s4", "kliknij") + 0.2)} /></div>
        <Okno zakl={0} p={p}>
          {W.map(([s, l, v]) => {
            const o = kl(t, kiedy("s4", s) - 0.1, kiedy("s4", s) + 0.3);
            return (
              <div key={l} style={{ display: "grid", gridTemplateColumns: "140px 1fr", padding: "12px 0", borderTop: `1.5px solid ${K.line}`, opacity: 0.3 + 0.7 * o }}>
                <span style={tekst(17, 800, K.mut)}>{l}</span><span style={tekst(19, 700)}>{v}</span>
              </div>
            );
          })}
        </Okno>
      </Tresc>
    </>
  );
};
const S5: React.FC = () => {
  const t = useT();
  const txt = "Rozmowa 3.10: chce zacząć od magnezu, oddzwonić w czwartek.";
  const n = Math.floor(txt.length * kl(t, kiedy("s5", "notatkach"), kiedy("s5", "notatkach") + 2.2));
  const pin = t >= kiedy("s5", "przypinasz");
  return (
    <>
      <Naglowek eyebrow="Notatki" tytul="Ustalenia po każdej rozmowie" />
      <Tresc>
        <div style={{ opacity: 0.4 }}><Tablica /></div>
        <Okno zakl={1} p={1}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ order: pin ? 0 : 1, background: pin ? K.warnT : K.tint, border: `2px solid ${pin ? K.warn : "transparent"}`, borderRadius: 14, padding: "12px 14px", ...tekst(18, 600), display: "flex", gap: 10, alignItems: "center" }}>
              {pin && <Pin size={20} color={K.warn} />}{txt.slice(0, n)}
            </div>
            <div style={{ order: pin ? 1 : 0, background: K.tint, borderRadius: 14, padding: "12px 14px", ...tekst(18, 600, K.mut) }}>📝 Analiza AI z quizu (kopia)</div>
          </div>
        </Okno>
      </Tresc>
    </>
  );
};
const S6: React.FC = () => {
  const t = useT();
  const KR = ["Podziękuj za wypełnienie quizu", "Zapytaj, co z wyniku ją zaskoczyło", "Wyślij link do pierwszego produktu"];
  const t0 = kiedy("s6", "odhaczasz");
  return (
    <>
      <Naglowek eyebrow="Kolejne kroki" tytul="Podpowiedź na każdy etap" />
      <Tresc>
        <div style={{ opacity: 0.4 }}><Tablica /></div>
        <Okno zakl={2} p={1}>
          {KR.map((k, i) => {
            const ok = t >= t0 + i * 0.4 && i < 2;
            return (
              <div key={k} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderTop: `1.5px solid ${K.line}` }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, border: `2.5px solid ${K.a}`, background: ok ? K.a : K.card, display: "flex", alignItems: "center", justifyContent: "center" }}>{ok && <Check size={18} color="#fff" strokeWidth={3} />}</div>
                <span style={{ ...tekst(19, 700, ok ? K.mut : K.ink), textDecoration: ok ? "line-through" : "none" }}>{k}</span>
              </div>
            );
          })}
        </Okno>
      </Tresc>
    </>
  );
};
const S7: React.FC = () => {
  const t = useT();
  const btn = kl(t, kiedy("s7", "przyciskiem") - 0.2, kiedy("s7", "przyciskiem") + 0.2);
  const nowa = kl(t, kiedy("s7", "kontakt") + 0.2, kiedy("s7", "kontakt") + 0.7);
  return (
    <>
      <Naglowek eyebrow="Znajomi" tytul="Dodaj kontakt ręcznie" />
      <Tresc>
        <div style={{ position: "absolute", left: 100, top: 172, display: "inline-flex", alignItems: "center", gap: 8, background: K.a, borderRadius: 99, padding: "10px 20px", ...tekst(19, 800, "#fff"), transform: `scale(${1 + 0.08 * btn})`, boxShadow: btn ? "0 0 0 6px rgba(25,160,32,.2)" : "none" }}>
          <Plus size={20} color="#fff" strokeWidth={3} /> Dodaj kontakt
        </div>
        <Tablica nowa={nowa} />
      </Tresc>
    </>
  );
};
const S8: React.FC = () => {
  const t = useT();
  const TABS = [["Statystyki", "statystyki"], ["Postęp", "postęp"], ["Ja vs grupa", "grupa"]];
  let a = 0;
  TABS.forEach(([, s], i) => { if (t >= kiedy("s8", s) - 0.1) a = i; });
  if (t < kiedy("s8", "statystyki") - 0.1) a = 0;
  return (
    <>
      <Naglowek eyebrow="Jak Ci idzie" tytul="Statystyki, postęp, Ty na tle grupy" />
      <Tresc>
        <div style={{ ...OBSZAR, top: 230, background: K.card, border: `1.5px solid ${K.line}`, borderRadius: 24, padding: "20px 26px" }}>
          <div style={{ display: "flex", gap: 8, borderBottom: `1.5px solid ${K.line}` }}>
            {TABS.map(([n], i) => <div key={n} style={{ padding: "8px 16px", ...tekst(19, 800, i === a ? K.a : K.mut), borderBottom: `3px solid ${i === a ? K.a : "transparent"}` }}>{n}</div>)}
          </div>
          <div style={{ height: 300, marginTop: 20 }}>
            {a === 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
                {[["Wszystkie", "37"], ["W toku", "12"], ["Na TAK", "6"], ["Skuteczność", "24%"]].map(([l, v]) => (
                  <div key={l} style={{ background: K.tint, borderRadius: 18, padding: 18 }}><div style={tekst(17, 700, K.mut)}>{l}</div><div style={{ ...tekst(54, 800), marginTop: 6 }}>{v}</div></div>
                ))}
              </div>
            )}
            {a === 1 && (
              <div style={{ display: "flex", alignItems: "flex-end", gap: 60, height: 260, paddingLeft: 40 }}>
                {[["Wrzesień", 4], ["Październik", 7]].map(([l, v]) => (
                  <div key={l as string} style={{ textAlign: "center" }}>
                    <div style={{ width: 120, height: (v as number) * 30, background: l === "Październik" ? K.a : K.line, borderRadius: "12px 12px 0 0" }} />
                    <div style={{ ...tekst(18, 700, K.mut), marginTop: 8 }}>{l} · {v} na TAK</div>
                  </div>
                ))}
              </div>
            )}
            {a === 2 && (
              <div style={{ paddingTop: 30 }}>
                <div style={tekst(22, 800)}>Jesteś w górnych 30% zespołu</div>
                <div style={{ position: "relative", height: 16, borderRadius: 99, background: K.line, marginTop: 24 }}>
                  <div style={{ position: "absolute", left: "70%", top: -10, width: 36, height: 36, borderRadius: 99, background: K.a, border: "4px solid #fff" }} />
                </div>
                <div style={{ ...tekst(17, 600, K.mut), marginTop: 20 }}>Porównanie anonimowe: nikt nie widzi Twoich liczb.</div>
              </div>
            )}
          </div>
        </div>
      </Tresc>
    </>
  );
};
const S9: React.FC = () => {
  const t = useT();
  const t0 = kiedy("s9", "pięć");
  const DNI = ["Pn", "Wt", "Śr", "Cz", "Pt", "Sb", "Nd"];
  return (
    <>
      <Naglowek eyebrow="Codzienny ruch" tytul="5 minut dziennie przy tablicy" />
      <Tresc>
        <div style={{ ...OBSZAR, top: 260, display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 12 }}>
          {DNI.map((d, i) => {
            const p = kl(t, t0 + i * 0.25, t0 + i * 0.25 + 0.3);
            return (
              <div key={d} style={{ background: K.card, border: `2px solid ${p > 0.5 ? K.a : K.line}`, borderRadius: 18, padding: "18px 0", textAlign: "center" }}>
                <div style={tekst(20, 800, K.mut)}>{d}</div>
                <div style={{ width: 54, height: 54, borderRadius: 99, margin: "14px auto 0", background: p > 0.5 ? K.a : K.tint, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${0.7 + 0.3 * p})` }}>{p > 0.5 && <Check size={30} color="#fff" strokeWidth={3} />}</div>
                <div style={{ ...tekst(16, 700, K.mut), marginTop: 10 }}>5 min</div>
              </div>
            );
          })}
        </div>
      </Tresc>
    </>
  );
};

export const KontaktyFilm: React.FC<{ zAwatarem?: boolean; bezNapisow?: boolean }> = ({ zAwatarem, bezNapisow }) => (
  <AbsoluteFill style={{ background: K.bg }}>
    <Audio src={staticFile("film-kontakty/lektor.mp3")} />
    <Scena id="s1"><S1 /></Scena>
    <Scena id="s2"><S2 /></Scena>
    <Scena id="s3"><S3 /></Scena>
    <Scena id="s4"><S4 /></Scena>
    <Scena id="s5"><S5 /></Scena>
    <Scena id="s6"><S6 /></Scena>
    <Scena id="s7"><S7 /></Scena>
    <Scena id="s8"><S8 /></Scena>
    <Scena id="s9"><S9 /></Scena>
    {bezNapisow ? null : <F.Napisy />}
    {zAwatarem ? <Awatar src={staticFile("film-kontakty/awatar.mp4")} /> : null}
  </AbsoluteFill>
);
