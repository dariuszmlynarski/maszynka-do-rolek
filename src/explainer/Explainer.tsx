// Film „Czym jest lejek” (16:9) do strefy partnera CNW — /lejki/ na czasnawellu.pl.
// Osobna kompozycja obok rolek: kadr poziomy, paleta CNW (jasna zieleń), mały awatar w rogu.
// Czasy scen i słów bierze z os.json (lektor ElevenLabs pocięty na sceny, scalony w lektor.mp3),
// więc animacje odpalają się na słowo, które je zapowiada.
// Media (poza repo): public/lejki-explainer/lektor.mp3 i awatar.mp4 (HeyGen „Office Desk 1” na tym samym audio);
// robocze pliki i skrypt lektora: projekty/lejki-explainer/. Render:
//   npx remotion render src/index.ts Lejki16x9 out.mp4 --props='{"zAwatarem":true}' --crf=20
// a potem loudnorm (-16 LUFS) i faststart w ffmpeg. Film stoi na czasnawellu.pl/lejki/ (03.10.2026).
import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, Easing } from "remotion";
import { Gift, Link2, Mail, MessageCircle, Moon, Smartphone, Sun, Check, Copy, Image as ImageIcon, MessageSquare } from "lucide-react";
import { CZCIONKA } from "../marka";
import OS from "./os.json";

export const EX_SZER = 1920;
export const EX_WYS = 1080;
export const EX_FPS = 30;
export const exKlatki = () => Math.ceil(OS.calosc * EX_FPS);

const K = {
  bg: "#F4F9F3",
  card: "#FFFFFF",
  ink: "#16211A",
  mut: "#5D6B61",
  line: "#DDE7DC",
  a: "#19A020",
  ad: "#137A18",
  tint: "#E9F4E7",
  warn: "#B7791F",
  dark: "#0E2412",
};

type Slowo = { tekst: string; start: number; koniec: number };
type Sc = { id: string; start: number; czas: number; slowa: Slowo[] };
const SCENY = OS.sceny as Sc[];

/** Moment (s, globalnie), w którym w scenie pada słowo zaczynające się od `rdzen`. */
const kiedy = (id: string, rdzen: string, ktore = 0) => {
  const s = SCENY.find((x) => x.id === id)!;
  const hit = s.slowa.filter((w) => w.tekst.toLowerCase().replace(/[^\p{L}-]/gu, "").startsWith(rdzen))[ktore];
  return s.start + (hit ? hit.start : 0);
};
const zakres = (id: string) => {
  const i = SCENY.findIndex((x) => x.id === id);
  const s = SCENY[i];
  const nast = SCENY[i + 1];
  return { od: i === 0 ? 0 : s.start - 0.3, do: nast ? nast.start - 0.3 : OS.calosc };
};

const useT = () => {
  const f = useCurrentFrame();
  return f / EX_FPS;
};
/** 0→1 sprężyną od chwili `t0` (sekundy). */
const useWej = (t0: number, dlug = 18) => {
  const f = useCurrentFrame();
  return spring({ frame: f - Math.round(t0 * EX_FPS), fps: EX_FPS, durationInFrames: dlug, config: { damping: 200 } });
};

