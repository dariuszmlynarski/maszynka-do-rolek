// Film 7 serii strefy partnera: „Wyniki” (16:9, głos Dariusza z nagrania 04.10.2026).
// Scenariusz: 4-CNW/Admin/czasnawellu.pl/Strefa partnera/Filmy/Film 7 - Wyniki - scenariusz.md. Media (poza repo): public/film-wyniki/.
// Liczby fikcyjne, spójne między scenami (kafle = suma kanałów = suma wierszy wykresu i tabeli).
import React from "react";
import { AbsoluteFill, Audio, interpolate, staticFile } from "remotion";
import { ChartBar, Check, Funnel, GraduationCap, House, Lock, MousePointer2, Rocket, SquareCheck, Users } from "lucide-react";
import { Awatar, K, Naglowek, OBSZAR, Tresc, tekst, useT, zrobFilm, type Os } from "./fabryka";
import OS from "./os-wyniki.json";

const F = zrobFilm(OS as Os);
export const wynikiKlatki = F.klatki;
const { kiedy, Scena } = F;
const kl = (t: number, a: number, b: number) => interpolate(t, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

// ------------------------------------------------------------------ dane
const ETAPY = [
  { n: "Nowy kontakt", c: "#95a5a6" },
  { n: "Zaproszony", c: "#3498db" },
  { n: "FollowUp", c: "#f39c12" },
  { n: "TAK - partner", c: "#27ae60" },
  { n: "TAK - klient", c: "#77bb41" },
  { n: "NIE", c: "#e74c3c" },
];
type Lejek = { n: string; kanal: "net" | "rek"; et: number[]; wejscia?: number };
const LEJKI: Lejek[] = [
  { n: "Zaproszenie do WellU", kanal: "net", et: [3, 2, 2, 2, 1, 4], wejscia: 42 },
  { n: "Quiz: Klienci – Longevity", kanal: "net", et: [2, 1, 1, 0, 2, 5], wejscia: 95 },
  { n: "Quiz: Klienci – dobór produktów", kanal: "net", et: [1, 0, 0, 0, 1, 3], wejscia: 140 },
  { n: "Dodane ręcznie", kanal: "rek", et: [2, 2, 3, 1, 1, 9] },
];
const suma = (a: number[]) => a.reduce((x, y) => x + y, 0);
const staty = (ls: Lejek[]) => {
  const all = ls.reduce((acc, l) => acc.map((v, i) => v + l.et[i]), [0, 0, 0, 0, 0, 0]);
  const tak = all[3] + all[4];
  const nie = all[5];
  return { lacznie: suma(all), proces: all[0] + all[1] + all[2], tak, nie, win: Math.round((100 * tak) / Math.max(1, tak + nie)) };
};
const NET = staty(LEJKI.filter((l) => l.kanal === "net"));
const REK = staty(LEJKI.filter((l) => l.kanal === "rek"));
const ALL = staty(LEJKI);

const NIEB = { bg: "#EAF3FC", br: "#3498db", ink: "#1F6FB2" };
const POM = { bg: "#FFF3E4", br: "#E67E22", ink: "#B35D10" };

// ------------------------------------------------------------------ klocki
const Kursor: React.FC<{ x: number; y: number; klik?: number }> = ({ x, y, klik = 0 }) => (
  <div style={{ position: "absolute", left: x, top: y, zIndex: 20 }}>
    {klik > 0 && klik < 1 && <div style={{ position: "absolute", left: -18, top: -18, width: 36, height: 36, borderRadius: 99, border: `3px solid ${K.a}`, opacity: 1 - klik, transform: `scale(${0.5 + klik})` }} />}
    <MousePointer2 size={34} color={K.ink} fill="#fff" strokeWidth={2} style={{ transform: `scale(${1 - 0.12 * Math.sin(Math.PI * klik)})` }} />
  </div>
);

const KAFLE = [
  { l: "Łącznie", v: ALL.lacznie, s: "kontaktów", sl: "kontaktów" },
  { l: "W procesie", v: ALL.proces, s: "rozmowy trwają", sl: "rozmów" },
  { l: "Decyzje TAK", v: ALL.tak, s: "partnerzy i klienci", sl: "tak", c: "#27ae60" },
  { l: "Decyzje NIE", v: ALL.nie, s: "zamknięte", sl: "nie", c: "#e74c3c" },
  { l: "Win rate", v: ALL.win, s: "TAK wśród decyzji", sl: "", proc: true },
];
const Kafle: React.FC<{ top?: number; wejscie?: (i: number) => number; swiec?: (i: number) => number; maly?: boolean }> = ({ top = 230, wejscie = () => 1, swiec = () => 0, maly }) => (
  <div style={{ ...OBSZAR, top, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14 }}>
    {KAFLE.map((k, i) => {
      const p = wejscie(i);
      const sw = swiec(i);
      return (
        <div key={k.l} style={{ background: K.card, borderRadius: 18, padding: maly ? "10px 14px" : "16px 18px", border: `${sw > 0.5 ? 3 : 1.5}px solid ${sw > 0.5 ? K.a : K.line}`, opacity: 0.25 + 0.75 * p, transform: `translateY(${-6 * sw}px)`, boxShadow: sw > 0.5 ? "0 14px 30px rgba(25,160,32,.18)" : "none" }}>
          <div style={tekst(maly ? 14 : 17, 800, K.mut)}>{k.l}</div>
          <div style={{ ...tekst(maly ? 32 : 50, 800, k.c ?? K.ink), marginTop: 4 }}>{Math.round(k.v * p)}{k.proc ? "%" : ""}</div>
          {!maly && <div style={tekst(14, 600, K.mut)}>{k.s}</div>}
        </div>
      );
    })}
  </div>
);

const Kanal: React.FC<{ rodz: "net" | "rek"; p: number; puls?: number; wygrany?: number }> = ({ rodz, p, puls = 0, wygrany = 0 }) => {
  const net = rodz === "net";
  const k = net ? NIEB : POM;
  const s = net ? NET : REK;
  return (
    <div style={{ background: k.bg, border: `${wygrany > 0.5 ? 4 : 2}px solid ${k.br}`, borderRadius: 24, padding: "22px 26px", opacity: p, transform: `translateY(${(1 - p) * 30}px)`, boxShadow: wygrany > 0.5 ? `0 0 0 ${8 * wygrany}px rgba(52,152,219,.18)` : "none", position: "relative" }}>
      <div style={tekst(28, 800, k.ink)}>{net ? "🌐 Z internetu" : "✋ Dodane ręcznie"}</div>
      <div style={{ ...tekst(16, 600, K.mut), marginTop: 4 }}>{net ? "zapisali się sami: lejki, quizy, formularze" : "wpisane przez Ciebie w CRM"}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginTop: 14 }}>
        <span style={{ ...tekst(76, 800, k.ink), display: "inline-block", transform: `scale(${1 + 0.14 * puls})`, transformOrigin: "left bottom" }}>{s.win}%</span>
        <span style={tekst(18, 700, K.mut)}>skuteczności</span>
      </div>
      <div style={{ display: "flex", gap: 18, marginTop: 10 }}>
        {[[s.lacznie, "kontaktów"], [s.proces, "w toku"], [s.tak, "TAK"], [s.nie, "NIE"]].map(([v, l]) => (
          <div key={l as string}><span style={tekst(24, 800)}>{v}</span> <span style={tekst(15, 700, K.mut)}>{l}</span></div>
        ))}
      </div>
      {wygrany > 0 && (
        <div style={{ position: "absolute", right: 18, top: 18, opacity: wygrany, transform: `scale(${0.7 + 0.3 * wygrany})`, background: k.br, borderRadius: 99, padding: "6px 14px", ...tekst(16, 800, "#fff") }}>▲ daje więcej</div>
      )}
    </div>
  );
};
const Kanaly: React.FC<{ top?: number; net?: number; rek?: number; puls?: number; wygrany?: number }> = ({ top = 250, net = 1, rek = 1, puls = 0, wygrany = 0 }) => (
  <div style={{ ...OBSZAR, top, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
    <Kanal rodz="net" p={net} puls={puls} wygrany={wygrany} />
    <Kanal rodz="rek" p={rek} puls={puls} />
  </div>
);

const Legenda: React.FC<{ swiec?: number }> = ({ swiec = 0 }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
    {ETAPY.map((e, i) => {
      const sw = swiec > 0 ? Math.max(0, Math.sin(Math.PI * Math.min(1, Math.max(0, swiec * 6 - i)))) : 0;
      return (
        <span key={e.n} style={{ display: "inline-flex", alignItems: "center", gap: 6, ...tekst(14, 700, K.mut), transform: `translateY(${-5 * sw}px)` }}>
          <span style={{ width: 14, height: 14, borderRadius: 4, background: e.c, transform: `scale(${1 + 0.5 * sw})` }} />{e.n}
        </span>
      );
    })}
  </div>
);

const SZ = 30; // px na kontakt
const Pasek: React.FC<{ et: number[]; p: number; sz?: number; h?: number }> = ({ et, p, sz = SZ, h = 34 }) => {
  return (
    <div style={{ position: "relative", height: h, width: suma(et) * sz * p, overflow: "hidden", borderRadius: 8, display: "flex" }}>
      {et.map((v, i) => {
        if (!v) return null;
        return <div key={i} style={{ width: v * sz, flexShrink: 0, height: h, background: ETAPY[i].c, borderRight: "2px solid #fff", ...tekst(14, 800, "#fff"), display: "flex", alignItems: "center", justifyContent: "center" }}>{v}</div>;
      })}
    </div>
  );
};

const Wykres: React.FC<{ wzrost?: (i: number) => number; widac?: (l: Lejek) => number; legenda?: number; top?: number }> = ({ wzrost = () => 1, widac = () => 1, legenda = 0, top = 230 }) => (
  <div style={{ ...OBSZAR, top, background: K.card, border: `1.5px solid ${K.line}`, borderRadius: 24, padding: "20px 26px" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
      <div style={tekst(22, 800)}>Kontakty w lejkach według etapu</div>
    </div>
    <div style={{ marginTop: 10 }}><Legenda swiec={legenda} /></div>
    <div style={{ marginTop: 16 }}>
      {LEJKI.map((l, i) => {
        const w = widac(l);
        return (
          <div key={l.n} style={{ display: "grid", gridTemplateColumns: "300px 1fr", alignItems: "center", height: 54 * w, opacity: w, overflow: "hidden" }}>
            <div style={tekst(17, 700)}>{l.kanal === "net" ? "🌐 " : "✋ "}{l.n}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Pasek et={l.et} p={wzrost(i)} />
              <span style={{ ...tekst(16, 800, K.mut), opacity: wzrost(i) }}>{suma(l.et)}</span>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

const FILTRY = ["Wszystkie", "🌐 Z internetu", "✋ Ręcznie"];
const Przelacznik: React.FC<{ akt: number; top: number }> = ({ akt, top }) => (
  <div style={{ position: "absolute", left: 100, top, display: "inline-flex", gap: 6, background: K.card, border: `1.5px solid ${K.line}`, borderRadius: 99, padding: 6 }}>
    {FILTRY.map((f, i) => (
      <div key={f} style={{ width: 170, textAlign: "center", padding: "9px 0", borderRadius: 99, background: i === akt ? K.a : "transparent", ...tekst(18, 800, i === akt ? "#fff" : K.mut) }}>{f}</div>
    ))}
  </div>
);

const Zakladki: React.FC<{ akt: number; children: React.ReactNode }> = ({ akt, children }) => (
  <div style={{ ...OBSZAR, top: 225, background: K.card, border: `1.5px solid ${K.line}`, borderRadius: 24, padding: "18px 26px" }}>
    <div style={{ display: "flex", gap: 8, borderBottom: `1.5px solid ${K.line}` }}>
      {["Statystyki", "Postęp", "Ja vs grupa"].map((n, i) => (
        <div key={n} style={{ padding: "8px 18px", ...tekst(19, 800, i === akt ? K.a : K.mut), borderBottom: `3px solid ${i === akt ? K.a : "transparent"}` }}>{n}</div>
      ))}
    </div>
    <div style={{ marginTop: 18, height: 380, position: "relative" }}>{children}</div>
  </div>
);

// ------------------------------------------------------------------ s1
const MENU = [
  { n: "Start", I: House },
  { n: "Lejki", I: Funnel },
  { n: "Kontakty", I: Users },
  { n: "Zadania", I: SquareCheck },
  { n: "Wyniki", I: ChartBar },
  { n: "Edukacja", I: GraduationCap },
];
const S1: React.FC = () => {
  const t = useT();
  const tk = kiedy("s1", "wynikami");
  const ruch = kl(t, kiedy("s1", "tutaj") - 0.2, tk - 0.1);
  const klik = kl(t, tk, tk + 0.5);
  const wyniki = t >= tk + 0.1;
  const strona = kl(t, tk + 0.1, tk + 0.6);
  const yW = 230 + 70 + 4 * 58 + 14;
  const x = 640 + (175 - 640) * ruch;
  const y = 470 + (yW - 470) * ruch;
  return (
    <>
      <Naglowek eyebrow="Strefa partnera" tytul={wyniki ? "Wyniki: co daje Twoja praca" : "Kontakty są do pracy"} />
      <Tresc>
        <div style={{ position: "absolute", left: 100, top: 230, width: 250, background: K.card, border: `1.5px solid ${K.line}`, borderRadius: 22, padding: "16px 12px" }}>
          <div style={{ ...tekst(14, 800, K.a), letterSpacing: "0.14em", padding: "4px 12px 14px" }}>CZASNAWELLU</div>
          {MENU.map(({ n, I }) => {
            const akt = wyniki ? n === "Wyniki" : n === "Kontakty";
            return (
              <div key={n} style={{ display: "flex", alignItems: "center", gap: 12, height: 50, marginBottom: 8, padding: "0 14px", borderRadius: 14, background: akt ? K.tint : "transparent", ...tekst(19, 800, akt ? K.ad : K.mut) }}>
                <I size={22} color={akt ? K.a : K.mut} />{n}
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 380, top: 230, width: 790, height: 470, background: K.card, border: `1.5px solid ${K.line}`, borderRadius: 22, padding: "22px 26px", overflow: "hidden" }}>
          {!wyniki ? (
            <>
              <div style={tekst(28, 800)}>Kontakty</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8, marginTop: 18 }}>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div key={i} style={{ height: 340, background: K.tint, borderRadius: 12, padding: 8 }}>
                    {Array.from({ length: (i * 7) % 3 + 1 }).map((_, j) => <div key={j} style={{ height: 46, background: K.card, borderRadius: 8, marginBottom: 8 }} />)}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ opacity: strona, transform: `translateY(${(1 - strona) * 16}px)` }}>
              <div style={tekst(30, 800)}>Twoje wyniki</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, marginTop: 18 }}>
                {KAFLE.map((k) => (
                  <div key={k.l} style={{ background: K.tint, borderRadius: 14, padding: "10px 12px" }}>
                    <div style={tekst(13, 800, K.mut)}>{k.l}</div>
                    <div style={tekst(28, 800, k.c ?? K.ink)}>{k.v}{k.proc ? "%" : ""}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 14 }}>
                <div style={{ height: 110, borderRadius: 16, background: NIEB.bg, border: `2px solid ${NIEB.br}` }} />
                <div style={{ height: 110, borderRadius: 16, background: POM.bg, border: `2px solid ${POM.br}` }} />
              </div>
              <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
                {LEJKI.map((l) => <Pasek key={l.n} et={l.et} p={1} sz={20} h={18} />)}
              </div>
            </div>
          )}
        </div>
        {t < tk + 1.2 && <Kursor x={x} y={y} klik={klik} />}
      </Tresc>
    </>
  );
};

// ------------------------------------------------------------------ s2
const S2: React.FC = () => {
  const t = useT();
  const cue = (i: number) => (i < 4 ? kiedy("s2", KAFLE[i].sl) : kiedy("s2", "nie") + 0.9);
  const wej = (i: number) => kl(t, cue(i) - 0.15, cue(i) + 0.6);
  const sw = (i: number) => (t >= cue(i) - 0.15 && t < (i < 4 ? cue(i + 1) - 0.15 : cue(i) + 2) ? 1 : 0);
  return (
    <>
      <Naglowek eyebrow="Twoje wyniki" tytul="Na górze masz całość" />
      <Tresc>
        <Kafle top={240} wejscie={wej} swiec={sw} />
        <div style={{ opacity: 0.3 }}><Kanaly top={440} /></div>
      </Tresc>
    </>
  );
};

// ------------------------------------------------------------------ s3, s4
const S3: React.FC = () => {
  const t = useT();
  return (
    <>
      <Naglowek eyebrow="Najważniejsze pytanie" tytul="Skąd masz ludzi?" />
      <Tresc>
        <div style={{ opacity: 0.45 }}><Kafle top={210} maly /></div>
        <Kanaly top={340} net={kl(t, kiedy("s3", "internetu") - 0.2, kiedy("s3", "internetu") + 0.4)} rek={kl(t, kiedy("s3", "ręcznie") - 0.4, kiedy("s3", "ręcznie") + 0.2)} />
      </Tresc>
    </>
  );
};
const S4: React.FC = () => {
  const t = useT();
  const t0 = kiedy("s4", "skuteczność");
  const puls = t >= t0 - 0.1 && t < t0 + 3.6 ? Math.max(0, Math.sin(((t - t0 + 0.1) * Math.PI) / 0.9)) : 0;
  return (
    <>
      <Naglowek eyebrow="Skuteczność" tytul="Która robota daje więcej" />
      <Tresc>
        <div style={{ opacity: 0.45 }}><Kafle top={210} maly /></div>
        <Kanaly top={340} puls={puls} wygrany={kl(t, kiedy("s4", "więcej") - 0.2, kiedy("s4", "więcej") + 0.3)} />
      </Tresc>
    </>
  );
};

// ------------------------------------------------------------------ s5, s6
const S5: React.FC = () => {
  const t = useT();
  const t0 = kiedy("s5", "wykres");
  return (
    <>
      <Naglowek eyebrow="Wykres lejków" tytul="Na czym stoją Twoi ludzie" />
      <Tresc><Wykres wzrost={(i) => kl(t, t0 + 0.3 + i * 0.35, t0 + 1.2 + i * 0.35)} legenda={kl(t, kiedy("s5", "kolory"), kiedy("s5", "kolory") + 2.2)} top={240} /></Tresc>
    </>
  );
};
const S6: React.FC = () => {
  const t = useT();
  const tN = kiedy("s6", "internetu");
  const tR = kiedy("s6", "ręczne");
  const tW = kiedy("s6", "wszystkie");
  const akt = t >= tW ? 0 : t >= tR ? 2 : t >= tN ? 1 : 0;
  const pokaz = (l: Lejek) => {
    const net = l.kanal === "net";
    if (t >= tW) return net ? kl(t, tW, tW + 0.4) : 1;
    if (t >= tR) return net ? 1 - kl(t, tR, tR + 0.4) : kl(t, tR, tR + 0.4);
    return net ? 1 : 1 - kl(t, tN, tN + 0.4);
  };
  // pozycje pigułek (środki): 100 + 6 + i*176 + 85
  const px = (i: number) => 100 + 6 + i * 176 + 85;
  const cele = [
    { t: tN, x: px(1) },
    { t: tR, x: px(2) },
    { t: tW, x: px(0) },
  ];
  let x = 640;
  let klik = 0;
  let poprz = { t: tN - 1.2, x: 640 };
  for (const c of cele) {
    if (t >= poprz.t) x = poprz.x + (c.x - poprz.x) * kl(t, Math.max(poprz.t + 0.2, c.t - 0.9), c.t - 0.1);
    if (t >= c.t - 0.05 && t < c.t + 0.5) klik = kl(t, c.t - 0.05, c.t + 0.45);
    poprz = { t: c.t, x: c.x };
  }
  const st = akt === 1 ? NET : akt === 2 ? REK : ALL;
  return (
    <>
      <Naglowek eyebrow="Przełącznik" tytul="Internet, ręczne albo wszystko" />
      <Tresc>
        <Przelacznik akt={akt} top={215} />
        <div style={{ position: "absolute", left: 670, top: 224, ...tekst(20, 800, K.mut) }}>
          <span style={tekst(26, 800, K.ink)}>{st.lacznie}</span> kontaktów · <span style={tekst(26, 800, "#27ae60")}>{st.win}%</span> skuteczności
        </div>
        <Wykres widac={pokaz} top={290} />
        <Kursor x={x} y={242} klik={klik} />
      </Tresc>
    </>
  );
};

// ------------------------------------------------------------------ s7
const KOLS = [
  { n: "Lejek / kanał", w: 290 },
  { n: "Wejścia", w: 90 },
  { n: "Kontakty", w: 95 },
  { n: "Wejście → zapis", w: 140 },
  { n: "Etapy", w: 210 },
  { n: "TAK", w: 60 },
  { n: "Skuteczność", w: 125 },
];
const S7: React.FC = () => {
  const t = useT();
  const cWej = kl(t, kiedy("s7", "wejścia") - 0.1, kiedy("s7", "wejścia") + 0.3) * (1 - kl(t, kiedy("s7", "zapisało") - 0.3, kiedy("s7", "zapisało")));
  const cZap = kl(t, kiedy("s7", "zapisało") - 0.3, kiedy("s7", "zapisało"));
  const wiersz = kl(t, kiedy("s7", "dużo") - 0.1, kiedy("s7", "dużo") + 0.3);
  const rada = kl(t, kiedy("s7", "zmień") - 0.1, kiedy("s7", "zmień") + 0.4);
  const kolBg = (j: number) => (j === 1 ? `rgba(52,152,219,${0.18 * cWej})` : j === 3 ? `rgba(25,160,32,${0.16 * cZap})` : "transparent");
  return (
    <>
      <Naglowek eyebrow="Tabela" tytul="Wejścia i zapisy z Twojego linku" />
      <Tresc>
        <div style={{ ...OBSZAR, top: 225, background: K.card, border: `1.5px solid ${K.line}`, borderRadius: 24, padding: "10px 16px" }}>
          <div style={{ display: "flex" }}>
            {KOLS.map((k, j) => (
              <div key={k.n} style={{ width: k.w, padding: "12px 8px", ...tekst(15, 800, K.mut), background: kolBg(j), borderRadius: "10px 10px 0 0" }}>{k.n}</div>
            ))}
          </div>
          {LEJKI.map((l, i) => {
            const s = staty([l]);
            const zap = l.wejscia ? Math.round((100 * s.lacznie) / l.wejscia) : null;
            const zly = i === 2;
            const komorki = [
              <span key="n" style={tekst(16, 700)}>{l.kanal === "net" ? "🌐 " : "✋ "}{l.n}</span>,
              <span key="w" style={tekst(19, 800)}>{l.wejscia ?? "—"}</span>,
              <span key="k" style={tekst(19, 800)}>{s.lacznie}</span>,
              <span key="z" style={{ ...tekst(19, 800, zly && wiersz > 0.5 ? "#e74c3c" : K.ink) }}>{zap === null ? "—" : `${zap}%`}</span>,
              <Pasek key="e" et={l.et} p={1} sz={10} h={18} />,
              <span key="t" style={tekst(19, 800, "#27ae60")}>{s.tak}</span>,
              <span key="s" style={tekst(19, 800)}>{s.win}%</span>,
            ];
            return (
              <div key={l.n} style={{ display: "flex", alignItems: "stretch", borderTop: `1.5px solid ${K.line}`, background: zly ? `rgba(231,76,60,${0.1 * wiersz})` : "transparent", boxShadow: zly && wiersz > 0.5 ? "inset 0 0 0 2.5px #e74c3c" : "none", borderRadius: 8 }}>
                {komorki.map((c, j) => (
                  <div key={j} style={{ width: KOLS[j].w, padding: "0 8px", height: 62, display: "flex", alignItems: "center", background: kolBg(j) }}>{c}</div>
                ))}
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 300, top: 590, opacity: rada, transform: `translateY(${(1 - rada) * 14}px)`, background: K.ink, borderRadius: 16, padding: "14px 20px", ...tekst(20, 700, "#fff"), whiteSpace: "nowrap" }}>
          💬 Dużo wejść, mało zapisów? Zmień wiadomość, z którą wysyłasz link.
        </div>
      </Tresc>
    </>
  );
};

// ------------------------------------------------------------------ s8
const DNI = 30;
const DZIS = 18;
const poprz = (d: number) => Math.round(25 * Math.pow(d / DNI, 1.15));
const teraz = (d: number) => Math.round(21 * Math.pow(d / DZIS, 0.95));
const S8: React.FC = () => {
  const t = useT();
  const akt = t >= kiedy("s8", "postęp") - 0.1 ? 1 : 0;
  const g = kl(t, kiedy("s8", "porównujesz"), kiedy("s8", "poprzednim") + 0.6);
  const dzis = kl(t, kiedy("s8", "dzień") - 0.1, kiedy("s8", "dnia") + 0.2);
  const H = 250;
  const skala = H / 28;
  const BW = 30;
  return (
    <>
      <Naglowek eyebrow="Zakładka „Postęp”" tytul="Ten miesiąc na tle poprzedniego" />
      <Tresc>
        <Zakladki akt={akt}>
          <div style={{ display: "flex", gap: 22, ...tekst(15, 700, K.mut) }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><span style={{ width: 14, height: 14, borderRadius: 4, background: K.a }} />Ten miesiąc</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><span style={{ width: 14, height: 14, borderRadius: 4, background: "#D3DDD2" }} />Poprzedni miesiąc</span>
            <span style={{ marginLeft: "auto", ...tekst(17, 800, K.ink), opacity: dzis }}>Dzień {DZIS}: {teraz(DZIS)} kontaktów, miesiąc temu {poprz(DZIS)}</span>
          </div>
          <div style={{ position: "absolute", left: 0, bottom: 30, height: H, display: "flex", alignItems: "flex-end", gap: 2 }}>
            {Array.from({ length: DNI }).map((_, i) => {
              const d = i + 1;
              const pg = kl(g, (i / DNI) * 0.6, (i / DNI) * 0.6 + 0.4);
              return (
                <div key={d} style={{ width: BW, height: H, position: "relative" }}>
                  <div style={{ position: "absolute", bottom: 0, left: 0, width: BW, height: poprz(d) * skala * pg, background: "#D3DDD2", borderRadius: "6px 6px 0 0" }} />
                  {d <= DZIS && <div style={{ position: "absolute", bottom: 0, left: 7, width: BW - 14, height: teraz(d) * skala * pg, background: K.a, borderRadius: "6px 6px 0 0" }} />}
                </div>
              );
            })}
          </div>
          <div style={{ position: "absolute", left: (DZIS - 1) * (BW + 2) + BW / 2 - 1, bottom: 30, height: H + 20, width: 3, background: K.ink, opacity: dzis }} />
          <div style={{ position: "absolute", left: (DZIS - 1) * (BW + 2) + BW / 2 - 30, bottom: H + 52, width: 60, textAlign: "center", opacity: dzis, background: K.ink, borderRadius: 99, padding: "3px 0", ...tekst(15, 800, "#fff") }}>dziś</div>
          <div style={{ position: "absolute", left: 0, bottom: 0, width: DNI * (BW + 2), display: "flex", justifyContent: "space-between", ...tekst(13, 700, K.mut) }}>
            <span>1</span><span>10</span><span>20</span><span>30</span>
          </div>
        </Zakladki>
      </Tresc>
    </>
  );
};

// ------------------------------------------------------------------ s9
const ZESPOL = [6, 9, 11, 12, 14, 15, 15, 17, 18, 19, 20, 22, 23, 24, 25, 27, 29, 31, 34, 38];
const TY = 28;
const S9: React.FC = () => {
  const t = useT();
  const akt = t >= kiedy("s9", "ja") - 0.1 ? 2 : 1;
  const p = kl(t, kiedy("s9", "widzisz"), kiedy("s9", "wypadasz") + 0.4);
  const ty = kl(t, kiedy("s9", "zespołu") - 0.2, kiedy("s9", "zespołu") + 0.4);
  const anon = kl(t, kiedy("s9", "anonimowo") - 0.1, kiedy("s9", "anonimowo") + 0.4);
  const W = 1000;
  const xx = (v: number) => ((v - 0) / 45) * W;
  const sr = Math.round(ZESPOL.reduce((a, b) => a + b, 0) / ZESPOL.length);
  return (
    <>
      <Naglowek eyebrow="Zakładka „Ja vs grupa”" tytul="Ty na tle zespołu" />
      <Tresc>
        <Zakladki akt={akt}>
          <div style={{ position: "absolute", inset: 0, opacity: kl(t, kiedy("s9", "ja") - 0.1, kiedy("s9", "ja") + 0.3) }}>
          <div style={tekst(20, 800)}>Skuteczność w tym miesiącu (%)</div>
          <div style={{ position: "absolute", left: 0, top: 80, width: W, height: 140 }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 66, height: 8, borderRadius: 99, background: K.line }} />
            {ZESPOL.map((v, i) => {
              const o = kl(p, (i / ZESPOL.length) * 0.7, (i / ZESPOL.length) * 0.7 + 0.3);
              return <div key={i} style={{ position: "absolute", left: xx(v) - 11, top: 59 - (i % 3) * 26 + 26, width: 22, height: 22, borderRadius: 99, background: "#BCC8BB", opacity: o, transform: `scale(${o})` }} />;
            })}
            <div style={{ position: "absolute", left: xx(sr) - 1, top: 10, width: 3, height: 110, background: K.mut, opacity: p }} />
            <div style={{ position: "absolute", left: xx(sr) - 80, top: -22, width: 160, textAlign: "center", opacity: p, ...tekst(15, 800, K.mut) }}>średnia zespołu {sr}%</div>
            <div style={{ position: "absolute", left: xx(TY) - 26, top: 44, width: 52, height: 52, borderRadius: 99, background: K.a, border: "5px solid #fff", boxShadow: "0 8px 20px rgba(25,160,32,.4)", opacity: ty, transform: `scale(${0.5 + 0.5 * ty})`, display: "flex", alignItems: "center", justifyContent: "center", ...tekst(17, 800, "#fff") }}>Ty</div>
            <div style={{ position: "absolute", left: xx(TY) - 40, top: 104, width: 80, textAlign: "center", opacity: ty, ...tekst(20, 800, K.a) }}>{TY}%</div>
          </div>
          <div style={{ position: "absolute", left: 0, top: 250, width: W, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, opacity: ty }}>
            <div style={{ background: K.tint, borderRadius: 16, padding: "14px 18px" }}><div style={tekst(15, 700, K.mut)}>Nowe kontakty w miesiącu</div><div style={tekst(26, 800)}>Ty: 21 · średnia: 14</div></div>
            <div style={{ background: K.tint, borderRadius: 16, padding: "14px 18px" }}><div style={tekst(15, 700, K.mut)}>Decyzje TAK</div><div style={tekst(26, 800)}>Ty: 8 · średnia: 5</div></div>
          </div>
          <div style={{ position: "absolute", right: 0, top: -6, opacity: anon, transform: `scale(${0.8 + 0.2 * anon})`, display: "inline-flex", alignItems: "center", gap: 8, background: K.ink, borderRadius: 99, padding: "8px 16px", ...tekst(17, 800, "#fff") }}>
            <Lock size={18} color="#fff" /> Anonimowo, bez nazwisk
          </div>
          </div>
        </Zakladki>
      </Tresc>
    </>
  );
};

// ------------------------------------------------------------------ s10
const S10: React.FC = () => {
  const t = useT();
  const raz = kl(t, kiedy("s10", "raz") - 0.1, kiedy("s10", "raz") + 0.4);
  const piec = kl(t, kiedy("s10", "pięć") - 0.1, kiedy("s10", "pięć") + 0.4);
  const prom = kl(t, kiedy("s10", "promować") - 0.2, kiedy("s10", "promować") + 0.4);
  const D = ["Pn", "Wt", "Śr", "Cz", "Pt", "Sb", "Nd"];
  return (
    <>
      <Naglowek eyebrow="Raz w tygodniu" tytul="5 minut przy Wynikach" />
      <Tresc>
        <div style={{ opacity: 0.35, filter: "blur(5px)" }}>
          <Kafle top={215} maly />
          <Kanaly top={350} />
        </div>
        <div style={{ ...OBSZAR, top: 270, display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 12 }}>
          {D.map((d, i) => {
            const on = i === 0;
            const p = on ? raz : 0;
            return (
              <div key={d} style={{ background: K.card, border: `${on && p > 0.5 ? 3 : 2}px solid ${on && p > 0.5 ? K.a : K.line}`, borderRadius: 18, padding: "18px 0", textAlign: "center", boxShadow: "0 10px 26px rgba(14,36,18,.08)" }}>
                <div style={tekst(20, 800, K.mut)}>{d}</div>
                <div style={{ width: 58, height: 58, borderRadius: 99, margin: "14px auto 0", background: p > 0.5 ? K.a : K.tint, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${0.7 + 0.3 * (on ? p : 1)})` }}>{p > 0.5 && <Check size={32} color="#fff" strokeWidth={3} />}</div>
                <div style={{ ...tekst(16, 800, K.a), marginTop: 10, opacity: on ? piec : 0 }}>5 min</div>
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 100, top: 500, opacity: prom, transform: `translateY(${(1 - prom) * 16}px)`, display: "inline-flex", alignItems: "center", gap: 10, background: K.a, borderRadius: 99, padding: "14px 26px", ...tekst(24, 800, "#fff"), boxShadow: "0 14px 30px rgba(25,160,32,.3)" }}>
          <Rocket size={26} color="#fff" /> Promuj mocniej: Zaproszenie do WellU
        </div>
      </Tresc>
    </>
  );
};

export const WynikiFilm: React.FC<{ zAwatarem?: boolean; bezNapisow?: boolean }> = ({ zAwatarem, bezNapisow }) => (
  <AbsoluteFill style={{ background: K.bg }}>
    <Audio src={staticFile("film-wyniki/lektor.mp3")} />
    <Scena id="s1"><S1 /></Scena>
    <Scena id="s2"><S2 /></Scena>
    <Scena id="s3"><S3 /></Scena>
    <Scena id="s4"><S4 /></Scena>
    <Scena id="s5"><S5 /></Scena>
    <Scena id="s6"><S6 /></Scena>
    <Scena id="s7"><S7 /></Scena>
    <Scena id="s8"><S8 /></Scena>
    <Scena id="s9"><S9 /></Scena>
    <Scena id="s10"><S10 /></Scena>
    {bezNapisow ? null : <F.Napisy />}
    {zAwatarem ? <Awatar src={staticFile("film-wyniki/awatar.mp4")} /> : null}
  </AbsoluteFill>
);
