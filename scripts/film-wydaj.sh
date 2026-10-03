#!/bin/bash
# Seria filmów strefy partnera: awatar (URL z HeyGena) -> render -> -16 LUFS -> okładka -> pliki gotowe do wgrania.
# Użycie: film-wydaj.sh <kompozycja> <folder public/projekty, np. film-zadania> <url awatara> <sekunda okładki>
set -e
cd "$(dirname "$0")/.."
KOMP=$1; F=$2; URL=$3; OKL=${4:-10}
P=projekty/$F
curl -s -o $P/awatar.mp4 "$URL"
cp $P/awatar.mp4 public/$F/awatar.mp4
npx remotion render src/index.ts $KOMP $P/render.mp4 --props='{"zAwatarem":true}' --codec=h264 --crf=20 --log=error
ffmpeg -y -v error -i $P/render.mp4 -c:v copy -af loudnorm=I=-16:TP=-1.5:LRA=11 -c:a aac -b:a 160k -movflags +faststart $P/$F.mp4
npx remotion still src/index.ts $KOMP $P/okladka.png --frame=$((OKL*30)) --props='{"zAwatarem":true,"bezNapisow":true}' --log=error
sips -s format jpeg -s formatOptions 85 $P/okladka.png --out $P/$F-okladka.jpg >/dev/null
ffprobe -v error -show_entries format=duration,size -of compact $P/$F.mp4
