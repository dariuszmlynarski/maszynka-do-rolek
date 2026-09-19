// Czytanie planu social media z sejfu dmOS: pozycje oznaczone jako rolka do nagrania.
// Baza contentowa to pliki .md z frontmatterem — właścicielem konwencji jest
// `.claude/rules/bazy-contentowe.md` w sejfie. Tutaj tylko czytamy, nigdy nie zapisujemy.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const SEJF = process.env.SEJF_DIR || path.join(os.homedir(), "dmOS");
const FOLDER_POSTOW = path.join(SEJF, "3-DM", "Content", "Posty Social Media");

export type PozycjaPlanu = {
  id: string;
  tytul: string;
  filar?: string;
  format?: string;
  status?: string;
  data?: string;
  /** Sekundy odczytane z pola `format`, np. „Rolka 9:16 (~40 s)" → 40. */
  dlugosc?: number;
  /** Treść pliku bez frontmatteru — idzie do scenarzysty jako źródło. */
  tresc: string;
  sciezka: string;
};

/** Minimalny czytnik frontmatteru: pary `klucz: wartość`, listy pomijamy. */
function rozbij(plik: string): { pola: Record<string, string>; tresc: string } {
  const m = plik.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { pola: {}, tresc: plik };
  const pola: Record<string, string> = {};
  for (const linia of m[1].split(/\r?\n/)) {
    const p = linia.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (p) pola[p[1]] = p[2].trim().replace(/^['"]|['"]$/g, "");
  }
  return { pola, tresc: m[2] };
}

function pliki(katalog: string, zebrane: string[] = []): string[] {
  let wpisy: fs.Dirent[];
  try {
    wpisy = fs.readdirSync(katalog, { withFileTypes: true });
  } catch {
    return zebrane;
  }
  for (const w of wpisy) {
    const pelna = path.join(katalog, w.name);
    if (w.isDirectory()) pliki(pelna, zebrane);
    else if (w.name.endsWith(".md")) zebrane.push(pelna);
  }
  return zebrane;
}

/** Czy sejf w ogóle jest pod ręką — dashboard chowa sekcję, gdy go nie ma. */
export function sejfDostepny(): boolean {
  return fs.existsSync(FOLDER_POSTOW);
}

/**
 * Pozycje planu czekające na nagranie: `rolka: Do nagrania`.
 * Najświeższe na górze — bez daty lądują na końcu, bo to szkice bez slotu.
 */
export function rolkiDoNagrania(): PozycjaPlanu[] {
  const wynik: PozycjaPlanu[] = [];
  for (const sciezka of pliki(FOLDER_POSTOW)) {
    let surowy: string;
    try {
      surowy = fs.readFileSync(sciezka, "utf8");
    } catch {
      continue;
    }
    const { pola, tresc } = rozbij(surowy);
    if ((pola.rolka || "").toLowerCase() !== "do nagrania") continue;
    const sekundy = (pola.format || "").match(/~?\s*(\d{1,3})\s*s\b/);
    wynik.push({
      id: path.relative(FOLDER_POSTOW, sciezka).replace(/\.md$/, ""),
      tytul: pola.title || path.basename(sciezka, ".md"),
      filar: pola.filar,
      format: pola.format,
      status: pola.status,
      data: pola.date || undefined,
      dlugosc: sekundy ? Number(sekundy[1]) : undefined,
      tresc: tresc.trim(),
      sciezka,
    });
  }
  return wynik.sort((a, b) => (b.data || "").localeCompare(a.data || ""));
}
