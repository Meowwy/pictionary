export const themesDrawingSimpleMode: string[] = [
    "Profese",
    "Volnočasové aktivity",
    "Česká přísloví",
    "Sporty",
    "Zvířata",
    "Jídlo",
    "Věci",
    "Místa",
    "Technologie",
    "Přírodní úkazy"
];

type Theme = {
  themeName: string;
  description: string;
};

export const themesDrawingActivityMode: Theme[] = [
  { themeName: "Profese", description: "Návrh na kreslení je povolání/profese a nějaká činnost, která je pro to povolání typická, přičemž to musí být jasně definovatelné. Např. Kuchař míchá (polévku) nebo Lékař operuje." },
  { themeName: "Zvířata", description: "Návrh na kreslení je zvíře a nějaká činnost, kterou toto zvíře vykonává. Předmět věty bude v závorkách Např. Slon pije (vodu) nebo Kůň skáče (přes překážky)." },
  { themeName: "Denní katastrofy", description: "Návrh na kreslení bude nějaké událost, která se běžně stává a je nepříjemná. Např. Rozlitá káva nebo Ujel mi autobus." },
  { themeName: "Šílený módní trend", description: "Návrh na kreslení je nějaký imaginární módní trend. Např. šaty ve tvaru banánové slupky nebo Boty z knih."},
  { themeName: "Budoucnost 3026", description: "Návrh na kreslení je nějaká představa budoucnosti nebo nějaký budoucí vynález. Může to být i trochu šílená a nereálná představa. Např. Létající auta nebo Škola s učitelem robotem"},
  { themeName: "Střet dějin", description: "Návrh na kreslení je mix dvou prvků z minulosti a současnosti. Např. Rytíř na skateboardu nebo Pračlověk používající deodorant"},
];
