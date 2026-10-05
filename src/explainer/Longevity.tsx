// Film 4 serii strefy partnera: „Lejek od środka: quiz Longevity” (16:9, głos Dariusza z nagrania 03.10.2026).
// Scenariusz: 4-CNW/Admin/czasnawellu.pl/Strefa partnera/Filmy/Film 4 - Quiz Longevity od środka - scenariusz.md. Media (poza repo): public/film-longevity/.
// Kadr w dwóch kolumnach przez cały film: po lewej telefon gościa (Ania), po prawej „u Ciebie” (tablica, maile, SMS).
import React from "react";
import { AbsoluteFill, Audio, interpolate, staticFile } from "remotion";
import { Bell, Check, Lock, Mail, MessageCircle, Phone, Pin, ShoppingCart, Smile } from "lucide-react";
import { Awatar, K, Naglowek, Tresc, tekst, useT, zrobFilm, type Os } from "./fabryka";
import OS from "./os-longevity.json";

const F = zrobFilm(OS as Os);
export const longevityKlatki = F.klatki;
const { kiedy, start, Scena } = F;
const kl = (t: number, a: number, b: number) => interpolate(t, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const miedzy = (t: number, a: number, b: number) => t >= a && t < b;

const NAGLOWKI: Record<string, [string, string]> = {
  s1: ["Lejek od środka", "Quiz Longevity krok po kroku"],
  s2: ["Krok 1", "Zaproszenie i link z Twoim kodem"],
  s3: ["Krok 2", "Siedem pytań, około minuty"],
  s4: ["Krok 3", "Imię, e-mail i zgoda"],
  s5: ["Krok 4", "Wynik u Ani, kontakt u Ciebie"],
  s6: ["Twój sklep", "Zakup trafia do Ciebie"],
  s7: ["Za zgodą", "Osobista analiza"],
  s8: ["Prośba o kontakt", "Mail, SMS i przypięta notatka"],
  s9: ["Seria maili", "Dzień 1, 4, 8 i 14"],
  s10: ["Zgody", "Tylko to, na co się zgodziła"],
  s11: ["Twoja rola", "Rozmowa w tempie Ani"],
  s12: ["Podsumowanie", "Quiz robi pierwszą rozmowę"],
};

// ------------------------------------------------------------------ telefon gościa (lewa kolumna)
const Ekran: React.FC = () => {
  const t = useT();
  const s = (id: string) => start(id);
  // --- s2: wiadomość i start quizu
  if (t < s("s3") - 0.3) {
    const msg = kl(t, kiedy("s2", "zaproszenie"), kiedy("s2", "zaproszenie") + 0.4);
    const quiz = t >= kiedy("s2", "trafia");
    if (quiz) {
      return (
        <div style={{ padding: 24 }}>
          <div style={{ ...tekst(14, 800, K.a), letterSpacing: "0.14em" }}>QUIZ LONGEVITY</div>
          <div style={{ ...tekst(30, 800), marginTop: 10 }}>Jaki jest Twój profil Longevity?</div>
          <div style={{ ...tekst(16, 500, K.mut), marginTop: 10 }}>7 pytań, około minuty.</div>
          <div style={{ marginTop: 26, background: K.a, borderRadius: 99, padding: "14px 0", textAlign: "center", ...tekst(18, 800, "#fff") }}>Zaczynam</div>
        </div>
      );
    }
    return (
      <div style={{ padding: 20, opacity: msg }}>
        <div style={{ ...tekst(13, 700, K.mut) }}>Messenger · Anna K.</div>
        <div style={{ marginTop: 14, background: K.tint, borderRadius: "18px 18px 18px 4px", padding: 14, ...tekst(16, 500), lineHeight: 1.4 }}>
          Hej! Mam quiz na minutę: jaki jest Twój profil Longevity. Ciekawe, co wyjdzie Tobie:<br />
          <span style={{ color: K.ad, fontWeight: 800 }}>czasnawellu.pl/longevity/?ref=anna</span>
        </div>
      </div>
    );
  }
  // --- s3: pytania
  if (t < s("s4") - 0.3) {
    const PYT = [["ruch", "Ile ruchu masz w tygodniu?"], ["tempo", "Jakie jest tempo Twojego dnia?"], ["poranki", "Jak wyglądają Twoje poranki?"], ["uwiera", "Co Cię na co dzień uwiera?"]];
    let i = 0;
    PYT.forEach((p, j) => { if (t >= kiedy("s3", p[0]) - 0.2) i = j; });
    return (
      <div style={{ padding: 24 }}>
        <div style={{ height: 8, borderRadius: 99, background: K.line }}><div style={{ height: "100%", borderRadius: 99, background: K.a, width: `${((i + 1) / 7) * 100 + kl(t, kiedy("s3", "zajmuje"), kiedy("s3", "zajmuje") + 1) * (100 - ((i + 1) / 7) * 100)}%` }} /></div>
        <div style={{ ...tekst(14, 700, K.mut), marginTop: 10 }}>Pytanie {i + 1} z 7</div>
        <div style={{ ...tekst(26, 800), marginTop: 12, minHeight: 70 }}>{PYT[i][1]}</div>
        {["Prawie wcale", "Trochę", "Sporo", "Codziennie"].map((o, j) => (
          <div key={o} style={{ marginTop: 10, border: `2px solid ${j === 2 ? K.a : K.line}`, background: j === 2 ? K.tint : K.card, borderRadius: 14, padding: "12px 14px", ...tekst(16, 600) }}>{o}</div>
        ))}
      </div>
    );
  }
  // --- s4: formularz
  if (t < s("s5") - 0.3) {
    const zg = t >= kiedy("s4", "zgodę") + 0.3;
    const pola = [["Imię", "Ania", "imię"], ["E-mail", "ania@poczta.pl", "adres"], ["Telefon (opcjonalnie)", "", "telefon"]];
    return (
      <div style={{ padding: 22 }}>
        <div style={tekst(22, 800)}>Gdzie wysłać Twój wynik?</div>
        {pola.map(([l, v, w]) => (
          <div key={l} style={{ marginTop: 12 }}>
            <div style={tekst(13, 700, K.mut)}>{l}</div>
            <div style={{ marginTop: 4, height: 42, borderRadius: 12, border: `2px solid ${t >= kiedy("s4", w) ? K.a : K.line}`, padding: "0 12px", display: "flex", alignItems: "center", ...tekst(16, 600) }}>{t >= kiedy("s4", w) ? v : ""}</div>
          </div>
        ))}
        <div style={{ marginTop: 14, display: "flex", gap: 10, alignItems: "flex-start", background: K.tint, borderRadius: 14, padding: 12 }}>
          <div style={{ width: 24, height: 24, borderRadius: 6, border: `2px solid ${K.a}`, background: zg ? K.a : K.card, display: "flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto" }}>{zg && <Check size={16} color="#fff" strokeWidth={3} />}</div>
          <div style={tekst(14, 700)}>Gratis: osobista analiza Twoich odpowiedzi</div>
        </div>
      </div>
    );
  }
  // --- s5–s6: wynik i sklep
  if (t < s("s7") - 0.3) {
    if (t >= kiedy("s6", "sklepu") - 0.2) {
      return (
        <div style={{ padding: 24, textAlign: "center" }}>
          <div style={{ ...tekst(14, 700, K.mut) }}>anna-k.wellu.eu</div>
          <ShoppingCart size={90} color={K.ad} style={{ marginTop: 40 }} />
          <div style={{ ...tekst(24, 800), marginTop: 20 }}>Sklep Twojego opiekuna</div>
          <div style={{ marginTop: 24, background: K.a, borderRadius: 99, padding: "14px 0", ...tekst(18, 800, "#fff") }}>Do koszyka</div>
        </div>
      );
    }
    const ind = Math.round(78 * kl(t, kiedy("s5", "indeks") - 0.2, kiedy("s5", "indeks") + 1));
    const plan = kl(t, kiedy("s5", "plan"), kiedy("s5", "plan") + 0.6);
    return (
      <div style={{ padding: 22 }}>
        <div style={{ ...tekst(13, 800, K.a), letterSpacing: "0.14em" }}>TWÓJ PROFIL</div>
        <div style={{ ...tekst(28, 800), marginTop: 4 }}>Spokojny Strateg</div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 14 }}>
          <div style={{ width: 84, height: 84, borderRadius: 99, border: `8px solid ${K.a}`, display: "flex", alignItems: "center", justifyContent: "center", ...tekst(28, 800, K.ad) }}>{ind}</div>
          <div style={tekst(15, 600, K.mut)}>Indeks Longevity<br />na 100</div>
        </div>
        <div style={{ marginTop: 16, opacity: plan }}>
          {[["Najważniejszy", 1], ["Krok 1", 3], ["Pełny pakiet", 5]].map(([l, n]) => (
            <div key={l as string} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: `1.5px solid ${K.line}`, ...tekst(16, 700) }}>
              <span>{l}</span><span style={{ color: K.mut }}>{n} prod.</span>
            </div>
          ))}
          <div style={{ marginTop: 10, background: K.a, borderRadius: 99, padding: "12px 0", textAlign: "center", ...tekst(16, 800, "#fff") }}>Zobacz w sklepie</div>
        </div>
      </div>
    );
  }
  // --- s7: analiza
  if (t < s("s8") - 0.3) {
    const nawyki = kl(t, kiedy("s7", "nawyki") - 0.2, kiedy("s7", "nawyki") + 0.5);
    return (
      <div style={{ padding: 22 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, ...tekst(14, 700, K.mut) }}><Mail size={18} color={K.mut} /> Skrzynka · teraz</div>
        <div style={{ ...tekst(22, 800), marginTop: 12 }}>Ania, Twoja osobista analiza</div>
        <div style={{ ...tekst(15, 500, K.mut), marginTop: 8, lineHeight: 1.4 }}>Co widać w Twoich odpowiedziach i od czego zacząć.</div>
        <div style={{ marginTop: 14, opacity: nawyki }}>
          {["Spacer 10 minut po obiedzie", "Kawa dopiero po śniadaniu", "Ekran off 30 minut przed snem"].map((n, i) => (
            <div key={n} style={{ display: "flex", gap: 10, padding: "10px 0", borderTop: `1.5px solid ${K.line}`, ...tekst(15, 700) }}><span style={{ color: K.a }}>{i + 1}.</span>{n}</div>
          ))}
        </div>
      </div>
    );
  }
  // --- s8: prośba o kontakt
  if (t < s("s9") - 0.3) {
    const klik = t >= kiedy("s8", "kliknie") + 0.4;
    return (
      <div style={{ padding: 24 }}>
        <div style={tekst(22, 800)}>Chcesz porozmawiać o swoim planie?</div>
        <div style={{ marginTop: 12, height: 42, borderRadius: 12, border: `2px solid ${K.a}`, padding: "0 12px", display: "flex", alignItems: "center", ...tekst(16, 600) }}>600 123 456</div>
        <div style={{ marginTop: 14, background: klik ? K.ad : K.a, borderRadius: 99, padding: "14px 0", textAlign: "center", ...tekst(17, 800, "#fff"), transform: `scale(${klik ? 0.97 : 1})` }}>{klik ? "Wysłane ✓" : "Proszę o kontakt opiekuna"}</div>
      </div>
    );
  }
  // --- s9: seria maili
  if (t < s("s10") - 0.3) {
    const M = [["pierwszego", "Dzień 1", "Twój plan: od czego zacząć"], ["czwartego", "Dzień 4", "Trzy drobiazgi dla Twojego profilu"], ["ósmego", "Dzień 8", "Kto stoi za tymi produktami"], ["czternastego", "Dzień 14", "Sprawdź, czy Twój indeks wzrósł"]];
    const wiz = kl(t, kiedy("s9", "wizytówka") - 0.3, kiedy("s9", "wizytówka") + 0.3);
    return (
      <div style={{ padding: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, ...tekst(14, 700, K.mut) }}><Mail size={18} color={K.mut} /> Skrzynka</div>
        {M.map(([w, d, tt]) => {
          const p = kl(t, kiedy("s9", w) - 0.2, kiedy("s9", w) + 0.3);
          return (
            <div key={d} style={{ marginTop: 10, opacity: p, transform: `translateY(${(1 - p) * -14}px)`, border: `1.5px solid ${K.line}`, borderRadius: 14, padding: "10px 12px" }}>
              <div style={tekst(12, 800, K.a)}>{d.toUpperCase()}</div>
              <div style={tekst(15, 700)}>{tt}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6, opacity: wiz }}>
                <div style={{ width: 22, height: 22, borderRadius: 99, background: K.a }} /><span style={tekst(12, 700, K.mut)}>Anna K. · 600 …</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
  // --- s10: zgody
  if (t < s("s11") - 0.3) {
    const bez = t >= kiedy("s10", "bez");
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        <Lock size={80} color={K.ad} style={{ marginTop: 30 }} />
        <div style={{ ...tekst(22, 800), marginTop: 18 }}>Tylko to, na co się zgodziła</div>
        <div style={{ marginTop: 18, textAlign: "left", opacity: bez ? 1 : 0.3 }}>
          {[["Mail z wynikiem", true], ["Osobista analiza", false], ["Seria maili", false]].map(([l, ok]) => (
            <div key={l as string} style={{ display: "flex", gap: 10, padding: "10px 0", borderTop: `1.5px solid ${K.line}`, ...tekst(16, 700, ok ? K.ink : K.mut) }}>{ok ? "✓" : "–"} {l}{!ok && " (bez zgody)"}</div>
          ))}
        </div>
      </div>
    );
  }
  // --- s11–s12: rozmowa
  const odp = kl(t, kiedy("s11", "odpowiadasz") - 0.4, kiedy("s11", "odpowiadasz") + 0.2);
  return (
    <div style={{ padding: 20 }}>
      <div style={{ ...tekst(13, 700, K.mut) }}>Mail · Odpowiedź</div>
      <div style={{ marginTop: 14, background: K.tint, borderRadius: "18px 18px 18px 4px", padding: 14, ...tekst(16, 500), lineHeight: 1.4 }}>Dzień dobry, chętnie dopytam o ten plan. Kiedy możemy porozmawiać?</div>
      <div style={{ marginTop: 12, marginLeft: 40, opacity: odp, background: K.a, borderRadius: "18px 18px 4px 18px", padding: 14, ...tekst(16, 600, "#fff"), lineHeight: 1.4 }}>Jutro o 18:00? Zadzwonię.</div>
      {t >= start("s12") && <div style={{ textAlign: "center", marginTop: 26 }}><Smile size={70} color={K.a} /></div>}
    </div>
  );
};

const Telefon: React.FC = () => (
  <div style={{ position: "absolute", left: 100, top: 205, width: 330, height: 545, borderRadius: 40, background: K.ink, padding: 12, boxShadow: "0 24px 60px rgba(14,36,18,.22)" }}>
    <div style={{ width: "100%", height: "100%", borderRadius: 30, background: K.card, overflow: "hidden" }}>
      <div style={{ height: 30, display: "flex", justifyContent: "center", alignItems: "center" }}><div style={{ width: 90, height: 8, borderRadius: 9, background: K.line }} /></div>
      <Ekran />
    </div>
  </div>
);

// ------------------------------------------------------------------ u Ciebie (prawa kolumna)
const KOL = ["Nowy kontakt", "Zaproszenie", "FollowUp", "TAK - klient"];
const UCiebie: React.FC = () => {
  const t = useT();
  const lad = kl(t, kiedy("s5", "ląduje") - 0.2, kiedy("s5", "ląduje") + 0.6);
  // kolumna karty Ani w s11: przesuwanie po słowach
  let kol = 0;
  if (t >= kiedy("s11", "kartę")) kol = 1;
  if (t >= kiedy("s11", "kartę") + 1.2) kol = 2;
  if (t >= kiedy("s11", "etapie")) kol = 3;
  const W = 145;
  const pin = t >= kiedy("s8", "przypięta");
  const notatka = t >= kiedy("s7", "kopię");
  const mailNowy = miedzy(t, kiedy("s5", "maila"), start("s6") - 0.3);
  const sms = miedzy(t, kiedy("s8", "sms-a") - 0.2, start("s9") - 0.3);
  const mailKontakt = miedzy(t, kiedy("s8", "maila") - 0.2, start("s9") - 0.3);
  const sklep = miedzy(t, kiedy("s6", "zakup") - 0.3, start("s7") - 0.3);
  const ref = miedzy(t, kiedy("s2", "kodem") - 0.2, start("s3") - 0.3);
  const kroki = t >= kiedy("s11", "etapie") - 0.3;
  const glow = t >= start("s12");
  return (
    <div style={{ position: "absolute", left: 480, top: 205, width: 640 }}>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(4, ${W}px)`, gap: 10 }}>
        {KOL.map((k, i) => (
          <div key={k} style={{ background: i === 3 ? "#E3F3E1" : K.tint, borderRadius: 16, padding: 10, height: 300 }}>
            <div style={tekst(14, 800)}>{k}</div>
          </div>
        ))}
      </div>
      {lad > 0 && (
        <div style={{ position: "absolute", top: 40, left: 10 + kol * (W + 10), width: W - 20, transition: "none", transform: `translate(${(1 - lad) * 300}px, ${(1 - lad) * -120}px)`, opacity: lad, background: K.card, border: `2.5px solid ${glow ? K.a : K.line}`, boxShadow: glow ? "0 0 0 6px rgba(25,160,32,.18)" : "0 6px 16px rgba(14,36,18,.08)", borderRadius: 14, padding: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}><span style={tekst(16, 800)}>Anna K.</span>{pin && <Pin size={16} color={K.warn} />}</div>
          <div style={tekst(12, 600, K.mut)}>Quiz Longevity</div>
          <div style={tekst(12, 700, K.ad)}>Spokojny Strateg</div>
          {notatka && <div style={{ marginTop: 6, ...tekst(11, 700, K.mut), background: K.tint, borderRadius: 8, padding: "3px 6px" }}>📝 Analiza AI</div>}
          {pin && <div style={{ marginTop: 4, ...tekst(11, 800, K.warn), background: K.warnT, borderRadius: 8, padding: "3px 6px" }}>📞 Prosi o kontakt</div>}
        </div>
      )}
      <div style={{ position: "absolute", left: 0, top: 316, width: 620, display: "flex", flexDirection: "column", gap: 10 }}>
        {ref && <Powiadomienie ikona={<MessageCircle size={22} color={K.ad} />} tekst1="Link z Twoim kodem" tekst2="?ref=anna · opiekun: Ty" />}
        {mailNowy && <Powiadomienie ikona={<Mail size={22} color={K.ad} />} tekst1="Masz nowy kontakt: Anna K." tekst2="Wynik i odpowiedzi z quizu" />}
        {sklep && <Powiadomienie ikona={<ShoppingCart size={22} color={K.ad} />} tekst1="Zakup w Twoim sklepie" tekst2="anna-k.wellu.eu" />}
        {mailKontakt && <Powiadomienie ikona={<Mail size={22} color={K.warn} />} tekst1="📞 Anna K. prosi o kontakt" tekst2="Zadzwoń, najlepiej dziś" alert />}
        {sms && <Powiadomienie ikona={<Bell size={22} color={K.warn} />} tekst1="SMS: Anna K. prosi o kontakt" tekst2="600 123 456" alert />}
        {kroki && <Powiadomienie ikona={<Check size={22} color={K.ad} />} tekst1="Kolejne kroki na tym etapie" tekst2="✓ Podziękuj za rozmowę · ✓ Wyślij link do sklepu" />}
        {miedzy(t, kiedy("s11", "dzwonisz") - 0.2, kiedy("s11", "kartę") - 0.2) && <Powiadomienie ikona={<Phone size={22} color={K.ad} />} tekst1="Telefon, gdy Ania prosi" tekst2="Odpowiedź, gdy odezwie się sama" />}
      </div>
    </div>
  );
};
const Powiadomienie: React.FC<{ ikona: React.ReactNode; tekst1: string; tekst2: string; alert?: boolean }> = ({ ikona, tekst1, tekst2, alert }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 14, background: alert ? K.warnT : K.card, border: `2px solid ${alert ? K.warn : K.line}`, borderRadius: 16, padding: "10px 16px" }}>
    {ikona}
    <div><div style={tekst(17, 800)}>{tekst1}</div><div style={tekst(14, 600, K.mut)}>{tekst2}</div></div>
  </div>
);

const Etykiety: React.FC = () => (
  <>
    <div style={{ position: "absolute", left: 100, top: 176, width: 330, textAlign: "center", ...tekst(16, 800, K.mut), letterSpacing: "0.12em" }}>CO WIDZI TWÓJ GOŚĆ</div>
    <div style={{ position: "absolute", left: 480, top: 176, width: 620, textAlign: "center", ...tekst(16, 800, K.mut), letterSpacing: "0.12em" }}>CO DZIEJE SIĘ U CIEBIE</div>
  </>
);

export const LongevityFilm: React.FC<{ zAwatarem?: boolean; bezNapisow?: boolean }> = ({ zAwatarem, bezNapisow }) => (
  <AbsoluteFill style={{ background: K.bg }}>
    <Audio src={staticFile("film-longevity/lektor.mp3")} />
    {Object.entries(NAGLOWKI).map(([id, [e, ti]]) => (
      <Scena key={id} id={id}><Naglowek eyebrow={e} tytul={ti} /></Scena>
    ))}
    <Tresc>
      <Etykiety />
      <Telefon />
      <UCiebie />
    </Tresc>
    {bezNapisow ? null : <F.Napisy />}
    {zAwatarem ? <Awatar src={staticFile("film-longevity/awatar.mp4")} /> : null}
  </AbsoluteFill>
);
