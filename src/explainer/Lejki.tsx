// Film 3 serii strefy partnera: „Jak korzystać z lejków” (16:9, głos Dariusza z nagrania 03.10.2026).
// Scenariusz: 4-CNW/Admin/czasnawellu.pl/Strefa partnera/Filmy/Film 3 - Strona z lejkami - scenariusz.md. Media (poza repo): public/film-lejki/.
import React from "react";
import { AbsoluteFill, Audio, interpolate, staticFile } from "remotion";
import { Check, Copy, Download, Image as ImageIcon, MessageCircle, Send, ShoppingCart, Smartphone } from "lucide-react";
import { Awatar, K, Naglowek, OBSZAR, Tresc, tekst, useP, useSpr, useT, zrobFilm, type Os } from "./fabryka";
import OS from "./os-lejki.json";

const F = zrobFilm(OS as Os);
export const lejkiKlatki = F.klatki;
const { kiedy, Scena } = F;
const kl = (t: number, a: number, b: number) => interpolate(t, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const LEJKI = ["Zaproszenie do WellU", "Quiz: Klienci – dobór produktów", "Quiz: Klienci – Longevity"];

const Zakladka: React.FC<{ tytul: string; otwarta: number; children?: React.ReactNode }> = ({ tytul, otwarta, children }) => (
  <div style={{ marginTop: 14 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12, ...tekst(20, 800, K.mut), letterSpacing: "0.1em" }}>
      <span style={{ display: "inline-block", width: 11, height: 11, borderRight: `3px solid ${K.a}`, borderBottom: `3px solid ${K.a}`, transform: `rotate(${-45 + 90 * otwarta}deg)` }} />
      {tytul.toUpperCase()}
      <span style={{ flex: 1, height: 1.5, background: K.line }} />
    </div>
    {children && otwarta > 0.01 ? <div style={{ overflow: "hidden", maxHeight: 420 * otwarta, opacity: otwarta, marginTop: 14 }}>{children}</div> : null}
  </div>
);

const Ramka: React.FC<{ children: React.ReactNode; styl?: React.CSSProperties }> = ({ children, styl }) => (
  <div style={{ ...OBSZAR, background: K.card, border: `3px solid ${K.a}`, borderRadius: 26, padding: "24px 30px", boxShadow: "0 18px 44px rgba(25,160,32,.14)", ...styl }}>{children}</div>
);
const Lejek: React.FC<{ nazwa: string }> = ({ nazwa }) => (
  <>
    <div style={{ ...tekst(17, 800, K.a), letterSpacing: "0.14em" }}>LEJEK</div>
    <div style={{ ...tekst(34, 800), marginTop: 4 }}>{nazwa}</div>
  </>
);
const Przycisk: React.FC<{ tekst1: string; tekst2?: string; klik: number; ikona?: React.ReactNode }> = ({ tekst1, tekst2, klik, ikona }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 99, padding: "10px 20px", background: klik > 0.5 ? K.ad : K.a, transform: `scale(${1 - 0.06 * Math.sin(Math.PI * Math.min(1, klik * 2))})`, ...tekst(19, 800, "#fff") }}>
    {klik > 0.5 ? <Check size={20} color="#fff" strokeWidth={3} /> : ikona}
    {klik > 0.5 && tekst2 ? tekst2 : tekst1}
  </span>
);

// ------------------------------------------------------------------ s1
const S1: React.FC = () => {
  const t = useT();
  return (
    <>
      <Naglowek eyebrow="Strefa partnera" tytul="Lejki" />
      <Tresc>
        <div style={{ ...OBSZAR, display: "flex", flexDirection: "column", gap: 18 }}>
          {LEJKI.map((n, i) => {
            const p = kl(t, 0.6 + i * 0.5, 1.1 + i * 0.5);
            return (
              <div key={n} style={{ opacity: p, transform: `translateY(${(1 - p) * 30}px)`, background: K.card, border: `2.5px solid ${K.a}`, borderRadius: 22, padding: "20px 26px" }}>
                <Lejek nazwa={n} />
              </div>
            );
          })}
        </div>
      </Tresc>
    </>
  );
};

