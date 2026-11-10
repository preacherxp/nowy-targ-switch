# Nowy Targ switch

Contemporary Nowy Targ in a pixel-art day/night switch: the Rynek of the capital of Podhale on a fair day in August, with the yellow town hall under its two limes, the black helmet of St Catherine's, the St Jan Kanty shrine, the café pavilion, and the Tatra range behind.

[Live demo](https://preacherxp.github.io/nowy-targ-switch/) · [Download 60 fps MP4](nowy-targ-day-night-60fps.mp4)

The seven-second, 1600 × 1000 H.264 recording is made by the Export video workflow and includes the entire animated switch, frame and moving glass lens.

The scene is a compressed panorama, not one street view. Everything on the ground stands on the Rynek, but not in this order; St Catherine's tower is brought in from 150 m to the north-west; and the town hall is turned round so that the Tatras, which lie to the south, stand behind it. The season is the Jarmark Podhalański (14–16 August 2026). A highlander cart behind two piebald horses, the yellow MZK bus and two touring cyclists take the cobbled street in turn. A cheese stall and a sheepskin stall stand for the town's Thursday and Saturday market. A fiddle trio plays by the town hall, the fountain runs, both clocks show the hour, a tow plane pulls a glider towards the range, and a balloon drifts over in the evening. A quick flick of the lens sends the pigeons off the pavilion roof.

## Research

[The source-cited research note](RESEARCH.md) records the references, the photographs that were opened and their dates, the layout, and what could not be verified. The main sources:

- Town hall: [Ratusz w Nowym Targu](https://pl.wikipedia.org/wiki/Ratusz_w_Nowym_Targu), the [heritage register](https://zabytek.pl/en/obiekty/budynek-ratusza-miejskie-670424), and photographs of [September 2015](https://commons.wikimedia.org/wiki/File:Nowy_Targ_ratusz_5.jpg) and [July 2020](https://commons.wikimedia.org/wiki/File:Nowy_Targ._Ratusz_1.jpg).
- The square, shrine and pavilion: [Rynek w Nowym Targu](https://pl.wikipedia.org/wiki/Rynek_w_Nowym_Targu), photographs of [July 2020](https://commons.wikimedia.org/wiki/File:Nowy_Targ._Rynek_3.jpg) and [December 2020](https://commons.wikimedia.org/wiki/File:Market_Square_in_Nowy_Targ_03.jpg), and [Rynek 16 and 17](https://commons.wikimedia.org/wiki/File:Nowy_Targ_kamienice_Rynek_16_17.jpg).
- St Catherine's: photographs of [September 2020](https://commons.wikimedia.org/wiki/File:2020_Powiat_nowotarski,_Nowy_Targ,_Ko%C5%9Bci%C3%B3%C5%82_%C5%9Bw._Katarzyny_Aleksandryjskiej_01.jpg) and [September 2012](https://commons.wikimedia.org/wiki/File:Kosciol_par._p.w._sw._Katarzyny,_Nowy_Targ,_A-939_M,_Rzb_01.JPG).
- The Tatras from the town: [nowytarg24.tv](https://nowytarg24.tv/nowy-targ-miasto-z-widokiem-na-tatry-zdjecia/) and Andrzej Śliwiński's photographs in the [Tatromaniak gallery](https://tatromaniak.pl/aktualnosci/tatry-widziane-z-nowego-targu-galeria-zdjec/).
- Jarmark Podhalański: the [city's programme](https://www.nowytarg.pl/miasto-nowy-targ/aktualnosci/24-jarmark-podhalanski--szczegolowy-program,4045), the [Miejskie Centrum Kultury](https://www.mck.nowytarg.pl/artykul/24-jarmark-podhalanski-w-nowym-targu/1298) and Jan Głąbiński's [photographs of 14 August 2026](https://krakow.gosc.pl/doc/9846904.Nowy-Targ-Jarmark-Podhalanski-z-atrakcjami). The weekly market: [Nowa Targowica](https://www.targowica.eu/jarmark-czwartek-sobota).
- Gliders: [Aeroklub Nowy Targ](https://www.epnt.pl/) and the [Tatrzański Obóz Przelotowy](https://zawody.epnt.pl/).
- Bus: an [MZK bus in July 2021](https://commons.wikimedia.org/wiki/File:Nowy_Targ_autobus_433.jpg) and [TransInfo on the fleet](https://transinfo.pl/infobus/nowy-targ-bez-ofert-na-szesc-autobusow-elektrycznych-dla-mzk-za-143-mln-zl/).

The wooden church of St Anne, the ice hall of Podhale Nowy Targ and the Dunajec are not drawn. The mountain profile is loose and names no peak. The bus carries no fleet number. Night lighting schedules are artistic.

## Run and validate

```sh
python3 -m http.server 8000
node test-scene.cjs
```

Open http://localhost:8000. No build or runtime dependencies are required. See [AGENTS.md](AGENTS.md) for real-browser composition and interaction checks.

## Embed

```html
<script src="city-switch.js"></script>
<script src="nowy-targ.js"></script>
<nowy-targ-switch style="display: block; width: min(680px, 100%);"></nowy-targ-switch>
```

Drag through the hours, tap or press Space to toggle, or use arrow keys. The API exposes `checked`, `position`, and `jump(night)`. `change` supplies `detail.night`; `scrub` supplies `position`, `hour`, and `dark`.

GitHub Pages serves `/` from `main`.

## Attribution

The engine is derived from `tokyo-switch.js`; the original idea is “住人のいるスイッチ” by @Lattice_Node ([original project](https://ludion.ai/p/toggle-daylight), MIT), as credited in the engine source. Research photographs are drawing references and are not redistributed.
