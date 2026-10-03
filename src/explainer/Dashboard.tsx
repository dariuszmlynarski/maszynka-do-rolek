// Film 2 serii strefy partnera: „Twój dashboard” (16:9, głos Dariusza z nagrania 03.10.2026).
// Scenariusz: 4-CNW/Admin/Lejki/Filmy/Film 2 - Dashboard - scenariusz.md. Media (poza repo):
// public/film-dashboard/lektor.mp3 i awatar.mp4; robocze w projekty/film-dashboard/.
import React from "react";
import { AbsoluteFill, Audio, interpolate, staticFile } from "remotion";
import { Check, Coffee } from "lucide-react";
import { Awatar, K, Naglowek, tekst, useP, useSpr, useT, zrobFilm, type Os } from "./fabryka";
import OS from "./os-dashboard.json";

const F = zrobFilm(OS as Os);
export const dashboardKlatki = F.klatki;
const { kiedy, Scena } = F;

// Treść scen jest w powiększeniu 1.2 (Tresc), więc współrzędne są w „małych” pikselach: 100 → 120 w kadrze.
const OBSZAR: React.CSSProperties = { position: "absolute", left: 100, right: 430, top: 250 };
const Tresc: React.FC<{ children: React.ReactNode }> = ({ children }) => <div style={{ position: "absolute", inset: 0, zoom: 1.2 }}>{children}</div>;

// ------------------------------------------------------------------ pasek kroków
const KROKI = [
  { t: "Sklep WellU", slowo: "sklepu", wynik: "anna-k.wellu.eu" },
  { t: "Twój główny link", slowo: "link", wynik: "czasnawellu.pl/?ref=anna" },
  { t: "Lejki", slowo: "lejki", wynik: "3 lejki gotowe" },
  { t: "Edukacja", slowo: "edukacja", wynik: "9 z 28 lekcji" },
];
const Mini: React.FC<{ i: number; zrobiony: boolean; teraz: boolean; swieci: number; chipy?: boolean; zmien?: number }> = ({ i, zrobiony, teraz, swieci, chipy, zmien = 0 }) => {
  const k = KROKI[i];
  return (
    <div style={{ background: K.card, borderRadius: 18, padding: 16, border: `${teraz ? 3 : 1.5}px solid ${teraz || swieci > 0.5 ? K.a : K.line}`, display: "grid", gridTemplateColumns: "auto 1fr", gap: "4px 12px", alignContent: "start", boxShadow: swieci ? `0 0 0 ${6 * swieci}px rgba(25,160,32,.18)` : "none", minHeight: 120 }}>
      <div style={{ gridRow: "span 3", width: 42, height: 42, borderRadius: 99, display: "flex", alignItems: "center", justifyContent: "center", background: zrobiony ? K.a : teraz ? K.card : "#EEF1EE", border: `2.5px solid ${zrobiony || teraz ? K.a : K.line}`, color: zrobiony ? "#fff" : teraz ? K.a : K.mut, ...tekst(20, 800) }}>
        {zrobiony ? <Check size={24} color="#fff" strokeWidth={3} /> : i + 1}
      </div>
      <div style={tekst(21, 800)}>{k.t}</div>
      {zrobiony ? (
        <>
          <div style={{ ...tekst(16, 600, K.mut) }}>{k.wynik}</div>
          {chipy && (
            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              <span style={{ ...tekst(15, 700), border: `1.5px solid ${K.line}`, borderRadius: 99, padding: "3px 12px" }}>Kopiuj</span>
              <span style={{ ...tekst(15, 700, zmien > 0.5 ? "#fff" : K.ink), background: zmien > 0.5 ? K.a : K.card, border: `1.5px solid ${zmien > 0.5 ? K.a : K.line}`, borderRadius: 99, padding: "3px 12px", transform: `scale(${1 + 0.12 * Math.sin(Math.PI * Math.min(1, zmien))})` }}>Zmień</span>
            </div>
          )}
        </>
      ) : (
        <div style={tekst(16, 600, K.mut)}>{teraz ? "Teraz ten krok" : "Czeka"}</div>
      )}
    </div>
  );
};