// ------------------------------------------------------------------ s2
const OPIS = [
  { d: "Dla kogo", t: "Dla osób, które szukają drugiego źródła dochodu albo pytają, czym się zajmujesz.", s: "dla" },
  { d: "Co się stanie", t: "Zostawia imię i e-mail i od razu ogląda prezentację WellU.", s: "co" },
  { d: "Dlaczego to działa", t: "Najpierw fakty, potem rozmowa. Nikogo nie namawiasz.", s: "dlaczego" },
];
const S2: React.FC = () => {
  const t = useT();
  const tc = kiedy("s2", "przeczytaj");
  return (
    <>
      <Naglowek eyebrow="Każdy lejek" tytul="Najpierw krótki opis" />
      <Tresc>
        <Ramka>
          <Lejek nazwa="Zaproszenie do WellU" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginTop: 18 }}>
            {OPIS.map((o) => {
              const p = kl(t, kiedy("s2", o.s) - 0.1, kiedy("s2", o.s) + 0.4);
              const czyt = t >= tc ? 1 : 0;
              return (
                <div key={o.d} style={{ background: K.tint, borderRadius: 18, padding: 18, opacity: 0.25 + 0.75 * p, border: `2px solid ${p > 0.5 && t < tc ? K.a : "transparent"}`, boxShadow: czyt ? `0 0 0 4px rgba(25,160,32,${0.2 * czyt})` : "none" }}>
                  <div style={tekst(19, 800, K.ad)}>{o.d}</div>
                  <div style={{ ...tekst(18, 500), marginTop: 6, lineHeight: 1.4 }}>{o.t}</div>
                </div>
              );
            })}
          </div>
        </Ramka>
      </Tresc>
    </>
  );
};

// ------------------------------------------------------------------ s3
const S3: React.FC = () => {
  const t = useT();
  const otw = kl(t, kiedy("s3", "pierwsza") - 0.1, kiedy("s3", "pierwsza") + 0.4);
  const klik = kl(t, kiedy("s3", "kliknij") + 0.2, kiedy("s3", "kliknij") + 0.5);
  const wklej = kl(t, kiedy("s3", "możesz"), kiedy("s3", "możesz") + 0.6);
  return (
    <>
      <Naglowek eyebrow="Zakładka 1" tytul="Strony lądowania" />
      <Tresc>
        <Ramka>
          <Lejek nazwa="Quiz: Klienci – Longevity" />
          <Zakladka tytul="Strony lądowania (1)" otwarta={otw}>
            <div style={tekst(22, 800)}>Quiz: Twój profil Longevity</div>
            <div style={{ display: "flex", gap: 12, marginTop: 10, alignItems: "center" }}>
              <div style={{ flex: 1, background: K.tint, borderRadius: 14, padding: "14px 18px", ...tekst(19, 700) }}>czasnawellu.pl/longevity/?ref=anna</div>
              <Przycisk tekst1="Kopiuj link" tekst2="Skopiowane" klik={klik} ikona={<Copy size={18} color="#fff" />} />
            </div>
          </Zakladka>
          <Zakladka tytul="Grafiki i kreacje (11)" otwarta={0} />
          <Zakladka tytul="Gotowe wiadomości (3)" otwarta={0} />
        </Ramka>
        <div style={{ position: "absolute", left: 100, top: 560, opacity: wklej, transform: `translateY(${(1 - wklej) * 20}px)`, display: "flex", alignItems: "center", gap: 14, background: K.card, border: `1.5px solid ${K.line}`, borderRadius: 99, padding: "12px 22px", ...tekst(19, 600) }}>
          <MessageCircle size={26} color={K.ad} /> Hej! Mam dla Ciebie quiz na minutę: czasnawellu.pl/longevity/?ref=anna
        </div>
      </Tresc>
    </>
  );
};

// ------------------------------------------------------------------ s4
const S4: React.FC = () => {
  const t = useT();
  const otw = kl(t, kiedy("s4", "druga") - 0.1, kiedy("s4", "druga") + 0.4);
  const pob = kl(t, kiedy("s4", "pobierasz"), kiedy("s4", "pobierasz") + 0.4);
  const kop = kl(t, kiedy("s4", "kopiuj") + 0.2, kiedy("s4", "kopiuj") + 0.5);
  const GR = [
    { f: "4:5 · post", h: 170 },
    { f: "9:16 · relacja", h: 210 },
    { f: "4:5 · post", h: 170 },
  ];
  return (
    <>
      <Naglowek eyebrow="Zakładka 2" tytul="Grafiki i kreacje" />
      <Tresc>
        <Ramka>
          <Lejek nazwa="Zaproszenie do WellU" />
          <Zakladka tytul="Strony lądowania (4)" otwarta={0} />
          <Zakladka tytul="Grafiki i kreacje (4)" otwarta={otw}>
            <div style={{ display: "flex", gap: 16, alignItems: "flex-end" }}>
              {GR.map((g, i) => (
                <div key={i} style={{ width: 150, border: `1.5px solid ${K.line}`, borderRadius: 14, overflow: "hidden", background: K.card }}>
                  <div style={{ height: g.h, background: `linear-gradient(160deg, #2a4a30, #6b8f6a ${50 + i * 10}%, #d8c7a8)`, display: "flex", alignItems: "center", justifyContent: "center" }}><ImageIcon size={40} color="rgba(255,255,255,.7)" /></div>
                  <div style={{ padding: 10, ...tekst(14, 700, K.mut) }}>{g.f}</div>
                </div>
              ))}
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginLeft: 12 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 99, padding: "10px 20px", background: K.a, ...tekst(19, 800, "#fff"), transform: `translateY(${pob * 6}px)` }}><Download size={20} color="#fff" /> Pobierz</span>
                <Przycisk tekst1="Kopiuj opis" tekst2="Skopiowane" klik={kop} ikona={<Copy size={18} color="#fff" />} />
              </div>
            </div>
          </Zakladka>
          <Zakladka tytul="Gotowe wiadomości (2)" otwarta={0} />
        </Ramka>
      </Tresc>
    </>
  );
};

