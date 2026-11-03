window.STAGE3_LESSONS = [
  {
    id: 17,
    title: 'Poznávání not na hmatníku: Struny E a A',
    stage: 3,
    stageEmoji: '🍺',
    stageName: 'Hospoda',
    type: 'theory',
    typeLabel: 'Teorie',
    description: 'Odhal tajemství basových strun — nauč se najít libovolný tón na strunách E a A a ovládni orientaci na hmatníku.',
    xpReward: 60,
    theoryExercise: {
      title: 'Trenažér not na strunách E a A',
      type: 'fretboard',
      strings: [6, 5],
      questions: [
        { note: 'F', string: 6, fret: 1, hint: '1. pražec na 6. struně E' },
        { note: 'G', string: 6, fret: 3, hint: '3. pražec na 6. struně E (první orientační tečka)' },
        { note: 'A', string: 6, fret: 5, hint: '5. pražec na 6. struně E (druhá tečka)' },
        { note: 'C', string: 5, fret: 3, hint: '3. pražec na 5. struně A (první tečka na A)' },
        { note: 'D', string: 5, fret: 5, hint: '5. pražec na 5. struně A (druhá tečka)' }
      ]
    },
    steps: [
      {
        title: 'Vítej v Hospodě — 3. etapě tvé kytarové cesty!',
        content: `
          <p class="lead">Vítej v Hospodě! Tady se hudba stává společenskou záležitostí. Lidé chtějí zpívat známé české i světové melodie, valčíky i trampské písničky.</p>
          <p>Aby ses stal opravdovým muzikantem, který dokáže okamžitě najít správnou tóninu pro zpěváka nebo zahrát basový tón k jakémukoliv akordu, musíš bezpečně znát <strong>tóny na dvou nejtlustších strunách: 6. struně (E) a 5. struně (A)</strong>.</p>
          <div class="card p-3 my-3 bg-surface-2 border-accent">
            <h4 class="text-accent font-bold mb-1">💡 Proč právě struny E a A?</h4>
            <p class="mb-0">Právě na těchto dvou strunách leží základní basové tóny (Root notes) pro 95 % všech akordů a budoucích barré hmatů. Jakmile znáš tóny zde, máš celou kytaru v kapse!</p>
          </div>
        `
      },
      {
        title: 'Hudební abeceda: Půltóny a celotóny',
        content: `
          <p>Na kytaře se tóny pohybují po půltónech (jeden pražec = jeden půltón). V hudební abecedě platí jednoduché pravidlo:</p>
          <div class="card p-4 my-3 bg-surface-2 text-center font-mono">
            <p class="text-lg text-white font-bold mb-1">C &nbsp;—(2)—&nbsp; D &nbsp;—(2)—&nbsp; E &nbsp;—(1)—&nbsp; F &nbsp;—(2)—&nbsp; G &nbsp;—(2)—&nbsp; A &nbsp;—(2)—&nbsp; H &nbsp;—(1)—&nbsp; C</p>
            <p class="text-xs text-accent mt-2 mb-0">⚠️ Pozor: Mezi E-F a mezi H-C je vzdálenost pouze 1 pražec (půltón)! Mezi všemi ostatními tóny jsou 2 pražce (celý tón).</p>
          </div>
        `
      },
      {
        title: 'Tóny na 6. struně (E)',
        content: `
          <p>Pojďme po 6. struně od nultého pražce:</p>
          <ul class="lesson-list font-mono">
            <li><strong>0. pražec (prázdná struna):</strong> Tón <strong>E</strong></li>
            <li><strong>1. pražec:</strong> Tón <strong>F</strong> (hned vedle E!)</li>
            <li><strong>3. pražec (1. orientační tečka):</strong> Tón <strong>G</strong></li>
            <li><strong>5. pražec (2. tečka):</strong> Tón <strong>A</strong></li>
            <li><strong>7. pražec (3. tečka):</strong> Tón <strong>H</strong> (B)</li>
            <li><strong>8. pražec:</strong> Tón <strong>C</strong> (hned vedle H!)</li>
            <li><strong>10. pražec:</strong> Tón <strong>D</strong></li>
            <li><strong>12. pražec (dvojitá tečka):</strong> Tón <strong>E</strong> (o celou oktávu výše)</li>
          </ul>
        `
      },
      {
        title: 'Tóny na 5. struně (A)',
        content: `
          <p>Podobně si projdeme 5. strunu A:</p>
          <ul class="lesson-list font-mono">
            <li><strong>0. pražec:</strong> Tón <strong>A</strong></li>
            <li><strong>2. pražec:</strong> Tón <strong>H</strong> (B)</li>
            <li><strong>3. pražec (1. orientační tečka):</strong> Tón <strong>C</strong> (základ akordu C dur!)</li>
            <li><strong>5. pražec (2. tečka):</strong> Tón <strong>D</strong> (základ akordu D dur a Dm)</li>
            <li><strong>7. pražec (3. tečka):</strong> Tón <strong>E</strong></li>
            <li><strong>8. pražec:</strong> Tón <strong>F</strong></li>
            <li><strong>10. pražec:</strong> Tón <strong>G</strong></li>
            <li><strong>12. pražec:</strong> Tón <strong>A</strong> (oktáva)</li>
          </ul>
        `
      }
    ],
    quiz: [
      {
        question: 'Které dvě dvojice základních tónů dělí pouze jeden pražec (půltón)?',
        options: ['E–F a H–C', 'C–D a G–A', 'A–H a D–E', 'G–A a E–F'],
        correct: 0,
        explanation: 'Pouze mezi E a F a mezi H a C je přirozený půltón (1 pražec). Všechny ostatní sousední tóny dělí 2 pražce.'
      },
      {
        question: 'Který tón najdeš na 3. pražci 6. struny (struna E)?',
        options: ['Tón G', 'Tón C', 'Tón F', 'Tón A'],
        correct: 0,
        explanation: 'Na 3. pražci struny E leží tón G (základní basový tón akordu G dur).'
      },
      {
        question: 'Který tón leží na 3. pražci 5. struny (struna A)?',
        options: ['Tón C', 'Tón D', 'Tón G', 'Tón E'],
        correct: 0,
        explanation: 'Na 3. pražci struny A tiskneš prsteníkem tón C při hraní akordu C dur.'
      },
      {
        question: 'Co znamená dvojitá tečka na 12. pražci hmatníku?',
        options: [
          'Přesně jednu oktávu od prázdné struny (stejné tóny o oktávu výš)',
          'Konec povolené oblasti hraní',
          'Označení pro použití kapodastru',
          'Místo, kde kytara neladí'
        ],
        correct: 0,
        explanation: '12. pražec rozděluje strunu přesně na polovinu a zní zde tóny o celou oktávu vyšší než na prázdných strunách.'
      }
    ]
  },
  {
    id: 18,
    title: 'Akord D moll (Dm) & melancholie',
    stage: 3,
    stageEmoji: '🍺',
    stageName: 'Hospoda',
    type: 'exercise',
    typeLabel: 'Praxe',
    description: 'Nauč se nádherný akord D moll — základ slavných balad, španělských melodií a hospodských písní.',
    xpReward: 70,
    practiceWorkout: {
      title: 'Střídání Dm a Am',
      chords: ['Dm', 'Am'],
      strummingPattern: 'folk',
      bpm: 80,
      bars: 16
    },
    unlockedSongId: 3,
    steps: [
      {
        title: 'Prstoklad akordu D moll (Dm)',
        content: `
          <p class="lead">Akord D moll je jedním z nejdojemnějších a nejkrásnějších akordů na kytaře. Přináší hlubokou melancholii a napětí.</p>
          <div class="card p-3 my-3 bg-surface-2 font-mono">
            <h4 class="text-accent font-bold mb-2">Jak položit prsty:</h4>
            <p class="mb-1"><strong>1. prst (ukazovák):</strong> 1. pražec na 1. struně (tenké e) – tón F</p>
            <p class="mb-1"><strong>2. prst (prostředník):</strong> 2. pražec na 3. struně (G) – tón A</p>
            <p class="mb-1"><strong>3. prst (prsteník):</strong> 3. pražec na 2. struně (B/H) – tón D</p>
            <p class="mb-0 text-muted">Struna 4 (D) zní prázdná jako bas. Struny 6 a 5 (E a A) netlumíme nebo nehrajeme!</p>
          </div>
        `
      },
      {
        title: 'Čistota tónu: Pozor na ukazovák a malíček',
        content: `
          <p>Při akordu Dm tiskne ukazovák 1. pražec tenké struny. Ujisti se, že bříško prstu nezatlumuje okolí a že prostředník na 3. struně se nedotýká volné 2. struny.</p>
          <div class="card p-3 my-3 bg-surface-2">
            <p class="mb-0">🎯 <strong>Tip:</strong> Zkontroluj akord brnknutím strunu po struně (D - G - B - e). Všechny 4 tóny musí znít jasně a zvonivě.</p>
          </div>
        `
      },
      {
        title: 'Píseň Slavíci z Madridu za odměnu',
        content: `
          <p>Dokončením této lekce si odemkneš legendární hit Waldemara Matušky <strong>Slavíci z Madridu</strong>, který je postaven na akordech <em>Am, E a Dm</em>!</p>
        `
      }
    ],
    quiz: [
      {
        question: 'Které struny se rozeznívají při správném hraní akordu D moll?',
        options: ['Spodní 4 struny (D, G, B, e)', 'Všech 6 strun', 'Pouze basové struny', 'Pouze 3 tenké struny'],
        correct: 0,
        explanation: 'Akord D moll má základní basový tón na volné 4. struně D a hrají se 4 struny (D, G, B, e).'
      },
      {
        question: 'Na kterém pražci tiskne ukazovák 1. strunu u akordu D moll?',
        options: ['Na 1. pražci', 'Na 2. pražci', 'Na 3. pražci', 'Struna zní prázdná'],
        correct: 0,
        explanation: 'Ukazovák drží 1. pražec tenké struny e (tón F – malá tercie akordu D moll).'
      },
      {
        question: 'Která česká píseň těží z melancholické atmosféry akordů Am, E a Dm?',
        options: ['Slavíci z Madridu', 'Jarošovský pivovar', 'Stánky', 'Severní vítr'],
        correct: 0,
        explanation: 'Slavíci z Madridu jsou perfektním příkladem španělské mollové progrese s akordem Dm.'
      },
      {
        question: 'Proč se při D moll nehrají struny 6 (E) a 5 (A)?',
        options: [
          'Protože tóny E a A by narušily čistý mollový souzvuk akordu od tónu D',
          'Protože na ně prsty nedosáhnou',
          'Protože jsou struny příliš tlusté',
          'Struny se hrát mohou libovolně'
        ],
        correct: 0,
        explanation: 'Základním basovým tónem je D. Basové struny E a A by akord harmonicky zakalily.'
      }
    ]
  },
  {
    id: 19,
    title: 'Akord A dur (A) & tři prsty v jedné řadě',
    stage: 3,
    stageEmoji: '🍺',
    stageName: 'Hospoda',
    type: 'exercise',
    typeLabel: 'Praxe',
    description: 'Postav tři prsty na 2. pražec a zahraj zářivý akord A dur — srdce folku, country a táboráků.',
    xpReward: 70,
    practiceWorkout: {
      title: 'Kolečko D – A – G – D',
      chords: ['D', 'A', 'G'],
      strummingPattern: 'camp',
      bpm: 90,
      bars: 16
    },
    unlockedSongId: 1,
    steps: [
      {
        title: 'Výzva 2. pražce: Akord A dur',
        content: `
          <p class="lead">Akord A dur je jedním z nejčastějších akordů, ale pro začátečníky představuje prostorovou výzvu: musíš vtěsnat 3 prsty na jediný 2. pražec!</p>
          <div class="card p-3 my-3 bg-surface-2 font-mono">
            <h4 class="text-accent font-bold mb-2">Prstoklad:</h4>
            <p class="mb-1"><strong>1. prst (ukazovák):</strong> 2. pražec na 4. struně (D)</p>
            <p class="mb-1"><strong>2. prst (prostředník):</strong> 2. pražec na 3. struně (G)</p>
            <p class="mb-1"><strong>3. prst (prsteník):</strong> 2. pražec na 2. struně (B)</p>
            <p class="mb-0 text-muted">Struna 5 (A) a struna 1 (e) znějí volně. 6. strunu nehrajeme.</p>
          </div>
        `
      },
      {
        title: 'Trik pro pohodlné umístění prstů',
        content: `
          <p>Místo toho, abys prsty tlačil přesně do jedné přímky, mírně natoč ruku a vytvoř kompaktní diagonální schůdek:</p>
          <ul class="lesson-list">
            <li>Prsteník je nejblíže kovovému pražci.</li>
            <li>Prostředník a ukazovák se seřadí těsně za něj.</li>
            <li>Dbej na to, aby prsteník nezatlumil tenkou strunu e!</li>
          </ul>
        `
      },
      {
        title: 'Odemkni legendární Stánky od Nedvědů!',
        content: `
          <p>Se spojením akordů <strong>D dur, G dur a A dur</strong> se ti odemyká největší česká táboráková hymna všech dob — <strong>Stánky</strong> od bratrů Nedvědů!</p>
        `
      }
    ],
    quiz: [
      {
        question: 'Které struny mačkáš na 2. pražci při akordu A dur?',
        options: ['Struny 4 (D), 3 (G) a 2 (B)', 'Struny 6, 5 a 4', 'Struny 3, 2 a 1', 'Pouze strunu 5'],
        correct: 0,
        explanation: 'Akord A dur mačká 3 struny vedle sebe na 2. pražci: D, G a B.'
      },
      {
        question: 'Která struna slouží jako základní basový tón pro akord A dur?',
        options: ['Prázdná 5. struna A', 'Prázdná 6. struna E', '3. pražec na struně D', '1. struna e'],
        correct: 0,
        explanation: 'Základním basovým tónem je otevřená 5. struna A.'
      },
      {
        question: 'Která slavná píseň bratří Nedvědů využívá akordy D, G a A?',
        options: ['Stánky', 'Severní vítr', 'Zombie', 'Kometa'],
        correct: 0,
        explanation: 'Stánky jsou složeny na geniální trojici akordů D, G a A.'
      },
      {
        question: 'Jak zabránit tomu, aby prsty netlumily volnou tenkou strunu e?',
        options: [
          'Zvednout dlaň a postavit prsty kolmo jako obloučky na bříška',
          'Hrát akord bez trsátka',
          'Přestat mačkat strunu B',
          'Naladit kytaru o tón níž'
        ],
        correct: 0,
        explanation: 'Správná klenba prstů kolmo k hmatníku dává spodní tenké struně prostor volně kmitat.'
      }
    ]
  },
  {
    id: 20,
    title: 'Třídobý takt (3/4) & Valčíkový doprovod',
    stage: 3,
    stageEmoji: '🍺',
    stageName: 'Hospoda',
    type: 'theory',
    typeLabel: 'Teorie & Praxe',
    description: 'BUM - cvak - cvak! Pronikni do kouzla třídobého rytmu a zahraj oblíbené balady a valčíky.',
    xpReward: 65,
    practiceWorkout: {
      title: 'Valčíkový trénink: Am – Dm – E – Am',
      chords: ['Am', 'Dm', 'E'],
      strummingPattern: 'waltz',
      bpm: 105,
      bars: 16
    },
    unlockedSongId: 18,
    steps: [
      {
        title: 'Rozdíl mezi 4/4 a 3/4 taktem',
        content: `
          <p class="lead">Doposud jsme hráli ve 4/4 taktu (počítání 1-2-3-4). V lidové hudbě, romancích a hospodských písních se však nesmírně často setkáš s <strong>třídobým taktem 3/4</strong>.</p>
          <div class="card p-3 my-3 bg-surface-2 text-center font-mono">
            <h3 class="text-accent font-bold text-2xl mb-1">RAZ — dva — tři, &nbsp; RAZ — dva — tři</h3>
            <p class="text-sm text-muted mb-0">Doba 1 je TĚŽKÁ (bas), doby 2 a 3 jsou LEHKÉ (doprovodné údery).</p>
          </div>
        `
      },
      {
        title: 'Valčíkový doprovod na kytaru',
        content: `
          <p>Klasický hospodský valčíkový rytmus na kytaru se hraje takto:</p>
          <ul class="lesson-list">
            <li><strong>1. doba (BUM):</strong> Brnkni samostatně základní basovou strunu akordu trsátkem dolů.</li>
            <li><strong>2. doba (cvak):</strong> Lehký úder dolů [↓] přes tenké struny 3, 2, 1.</li>
            <li><strong>3. doba (cvak):</strong> Druhý lehký úder dolů [↓] přes tenké struny.</li>
          </ul>
          <p class="mt-2">Výsledkem je houpavý, taneční rytmus, který okamžitě rozezpívá celou místnost!</p>
        `
      },
      {
        title: 'Píseň Kometa od Jaromíra Nohavici',
        content: `
          <p>Tento nádherný třídobý doprovod si ihned vyzkoušíš na jedné z nejkrásnějších českých písní — <strong>Kometa</strong> od Jaromíra Nohavici (akordy Am, Dm, E, C).</p>
        `
      }
    ],
    quiz: [
      {
        question: 'Kolik dob má jeden takt ve třídobém valčíkovém rytmu?',
        options: ['3 doby (Raz - dva - tři)', '4 doby', '2 doby', '6 dob'],
        correct: 0,
        explanation: 'Ve 3/4 taktu má každý takt přesně 3 čtvrťové doby.'
      },
      {
        question: 'Která doba je ve valčíkovém rytmu těžká a akcentovaná?',
        options: ['První doba (1)', 'Druhá doba (2)', 'Třetí doba (3)', 'Všechny doby jsou stejné'],
        correct: 0,
        explanation: 'První doba nese hlavní puls taktu – na kytaře se hraje zřetelný basový tón.'
      },
      {
        question: 'Jak se na kytaru hrají 2. a 3. doba ve valčíkovém doprovodu?',
        options: [
          'Lehkými údery dolů přes vyšší melodické struny',
          'Mlčením',
          'Úderem pěstí do lubu kytary',
          'Vytahováním struny o dva tóny'
        ],
        correct: 0,
        explanation: 'Doby 2 a 3 doplňují harmonii lehkým brnknutím přes tenčí struny.'
      },
      {
        question: 'Která slavná Nohavicova skladba je napsána v třídobém valčíkovém taktu?',
        options: ['Kometa', 'Zombie', 'Knockin on Heaven Door', 'Slavíci z Madridu'],
        correct: 0,
        explanation: 'Píseň Kometa je legendární česká balada ve 3/4 valčíkovém tempu.'
      }
    ]
  },
  {
    id: 21,
    title: 'Kapodastr – Tajná zbraň kytaristy',
    stage: 3,
    stageEmoji: '🍺',
    stageName: 'Hospoda',
    type: 'theory',
    typeLabel: 'Teorie',
    description: 'Zjisti, jak kapodastr funguje, jak snadno změnit tóninu pro svůj hlas a hrát těžké písně jednoduchými akordy.',
    xpReward: 60,
    unlockedSongId: 20,
    steps: [
      {
        title: 'Co je kapodastr (Capo)?',
        content: `
          <p class="lead"><strong>Kapodastr (Capo)</strong> je pružinová nebo šroubovací svorka s gumovým profilem, kterou nasadíš na libovolný pražec hmatníku.</p>
          <p>Kapodastr funguje jako <em>přemístitelný nultý pražec</em>. Zkracuje znějící délku všech šesti strun současně a zvyšuje jejich ladění přesně o tolik půltónů, na který pražec ho nasadíš.</p>
          <div class="card p-3 my-3 bg-surface-2 border-accent">
            <h4 class="text-accent font-bold mb-1">Proč ho každý kytarista miluje:</h4>
            <p class="mb-0">Můžeš hrát své oblíbené otevřené tvary akordů (C, G, D, Em, Am), ale píseň bude znít v úplně jiné tónině, která přesně sedí tvému zpěvu!</p>
          </div>
        `
      },
      {
        title: 'Praktický příklad transpozice',
        content: `
          <p>Představ si, že chceš hrát v tónině <strong>G# dur (As dur)</strong>. Bez kapodastru bys musel hrát těžké barré akordy. S kapodastrem:</p>
          <ul class="lesson-list">
            <li>Nasadíš kapodastr na <strong>1. pražec</strong>.</li>
            <li>Zahraješ prsty obyčejný tvar <strong>G dur</strong>.</li>
            <li>Výsledný znějící akord je <strong>G# dur</strong>! Zvuk je jasný, plný a zvonivý.</li>
          </ul>
        `
      },
      {
        title: 'Kam správně kapodastr umístit',
        content: `
          <p>Kapodastr vždy nasazuj <strong>těsně za kovový pražec</strong> (cca 2–3 mm za něj), nikoliv doprostřed pole. Předejdeš tím rozladění strun a drnčení.</p>
        `
      }
    ],
    quiz: [
      {
        question: 'K čemu slouží kapodastr na kytaře?',
        options: [
          'Zvyšuje ladění strun a umožňuje hrát v jiné tónině se známými hmaty',
          'Slouží k trvalému ztišení kytary',
          'Vyměňuje staré struny za nové',
          'Používá se pouze jako držák trsátka'
        ],
        correct: 0,
        explanation: 'Kapodastr posouvá nultý pražec výš, čímž zvyšuje ladění strun bez nutnosti měnit prstoklady.'
      },
      {
        question: 'Když nasadíš kapodastr na 2. pražec a zahraješ tvar akordu C dur, jaký akord skutečně zazní?',
        options: ['Akord D dur (o 2 půltóny výše)', 'Akord E dur', 'Akord H dur', 'Stále akord C dur'],
        correct: 0,
        explanation: '2. pražec znamená posun o 2 půltóny (1 celý tón). Z tvaru C se stane znějící akord D dur.'
      },
      {
        question: 'Kam přesně za pražec je nejlepší kapodastr nasadit pro čisté ladění?',
        options: ['Těsně za kovový pražec (cca 2-3 mm)', 'Doprostřed pražcového pole', 'Přímo na kovový pražec shora', 'Až k hlavičce kytary'],
        correct: 0,
        explanation: 'Těsně za kovovým pražcem struny nejméně trpí přeladěním a zní nejčistěji.'
      },
      {
        question: 'Mění kapodastr názvy prstokladů, které držíš v levé ruce?',
        options: [
          'V praxi prstoklady nazýváme stále stejně podle jejich tvarů (např. „tvar G s kapodastrem na 2.“)',
          'Ano, musíš se naučit zcela nové hmaty',
          'Kapodastr prstoklady úplně zakazuje',
          'Pouze u elektrických kytar'
        ],
        correct: 0,
        explanation: 'Obrovská výhoda kapodastru je právě v tom, že používáš známé tvary akordů relativně k pozici svorky.'
      }
    ]
  },
  {
    id: 22,
    title: 'Střídavý bas (Bass-Strum doprovod)',
    stage: 3,
    stageEmoji: '🍺',
    stageName: 'Hospoda',
    type: 'exercise',
    typeLabel: 'Praxe',
    description: 'Zvládni techniku střídavého basu — základní kámen country, trampské hudby a amerického folku.',
    xpReward: 75,
    practiceWorkout: {
      title: 'Střídavý bas: G – C – D',
      chords: ['G', 'C', 'D'],
      strummingPattern: 'folk',
      bpm: 90,
      bars: 16
    },
    unlockedSongId: 17,
    steps: [
      {
        title: 'Princip techniky Bass-Strum',
        content: `
          <p class="lead">Místo toho, abys přes všech 6 strun hrál stále stejný úder dolů, začneš rozlišovat basovou linku a akordový doprovod.</p>
          <p>Tato technika se nazývá <strong>Bass-Strum (Úder basu a akordu)</strong>:</p>
          <ul class="lesson-list">
            <li><strong>1. doba:</strong> Zahraj pouze <em>hlavní basový tón</em> (např. 6. struna u G dur).</li>
            <li><strong>2. doba:</strong> Zahraj úder dolů-nahoru přes tenké struny.</li>
            <li><strong>3. doba:</strong> Zahraj <em>střídavý basový tón</em> (např. 4. struna D).</li>
            <li><strong>4. doba:</strong> Opět úder dolů-nahoru přes tenké struny.</li>
          </ul>
        `
      },
      {
        title: 'Basové tóny pro klíčové akordy',
        content: `
          <div class="card p-3 my-3 bg-surface-2 font-mono">
            <p class="mb-1"><strong>Akord G:</strong> 1. bas = 6. struna (G) &bull; 2. bas = 4. struna (D)</p>
            <p class="mb-1"><strong>Akord C:</strong> 1. bas = 5. struna (C) &bull; 2. bas = 4. struna (E)</p>
            <p class="mb-0"><strong>Akord D:</strong> 1. bas = 4. struna (D) &bull; 2. bas = 5. struna (A)</p>
          </div>
          <p class="mt-2">Kytara tak zní jako dva nástroje v jednom — kontrabas i doprovodná kytara současně!</p>
        `
      },
      {
        title: 'Píseň Tisíc mil za odměnu',
        content: `
          <p>S touto technikou si odemkneš legendární country baladu <strong>Tisíc mil</strong> od Waldemara Matušky!</p>
        `
      }
    ],
    quiz: [
      {
        question: 'V čem spočívá technika střídavého basu na kytaru?',
        options: [
          'Střídá se úder na basovou strunu s doprovodným úderem přes tenké struny',
          'Hraje se pouze na basovou kytaru',
          'Všechny struny se hrají současně palcem',
          'Hraje se bez držení pražců'
        ],
        correct: 0,
        explanation: 'Střídavý bas odděluje melodii basových strun od rytmického doprovodu tenkých strun.'
      },
      {
        question: 'Které struny střídáš jako basy u akordu C dur?',
        options: ['5. strunu (C) a 4. strunu (E)', '6. strunu a 1. strunu', 'Pouze 2. strunu', 'Struny se nestřídají'],
        correct: 0,
        explanation: 'U C dur je primární bas na 5. struně a sekundární střídavý bas na 4. struně.'
      },
      {
        question: 'Pro které hudební žánry je střídavý bas typický?',
        options: ['Country, bluegrass, trampská píseň a folk', 'Heavy metal a grindcore', 'Techno a house', 'Klasická barokní fuga'],
        correct: 0,
        explanation: 'Střídavý bas (tzv. boom-chick) je naprostou esencí country, folku a trampské hudby.'
      },
      {
        question: 'Která slavná píseň Waldemara Matušky stojí na střídavém basu v tónině G dur?',
        options: ['Tisíc mil', 'Let It Be', 'Zombie', 'Hallelujah'],
        correct: 0,
        explanation: 'Tisíc mil je nejznámější česká country skladba s klasickým střídavým basem.'
      }
    ]
  },
  {
    id: 23,
    title: 'Dominantní septakord H7 (B7)',
    stage: 3,
    stageEmoji: '🍺',
    stageName: 'Hospoda',
    type: 'exercise',
    typeLabel: 'Praxe',
    description: 'Čtyřprstý mistrovský hmat, který dodá tvým písničkám napětí a šmrnc country i blues.',
    xpReward: 75,
    practiceWorkout: {
      title: 'Kolečko s akordem H7: Em – Am – H7 – Em',
      chords: ['Em', 'Am', 'H7'],
      strummingPattern: 'camp',
      bpm: 85,
      bars: 16
    },
    unlockedSongId: 19,
    steps: [
      {
        title: 'Seznam se s akordem H7 (B7)',
        content: `
          <p class="lead">Akord H7 (v anglosaském značení B7) je jedním z nejzajímavějších otevřených akordů. Využívá všechny čtyři prsty levé ruky a vytváří silné harmonické napětí, které si říká o vyřešení do akordu E moll nebo E dur.</p>
          <div class="card p-3 my-3 bg-surface-2 font-mono">
            <h4 class="text-accent font-bold mb-2">Prstoklad:</h4>
            <p class="mb-1"><strong>2. prst (prostředník):</strong> 2. pražec na 5. struně (A) – tón H</p>
            <p class="mb-1"><strong>1. prst (ukazovák):</strong> 1. pražec na 4. struně (D) – tón D#</p>
            <p class="mb-1"><strong>3. prst (prsteník):</strong> 2. pražec na 3. struně (G) – tón A</p>
            <p class="mb-1"><strong>4. prst (malíček):</strong> 2. pražec na 1. struně (e) – tón F#</p>
            <p class="mb-0 text-muted">Struna 2 (B) zní prázdná! Struna 6 (E) se nehraje.</p>
          </div>
        `
      },
      {
        title: 'Tajemství volné 2. struny',
        content: `
          <p>Nejčastější chybou u H7 je, že prsteník na 3. struně lehne a zatlumí volnou 2. strunu. Postav prsteník a malíček hezky na špičky jako baletky!</p>
        `
      },
      {
        title: 'Odemkni Jarošovský pivovar!',
        content: `
          <p>S akordem H7 a zvládnutým hospodským doprovodem se ti odemyká rocková pivovarská hymna — <strong>Jarošovský pivovar</strong> od skupiny Argema!</p>
        `
      }
    ],
    quiz: [
      {
        question: 'Kolik prstů levé ruky aktivně mačká pražce při akordu H7?',
        options: ['Všechny 4 prsty', 'Pouze 2 prsty', '3 prsty', '1 prst'],
        correct: 0,
        explanation: 'Akord H7 zapojuje všechny 4 prsty: ukazovák, prostředník, prsteník i malíček.'
      },
      {
        question: 'Která struna zní u akordu H7 volně (otevřená bez stisknutého pražce)?',
        options: ['2. struna (B)', '5. struna (A)', '1. struna (e)', '4. struna (D)'],
        correct: 0,
        explanation: '2. struna B zní uprostřed akordu prázdná a nesmí být zatlumena okolními prsty.'
      },
      {
        question: 'Do kterého akordu se akord H7 nejčastěji přirozeně rozvádí?',
        options: ['Do akordu E moll nebo E dur', 'Do akordu F dur', 'Do akordu B dur', 'Do žádného'],
        correct: 0,
        explanation: 'H7 je dominantou tóniny E – vytváří napětí, které se krásně usadí v Em nebo E.'
      },
      {
        question: 'Která česká hospodská hymna skupiny Argema využívá akord H7?',
        options: ['Jarošovský pivovar', 'Bedna od vodky', 'Stánky', 'Slavíci z Madridu'],
        correct: 0,
        explanation: 'Jarošovský pivovar od Argemy je slavná píseň postavená na energickém akordu H7.'
      }
    ]
  },
  {
    id: 24,
    title: 'Hospodský jam: Píseň Bedna od vodky',
    stage: 3,
    stageEmoji: '🍺',
    stageName: 'Hospoda',
    type: 'exercise',
    typeLabel: 'Praxe',
    description: 'Velké finále 3. etapy! Spoj všechny zvládnuté akordy a rytmy v legendární hospodské hymně.',
    xpReward: 120,
    practiceWorkout: {
      title: 'Bedna od vodky: C – F – G – Am',
      chords: ['C', 'F', 'G', 'Am'],
      strummingPattern: 'camp',
      bpm: 115,
      bars: 20
    },
    unlockedSongId: 2,
    steps: [
      {
        title: 'Gratulujeme k dosažení finále Hospody!',
        content: `
          <p class="lead">Prošel jsi celou 3. etapou — znáš tóny na hmatníku, akordy Dm, A dur, H7, střídavý bas i třídobý valčík.</p>
          <p>Nyní tě čeká absolutní vrchol hospodského repertoáru: <strong>Bedna od vodky</strong> od Mikiho Ryvoly. Tato píseň prověřuje tvůj rytmický tah, čistotu akordů C, F (jednoduchý čtyřprstý tvar), G a Am ve svižném tempu.</p>
        `
      },
      {
        title: 'Zjednodušený akord F dur (Fmaj7 / mini-F)',
        content: `
          <p>Pokud ještě neovládáš plné barré F dur, použij osvědčený hospodský hmat:</p>
          <ul class="lesson-list font-mono">
            <li>1. prst: 1. pražec na 2. struně (B)</li>
            <li>2. prst: 2. pražec na 3. struně (G)</li>
            <li>3. prst: 3. pražec na 4. struně (D)</li>
          </ul>
          <p class="mt-2">Hraj pouze spodní 4 struny (struna D, G, B, e). Zní skvěle a přechod z C dur je bleskový!</p>
        `
      },
      {
        title: 'Získej titul Muzikant a postup do Klubu!',
        content: `
          <p>Dokončením této lekce úspěšně završíš 3. etapu, získáš odznak <strong>Hospodský bard</strong> a otevírá se před tebou 4. etapa: <strong>Klub</strong>!</p>
        `
      }
    ],
    quiz: [
      {
        question: 'Kdo je autorem legendární písně Bedna od vodky?',
        options: ['Miki Ryvola', 'Jan Nedvěd', 'Karel Kryl', 'Jaromír Nohavica'],
        correct: 0,
        explanation: 'Bednu od vodky napsal v roce 1968 legendární trampský písničkář Miki Ryvola.'
      },
      {
        question: 'Které akordy tvoří základní sloku písně Bedna od vodky?',
        options: ['C, F, G, Am', 'Pouze akord D', 'E, H, F#', 'Em, D, C, H7'],
        correct: 0,
        explanation: 'Sloka je postavena na známé chytlavé progresi C - F - G - Am.'
      },
      {
        question: 'Co je největší výzvou při hraní svižné hospodské písně před publikem?',
        options: [
          'Udržet stabilní tempo a nezrychlovat ani nezpomalovat při přechodech akordů',
          'Hrát co nejtišeji',
          'Zavřít oči a nedívat se na kytaru',
          'Měnit prsty na každou dobu'
        ],
        correct: 0,
        explanation: 'Udržet stálý rytmus a jistotu přechodů je klíčem k tomu, aby publikum mohlo zpívat.'
      },
      {
        question: 'Kterou novou etapu v Melodriu odemykáš po dokončení lekce 24?',
        options: ['4. Fáze: Klub (rock, blues a sóla)', 'Žádnou, hra končí', 'Zpět do Garáže', 'Olymp'],
        correct: 0,
        explanation: 'Po Hospodě vstupuješ do 4. fáze: Klub, kde tě čeká rock, power akordy a blues!'
      }
    ]
  }
];