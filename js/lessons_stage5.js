window.STAGE5_LESSONS = [
  {
    id: 33,
    title: 'Anatomie barré akordů: E-tvar a A-tvar',
    stage: 5,
    stageEmoji: '🎭',
    stageName: 'Koncertní sál',
    type: 'theory',
    typeLabel: 'Teorie',
    description: 'Pochop geniální systém posuvných barré hmatů — jak z otevřeného E a A vytvořit všech 12 tónin po celém hmatníku.',
    xpReward: 90,
    steps: [
      {
        title: 'Vítej v Koncertním sále — 5. etapě kytarového mistrovství!',
        content: `
          <p class="lead">Vítej v Koncertním sále! Tady se oddělují příležitostní hráči od skutečných kytarových virtuózů. Vstupujeme do světa barré akordů, citlivého vybrnkávání a pokročilé harmonie.</p>
          <p><strong>Barré akord (Barre chord)</strong> je technika, kdy natažený ukazováček levé ruky přitiskne více strun (nebo všech 6 strun) současně přes jeden pražec. Tvůj ukazováček se tak stává <em>živým kapodastrem</em>!</p>
          <div class="card p-3 my-3 bg-surface-2 border-accent">
            <h4 class="text-accent font-bold mb-1">Geniální objev: CAGED systém a E-tvar</h4>
            <p class="mb-0">Vzpomeň si na otevřený akord <strong>E dur</strong>. Když přehodíš prsty (prostředník, prsteník a malíček zaujmou tvar E dur) a ukazováčkem položíš barré přes 1. pražec, vznikne akord <strong>F dur</strong>! Posuneš na 3. pražec = <strong>G dur</strong>. Posuneš na 5. pražec = <strong>A dur</strong>. Jeden tvar hraje cokoliv!</p>
          </div>
        `
      },
      {
        title: 'Dva pilíře: E-tvar a A-tvar',
        content: `
          <ul class="lesson-list font-mono">
            <li><strong>Barré z tvaru E (bas na 6. struně):</strong> Základní tón leží pod ukazováčkem na 6. struně E. 1. pražec = F, 3. pražec = G, 5. pražec = A, 7. pražec = H (B).</li>
            <li><strong>Barré z tvaru A (bas na 5. struně):</strong> Ukazovák na 5. struně, ostatní prsty drží tvar A dur. 2. pražec = H dur, 3. pražec = C dur, 5. pražec = D dur!</li>
          </ul>
        `
      }
    ],
    quiz: [
      {
        question: 'Co dělá ukazováček levé ruky při hraní barré akordu?',
        options: [
          'Leží naplocho přes více strun a funguje jako pohyblivý kapodastr',
          'Tiskne pouze jednu strunu špičkou',
          'Nehraje vůbec',
          'Bubnuje do hmatníku'
        ],
        correct: 0,
        explanation: 'Ukazovák tiskne celou šířku hmatníku a nahrazuje nultý pražec na zvolené pozici.'
      },
      {
        question: 'Který otevřený akord slouží jako předloha pro 6strunné durové barré s basem na 6. struně?',
        options: ['Akord E dur', 'Akord C dur', 'Akord D dur', 'Akord G dur'],
        correct: 0,
        explanation: 'Barré tvar na 6. struně vychází přímo z posunutého tvaru akordu E dur.'
      },
      {
        question: 'Kde leží základní basový tón pro barré odvozené z tvaru akordu A dur?',
        options: ['Na 5. struně (A)', 'Na 1. struně (e)', 'Na 6. struně (E)', 'Akord nemá bas'],
        correct: 0,
        explanation: 'U A-tvaru leží tónika přímo na 5. struně pod ukazováčkem.'
      },
      {
        question: 'Jaký akord vznikne, když vezmeš tvar E dur a posuneš ho s barré na 3. pražec?',
        options: ['Akord G dur', 'Akord F dur', 'Akord C dur', 'Akord D dur'],
        correct: 0,
        explanation: 'Na 3. pražci 6. struny leží tón G, takže posunutý E-tvar vytvoří plný barré akord G dur.'
      }
    ]
  },
  {
    id: 34,
    title: 'Zvládnutí F dur bez bolesti',
    stage: 5,
    stageEmoji: '🎭',
    stageName: 'Koncertní sál',
    type: 'exercise',
    typeLabel: 'Praxe',
    description: 'Pokoř největšího strašáka kytaristů! Metodika nácviku F dur od zjednodušených tvarů po plné zvonivé barré.',
    xpReward: 100,
    practiceWorkout: {
      title: 'Přechody s F dur: C – F – G – C',
      chords: ['C', 'F', 'G'],
      strummingPattern: 'camp',
      bpm: 85,
      bars: 16
    },
    unlockedSongId: 13,
    steps: [
      {
        title: 'Mýtus o síle prstů',
        content: `
          <p class="lead">Akord F dur je okamžik, kde 50 % začátečníků bez dobrého vedení vzdá kytaru. Mají pocit, že na to nemají dost silné prsty. Pravda je však jiná: <strong>F dur není o síle stisku, ale o páce paže a úhlu ukazováku!</strong></p>
          <div class="card p-3 my-3 bg-surface-2 border-accent">
            <h4 class="text-accent font-bold mb-1">Tajemství boční hrany:</h4>
            <p class="mb-0">Nikdy netlač ukazováčkem měkkým bříškem naplocho! Mírně ukazovák natoč na jeho <strong>kostnatější vnější boční hranu</strong> směrem k hlavičce. Kost zmáčkne struny s minimální námahou!</p>
          </div>
        `
      },
      {
        title: 'Váha paže (Gravity technique)',
        content: `
          <p>Místo křečovitého stlačování palce a ukazováku proti sobě jako kleště nechej <strong>celou paži lehce klesnout tíhou gravitace</strong> směrem dolů a dozadu k tělu kytary. Palec zezadu krku slouží pouze jako opora, nikoliv lis!</p>
        `
      },
      {
        title: 'Odemkni hit Riptide od Vance Joye!',
        content: `
          <p>Se zvládnutým akordem F dur se ti otevírají tisíce moderních písní včetně celosvětového megahitu <strong>Riptide</strong> (Am - G - C - F)!</p>
        `
      }
    ],
    quiz: [
      {
        question: 'Kterou částí ukazováku je nejefektivnější přitlačovat struny při barré F dur?',
        options: [
          'Mírně natočenou boční kostnatou hranou prstu',
          'Měkkým plochým středem bříška',
          'Špičkou nehtu',
          'Kloubem u dlaně'
        ],
        correct: 0,
        explanation: 'Kostnatější boční hrana prstu nepohlcuje energii a čistě domáčkne struny bez námahy.'
      },
      {
        question: 'Odkud by měla vycházet hlavní síla pro přitlačení barré akordu?',
        options: [
          'Z přirozené váhy paže a ramene opřené dozadu k tělu kytary',
          'Z křečovitého stisku palce proti ukazováku',
          'Ze zaťatých zubů',
          'Z kmitání nohou'
        ],
        correct: 0,
        explanation: 'Využití páky celé paže šetří svaly dlaně a předchází křečím v ruce.'
      },
      {
        question: 'Která světoznámá indie-popová píseň Vance Joye stojí na akordech Am, G, C a F?',
        options: ['Riptide', 'Stánky', 'Zombie', 'Kometa'],
        correct: 0,
        explanation: 'Riptide je celosvětový hit postavený na chytlavém střídání akordů Am, G, C a F.'
      },
      {
        question: 'Co dělat, když při F dur drnčí 2. struna (B)?',
        options: [
          'Mírně posunout ukazováček o 1-2 mm nahoru nebo dolů, aby záhyb kloubu nevyšel přesně na strunu',
          'Koupit novou kytaru',
          'Udeřit do struny vší silou',
          'Přestat hrát'
        ],
        correct: 0,
        explanation: 'Každá ruka má jinou délku článků prstů – jemné vertikální doladění polohy kloubu vyřeší drnčení.'
      }
    ]
  },
  {
    id: 35,
    title: 'Mollové barré: H moll (Bm) a F#m',
    stage: 5,
    stageEmoji: '🎭',
    stageName: 'Koncertní sál',
    type: 'exercise',
    typeLabel: 'Praxe',
    description: 'Dva nezbytné mollové barré akordy pro popové, rockové i filmové hity od Beatles po Eda Sheerana.',
    xpReward: 100,
    practiceWorkout: {
      title: 'Balada v D dur: D – A – Bm – G',
      chords: ['D', 'A', 'Bm', 'G'],
      strummingPattern: 'ballad',
      bpm: 75,
      bars: 16
    },
    unlockedSongId: 6,
    steps: [
      {
        title: 'Akord H moll (Bm) — posunutý tvar A moll',
        content: `
          <p class="lead">Akord H moll (anglicky B minor / Bm) je králem filmové hudby a popových dojáků. Je to 5strunné barré odvozené z otevřeného tvaru <strong>A moll</strong>.</p>
          <div class="card p-3 my-3 bg-surface-2 font-mono">
            <h4 class="text-accent font-bold mb-2">Prstoklad Bm na 2. pražci:</h4>
            <p class="mb-1"><strong>Ukazovák (barré):</strong> 2. pražec přes struny 5 až 1 (basový tón H na 5. struně)</p>
            <p class="mb-1"><strong>Prostředník:</strong> 3. pražec na 2. struně (B) – tón D</p>
            <p class="mb-1"><strong>Prsteník:</strong> 4. pražec na 4. struně (D) – tón F#</p>
            <p class="mb-1"><strong>Malíček:</strong> 4. pražec na 3. struně (G) – tón H</p>
            <p class="mb-0 text-muted">6. strunu tlumíme špičkou ukazováku.</p>
          </div>
        `
      },
      {
        title: 'Akord F#m — mollový bratr F dur',
        content: `
          <p>Akord <strong>F#m (Fis moll)</strong> se hraje na 2. pražci přes všech 6 strun. Stačí vzít tvar F dur a <strong>zvednout prostředník</strong> ze 3. struny! Zvuk je hluboký, vznešený a emotivní.</p>
        `
      },
      {
        title: 'Odemkni nesmrtelnou Let It Be od The Beatles!',
        content: `
          <p>Se znalostí těchto barré akordů si odemykáš jeden z nejdojemnějších klenotů v historii hudby — <strong>Let It Be</strong> od The Beatles!</p>
        `
      }
    ],
    quiz: [
      {
        question: 'Ze kterého otevřeného akordu je odvozen prstoklad akordu H moll (Bm)?',
        options: ['Z otevřeného akordu A moll (Am)', 'Z akordu C dur', 'Z akordu E dur', 'Z akordu G dur'],
        correct: 0,
        explanation: 'Akord Bm je tvar Am posunutý s barré ukazováku na 2. pražec.'
      },
      {
        question: 'Jak vytvoříš akord F#m z plného barré akordu F# dur?',
        options: [
          'Zvedneš prostředník ze 3. struny (čímž se velká tercie změní na malou tercii)',
          'Zvedneš ukazovák',
          'Posuneš celou ruku o 5 pražců',
          'Přidáš další dva prsty'
        ],
        correct: 0,
        explanation: 'Zvednutím prostředníku klesne tón o půltón na tóninu mollové tercie.'
      },
      {
        question: 'Která světoznámá píseň skupiny The Beatles využívá tyto nádherné akordové barvy?',
        options: ['Let It Be', 'Zombie', 'Kometa', 'Sweet Home Alabama'],
        correct: 0,
        explanation: 'Let It Be od Paula McCartneyho je harmonickým mistrovským dílem.'
      },
      {
        question: 'Která basová struna se při hraní akordu Bm nehraje (je zatlumena)?',
        options: ['6. struna (nejtlustší E)', '1. struna (tenké e)', '3. struna (G)', '5. struna (A)'],
        correct: 0,
        explanation: 'Základní bas leží na 5. struně A (2. pražec). 6. struna E se nehraje.'
      }
    ]
  },
  {
    id: 36,
    title: 'Stavba akordů: Durová stupnice & tercie',
    stage: 5,
    stageEmoji: '🎭',
    stageName: 'Koncertní sál',
    type: 'theory',
    typeLabel: 'Teorie',
    description: 'Nahlédni pod kapotu hudby! Pochop vzorce 1-3-5, rozdíl mezi velkou a malou tercií a stavbu čtyřzvuků.',
    xpReward: 95,
    steps: [
      {
        title: 'Durová stupnice: Matka veškeré harmonie',
        content: `
          <p class="lead">Jak to, že z tónů vznikají akordy? Vše se odvíjí od <strong>durové stupnice</strong> (v tónině C: C - D - E - F - G - A - H - C).</p>
          <p>Každý tón má své číslo stupně (interval):</p>
          <div class="card p-3 my-3 bg-surface-2 font-mono text-center">
            <p class="text-white font-bold mb-0">1 (Prima) &bull; 2 (Sekunda) &bull; 3 (Tercie) &bull; 4 (Kvarta) &bull; 5 (Kvinta) &bull; 6 (Sexta) &bull; 7 (Septima) &bull; 8 (Oktáva)</p>
          </div>
        `
      },
      {
        title: 'Vzorec pro durový a mollový kvintakord',
        content: `
          <ul class="lesson-list font-mono">
            <li><strong>Durový akord (Trojzvuk):</strong> 1 + 3 + 5 (Základní tón + <em>Velká tercie</em> [4 půltóny] + Čistá kvinta [7 půltónů]). Např. C dur = C - E - G.</li>
            <li><strong>Mollový akord:</strong> 1 + b3 + 5 (Základní tón + <em>Malá tercie</em> [3 půltóny] + Čistá kvinta). Např. C moll = C - Eb - G.</li>
          </ul>
          <p class="mt-2">Jediný půltón na 3. stupni rozhoduje o tom, zda skladba zní zářivě a optimisticky (dur), nebo smutně a zamyšleně (moll)!</p>
        `
      }
    ],
    quiz: [
      {
        question: 'Které stupně durové stupnice tvoří základní durový trojzvuk?',
        options: ['1. stupeň, 3. stupeň a 5. stupeň (1 - 3 - 5)', '1, 2 a 3', 'Všechny liché stupně', '1 a 7'],
        correct: 0,
        explanation: 'Základní akord tvoří základní tón (prima), tercie a kvinta (1 - 3 - 5).'
      },
      {
        question: 'Jaký je rozdíl ve vzdálenosti mezi velkou a malou tercií od základního tónu?',
        options: [
          'Velká tercie má 4 půltóny (2 celé tóny), malá tercie má 3 půltóny',
          'Obě jsou stejně velké',
          'Malá tercie má 12 půltónů',
          'Velká tercie je tichá'
        ],
        correct: 0,
        explanation: 'Malá tercie je o jeden půltón (1 pražec na kytaře) kratší než velká tercie.'
      },
      {
        question: 'Z kterých konkrétních tří tónů se skládá akord C dur?',
        options: ['C, E, G', 'C, D, E', 'C, F, G', 'C, Es, G'],
        correct: 0,
        explanation: 'V tónině C je 1 = C, 3 = E a 5 = G. Akord C dur tvoří tóny C - E - G.'
      },
      {
        question: 'Který tón v akordu určuje, zda bude akord durový nebo mollový?',
        options: ['Tercie (3. stupeň)', 'Kvinta', 'Základní tón', 'Oktáva'],
        correct: 0,
        explanation: 'Právě tercie svým půltónovým posunem definuje radostnou (dur) či smutnou (moll) náladu.'
      }
    ]
  },
  {
    id: 37,
    title: 'Fingerpicking (P-I-M-A) & Arpeggia',
    stage: 5,
    stageEmoji: '🎭',
    stageName: 'Koncertní sál',
    type: 'exercise',
    typeLabel: 'Praxe',
    description: 'Odlož trsátko a nech promluvit prsty! Klasické španělské značení P-I-M-A a plynulý rozklad akordů.',
    xpReward: 105,
    practiceWorkout: {
      title: 'Arpeggio v 6/8 taktu: Am – C – D – F',
      chords: ['Am', 'C', 'D', 'F'],
      strummingPattern: 'ballad',
      bpm: 78,
      bars: 16
    },
    unlockedSongId: 11,
    steps: [
      {
        title: 'Anatomie hry prsty: P - I - M - A',
        content: `
          <p class="lead">Hra prsty (Fingerstyle / Fingerpicking) dává kytaristovi intimní, bohatý a vícehlasý zvuk. Ve světové kytarové literatuře se prsty pravé ruky označují podle španělských názvů:</p>
          <div class="card p-3 my-3 bg-surface-2 font-mono">
            <p class="mb-1"><strong>P (Pulgar - Palec):</strong> Stará se o basové struny 6 (E), 5 (A) a 4 (D).</p>
            <p class="mb-1"><strong>I (Índice - Ukazovák):</strong> Hraje strunu 3 (G).</p>
            <p class="mb-1"><strong>M (Medio - Prostředník):</strong> Hraje strunu 2 (B).</p>
            <p class="mb-0"><strong>A (Anular - Prsteník):</strong> Hraje strunu 1 (tenké e).</p>
          </div>
        `
      },
      {
        title: 'Co je to Arpeggio (Rozklad akordu)?',
        content: `
          <p>Místo toho, abys udeřil do všech strun najednou, zahraješ tóny akordu <strong>postupně za sebou jako perly na šňůrce</strong>. Každý tón necháš znít a doznívat!</p>
        `
      },
      {
        title: 'Odemkni House of the Rising Sun!',
        content: `
          <p>Nejslavnější arpeggio v historii rocku tě čeká v nesmrtelné baladě <strong>House of the Rising Sun</strong> od skupiny The Animals (Am - C - D - F - E)!</p>
        `
      }
    ],
    quiz: [
      {
        question: 'Který prst pravé ruky se podle značení P-I-M-A stará o basové struny (6, 5, 4)?',
        options: ['Palec (P - Pulgar)', 'Ukazovák (I)', 'Prsteník (A)', 'Malíček'],
        correct: 0,
        explanation: 'Palec P má na starosti basové struny 6, 5 a 4 a hraje údery směrem dolů.'
      },
      {
        question: 'Co znamená hudební termín „Arpeggio“?',
        options: [
          'Rozklad akordu — tóny akordu se hrají postupně jeden po druhém a nechávají se znít',
          'Silný úder do ozvučné desky',
          'Vypnutí zvuku',
          'Zpěv bez doprovodu'
        ],
        correct: 0,
        explanation: 'Arpeggio (z italského arpeggiare = hrát jako na harfu) je postupné rozkládání tónů akordu.'
      },
      {
        question: 'Které struny mají přiřazeny prsty I, M a A?',
        options: [
          'I = 3. struna (G), M = 2. struna (B), A = 1. struna (e)',
          'Všechny hrají 6. strunu',
          'I = palec, M = malík, A = zápěstí',
          'Hrají náhodně'
        ],
        correct: 0,
        explanation: 'Ukazovák, prostředník a prsteník obsluhují tři melodické tenké struny.'
      },
      {
        question: 'Která legendární skladba kapely The Animals je celosvětovým symbolem 6strunného arpeggia?',
        options: ['House of the Rising Sun', 'Zombie', 'Wonderwall', 'Stánky'],
        correct: 0,
        explanation: 'House of the Rising Sun má nejslavnější kytarový rozklad akordů všech dob.'
      }
    ]
  },
  {
    id: 38,
    title: 'Travis Picking – Nezávislý basový palec',
    stage: 5,
    stageEmoji: '🎭',
    stageName: 'Koncertní sál',
    type: 'exercise',
    typeLabel: 'Praxe',
    description: 'Vrchol folkového prstokladu pojmenovaný po Merle Travisovi — stálý tepající bas a melodické synkopy.',
    xpReward: 110,
    practiceWorkout: {
      title: 'Travis Picking: C – Am – Em – G',
      chords: ['C', 'Am', 'Em', 'G'],
      strummingPattern: 'folk',
      bpm: 82,
      bars: 16
    },
    unlockedSongId: 12,
    steps: [
      {
        title: 'Kouzlo nezávislého palce (Alternating Thumb)',
        content: `
          <p class="lead"><strong>Travis Picking</strong> (pojmenovaný po legendárním kytaristovi Merle Travisovi) je technika, která promění kytaru v celý orchestr.</p>
          <p>Tajemství spočívá v <strong>naprosté nezávislosti palce pravé ruky</strong>:</p>
          <ul class="lesson-list">
            <li>Palec neúnavně tepe čtvrťové doby (1 - 2 - 3 - 4) a střídá dvě basové struny jako hodiny.</li>
            <li>Zatímco palec drží bas, ukazováček a prostředník vybrnkávají melodii a synkopy na osminové mezidoby!</li>
          </ul>
        `
      },
      {
        title: 'Píseň Wish You Were Here od Pink Floyd za odměnu!',
        content: `
          <p>Zvládnutím této techniky si odemkneš jednu z nejdojemnějších skladeb 20. století — <strong>Wish You Were Here</strong> od Pink Floyd!</p>
        `
      }
    ],
    quiz: [
      {
        question: 'Co je základním rysem techniky Travis Picking?',
        options: [
          'Palec pravé ruky hraje pravidelný střídavý bas, zatímco prsty nezávisle doplňují melodii',
          'Hraje se pouze trsátkem z kosti',
          'Všechny struny se mačkají pouze palcem levé ruky',
          'Kytara se ladí do otevřeného D'
        ],
        correct: 0,
        explanation: 'Nezávislost tepajícího basového palce a melodických prstů vytváří iluzi dvou hrajících kytar.'
      },
      {
        question: 'Po kom je technika Travis Picking pojmenována?',
        options: ['Po americkém kytaristovi Merle Travisovi', 'Po Travisi Barkerovi z Blink-182', 'Po městě Travis v Texasu', 'Po starém druhu dřeva'],
        correct: 0,
        explanation: 'Merle Travis byl legendární country kytarista, který tento styl dovedl k dokonalosti.'
      },
      {
        question: 'Který světoznámý hit skupiny Pink Floyd těží z folkové kytarové akustické hry?',
        options: ['Wish You Were Here', 'Zombie', 'Bad Moon Rising', 'Jarošovský pivovar'],
        correct: 0,
        explanation: 'Wish You Were Here Davida Gilmoura je akustickým etalonem pro každého kytaristu.'
      },
      {
        question: 'Jak trénovat nezávislost palce při Travis Pickingu?',
        options: [
          'Nejprve trénovat pouze samotný basový pohyb palce do zautomatizování a teprve pak přidat prsty',
          'Hrát hned maximální rychlostí',
          'Hrát bez metronomu',
          'Přestat mačkat akordy'
        ],
        correct: 0,
        explanation: 'Zautomatizování rytmického basu palce uvolní hlavu pro melodické tóny ostatních prstů.'
      }
    ]
  },
  {
    id: 39,
    title: 'Kvintový kruh & Transpozice',
    stage: 5,
    stageEmoji: '🎭',
    stageName: 'Koncertní sál',
    type: 'theory',
    typeLabel: 'Teorie',
    description: 'Nejmocnější mapa v hudební teorii! Zjisti, které akordy k sobě zaručeně ladí a jak skládat vlastní písně.',
    xpReward: 100,
    unlockedSongId: 14,
    steps: [
      {
        title: 'Královská mapa hudebníků: Kvintový kruh',
        content: `
          <p class="lead"><strong>Kvintový kruh (Circle of Fifths)</strong> je geometrický diagram uspořádávající všech 12 tónů chromatické stupnice podle čistých kvint (po směru hodinových ručiček) a čistých kvart (proti směru).</p>
          <div class="card p-4 my-3 bg-surface-2 text-center font-mono">
            <h4 class="text-accent font-bold mb-2">Hodinový ciferník tónin:</h4>
            <p class="text-lg text-white font-bold mb-0">12h: C (0 křížků) &bull; 1h: G (1#) &bull; 2h: D (2#) &bull; 3h: A (3#) &bull; 4h: E (4#) &bull; 5h: H (5#)</p>
          </div>
        `
      },
      {
        title: 'Tajemství rodiny akordů (Harmonické sousedství)',
        content: `
          <p>Když si vybereš jakoukoliv tóninu na kruhu (např. <strong>C dur</strong>):</p>
          <ul class="lesson-list font-mono">
            <li>Její pravý soused je Dominanta: <strong>G dur</strong> (V. stupeň).</li>
            <li>Její levý soused je Subdominanta: <strong>F dur</strong> (IV. stupeň).</li>
            <li>Její vnitřní soused je paralelní moll: <strong>A moll</strong> (vi. stupeň).</li>
          </ul>
          <p class="mt-2">Všichni tito nejbližší sousedé k sobě dokonale harmonicky pasují a tvoří základ 90 % hitů!</p>
        `
      },
      {
        title: 'Odemkni Hey Jude od The Beatles!',
        content: `
          <p>S pochopením harmonických příbuzností si odemykáš monumentální hymnu <strong>Hey Jude</strong> od The Beatles!</p>
        `
      }
    ],
    quiz: [
      {
        question: 'O jaký hudební interval postupuje kvintový kruh po směru hodinových ručiček?',
        options: ['O čistou kvintu (7 půltónů nahoru)', 'O půltón', 'O oktávu', 'O sekundu'],
        correct: 0,
        explanation: 'Každý krok po směru hodinových ručiček je skokem o čistou kvintu (odtud název).'
      },
      {
        question: 'Která tónina leží na vrcholu kvintového kruhu (na 12. hodině) a nemá žádné předznamenání?',
        options: ['Tónina C dur (a a moll)', 'Tónina Fis dur', 'Tónina Es dur', 'Tónina H dur'],
        correct: 0,
        explanation: 'C dur nemá žádné křížky ani béčka a tvoří přirozený výchozí bod celého kruhu.'
      },
      {
        question: 'Kteří dva bezprostřední sousedé obklopují akord G dur na kvintovém kruhu?',
        options: ['C dur (vlevo) a D dur (vpravo)', 'F dur a B dur', 'A dur a E dur', 'Des dur a Ges dur'],
        correct: 0,
        explanation: 'C je subdominanta a D je dominanta ke G dur – na kruhu leží těsně vedle sebe.'
      },
      {
        question: 'Která světoznámá píseň The Beatles končí legendárním sborovým chorálem Na-na-na-na?',
        options: ['Hey Jude', 'Yesterday', 'Help', 'Come Together'],
        correct: 0,
        explanation: 'Hey Jude Paula McCartneyho je jednou z nejslavnějších písní všech dob.'
      }
    ]
  },
  {
    id: 40,
    title: 'Koncertní vystoupení: Velká balada (Finále sálu)',
    stage: 5,
    stageEmoji: '🎭',
    stageName: 'Koncertní sál',
    type: 'exercise',
    typeLabel: 'Praxe',
    description: 'Velké finále 5. etapy! Spoj barré akordy, vybrnkávání i dynamiku v mistrovském provedení.',
    xpReward: 150,
    practiceWorkout: {
      title: 'Hallelujah: C – Am – F – G – E',
      chords: ['C', 'Am', 'F', 'G', 'E'],
      strummingPattern: 'waltz',
      bpm: 58,
      bars: 24
    },
    unlockedSongId: 9,
    steps: [
      {
        title: 'Gratulujeme k dosažení finále Koncertního sálu!',
        content: `
          <p class="lead">Zvládl jsi 5. etapu — nejtěžší technickou zkoušku kytaristy. Pokořil jsi barré F dur, H moll, stavbu akordů, prstové vybrnkávání i kvintový kruh.</p>
          <p>Nyní vystoupíš před ztichlý koncertní sál a zahraješ jednu z nejdojemnějších písní lidstva: <strong>Hallelujah</strong> od Leonarda Cohena (C, Am, F, G, E) v citlivém 6/8 valčíkovém rozkladu.</p>
        `
      },
      {
        title: 'Získej titul Umělec a postup na vyprodaný Stadion!',
        content: `
          <p>Dokončením lekce 40 získáváš prestižní odznak <strong>Koncertní virtuos</strong> a vstupuješ do závěrečné 6. etapy: <strong>Stadion</strong>, kde tě čekají blesková sóla, bending a absolutní kytarové mistrovství!</p>
        `
      }
    ],
    quiz: [
      {
        question: 'Kdo je původním autorem a skladatelem nesmrtelné písně Hallelujah?',
        options: ['Leonard Cohen', 'Bob Dylan', 'Paul Simon', 'Jeff Buckley'],
        correct: 0,
        explanation: 'Píseň Hallelujah napsal v roce 1984 legendární kanadský básník a písničkář Leonard Cohen.'
      },
      {
        question: 'V jakém taktu a náladě se hraje balada Hallelujah?',
        options: [
          'V houpavém 6/8 taktu s jemným arpeggiem prstů a velkou dynamikou',
          'V rychlém pochodovém rytmu',
          'Jako punkový nářez s power akordy',
          'Bez rytmu'
        ],
        correct: 0,
        explanation: 'Pomalý 6/8 takt dodává skladbě její posvátný, kolébavý a dojemný charakter.'
      },
      {
        question: 'Co je nejdůležitějším prvkem při hraní pomalé balady před velkým publikem?',
        options: [
          'Dynamika (střídání tichých a hlasitých pasáží) a cit pro každý jednotlivý doznívající tón',
          'Hrát co nejrychleji, aby píseň brzy skončila',
          'Křičet do mikrofonu',
          'Měnit ladění uprostřed taktu'
        ],
        correct: 0,
        explanation: 'Dynamické frázování a schopnost nechat hudbu dýchat odlišuje skutečné umělce.'
      },
      {
        question: 'Která poslední etapa tě čeká jako vrchol tvé kytarové akademie Melodrio?',
        options: ['6. Fáze: Stadion (Mistr kytary)', 'Žádná, kytara se vyhodí', 'Zpět do Hospody', 'Opakování Garáže'],
        correct: 0,
        explanation: 'Vstupuješ do závěrečné fáze: Stadion — kde se staneš skutečným kytarovým mistrem!'
      }
    ]
  }
];