// ------------------------------------------------------------------ s5
const S5: React.FC = () => {
  const t = useT();
  const otw = kl(t, kiedy("s5", "trzecia") - 0.1, kiedy("s5", "trzecia") + 0.4);
  const kop = kl(t, kiedy("s5", "skopiuj") + 0.2, kiedy("s5", "skopiuj") + 0.5);
  const wys = kl(t, kiedy("s5", "wysyłaj"), kiedy("s5", "wysyłaj") + 0.6);
  return (
    <>
      <Naglowek eyebrow="Zakładka 3" tytul="Gotowe wiadomości" />
      <Tresc>
        <Ramka>
          <Lejek nazwa="Quiz: Klienci – dobór produktów" />
          <Zakladka tytul="Strony lądowania (1)" otwarta={0} />
          <Zakladka tytul="Grafiki i kreacje (1)" otwarta={0} />
          <Zakladka tytul="Gotowe wiadomości (4)" otwarta={otw}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {["Do koleżanki, która narzeka na cerę", "Post na Facebooka"].map((l, i) => (
                <div key={l} style={{ background: K.tint, borderRadius: 16, padding: 16 }}>
                  <div style={{ ...tekst(14, 800, K.mut), letterSpacing: "0.08em" }}>{l.toUpperCase()}</div>
                  <div style={{ ...tekst(17, 500), margin: "6px 0 12px", lineHeight: 1.4 }}>{i ? "Zrobiłam quiz WellU, który dobiera produkty pod to, czego potrzebujesz. Sprawdź swój wynik 👇" : "Hej! Mam quiz na kilka minut, dobiera produkty pod Twoją skórę. Zerknij:"}</div>
                  <Przycisk tekst1="Kopiuj wiadomość" tekst2="Skopiowane" klik={i === 0 ? kop : 0} ikona={<Copy size={18} color="#fff" />} />
                </div>
              ))}
            </div>
          </Zakladka>
        </Ramka>
        <div style={{ position: "absolute", left: 1120, top: 330, opacity: wys, transform: `translate(${wys * 40}px, ${-wys * 40}px)` }}>
          <Send size={70} color={K.a} />
        </div>
      </Tresc>
    </>
  );
};

// ------------------------------------------------------------------ s6
const S6: React.FC = () => {
  const t = useT();
  const t0 = kiedy("s6", "otwarta");
  const krok = Math.floor(Math.max(0, t - t0) / 1.1) % 3;
  const nazwy = ["Strony lądowania", "Grafiki i kreacje", "Gotowe wiadomości"];
  return (
    <>
      <Naglowek eyebrow="Jedna rzecz naraz" tytul="Zawsze jedna otwarta zakładka" />
      <Tresc>
        <Ramka>
          <Lejek nazwa="Quiz: Klienci – Longevity" />
          {nazwy.map((n, i) => (
            <Zakladka key={n} tytul={n} otwarta={t >= t0 && krok === i ? 1 : 0}>
              <div style={{ height: 70, borderRadius: 14, background: K.tint }} />
            </Zakladka>
          ))}
        </Ramka>
      </Tresc>
    </>
  );
};

