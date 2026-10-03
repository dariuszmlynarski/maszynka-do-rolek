// Film 0 serii strefy partnera: „Co nowego na platformie” (zapowiedź, 16:9, głos Dariusza z nagrania 03.10.2026).
// Scenariusz: 4-CNW/Admin/Lejki/Filmy/Film 0 - Zapowiedź - scenariusz.md. Media (poza repo): public/film-zapowiedz/.
import React from "react";
import { AbsoluteFill, Audio, interpolate, staticFile } from "remotion";
import { Check, Copy, MessageCircle, ShoppingCart, Sparkles } from "lucide-react";
import { Awatar, K, Naglowek, OBSZAR, Tresc, tekst, useSpr, useT, zrobFilm, type Os } from "./fabryka";
import OS from "./os-zapowiedz.json";

const F = zrobFilm(OS as Os);
export const zapowiedzKlatki = F.klatki;
const { kiedy, start, Scena } = F;
const kl = (t: number, a: number, b: number) => interpolate(t, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const Przegladarka: React.FC<{ adres: string; children: React.ReactNode; styl?: React.CSSProperties }> = ({ adres, children, styl }) => (
  <div style={{ ...OBSZAR, top: 210, background: K.card, borderRadius: 22, border: `1.5px solid ${K.line}`, boxShadow: "0 18px 44px rgba(14,36,18,.12)", overflow: "hidden", ...styl }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", background: K.tint }}>
      {["#E5534B", "#E0A21A", "#3FAE5A"].map((c) => <span key={c} style={{ width: 12, height: 12, borderRadius: 99, background: c }} />)}
      <span style={{ marginLeft: 14, background: K.card, borderRadius: 99, padding: "4px 16px", ...tekst(15, 600, K.mut) }}>{adres}</span>
    </div>
    <div style={{ padding: 26 }}>{children}</div>
  </div>
);
const Linia: React.FC<{ w: number }> = ({ w }) => <div style={{ height: 12, borderRadius: 9, background: K.line, width: `${w}%`, marginTop: 12 }} />;

const S1: React.FC = () => {
  const t = useT();
  const p = useSpr(0.6, 200);
  const m = kl(t, kiedy("s1", "metamorfozę") - 0.2, kiedy("s1", "metamorfozę") + 0.6);
  return (
    <Tresc>
      <div style={{ position: "absolute", left: 100, top: 230, opacity: p, transform: `translateY(${(1 - p) * 30}px)` }}>
        <div style={tekst(36, 800, K.a)}>Czas<span style={{ color: K.mut }}>Na</span>WellU</div>
        <div style={{ ...tekst(84, 800), marginTop: 10, letterSpacing: "-0.02em" }}>Co nowego<br />na platformie</div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 20 }}>
          <span style={{ ...tekst(22, 800, "#fff"), background: K.a, borderRadius: 99, padding: "6px 18px" }}>Październik 2026</span>
          <Sparkles size={44} color={K.a} style={{ opacity: m, transform: `scale(${0.5 + 0.5 * m}) rotate(${m * 20}deg)` }} />
        </div>
      </div>
    </Tresc>
  );
};

const S2: React.FC = () => {
  const t = useT();
  const puls = kl(t, kiedy("s2", "prosto") - 0.1, kiedy("s2", "prosto") + 0.5);
  return (
    <>
      <Naglowek eyebrow="Dla Twoich gości" tytul="Nowa strona główna" />
      <Tresc>
        <Przegladarka adres="czasnawellu.pl">
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 30, alignItems: "center" }}>
            <div>
              <div style={tekst(42, 800)}>Poznaj możliwości z WellU</div>
              <Linia w={90} /><Linia w={70} />
              <div style={{ display: "inline-block", marginTop: 22, background: K.a, borderRadius: 99, padding: "14px 30px", ...tekst(22, 800, "#fff"), transform: `scale(${1 + 0.08 * Math.sin(Math.PI * puls)})`, boxShadow: puls > 0 ? `0 0 0 ${8 * puls}px rgba(25,160,32,.18)` : "none" }}>Obejrzyj prezentację</div>
            </div>
            <div style={{ aspectRatio: "16/10", borderRadius: 18, background: "linear-gradient(135deg,#0e2412,#19a020)" }} />
          </div>
        </Przegladarka>
      </Tresc>
    </>
  );
};

