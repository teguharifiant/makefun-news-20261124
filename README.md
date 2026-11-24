# The World Today — 24 November 2026

[![news-image-20261124](https://make.fun/badge/news-image-20261124.svg)](https://make.fun/bounty/news-image-20261124)
[![rank](https://make.fun/badge/news-image-20261124/teguharifiant/makefun-news-20261124/rank.svg)](https://make.fun/bounty/news-image-20261124)
[![reward](https://make.fun/badge/news-image-20261124/teguharifiant/makefun-news-20261124/reward.svg)](https://make.fun/bounty/news-image-20261124)

A newspaper front page for Tuesday 24 November 2026, drawn entirely in code.
`main.ts` (Node, standard library only, no network) renders the day's news as a
1024×1024 PNG and writes it to `/output/entry.png`.

## The day's news

- **Lead — "Drone-struck ship docks in St Petersburg":** the Russian cargo ship
  Sparta II, hit by two drones in the Gulf of Finland on Saturday 21 November
  and set ablaze, was towed into St Petersburg on Monday. Finland says Ukraine
  was likely behind the strike; Finnish, Estonian and Russian vessels fought
  the fire together.
- **NATO weighs an air shield for Poland:** allies met in Brussels after three
  Russian Kh-101 missiles fell in Poland on 20 November. Warsaw asks for AWACS
  planes and F-35 jets.
- **Cikande: 24 dead, 30 still missing:** rescue teams keep digging at the
  Indonesian candy factory; 29 workers survived.
- **Alcaraz wins his first ATP Finals** in Turin, beating Zverev.
- **World Chess Championship defence begins** in Geneva: Gukesh faces Sindarov.

## Run it

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

The program is deterministic: two runs write byte-identical PNGs.

## Entry

- Competition: [news-image-20261124](https://make.fun/bounty/news-image-20261124)
- Account: @teguharifiant