const Scena: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => {
  const t = useT();
  const z = zakres(id);
  if (t < z.od - 0.01 || t > z.do + 0.35) return null;
  const op = Math.min(interpolate(t, [z.od, z.od + 0.35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), interpolate(t, [z.do, z.do + 0.35], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const y = interpolate(t, [z.od, z.od + 0.5], [24, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return <AbsoluteFill style={{ opacity: op, transform: `translateY(${y}px)` }}>{children}</AbsoluteFill>;
};

const Naglowek: React.FC<{ eyebrow: string; tytul: string }> = ({ eyebrow, tytul }) => (
  <div style={{ position: "absolute", left: 120, top: 92 }}>
    <div style={{ fontFamily: CZCIONKA.tekst, fontWeight: 800, fontSize: 24, letterSpacing: "0.16em", textTransform: "uppercase", color: K.a, marginBottom: 12 }}>{eyebrow}</div>
    <div style={{ fontFamily: CZCIONKA.tekst, fontWeight: 800, fontSize: 64, letterSpacing: "-0.02em", color: K.ink, lineHeight: 1.08, maxWidth: 1300 }}>{tytul}</div>
  </div>
);

// ------------------------------------------------------------------ tablica kontaktów (s1, s2, s4)
const KOLUMNY = ["Nowy kontakt", "Zaproszenie", "FollowUp"];
const Karta: React.FC<{ imie: string; zrodlo: string; styl?: React.CSSProperties; wyroznij?: number; extra?: React.ReactNode }> = ({ imie, zrodlo, styl, wyroznij = 0, extra }) => (
  <div style={{ background: K.card, borderRadius: 18, padding: "18px 22px", border: `2px solid ${wyroznij ? K.a : K.line}`, boxShadow: `0 ${8 + 18 * wyroznij}px ${24 + 30 * wyroznij}px rgba(25,160,32,${0.08 + 0.22 * wyroznij})`, ...styl }}>
    <div style={{ fontFamily: CZCIONKA.tekst, fontWeight: 700, fontSize: 28, color: K.ink }}>{imie}</div>
    <div style={{ fontFamily: CZCIONKA.tekst, fontWeight: 500, fontSize: 21, color: K.mut, marginTop: 4 }}>{zrodlo}</div>
    {extra}
  </div>
);

const Tablica: React.FC<{ karty: { imie: string; zrodlo: string; t0: number }[]; anna?: number }> = ({ karty, anna }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 120, right: 520, top: 300, bottom: 150, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 26 }}>
      {KOLUMNY.map((k, i) => {
        const wKolumnie = i === 0 ? karty.filter((c) => f >= c.t0 * EX_FPS).length + (anna !== undefined && anna > 0.5 ? 1 : 0) : 0;
        return (
          <div key={k} style={{ background: K.tint, borderRadius: 24, padding: 22, display: "flex", flexDirection: "column", gap: 14, overflow: "hidden" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: CZCIONKA.tekst, fontWeight: 800, fontSize: 24, color: K.ink }}>
              {k}
              <span style={{ background: K.card, color: K.mut, borderRadius: 999, padding: "4px 14px", fontSize: 21 }}>{wKolumnie}</span>
            </div>
            {i === 0 && anna !== undefined && anna > 0 && <AnnaKarta p={anna} />}
            {i === 0 &&
              karty.map((c, j) => {
                const p = spring({ frame: f - Math.round(c.t0 * EX_FPS), fps: EX_FPS, config: { damping: 14, stiffness: 120 } });
                if (f < c.t0 * EX_FPS) return null;
                return <Karta key={j} imie={c.imie} zrodlo={c.zrodlo} styl={{ transform: `translateY(${(1 - p) * -260}px)`, opacity: Math.min(1, p * 1.6) }} />;
              })}
            {wKolumnie === 0 && !(anna !== undefined && anna > 0) && (
              <div style={{ flex: 1, border: `3px dashed ${K.line}`, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: CZCIONKA.tekst, fontSize: 22, color: "#9AA89D" }}>pusto</div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const AnnaKarta: React.FC<{ p: number }> = ({ p }) => {
  const t = useT();
  const tagi = [
    { tekst: "Źródło: Quiz Longevity", t0: kiedy("s4", "skąd") },
    { tekst: "Szuka: więcej energii", t0: kiedy("s4", "czego") },
  ];
  return (
    <Karta
      imie="Anna K."
      zrodlo="Profil: Spokojny Strateg"
      wyroznij={1}
      styl={{ transform: `translate(${(1 - p) * 900}px, ${(1 - p) * -200}px) rotate(${(1 - p) * 8}deg)` }}
      extra={
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
          {tagi.map((g) => {
            const o = interpolate(t, [g.t0, g.t0 + 0.3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return (
              <span key={g.tekst} style={{ opacity: o, transform: `scale(${0.85 + 0.15 * o})`, background: K.tint, color: K.ad, fontFamily: CZCIONKA.tekst, fontWeight: 700, fontSize: 18, borderRadius: 999, padding: "5px 12px" }}>{g.tekst}</span>
            );
          })}
        </div>
      }
    />
  );
};

const DzienNoc: React.FC<{ t0: number }> = ({ t0 }) => {
  const t = useT();
  const kat = interpolate(t, [t0, t0 + 2.4], [0, 360], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const noc = kat > 90 && kat < 270;
  return (
    <div style={{ position: "absolute", right: 540, top: 110, width: 96, height: 96, borderRadius: 999, background: noc ? K.dark : "#FFF4D6", display: "flex", alignItems: "center", justifyContent: "center", transform: `rotate(${kat}deg)`, opacity: t >= t0 ? 1 : 0 }}>
      {noc ? <Moon size={48} color="#E8F0E8" /> : <Sun size={52} color="#E0A21A" />}
    </div>
  );
};

const KARTY_S2 = [
  { imie: "Marta W.", zrodlo: "Quiz: dobór produktów" },
  { imie: "Tomek R.", zrodlo: "Zaproszenie do WellU" },
  { imie: "Ewa P.", zrodlo: "Quiz Longevity" },
];

// ------------------------------------------------------------------ s3: pięć kroków lejka
const KROKI = [
  { ikona: MessageCircle, tytul: "Zaproszenie", opis: "wiadomość, post, relacja", slowo: "zaproszenie" },
  { ikona: Link2, tytul: "Link", opis: "z Twoim kodem", slowo: "klika" },
  { ikona: Smartphone, tytul: "Strona pod jedną sprawę", opis: "np. quiz", slowo: "stronę" },
  { ikona: Mail, tytul: "Imię i e-mail", opis: "zostawia kontakt", slowo: "zostawia" },
  { ikona: Gift, tytul: "Wartość w zamian", opis: "wynik, plan, prezentacja", slowo: "zamian" },
];
const Kroki: React.FC = () => {
  const t = useT();
  return (
    <div style={{ position: "absolute", left: 120, right: 520, top: 330, display: "flex", flexDirection: "column", gap: 18 }}>
      {KROKI.map((k, i) => {
        const t0 = kiedy("s3", k.slowo);
        const p = interpolate(t, [t0 - 0.15, t0 + 0.35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
        const aktywny = t >= t0 && (i === KROKI.length - 1 || t < kiedy("s3", KROKI[i + 1].slowo));
        const Ik = k.ikona;
        return (
          <div key={k.tytul} style={{ opacity: 0.18 + 0.82 * p, transform: `translateX(${(1 - p) * -40}px)`, display: "flex", alignItems: "center", gap: 26, background: aktywny ? K.card : "transparent", border: `2px solid ${aktywny ? K.a : "transparent"}`, borderRadius: 22, padding: "14px 22px", boxShadow: aktywny ? "0 16px 40px rgba(25,160,32,.16)" : "none", width: `${100 - i * 6}%`, marginLeft: `${i * 3}%` }}>
            <div style={{ width: 70, height: 70, borderRadius: 999, background: p > 0.5 ? K.a : K.line, display: "flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto" }}>
              <Ik size={36} color="#fff" />
            </div>
            <div style={{ fontFamily: CZCIONKA.tekst, fontWeight: 800, fontSize: 36, color: K.ink }}>{k.tytul}</div>
            <div style={{ fontFamily: CZCIONKA.tekst, fontWeight: 500, fontSize: 26, color: K.mut }}>{k.opis}</div>
          </div>
        );
      })}
    </div>
  );
};

// ------------------------------------------------------------------ s5: trzy lejki
const LEJKI = [
  { typ: "Quiz", nazwa: "Dobór produktów", slowo: "doboru" },
  { typ: "Quiz", nazwa: "Longevity", slowo: "longevity" },
  { typ: "Lejek", nazwa: "Zaproszenie do WellU", slowo: "zaproszenie" },
];
const Lejki: React.FC = () => {
  const t = useT();
  const tPigulki = kiedy("s5", "każdy");
  return (
    <div style={{ position: "absolute", left: 120, right: 520, top: 330, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 26 }}>
      {LEJKI.map((l) => {
        const t0 = kiedy("s5", l.slowo);
        const p = interpolate(t, [t0 - 0.2, t0 + 0.35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.4)) });
        const pp = interpolate(t, [tPigulki, tPigulki + 0.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div key={l.nazwa} style={{ opacity: p, transform: `translateY(${(1 - p) * 60}px) scale(${0.92 + 0.08 * p})`, background: K.card, border: `2px solid ${K.a}`, borderRadius: 26, padding: "30px 28px", boxShadow: "0 18px 44px rgba(25,160,32,.14)", display: "flex", flexDirection: "column", gap: 12, minHeight: 300 }}>
            <div style={{ fontFamily: CZCIONKA.tekst, fontWeight: 800, fontSize: 21, letterSpacing: "0.14em", textTransform: "uppercase", color: K.a }}>{l.typ}</div>
            <div style={{ fontFamily: CZCIONKA.tekst, fontWeight: 800, fontSize: 40, color: K.ink, lineHeight: 1.12, flex: 1 }}>{l.nazwa}</div>
            <div style={{ display: "flex", gap: 10, opacity: pp, transform: `translateY(${(1 - pp) * 10}px)` }}>
              {[{ i: MessageSquare, t: "wiadomości" }, { i: ImageIcon, t: "grafiki" }].map(({ i: Ik, t: tx }) => (
                <span key={tx} style={{ display: "flex", alignItems: "center", gap: 8, background: K.tint, color: K.ad, fontFamily: CZCIONKA.tekst, fontWeight: 700, fontSize: 21, borderRadius: 999, padding: "7px 14px" }}>
                  <Ik size={22} color={K.ad} /> {tx}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ------------------------------------------------------------------ s6: kopiuj link + kula śnieżna
const Final: React.FC = () => {
  const t = useT();
  const tKlik = kiedy("s6", "skopiuj");
  const tKula = kiedy("s6", "jeden", 1);
  const klik = t >= tKlik + 0.25;
  const wcisk = interpolate(t, [tKlik, tKlik + 0.12, tKlik + 0.25], [1, 0.94, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const k = interpolate(t, [tKula, tKula + 3.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
  const x0 = 180, y0 = 640, x1 = 1220, y1 = 880;
  const r = 22 + 90 * k;
  const cx = x0 + (x1 - x0) * k;
  const cy = y0 + (y1 - y0) * k - r;
  return (
    <>
      <div style={{ position: "absolute", left: 120, top: 330, display: "flex", alignItems: "center", gap: 22 }}>
        <div style={{ fontFamily: CZCIONKA.kod, fontSize: 30, color: K.ink, background: K.card, border: `2px solid ${K.line}`, borderRadius: 18, padding: "22px 28px" }}>czasnawellu.pl/longevity/?ref=Twoj-kod</div>
        <div style={{ transform: `scale(${wcisk})`, display: "flex", alignItems: "center", gap: 12, background: klik ? K.ad : K.a, color: "#fff", fontFamily: CZCIONKA.tekst, fontWeight: 800, fontSize: 32, borderRadius: 999, padding: "22px 36px" }}>
          {klik ? <Check size={34} color="#fff" /> : <Copy size={32} color="#fff" />} {klik ? "Skopiowane" : "Kopiuj link"}
        </div>
      </div>
      <svg width={EX_SZER} height={EX_WYS} style={{ position: "absolute", left: 0, top: 0, opacity: t >= tKula - 0.4 ? 1 : 0 }}>
        <line x1={x0 - 60} y1={y0 + 4} x2={x1 + 140} y2={y1 + 36} stroke={K.line} strokeWidth={8} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={r} fill="#FFFFFF" stroke="#C9D9C7" strokeWidth={4} />
        <circle cx={cx - r * 0.35} cy={cy - r * 0.35} r={r * 0.22} fill="#EEF5EC" />
      </svg>
      <div style={{ position: "absolute", left: 120, top: 520, fontFamily: CZCIONKA.tekst, fontWeight: 800, fontSize: 40, color: K.a, opacity: interpolate(t, [tKula, tKula + 0.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>1 link dziennie</div>
    </>
  );
};

// ------------------------------------------------------------------ napisy (karaoke)
type Linia = { slowa: Slowo[]; od: number; do: number };
const LINIE: Linia[] = (() => {
  const out: Linia[] = [];
  for (const s of SCENY) {
    let cur: Slowo[] = [];
    let len = 0;
    const flush = () => {
      if (!cur.length) return;
      out.push({ slowa: cur, od: cur[0].start, do: cur[cur.length - 1].koniec });
      cur = [];
      len = 0;
    };
    for (const w of s.slowa) {
      const g = { tekst: w.tekst, start: s.start + w.start, koniec: s.start + w.koniec };
      if (len + w.tekst.length > 46) flush();
      cur.push(g);
      len += w.tekst.length + 1;
      if (/[.?!:]$/.test(w.tekst) && len > 18) flush();
    }
    flush();
  }
  return out;
})();
const Napisy: React.FC = () => {
  const t = useT();
  const i = LINIE.findIndex((l, j) => t >= l.od - 0.05 && t < (LINIE[j + 1]?.od ?? l.do + 0.6) - 0.05);
  if (i < 0) return null;
  const l = LINIE[i];
  if (t > l.do + 0.8) return null;
  return (
    <div style={{ position: "absolute", left: 120, right: 520, bottom: 64, display: "flex" }}>
      <div style={{ background: "rgba(14,36,18,.88)", borderRadius: 16, padding: "14px 24px", fontFamily: CZCIONKA.napisy, fontWeight: 700, fontSize: 36, lineHeight: 1.25, color: "#fff" }}>
        {l.slowa.map((w, j) => (
          <span key={j} style={{ color: t >= w.start ? "#7EE08A" : "#FFFFFF" }}>{w.tekst} </span>
        ))}
      </div>
    </div>
  );
};

// ------------------------------------------------------------------ awatar w rogu
const Awatar: React.FC<{ src: string }> = ({ src }) => {
  const f = useCurrentFrame();
  const p = spring({ frame: f - 4, fps: EX_FPS, config: { damping: 200 } });
  const D = 360;
  return (
    <div style={{ position: "absolute", right: 90, bottom: 70, width: D, height: D, borderRadius: 999, overflow: "hidden", border: `8px solid ${K.card}`, boxShadow: `0 0 0 4px ${K.a}, 0 24px 60px rgba(14,36,18,.28)`, transform: `scale(${0.8 + 0.2 * p})`, opacity: p, background: K.dark }}>
      <OffthreadVideo src={src} muted style={{ position: "absolute", height: 520, left: "50%", top: -18, transform: "translateX(-50%)" }} />
    </div>
  );
};

export const Explainer: React.FC<{ zAwatarem?: boolean; bezNapisow?: boolean }> = ({ zAwatarem, bezNapisow }) => {
  const awatar = zAwatarem ? staticFile("lejki-explainer/awatar.mp4") : "";
  return (
    <AbsoluteFill style={{ background: K.bg }}>
      <Audio src={staticFile("lejki-explainer/lektor.mp3")} />
      <Scena id="s1">
        <Naglowek eyebrow="Lejki w strefie partnera" tytul="Pusta tablica kontaktów?" />
        <Tablica karty={[]} />
      </Scena>
      <Scena id="s2">
        <Naglowek eyebrow="Zadanie lejka" tytul="Nowe kontakty na Twojej tablicy" />
        <DzienNoc t0={kiedy("s2", "codziennie")} />
        <Tablica karty={KARTY_S2.map((c, i) => ({ ...c, t0: kiedy("s2", "dostarczać") + i * 0.9 }))} />
      </Scena>
      <Scena id="s3">
        <Naglowek eyebrow="Jak działa lejek" tytul="Pięć kroków od linku do kontaktu" />
        <Kroki />
      </Scena>
      <Scena id="s4">
        <Naglowek eyebrow="W tej samej chwili" tytul="Kontakt ląduje u Ciebie, z konkretem" />
        <AnnaWejscie />
      </Scena>
      <Scena id="s5">
        <Naglowek eyebrow="Gotowe lejki" tytul="Wybierz i wysyłaj" />
        <Lejki />
      </Scena>
      <Scena id="s6">
        <Naglowek eyebrow="Twój ruch" tytul="Jeden link dziś. Jednej osobie." />
        <Final />
      </Scena>
      {bezNapisow ? null : <Napisy />}
      {awatar ? <Awatar src={awatar} /> : null}
    </AbsoluteFill>
  );
};

const AnnaWejscie: React.FC = () => {
  const p = useWej(kiedy("s4", "ląduje") - 0.2, 26);
  return <Tablica karty={[]} anna={p} />;
};