const S3: React.FC = () => {
  const t = useT();
  const zap = kl(t, kiedy("s3", "zapis") - 0.1, kiedy("s3", "zapis") + 0.5);
  const prod = kl(t, kiedy("s3", "produkty") - 0.1, kiedy("s3", "produkty") + 0.5);
  const link = t >= kiedy("s3", "linkiem");
  const wej = kl(t, kiedy("s3", "stał"), kiedy("s3", "wejściem") + 0.4);
  return (
    <>
      <Naglowek eyebrow="Blog" tytul="Każdy wpis prowadzi do lejka" />
      <Tresc>
        <Przegladarka adres="czasnawellu.pl/blog/kolagen-kiedy-ma-sens">
          <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 24 }}>
            <div>
              <div style={tekst(28, 800)}>Kolagen: kiedy ma sens</div>
              <Linia w={95} /><Linia w={88} /><Linia w={92} /><Linia w={60} />
              <div style={{ marginTop: 18, opacity: zap, transform: `translateY(${(1 - zap) * 20}px)`, background: K.tint, border: `2px solid ${K.a}`, borderRadius: 16, padding: 16 }}>
                <div style={tekst(18, 800)}>Obejrzyj prezentację WellU</div>
                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <div style={{ flex: 1, height: 36, borderRadius: 10, background: K.card, border: `1.5px solid ${K.line}` }} />
                  <div style={{ background: K.a, borderRadius: 99, padding: "8px 18px", ...tekst(15, 800, "#fff") }}>Zapisz mnie</div>
                </div>
              </div>
            </div>
            <div style={{ opacity: prod, transform: `translateX(${(1 - prod) * 30}px)`, border: `1.5px solid ${K.line}`, borderRadius: 18, padding: 16, alignSelf: "start" }}>
              <div style={{ height: 120, borderRadius: 12, background: "linear-gradient(135deg,#e9f4e7,#c8e6c4)" }} />
              <div style={{ ...tekst(19, 800), marginTop: 10 }}>Kolagen WellU</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, background: K.a, borderRadius: 99, padding: "8px 14px", ...tekst(15, 800, "#fff") }}><ShoppingCart size={16} color="#fff" /> Zobacz w WellU</div>
              <div style={{ ...tekst(13, 700, link ? K.ad : K.mut), marginTop: 8 }}>{link ? "anna-k.wellu.eu · Twój sklep" : "wellu.eu"}</div>
            </div>
          </div>
        </Przegladarka>
        <div style={{ position: "absolute", left: 100, top: 660, opacity: wej, ...tekst(26, 800, K.a) }}>Blog → zapis → Twoje kontakty</div>
      </Tresc>
    </>
  );
};

const S4: React.FC = () => {
  const t = useT();
  const p = kl(t, start("s4"), start("s4") + 0.5);
  const kr = kl(t, kiedy("s4", "krok"), kiedy("s4", "krok") + 1.2);
  const lb = kl(t, kiedy("s4", "liczby") - 0.2, kiedy("s4", "liczby") + 0.6);
  return (
    <>
      <Naglowek eyebrow="Po zalogowaniu" tytul="Nowy dashboard" />
      <Tresc>
        <div style={{ ...OBSZAR, top: 220, opacity: p }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
            {["Sklep WellU", "Twój główny link", "Lejki", "Edukacja"].map((n, i) => {
              const done = kr * 4 > i + 0.5;
              return (
                <div key={n} style={{ background: K.card, border: `2px solid ${done ? K.a : K.line}`, borderRadius: 16, padding: 14, display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 99, background: done ? K.a : "#EEF1EE", display: "flex", alignItems: "center", justifyContent: "center" }}>{done ? <Check size={20} color="#fff" strokeWidth={3} /> : <span style={tekst(16, 800, K.mut)}>{i + 1}</span>}</div>
                  <span style={tekst(18, 800)}>{n}</span>
                </div>
              );
            })}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 14, marginTop: 18 }}>
            {[["Wszystkie", 37], ["Nowe", 4], ["W toku", 12], ["Bez ruchu", 5], ["Na TAK", 6]].map(([l, v], i) => (
              <div key={l as string} style={{ background: i === 3 ? K.warnT : K.card, border: `2px solid ${i === 3 ? K.warn : K.line}`, borderRadius: 16, padding: 16 }}>
                <div style={tekst(16, 700, K.mut)}>{l}</div>
                <div style={{ ...tekst(52, 800, i === 3 ? K.warn : K.ink) }}>{Math.round((v as number) * lb)}</div>
              </div>
            ))}
          </div>
        </div>
      </Tresc>
    </>
  );
};