// ------------------------------------------------------------------ s7
const S7: React.FC = () => {
  const t = useT();
  const p1 = kl(t, kiedy("s7", "każdy"), kiedy("s7", "każdy") + 0.8);
  const p2 = useSpr(kiedy("s7", "kto"));
  const p3 = useSpr(kiedy("s7", "zakupy"));
  return (
    <>
      <Naglowek eyebrow="Twój kod w każdym linku" tytul="Kontakt i zakup idą do Ciebie" />
      <Tresc>
        <div style={{ ...OBSZAR, top: 270, display: "flex", alignItems: "center", gap: 40 }}>
          <div style={{ background: K.tint, borderRadius: 16, padding: "16px 22px", ...tekst(20, 800) }}>?ref=<span style={{ color: K.a }}>anna</span></div>
          <div style={{ width: 120 * p1, height: 4, background: K.a, borderRadius: 4 }} />
          <div style={{ opacity: p1 }}><Smartphone size={110} color={K.ink} strokeWidth={1.4} /></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
            <div style={{ opacity: p2, transform: `translateX(${(1 - p2) * 60}px)`, background: K.card, border: `2.5px solid ${K.a}`, borderRadius: 18, padding: "14px 20px", width: 330 }}>
              <div style={tekst(15, 800, K.mut)}>TWOJE KONTAKTY · NOWY KONTAKT</div>
              <div style={{ ...tekst(24, 800), marginTop: 4 }}>Ewa P.</div>
            </div>
            <div style={{ opacity: p3, transform: `translateX(${(1 - p3) * 60}px)`, display: "flex", alignItems: "center", gap: 14, background: K.card, border: `2.5px solid ${K.a}`, borderRadius: 18, padding: "14px 20px", width: 330 }}>
              <ShoppingCart size={34} color={K.ad} />
              <div style={tekst(22, 800)}>anna-k.wellu.eu</div>
            </div>
          </div>
        </div>
      </Tresc>
    </>
  );
};

// ------------------------------------------------------------------ s8
const OSOBY = [
  { o: "„Szukam dodatkowego dochodu”", l: "Zaproszenie do WellU" },
  { o: "„Co mi pomoże na cerę?”", l: "Quiz: dobór produktów" },
  { o: "„Chcę mieć więcej energii”", l: "Quiz Longevity" },
];
const S8: React.FC = () => {
  const t = useT();
  const t0 = kiedy("s8", "dobierz");
  const tw = kiedy("s8", "wysyłaj");
  const wys = useP(tw, 0.6);
  return (
    <>
      <Naglowek eyebrow="Twój ruch" tytul="Lejek do osoby, nie osoba do lejka" />
      <Tresc>
        <div style={{ ...OBSZAR, display: "flex", flexDirection: "column", gap: 20 }}>
          {OSOBY.map((x, i) => {
            const p = kl(t, t0 + i * 0.5, t0 + i * 0.5 + 0.4);
            return (
              <div key={x.l} style={{ display: "grid", gridTemplateColumns: "1fr 90px 1fr", alignItems: "center", gap: 10, opacity: p }}>
                <div style={{ background: K.card, border: `1.5px solid ${K.line}`, borderRadius: 18, padding: "16px 20px", ...tekst(22, 700) }}>{x.o}</div>
                <div style={{ height: 4, background: K.a, borderRadius: 4, width: `${100 * p}%` }} />
                <div style={{ background: K.tint, border: `2px solid ${K.a}`, borderRadius: 18, padding: "16px 20px", ...tekst(22, 800, K.ad), display: "flex", alignItems: "center", gap: 12 }}>
                  {x.l}
                  <Send size={24} color={K.a} style={{ marginLeft: "auto", transform: `translate(${wys * 14}px, ${-wys * 14}px)`, opacity: 0.4 + 0.6 * wys }} />
                </div>
              </div>
            );
          })}
        </div>
      </Tresc>
    </>
  );
};

export const LejkiFilm: React.FC<{ zAwatarem?: boolean; bezNapisow?: boolean }> = ({ zAwatarem, bezNapisow }) => (
  <AbsoluteFill style={{ background: K.bg }}>
    <Audio src={staticFile("film-lejki/lektor.mp3")} />
    <Scena id="s1"><S1 /></Scena>
    <Scena id="s2"><S2 /></Scena>
    <Scena id="s3"><S3 /></Scena>
    <Scena id="s4"><S4 /></Scena>
    <Scena id="s5"><S5 /></Scena>
    <Scena id="s6"><S6 /></Scena>
    <Scena id="s7"><S7 /></Scena>
    <Scena id="s8"><S8 /></Scena>
    {bezNapisow ? null : <F.Napisy />}
    {zAwatarem ? <Awatar src={staticFile("film-lejki/awatar.mp4")} /> : null}
  </AbsoluteFill>
);
