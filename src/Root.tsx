import React from "react";
import { Composition } from "remotion";
import { Short } from "./Short";
import { PRZYKLAD } from "./przyklad";
import { klatkiCalosci, FPS } from "./czas";
import { SZEROKOSC, WYSOKOSC } from "./marka";
import type { PropsRolki } from "./typy";
import { Explainer, EX_FPS, EX_SZER, EX_WYS, exKlatki } from "./explainer/Explainer";
import { Dashboard, dashboardKlatki } from "./explainer/Dashboard";
import { LejkiFilm, lejkiKlatki } from "./explainer/Lejki";
import { LongevityFilm, longevityKlatki } from "./explainer/Longevity";
import { KontaktyFilm, kontaktyKlatki } from "./explainer/Kontakty";
import { ZadaniaFilm, zadaniaKlatki } from "./explainer/Zadania";

export const RemotionRoot: React.FC = () => {
  return (
    <>
    <Composition
      id="Short"
      component={Short}
      fps={FPS}
      width={SZEROKOSC}
      height={WYSOKOSC}
      durationInFrames={klatkiCalosci(PRZYKLAD)}
      defaultProps={{ scenariusz: PRZYKLAD, bazaUrl: "" } satisfies PropsRolki}
      calculateMetadata={({ props }) => ({
        durationInFrames: klatkiCalosci(props.scenariusz),
      })}
    />
    {/* Film „Czym jest lejek” do strefy partnera CNW (16:9, osobny od rolek). */}
    <Composition id="Lejki16x9" component={Explainer} fps={EX_FPS} width={EX_SZER} height={EX_WYS} durationInFrames={exKlatki()} defaultProps={{ zAwatarem: false }} />
    <Composition id="Dashboard16x9" component={Dashboard} fps={EX_FPS} width={EX_SZER} height={EX_WYS} durationInFrames={dashboardKlatki} defaultProps={{ zAwatarem: false }} />
    <Composition id="LejkiJak16x9" component={LejkiFilm} fps={EX_FPS} width={EX_SZER} height={EX_WYS} durationInFrames={lejkiKlatki} defaultProps={{ zAwatarem: false }} />
    <Composition id="Longevity16x9" component={LongevityFilm} fps={EX_FPS} width={EX_SZER} height={EX_WYS} durationInFrames={longevityKlatki} defaultProps={{ zAwatarem: false }} />
    <Composition id="Kontakty16x9" component={KontaktyFilm} fps={EX_FPS} width={EX_SZER} height={EX_WYS} durationInFrames={kontaktyKlatki} defaultProps={{ zAwatarem: false }} />
    <Composition id="Zadania16x9" component={ZadaniaFilm} fps={EX_FPS} width={EX_SZER} height={EX_WYS} durationInFrames={zadaniaKlatki} defaultProps={{ zAwatarem: false }} />
    </>
  );
};