const S5: React.FC = () => {
  const t = useT();
  const zak = [["linki", "Strony lądowania"], ["grafiki", "Grafiki i kreacje"], ["wiadomości", "Gotowe wiadomości"]];
  const k = kl(t, kiedy("s5", "kontakty") - 0.2, kiedy("s5", "kontakty") + 0.6);
  return (
    <>
      <Naglowek eyebrow="Lejki, kontakty, zadania" tytul="Wszystko pod ręką" />
      <Tresc>
        <div style={{ ...OBSZAR, top: 220, opacity: 1 - 0.7 * k, background: K.card, border: `3px solid ${K.a}`, borderRadius: 24, padding: "22px 28px" }}>
          <div style={{ ...tekst(15, 800, K.a), letterSpacing: "0.14em" }}>LEJEK</div>
          <div style={tekst(30, 800)}>Quiz: Klienci – Longevity</div>
          <div style={{ display: "flex", gap: 12, marginTop: 18 }}>
            {zak.map(([w, n]) => {
              const p = kl(t, kiedy("s5", w) - 0.1, kiedy("s5", w) + 0.4);
              return <span key={n} style={{ ...tekst(18, 800, p > 0.5 ? "#fff" : K.mut), background: p > 0.5 ? K.a : K.tint, borderRadius: 99, padding: "10px 18px", transform: `scale(${0.9 + 0.1 * p})` }}>{n}</span>;
            })}
          </div>
        </div>
        <div style={{ position: "absolute", left: 100, top: 470, display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20, width: 1070, opacity: k, transform: `translateY(${(1 - k) * 30}px)` }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
            {["Nowy kontakt", "Zaproszenie", "FollowUp", "TAK"].map((c, i) => (
              <div key={c} style={{ background: K.tint, borderRadius: 12, padding: 8, height: 150 }}>
                <div style={tekst(13, 800)}>{c}</div>
                {i < 3 && <div style={{ marginTop: 8, height: 40, borderRadius: 8, background: K.card, border: `1.5px solid ${K.line}` }} />}
              </div>
            ))}
          </div>
          <div style={{ background: K.card, border: `1.5px solid ${K.line}`, borderRadius: 14, padding: 14 }}>
            <div style={tekst(16, 800)}>Twoje zadania</div>
            {[0, 1, 2].map((i) => <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 10 }}><div style={{ width: 18, height: 18, borderRadius: 5, border: `2px solid ${K.a}`, background: i === 0 ? K.a : K.card }} /><div style={{ height: 10, flex: 1, borderRadius: 9, background: K.line }} /></div>)}
          </div>
        </div>
      </Tresc>
    </>
  );
};