const Pasek: React.FC<{ zrobione: number; teraz: number; swiec?: number[]; chipy?: boolean; zmien?: number }> = ({ zrobione, teraz, swiec = [], chipy, zmien }) => (
  <div style={{ ...OBSZAR, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
    {KROKI.map((_, i) => (
      <Mini key={i} i={i} zrobiony={i < zrobione} teraz={i === teraz} swieci={swiec[i] ?? 0} chipy={chipy && i === 0} zmien={zmien} />
    ))}
  </div>
);

const DuzaKarta: React.FC<{ nr: number; tytul: string; children?: React.ReactNode; styl?: React.CSSProperties }> = ({ nr, tytul, children, styl }) => (
  <div style={{ position: "absolute", left: 100, right: 430, top: 395, background: K.card, border: `3px solid ${K.a}`, borderRadius: 26, padding: "28px 34px", boxShadow: "0 18px 44px rgba(25,160,32,.16)", ...styl }}>
    <span style={{ ...tekst(18, 800, "#fff"), background: K.a, borderRadius: 99, padding: "4px 14px", letterSpacing: "0.1em" }}>KROK {nr} Z 4</span>
    <div style={{ ...tekst(40, 800), marginTop: 14 }}>{tytul}</div>
    {children}
  </div>
);

// ------------------------------------------------------------------ s1
const S1: React.FC = () => {
  const t = useT();
  const login = interpolate(t, [0.3, 1.2], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const p = useP(kiedy("s1", "dashboard"));
  const c = useSpr(kiedy("s1", "centrum"));
  return (
    <>
      <Tresc>
      <div style={{ position: "absolute", left: 560, top: 250, width: 480, opacity: login, transform: `scale(${0.9 + 0.1 * login})`, background: K.card, borderRadius: 24, padding: 34, border: `1.5px solid ${K.line}` }}>
        <div style={tekst(34, 800)}>Logowanie</div>
        {["E-mail", "Hasło"].map((l) => (
          <div key={l} style={{ marginTop: 18, height: 56, borderRadius: 14, border: `2px solid ${K.line}`, display: "flex", alignItems: "center", padding: "0 18px", ...tekst(20, 600, K.mut) }}>{l}</div>
        ))}
        <div style={{ marginTop: 22, height: 58, borderRadius: 99, background: K.a, ...tekst(22, 800, "#fff"), display: "flex", alignItems: "center", justifyContent: "center" }}>Zaloguj</div>
      </div>
      </Tresc>
      <div style={{ opacity: p }}>
        <Naglowek eyebrow="Strefa partnera" tytul="Cześć, Anna!" />
        <Tresc>
        <Pasek zrobione={1} teraz={1} />
        <div style={{ ...OBSZAR, top: 395, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} style={{ height: 150, borderRadius: 18, background: K.card, border: `1.5px solid ${K.line}`, opacity: interpolate(p, [0.2 + i * 0.12, 0.6 + i * 0.12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }} />
          ))}
        </div>
        <div style={{ position: "absolute", left: 100, top: 580, opacity: c, transform: `scale(${0.7 + 0.3 * c})`, transformOrigin: "left center", ...tekst(54, 800, K.a) }}>Centrum dowodzenia</div>
        </Tresc>
      </div>
    </>
  );
};

// ------------------------------------------------------------------ s2
const S2: React.FC = () => {
  const t = useT();
  const sw = KROKI.map((k, i) => {
    const t0 = kiedy("s2", k.slowo);
    const t1 = i < 3 ? kiedy("s2", KROKI[i + 1].slowo) : kiedy("s2", "bieżący");
    return t >= t0 && t < t1 ? 1 : 0;
  });
  const karta = useSpr(kiedy("s2", "bieżący"), 200);
  return (
    <>
      <Naglowek eyebrow="Cztery kroki startu" tytul="Bieżący krok na środku" />
      <Tresc>
      <Pasek zrobione={0} teraz={karta > 0.05 ? 0 : -1} swiec={sw} />
      <DuzaKarta nr={1} tytul="Podłącz swój sklep WellU" styl={{ opacity: karta, transform: `translateY(${(1 - karta) * 40}px)` }}>
        <div style={{ display: "flex", gap: 14, marginTop: 22 }}>
          <div style={{ flex: 1, height: 64, borderRadius: 16, border: `2.5px solid ${K.line}`, display: "flex", alignItems: "center", ...tekst(24, 700, K.mut) }}>
            <span style={{ background: K.tint, height: "100%", display: "flex", alignItems: "center", padding: "0 14px", borderRadius: "14px 0 0 14px" }}>https://</span>
            <span style={{ padding: "0 14px", color: K.ink }}>anna-k</span>
            <span style={{ marginLeft: "auto", background: K.tint, height: "100%", display: "flex", alignItems: "center", padding: "0 14px", borderRadius: "0 14px 14px 0" }}>.wellu.eu</span>
          </div>
          <div style={{ height: 64, borderRadius: 99, background: K.a, padding: "0 34px", display: "flex", alignItems: "center", ...tekst(24, 800, "#fff") }}>Zapisz</div>
        </div>
      </DuzaKarta>
    </Tresc>
    </>
  );
};

// ------------------------------------------------------------------ s3
const S3: React.FC = () => {
  const t0 = kiedy("s3", "wykonany");
  const p = useP(t0, 0.7);
  const t = useT();
  const zmien = interpolate(t, [kiedy("s3", "zmień") - 0.1, kiedy("s3", "zmień") + 0.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const nast = useSpr(t0 + 0.8, 200);
  return (
    <>
      <Naglowek eyebrow="Zrobione zjeżdża do paska" tytul="Miniatura z wynikiem" />
      <Tresc>
      <Pasek zrobione={p > 0.6 ? 1 : 0} teraz={p > 0.6 ? 1 : 0} chipy={p > 0.6} zmien={zmien} />
      {p < 0.98 && (
        <DuzaKarta nr={1} tytul="Podłącz swój sklep WellU" styl={{ opacity: 1 - p, transform: `translate(${-p * 380}px, ${-p * 190}px) scale(${1 - 0.7 * p})`, transformOrigin: "left top" }} />
      )}
      <DuzaKarta nr={2} tytul="Skopiuj swój główny link" styl={{ opacity: nast, transform: `translateY(${(1 - nast) * 40}px)` }}>
        <div style={{ display: "flex", gap: 14, marginTop: 22 }}>
          <div style={{ flex: 1, height: 64, borderRadius: 16, background: K.tint, display: "flex", alignItems: "center", padding: "0 20px", ...tekst(24, 700) }}>https://czasnawellu.pl/?ref=anna</div>
          <div style={{ height: 64, borderRadius: 99, background: K.a, padding: "0 30px", display: "flex", alignItems: "center", ...tekst(24, 800, "#fff") }}>Kopiuj link</div>
        </div>
      </DuzaKarta>
    </Tresc>
    </>
  );
};

// ------------------------------------------------------------------ s4
const KURSY = ["Pierwsze kroki", "Narzędzia rekrutacyjne", "Mocna Głowa", "Mocne Ręce", "Akademia AI"];
const S4: React.FC = () => {
  const t = useT();
  const p = useSpr(kiedy("s4", "edukacja"), 200);
  const tl = kiedy("s4", "lekcja");
  const tp = kiedy("s4", "przycisk");
  const puls = interpolate(t, [tp, tp + 0.3, tp + 0.6], [1, 1.08, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <>
      <Naglowek eyebrow="Krok 4 · Edukacja" tytul="Zawsze wiesz, co dalej" />
      <Tresc>
      <div style={{ ...OBSZAR, opacity: p, transform: `translateY(${(1 - p) * 40}px)`, background: K.card, border: `3px solid ${K.a}`, borderRadius: 26, padding: 30, display: "grid", gridTemplateColumns: "360px 1fr", gap: 32 }}>
        <div style={{ aspectRatio: "16/10", borderRadius: 18, background: "linear-gradient(135deg,#1d6b24,#19a020 55%,#8fd694)", display: "flex", alignItems: "flex-end", padding: 18, ...tekst(30, 800, "#fff") }}>Mocna Głowa</div>
        <div>
          <div style={{ ...tekst(20, 800, K.a), letterSpacing: "0.1em", opacity: t >= tl ? 1 : 0.25 }}>LEKCJA 3 Z 9</div>
          <div style={{ ...tekst(32, 800), marginTop: 6 }}>Reset partnera: jedna sekwencja zamiast chaosu</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 20 }}>
            {KURSY.map((k, i) => {
              const o = interpolate(t, [tl + i * 0.15, tl + i * 0.15 + 0.3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              return (
                <span key={k} style={{ opacity: o, ...tekst(18, 700, i < 2 ? K.a : i === 2 ? "#fff" : K.mut), background: i < 2 ? K.tint : i === 2 ? K.a : "#EEF1EE", borderRadius: 99, padding: "6px 14px" }}>{(i < 2 ? "✓ " : "") + k}</span>
              );
            })}
          </div>
          <div style={{ display: "inline-block", marginTop: 24, transform: `scale(${puls})`, background: K.a, borderRadius: 99, padding: "16px 34px", ...tekst(26, 800, "#fff") }}>Kontynuuj lekcję 3</div>
        </div>
      </div>
    </Tresc>
    </>
  );
};

// ------------------------------------------------------------------ s5
const KPI = [
  { l: "Wszystkie", v: 37, d: "w Twoim CRM", slowo: "kontaktów" },
  { l: "Nowe", v: 4, d: "w tym tygodniu", slowo: "nowych" },
  { l: "W toku", v: 12, d: "czekają na ruch", slowo: "czeka" },
  { l: "Bez ruchu", v: 5, d: "ponad 14 dni", slowo: "rozmawiałeś", alert: true },
  { l: "Na TAK", v: 6, d: "partnerzy i klienci", slowo: "" },
];
const S5: React.FC = () => {
  const t = useT();
  const tp = kiedy("s5", "pomarańczowy");
  return (
    <>
      <Naglowek eyebrow="Twoje kontakty" tytul="Twoje liczby na dziś" />
      <Tresc>
      <div style={{ ...OBSZAR, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 18 }}>
        {KPI.map((k, i) => {
          const t0 = k.slowo ? kiedy("s5", k.slowo) : kiedy("s5", "kontaktów");
          const p = interpolate(t, [t0 - 0.1, t0 + 0.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const hit = k.slowo !== "" && t >= t0 && t < t0 + 1.4;
          const al = k.alert && t >= tp ? 1 + 0.05 * Math.sin((t - tp) * 8) : 1;
          return (
            <div key={k.l} style={{ background: k.alert ? K.warnT : K.card, border: `2px solid ${k.alert ? K.warn : hit ? K.a : K.line}`, borderRadius: 20, padding: "22px 20px", transform: `scale(${al})`, opacity: 0.3 + 0.7 * p }}>
              <div style={tekst(20, 700, K.mut)}>{k.l}</div>
              <div style={{ ...tekst(64, 800, k.alert ? K.warn : K.ink), marginTop: 6 }}>{Math.round(k.v * p)}</div>
              <div style={tekst(17, 600, K.mut)}>{k.d}</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 100 + 3 * ((1390 - 72) / 5 + 18), top: 470, width: (1390 - 72) / 5, textAlign: "center", ...tekst(24, 800, K.warn), opacity: useP(tp) }}>↑ lista na teraz</div>
    </Tresc>
    </>
  );
};

// ------------------------------------------------------------------ s6
const LEJKI = [
  { n: "Quiz: Klienci – Longevity", w: 64, z: 11, k: 17, tak: 2 },
  { n: "Quiz: Klienci – dobór produktów", w: 41, z: 6, k: 15, tak: 3 },
  { n: "Zaproszenie do WellU", w: 18, z: 2, k: 11, tak: 1 },
];
const S6: React.FC = () => {
  const t = useT();
  const kol = [kiedy("s6", "weszło"), kiedy("s6", "zapisało"), kiedy("s6", "odpowiedziało")];
  const c = (i: number) => interpolate(t, [kol[i] - 0.1, kol[i] + 0.7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const th: React.CSSProperties = { ...tekst(18, 800, K.mut), letterSpacing: "0.08em", textAlign: "right", padding: "0 16px 14px" };
  const td: React.CSSProperties = { ...tekst(28, 700), textAlign: "right", padding: "18px 16px", borderTop: `1.5px solid ${K.line}` };
  return (
    <>
      <Naglowek eyebrow="Skuteczność Twoich lejków" tytul="Jak pracują Twoje linki" />
      <Tresc>
      <div style={{ ...OBSZAR, background: K.card, borderRadius: 24, padding: "26px 30px", border: `1.5px solid ${K.line}` }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ ...th, textAlign: "left", paddingLeft: 0 }}>LEJEK</th>
              <th style={{ ...th, color: c(0) > 0 ? K.a : K.mut }}>WEJŚCIA</th>
              <th style={{ ...th, color: c(1) > 0 ? K.a : K.mut }}>ZAPISY</th>
              <th style={th}>KONWERSJA</th>
              <th style={{ ...th, color: c(2) > 0 ? K.a : K.mut }}>TAK</th>
            </tr>
          </thead>
          <tbody>
            {LEJKI.map((l) => (
              <tr key={l.n}>
                <td style={{ ...td, textAlign: "left", paddingLeft: 0 }}>{l.n}</td>
                <td style={td}>{Math.round(l.w * c(0))}</td>
                <td style={td}>{Math.round(l.z * c(1))}</td>
                <td style={td}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
                    <span style={{ width: 90, height: 10, borderRadius: 99, background: K.line, overflow: "hidden" }}><span style={{ display: "block", height: "100%", width: `${(l.k / 17) * 100 * c(1)}%`, background: K.a }} /></span>
                    {Math.round(l.k * c(1))}%
                  </span>
                </td>
                <td style={td}>{Math.round(l.tak * c(2))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Tresc>
    </>
  );
};

// ------------------------------------------------------------------ s7
const NOWOSCI = [
  { typ: "Nowy quiz", tlo: "#F1EAFA", kol: "#7A4BB3", t: "Klienci – Longevity", slowo: "lejki", nowe: true },
  { typ: "Kurs", tlo: K.warnT, kol: K.warn, t: "Mocne Ręce: nowa lekcja", slowo: "kursy" },
  { typ: "Blog", tlo: "#E8F0FA", kol: "#2F6FB3", t: "Gala WellU 2026: nowe produkty i mentoring", slowo: "wpisy" },
];
const S7: React.FC = () => {
  const t = useT();
  return (
    <>
      <Naglowek eyebrow="Co nowego" tytul="Wiesz pierwszy" />
      <Tresc>
      <div style={{ ...OBSZAR, background: K.card, borderRadius: 24, padding: "10px 30px", border: `1.5px solid ${K.line}` }}>
        {NOWOSCI.map((n, i) => {
          const t0 = kiedy("s7", n.slowo);
          const p = interpolate(t, [t0 - 0.15, t0 + 0.35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div key={n.t} style={{ display: "flex", alignItems: "center", gap: 20, padding: "24px 0", borderTop: i ? `1.5px solid ${K.line}` : "none", opacity: p, transform: `translateY(${(1 - p) * -30}px)` }}>
              <span style={{ ...tekst(18, 800, n.kol), background: n.tlo, borderRadius: 99, padding: "6px 14px" }}>{n.typ}</span>
              <span style={tekst(30, 700)}>{n.t}</span>
              {n.nowe && <span style={{ ...tekst(15, 800, "#fff"), background: K.a, borderRadius: 6, padding: "2px 8px", letterSpacing: "0.08em" }}>NOWE</span>}
            </div>
          );
        })}
      </div>
    </Tresc>
    </>
  );
};

// ------------------------------------------------------------------ s8
const S8: React.FC = () => {
  const t = useT();
  const t0 = kiedy("s8", "zaglądaj");
  const kat = interpolate(t, [t0, t0 + 2.5], [0, 360], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const p5 = useSpr(kiedy("s8", "pięć"));
  return (
    <>
      <Naglowek eyebrow="Codzienny rytuał" tytul="Każdego ranka, tutaj" />
      <Tresc>
      <div style={{ ...OBSZAR, display: "flex", alignItems: "center", gap: 60 }}>
        <div style={{ position: "relative", width: 260, height: 260, borderRadius: 999, background: K.card, border: `8px solid ${K.a}` }}>
          <div style={{ position: "absolute", left: 126, top: 50, width: 8, height: 84, borderRadius: 9, background: K.ink, transformOrigin: "50% 100%", transform: `rotate(${kat}deg)` }} />
          <div style={{ position: "absolute", left: 126, top: 74, width: 8, height: 60, borderRadius: 9, background: K.a, transformOrigin: "50% 100%", transform: "rotate(240deg)" }} />
          <div style={{ position: "absolute", left: 118, top: 118, width: 24, height: 24, borderRadius: 99, background: K.ink }} />
        </div>
        <Coffee size={150} color={K.ad} strokeWidth={1.5} />
        <div style={{ transform: `scale(${0.6 + 0.4 * p5})`, opacity: p5, transformOrigin: "left center" }}>
          <div style={tekst(110, 800, K.a)}>5 minut</div>
          <div style={tekst(40, 700, K.mut)}>dziennie</div>
        </div>
      </div>
    </Tresc>
    </>
  );
};

export const Dashboard: React.FC<{ zAwatarem?: boolean; bezNapisow?: boolean }> = ({ zAwatarem, bezNapisow }) => (
  <AbsoluteFill style={{ background: K.bg }}>
    <Audio src={staticFile("film-dashboard/lektor.mp3")} />
    <Scena id="s1"><S1 /></Scena>
    <Scena id="s2"><S2 /></Scena>
    <Scena id="s3"><S3 /></Scena>
    <Scena id="s4"><S4 /></Scena>
    <Scena id="s5"><S5 /></Scena>
    <Scena id="s6"><S6 /></Scena>
    <Scena id="s7"><S7 /></Scena>
    <Scena id="s8"><S8 /></Scena>
    {bezNapisow ? null : <F.Napisy />}
    {zAwatarem ? <Awatar src={staticFile("film-dashboard/awatar.mp4")} /> : null}
  </AbsoluteFill>
);
