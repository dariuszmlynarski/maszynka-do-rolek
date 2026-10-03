#!/usr/bin/env python3
"""Seria filmów strefy partnera: nagranie Dariusza -> sceny -> os.json + lektor.mp3.

Użycie: film-tnij.py <folder projektu> s1=5.42-11.26 s2=12.86-28.20 ...
Folder musi mieć nagranie/surowe.m4a i nagranie/transkrypcja.json (ElevenLabs Scribe, słowa z czasami).
Zakresy scen bierzesz z transkrypcji (początek pierwszego i koniec ostatniego słowa sceny);
powtórzone podejście po prostu pomijasz w zakresach. Napisy: formy grzecznościowe wielką literą,
cudzysłowy polskie. Pauzy między scenami skracane do 0,6 s, głośność do -16 LUFS.
"""
import json, re, subprocess, sys
from pathlib import Path

d = Path(sys.argv[1])
SC = []
for arg in sys.argv[2:]:
    sid, r = arg.split("=")
    a, b = (float(x) for x in r.split("-"))
    SC.append((sid, a, b))
ws = [w for w in json.load(open(d / "nagranie/transkrypcja.json"))["words"] if w.get("type") == "word"]
CAP = {"twój": "Twój", "twoje": "Twoje", "twoja": "Twoja", "twoim": "Twoim", "twojego": "Twojego", "twoją": "Twoją",
       "twojej": "Twojej", "twoich": "Twoich", "twoi": "Twoi", "cię": "Cię", "ci": "Ci", "ty": "Ty", "tobie": "Tobie",
       "ciebie": "Ciebie", "longevity": "Longevity", "wellu": "WellU"}

def fix(t):
    t = re.sub(r'"([^"]*)"', r"„\1”", t)
    if t.startswith('"'):
        t = "„" + t[1:]
    t = t.replace('"', "”")
    m = re.match(r"^([^\w]*)(\w+)(.*)$", t)
    if m and m.group(2).lower() in CAP:
        t = m.group(1) + CAP[m.group(2).lower()] + m.group(3)
    return t

PRE, GAP, END, HEAD, TAIL = 0.4, 0.6, 1.8, 0.12, 0.22
t = PRE
tl = []
for i, (sid, a, b) in enumerate(SC):
    s0 = a - HEAD
    dur = b + TAIL - s0
    clip = d / f"nagranie/{sid}.wav"
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-ss", f"{s0:.3f}", "-t", f"{dur:.3f}", "-i", str(d / "nagranie/surowe.m4a"),
                    "-af", f"highpass=f=80,afade=t=in:d=0.04,afade=t=out:st={dur - 0.08:.3f}:d=0.08", "-ar", "44100", "-ac", "1", str(clip)], check=True)
    sl = [{"tekst": fix(w["text"]), "start": round(w["start"] - s0, 3), "koniec": round(w["end"] - s0, 3)}
          for w in ws if w["start"] >= a - 0.05 and w["end"] <= b + 0.05]
    tl.append({"id": sid, "start": round(t, 3), "audio": str(clip.relative_to(d)), "czas": round(dur, 3), "slowa": sl})
    t += dur + (GAP if i < len(SC) - 1 else END)
json.dump({"sceny": tl, "calosc": round(t, 3)}, open(d / "os.json", "w"), indent=1, ensure_ascii=False)
inp, flt = [], []
for i, s in enumerate(tl):
    inp += ["-i", str(d / s["audio"])]
    ms = int(s["start"] * 1000)
    flt.append(f"[{i}:a]adelay={ms}|{ms}[a{i}]")
flt.append("".join(f"[a{i}]" for i in range(len(tl))) + f"amix=inputs={len(tl)}:normalize=0,apad=whole_dur={t},loudnorm=I=-16:TP=-1.5:LRA=11[out]")
subprocess.run(["ffmpeg", "-y", "-v", "error"] + inp + ["-filter_complex", ";".join(flt), "-map", "[out]", "-ar", "44100", "-ac", "2", "-b:a", "192k", str(d / "lektor.mp3")], check=True)
print("całość", round(t, 2), "s")
for s in tl:
    print(s["id"], s["start"], " ".join(w["tekst"] for w in s["slowa"]))