const FILMY = [["1", "Twój dashboard", "1:26"], ["2", "Czym jest lejek", "1:14"], ["3", "Jak korzystać z lejków", "1:26"], ["4", "Lejek od środka", "2:23"], ["5", "Kontakty", "1:14"], ["6", "Zadania", "0:35"]];
const S6: React.FC = () => {
  const t = useT();
  const t0 = start("s6");
  const d = kl(t, kiedy("s6", "dziesięć") - 0.2, kiedy("s6", "dziesięć") + 0.5);
  return (
    <>
      <Naglowek eyebrow="Seria instruktaży" tytul="Krótki film przy każdym narzędziu" />
      <Tresc>
        <div style={{ ...OBSZAR, top: 220, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
          {FILMY.map(([n, ti, c], i) => {
            const p = kl(t, t0 + 0.3 + i * 0.35, t0 + 0.6 + i * 0.35);
            return (
              <div key={n} style={{ opacity: p, transform: `scale(${0.9 + 0.1 * p})`, background: K.card, border: `1.5px solid ${K.line}`, borderRadius: 18, overflow: "hidden" }}>
                <div style={{ height: 110, background: "linear-gradient(135deg,#e9f4e7,#bfe3bb)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 54, height: 54, borderRadius: 99, background: "rgba(255,255,255,.9)", display: "flex", alignItems: "center", justifyContent: "center", ...tekst(22, 800, K.a) }}>▶</div>
                </div>
                <div style={{ padding: "12px 14px", display: "flex", justifyContent: "space-between" }}><span style={tekst(18, 800)}>{n}. {ti}</span><span style={tekst(15, 700, K.mut)}>{c}</span></div>
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 100, top: 640, opacity: d, ...tekst(30, 800, K.a) }}>Razem niecałe 10 minut</div>
      </Tresc>
    </>
  );
};

const S7: React.FC = () => {
  const t = useT();
  const klik = t >= kiedy("s7", "wyślij") + 0.4;
  const daj = kl(t, kiedy("s7", "daj") - 0.1, kiedy("s7", "daj") + 0.5);
  const pam = kl(t, kiedy("s7", "pamiętaj") - 0.1, kiedy("s7", "pamiętaj") + 0.6);
  return (
    <>
      <Naglowek eyebrow="Twój ruch" tytul="Testuj i daj znać" />
      <Tresc>
        <div style={{ ...OBSZAR, top: 240, display: "flex", flexDirection: "column", gap: 26 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ background: K.tint, borderRadius: 14, padding: "14px 20px", ...tekst(22, 700) }}>czasnawellu.pl/longevity/?ref=Twoj-kod</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: klik ? K.ad : K.a, borderRadius: 99, padding: "14px 26px", ...tekst(22, 800, "#fff") }}>{klik ? <Check size={22} color="#fff" strokeWidth={3} /> : <Copy size={20} color="#fff" />}{klik ? "Skopiowane" : "Kopiuj link"}</div>
          </div>
          <div style={{ opacity: daj, transform: `translateY(${(1 - daj) * 20}px)`, display: "inline-flex", alignSelf: "flex-start", alignItems: "center", gap: 14, background: K.card, border: `2px solid ${K.a}`, borderRadius: "22px 22px 22px 6px", padding: "16px 24px", ...tekst(26, 800) }}>
            <MessageCircle size={30} color={K.a} /> Co działa? Co poprawić?
          </div>
          <div style={{ opacity: pam, ...tekst(44, 800, K.a) }}>Tworzymy ją razem.</div>
        </div>
      </Tresc>
    </>
  );
};

export const ZapowiedzFilm: React.FC<{ zAwatarem?: boolean; bezNapisow?: boolean }> = ({ zAwatarem, bezNapisow }) => (
  <AbsoluteFill style={{ background: K.bg }}>
    <Audio src={staticFile("film-zapowiedz/lektor.mp3")} />
    <Scena id="s1"><S1 /></Scena>
    <Scena id="s2"><S2 /></Scena>
    <Scena id="s3"><S3 /></Scena>
    <Scena id="s4"><S4 /></Scena>
    <Scena id="s5"><S5 /></Scena>
    <Scena id="s6"><S6 /></Scena>
    <Scena id="s7"><S7 /></Scena>
    {bezNapisow ? null : <F.Napisy />}
    {zAwatarem ? <Awatar src={staticFile("film-zapowiedz/awatar.mp4")} /> : null}
  </AbsoluteFill>
);
