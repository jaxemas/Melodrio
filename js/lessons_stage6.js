window.STAGE6_LESSONS = [
  {
    id: 41,
    title: 'Legato techniky: Hammer-on & Pull-off',
    stage: 6,
    stageEmoji: '🏟️',
    stageName: 'Stadion',
    type: 'exercise',
    typeLabel: 'Praxe',
    description: 'Blesková plynulost bez trsátka! Nauč se příklepy a odtrhy prstů levé ruky pro perlivá a rychlá sóla.',
    xpReward: 110,
    practiceWorkout: {
      title: 'Legato etuda v pentatonice',
      chords: ['Em', 'G', 'A'],
      strummingPattern: 'rock',
      bpm: 105,
      bars: 16
    },
    steps: [
      {
        title: 'Vítej na Stadionu — závěrečném vrcholu Melodria!',
        content: `
          <p class="lead">Vítej na vyprodaném Stadionu před 80 000 fanoušky! Zde se učí sólové mistrovství, exprese, rychlost a pódiové kytarové umění.</p>
          <p>První technikou pro blesková sóla je <strong>Legato</strong> (z italského vázaně). Místo abys každý tón trnkal trsátkem, rozezníš další tóny čistě pohybem prstů levé ruky!</p>
        `
      },
      {
        title: 'Hammer-on (Kladívkový příklep, značka h)',
        content: `
          <p>Brnkni tón trsátkem na nižším pražci (např. 5. pražec ukazovákem). Poté <strong>prudce a přesně udeř sousedním prstem (např. prsteníkem) na vyšší pražec</strong> (7. pražec) jako malé kladívko, aniž by pravá ruka znovu brnkla. Tón zazní čistě a plynule!</p>
        `
      },
      {
        title: 'Pull-off (Odtrh prstu, značka p)',
        content: `
          <p>Opačný pohyb: oba prsty jsou připravené na hmatníku (např. prsteník na 7. a ukazovák na 5. pražci). Rozezníš 7. pražec a prsteníkem <strong>lehce škubneš směrem dolů k podlaze</strong>. Tím rozezníš tón na 5. pražci pod ním!</p>
        `
      }
    ],
    quiz: [
      {
        question: 'Co znamená technika Hammer-on (příklep)?',
        options: [
          'Prudký dopad prstu levé ruky na vyšší pražec, který rozezní nový tón bez úderu trsátka',
          'Úder skutečným kladivem do struny',
          'Rychlé ztlumení všech strun',
          'Přeladění kolíku'
        ],
        correct: 0,
        explanation: 'Hammer-on využívá rychlost a přesnost dopadu prstu k rozeznění vyššího tónu.'
      },
      {
        question: 'Jak se provádí technika Pull-off (odtrh)?',
        options: [
          'Prst na vyšším pražci při uvolnění jemně brnkne o strunu směrem dolů, čímž rozezní nižší držený pražec',
          'Vytržením struny z kobylky',
          'Zvednutím ruky nad hlavu',
          'Uhozením trsátka o snímač'
        ],
        correct: 0,
        explanation: 'Lehké zadrnčení špičkou prstu směrem dolů udrží energii kmitu struny.'
      },
      {
        question: 'Jaké písmeno obvykle v tabulatuře označuje Hammer-on a Pull-off?',
        options: ['h pro hammer-on (např. 5h7) a p pro pull-off (7p5)', 'Značka X', 'Písmena A a B', 'Číslice 0'],
        correct: 0,
        explanation: 'V mezinárodním zápisu tabulatur se používá malé „h“ a „p“.'
      },
      {
        question: 'Jaká je hlavní hudební výhoda legato techniky?',
        options: [
          'Tóny znějí hladce propojené, tekuté a lze dosáhnout podstatně vyšší rychlosti než při trnkání každého tónu',
          'Struny se nikdy neopotřebují',
          'Kytara hraje sama',
          'Není potřeba mít kytaru naladěnou'
        ],
        correct: 0,
        explanation: 'Legato odstraňuje ostrý atak trsátka a dává sólu zpěvný, plynulý charakter.'
      }
    ]
  },
  {
    id: 42,
    title: 'Slide (skluz) & Bending (vytahování strun)',
    stage: 6,
    stageEmoji: '🏟️',
    stageName: 'Stadion',
    type: 'exercise',
    typeLabel: 'Praxe',
    description: 'Nejexpresivnější techniky elektrické i akustické kytary — rozezpívej kytaru jako lidský hlas.',
    xpReward: 115,
    practiceWorkout: {
      title: 'Bending & Slide etuda',
      chords: ['Am', 'F', 'G'],
      strummingPattern: 'rock',
      bpm: 90,
      bars: 16
    },
    steps: [
      {
        title: 'Slide (Skluz prstu, značka / nebo \\)',
        content: `
          <p class="lead">Skluz je nejpřirozenější způsob pohybu po hmatníku. Brnkneš tón a s nepolevujícím tlakem sklouzneš po pražcích na cílový tón.</p>
          <ul class="lesson-list font-mono">
            <li><strong>Slide Up (/):</strong> Skluz nahoru k tělu kytary na vyšší tón (např. 5/7).</li>
            <li><strong>Slide Down (\\):</strong> Skluz dolů k hlavě na nižší tón (např. 7\\5).</li>
          </ul>
        `
      },
      {
        title: 'Bending (Vytahování struny, značka b)',
        content: `
          <p><strong>Bending je duší rockové a bluesové kytary.</strong> Prstem vytlačíš strunu kolmo nahoru napříč hmatníkem, čímž zvýšíš její tah a plynule zvedneš tón o půltón nebo celý tón.</p>
          <div class="card p-3 my-3 bg-surface-2 border-accent">
            <h4 class="text-accent font-bold mb-1">Pravidlo páky zápěstí (Wrist Turn):</h4>
            <p class="mb-0">Nikdy nevytahuj strunu pouhým natahováním jednotlivých prstů! Zamkni prsty a <strong>otoč celým zápěstím jako při otáčení klíče v zámku</strong>. A vždy použij 3 prsty pohromadě za sebou pro maximální sílu a kontrolu intonace!</p>
          </div>
        `
      }
    ],
    quiz: [
      {
        question: 'Odkud vychází síla pro přesné a stabilní vytažení struny (bending)?',
        options: [
          'Z rotace celého zápěstí a předloktí za podpory 2–3 prstů pohromadě',
          'Z pouhého natahování jednoho malíčku',
          'Z nohou hráče',
          'Z trsátka'
        ],
        correct: 0,
        explanation: 'Rotační pohyb zápěstí dává prstům páku a chrání šlachy před přetížením.'
      },
      {
        question: 'O kolik tónů se nejčastěji vytahuje struna v rockových sólech?',
        options: ['O půltón (1 pražec) nebo o celý tón (2 pražce)', 'O 5 oktáv', 'O čtvrt milimetru', 'Vytahování nemění výšku tónu'],
        correct: 0,
        explanation: 'Half step bend (půltón) a Full step bend (celý tón) jsou dva standardní typy vytažení.'
      },
      {
        question: 'Co je při bendingu nejdůležitější pro ucho posluchače?',
        options: [
          'Přesná intonace — vytažený tón musí dosáhnout přesně cílové výšky tónu bez podladění či přetažení',
          'Pouze co největší hluk',
          'Roztrhnout strunu',
          'Zavřít oči'
        ],
        correct: 0,
        explanation: 'Čistá intonace vytaženého tónu je znakem opravdového mistra.'
      },
      {
        question: 'Jak se v tabulaturách značí skluz prstu z 5. na 7. pražec?',
        options: ['5/7', '5+7', '5-7-0', '5X7'],
        correct: 0,
        explanation: 'Lomítko symbolizuje vzestupný skluz po hmatníku.'
      }
    ]
  },
  {
    id: 43,
    title: 'Vibrato – Hlas a duše kytaristy',
    stage: 6,
    stageEmoji: '🏟️',
    stageName: 'Stadion',
    type: 'theory',
    typeLabel: 'Teorie & Praxe',
    description: 'Poznej techniku, podle které poznáš mistra po prvním tónu — citlivé, široké i dravé vibrato.',
    xpReward: 110,
    steps: [
      {
        title: 'Otisk prstu každého kytaristy',
        content: `
          <p class="lead">B.B. King, Eric Clapton, David Gilmour, Gary Moore či Slash — každého z nich poznáš po jediném zahraném tónu. Jak je to možné? Díky jejich <strong>vibratu</strong>.</p>
          <p><strong>Vibrato</strong> je pravidelné mikroskopické kolísání výšky tónu nahoru a zpět, které dodává tónu sustain (dlouhý dozvuk), emoce a lidský charakter. Tón bez vibrata zní sterilně a mrtvě!</p>
        `
      },
      {
        title: 'Mechanika správného vibrata',
        content: `
          <ul class="lesson-list">
            <li>Palec pevně zahákni přes horní hranu krku jako otočný čep.</li>
            <li>Zápěstí kmitá v pravidelném kruhovém rytmu dolů a nahoru.</li>
            <li>Prst na pražci neklouže, ale táhne strunu nepatrně vzhůru a vrací ji zpět do rovnovážné polohy.</li>
          </ul>
        `
      }
    ],
    quiz: [
      {
        question: 'Co je to kytarové vibrato?',
        options: [
          'Pravidelné jemné kolísání výšky tónu vytvářející sustain a zpěvný výraz',
          'Třesení celým tělem z trémy',
          'Rychlé střídání dvou akordů',
          'Vypínání zvuku poťákem'
        ],
        correct: 0,
        explanation: 'Vibrato napodobuje přirozené vibrato lidského hlasu a dává tónu život.'
      },
      {
        question: 'Který slavný bluesman byl legendární svým rychlým kmitavým „motýlím“ vibratem ukazováku?',
        options: ['B.B. King', 'Ludwig van Beethoven', 'Mozart', 'Elvis Presley'],
        correct: 0,
        explanation: 'B.B. King proslul svým jedinečným třepotavým vibratem, které definovalo moderní blues.'
      },
      {
        question: 'Kdy se na kytaru obvykle vibrato nasazuje?',
        options: [
          'Až nepatrný zlomek sekundy po zaznění tónu, když tón začíná doznívat',
          'Předtím než se prst dotkne struny',
          'Pouze při ladění',
          'Vibrato je zakázáno'
        ],
        correct: 0,
        explanation: 'Nechat tón nejprve jasně promluvit a teprve poté rozvinout vibrato zní nejhudebněji.'
      },
      {
        question: 'Jaké je nejdůležitější pravidlo pro dobré vibrato?',
        options: [
          'Pravidelnost a kontrola tempa kmitu (nikoliv chaotický záškub)',
          'Hrát co nejrychleji a nejkřečovitěji',
          'Používat pouze malíček',
          'Vypnout reproduktory'
        ],
        correct: 0,
        explanation: 'Klidné, ovládané a rytmické vibrato je pečetí špičkového hráče.'
      }
    ]
  },
  {
    id: 44,
    title: 'Bluesový tón (Blue Note) & Durová pentatonika',
    stage: 6,
    stageEmoji: '🏟️',
    stageName: 'Stadion',
    type: 'theory',
    typeLabel: 'Teorie',
    description: 'Tajemství zmenšené kvinty (b5) a spojení mollové a durové pentatoniky v sólech světových mistrů.',
    xpReward: 115,
    steps: [
      {
        title: 'Tajemství modrého tónu (Blue Note)',
        content: `
          <p class="lead">Vezmi 5 tónů mollové pentatoniky a přidej mezi 4. a 5. stupeň jediný tajný tón: <strong>zmenšenou kvintu (b5)</strong>. Tomuto tónu se říká <strong>Blue Note (modrý tón)</strong>.</p>
          <div class="card p-4 my-3 bg-surface-2 text-center font-mono">
            <h4 class="text-accent font-bold mb-1">E Bluesová stupnice (6 tónů):</h4>
            <p class="text-lg text-white font-bold mb-0">E &nbsp;—&nbsp; G &nbsp;—&nbsp; A &nbsp;—&nbsp; <span class="text-primary font-extrabold">B♭ (Blue Note)</span> &nbsp;—&nbsp; H &nbsp;—&nbsp; D &nbsp;—&nbsp; E</p>
          </div>
          <p class="mt-2">Tento tón vnáší do hudby ono pověstné „špinavé“, dráždivé a srdceryvné bluesové napětí!</p>
        `
      },
      {
        title: 'Míchání dur a moll jako B.B. King',
        content: `
          <p>Opravdoví mistři kytary nesóleují pouze v jedné stupnici. Přepínají mezi <em>mollovou pentatonikou</em> (drsná, rocková) a <em>durovou pentatonikou</em> (sladká, melodická, jižanská). Jejich prolnutí vytváří nekonečné zvukové barvy!</p>
        `
      }
    ],
    quiz: [
      {
        question: 'Který interval představuje tzv. Blue Note (modrý tón) v bluesové stupnici?',
        options: ['Zmenšená kvinta (b5 / tritonus)', 'Čistá prima', 'Velká sekunda', 'Oktáva'],
        correct: 0,
        explanation: 'Zmenšená kvinta (b5) leží přesně mezi kvartou a čistou kvintou a dává blues jeho typický zvuk.'
      },
      {
        question: 'Kolik tónů má bluesová stupnice po přidání Blue Note?',
        options: ['6 tónů (hexatonika)', '5 tónů', '12 tónů', '3 tóny'],
        correct: 0,
        explanation: 'K 5 tónům pentatoniky přibude 1 modrý tón, celkem tedy 6 tónů.'
      },
      {
        question: 'Kde leží Blue Note v tónině E?',
        options: ['Tón B♭ (Ais / hes)', 'Tón C', 'Tón F#', 'Tón G#'],
        correct: 0,
        explanation: 'Mezi tóny A a H leží zmenšená kvinta B♭ (A#).'
      },
      {
        question: 'Jaký zvukový efekt má použití durové pentatoniky v blues a rocku?',
        options: [
          'Sladší, jasnější, country-bluesový a hymnický charakter',
          'Děsí posluchače',
          'Vypíná distorzi',
          'Zní jako falešný tón'
        ],
        correct: 0,
        explanation: 'Durová pentatonika (např. styl Allman Brothers, Eric Clapton) přináší zpěvný a optimistický tón.'
      }
    ]
  },
  {
    id: 45,
    title: 'Rychlost a koordinace: Pavouk (Spider Exercise)',
    stage: 6,
    stageEmoji: '🏟️',
    stageName: 'Stadion',
    type: 'exercise',
    typeLabel: 'Praxe',
    description: 'Přísný atletický trénink nezávislosti všech 4 prstů na všech 6 strunách s metronomem pro čistotu a rychlost.',
    xpReward: 125,
    practiceWorkout: {
      title: 'Spider Walk po hmatníku',
      chords: ['Em', 'Am', 'C', 'D'],
      strummingPattern: 'rock',
      bpm: 110,
      bars: 16
    },
    steps: [
      {
        title: 'Cvičení, které buduje nezávislost svalů',
        content: `
          <p class="lead"><strong>Cvičení Pavouk (Spider Walk)</strong> je celosvětově nejuznávanějším gymnastickým cvičením pro ruce kytaristy. Synchronizuje obě ruce s dokonalou milisekundovou přesností.</p>
          <div class="card p-3 my-3 bg-surface-2 font-mono">
            <h4 class="text-accent font-bold mb-2">Vzorec na 1. až 4. pražci:</h4>
            <p class="mb-1"><strong>6. struna (E):</strong> 1 (ukazovák) - 2 (prostředník) - 3 (prsteník) - 4 (malíček)</p>
            <p class="mb-1"><strong>5. struna (A):</strong> 1 - 2 - 3 - 4</p>
            <p class="mb-1"><strong>4. struna (D):</strong> 1 - 2 - 3 - 4 ... a tak dále až na 1. strunu!</p>
            <p class="mb-0 text-muted">A potom pozpátku: 4 - 3 - 2 - 1 od tenké struny e zpět k basovému E!</p>
          </div>
        `
      },
      {
        title: 'Železné pravidlo metronomu',
        content: `
          <p>Nikdy necvič pavouka rychle bez rytmu! Nastav metronom na <strong>60 BPM</strong>. Na každé pípnutí zahraj přesně jeden tón. Teprve když zahraješ celou kytaru nahoru a dolů bez jediného zaváhání, zvedni tempo o 5 BPM!</p>
        `
      }
    ],
    quiz: [
      {
        question: 'Co je hlavním cílem cvičení Pavouk (Spider Walk)?',
        options: [
          'Vybudovat nezávislost, koordinaci a synchronizaci prstů obou rukou s metronomem',
          'Vylekat pavouky v pokoji',
          'Hrát co nejfalešnější tóny',
          'Vyčistit prach z pražců'
        ],
        correct: 0,
        explanation: 'Spider Walk je základní atletické cvičení pro absolutní kontrolu prstů.'
      },
      {
        question: 'V jakém tempu je nejlepší začít trénovat techniku pro čistotu tónu?',
        options: ['V pomalém, kontrolovaném tempu (cca 60 BPM)', 'Ihned na 250 BPM', 'Bez rytmu', 'Co nejrychleji i s chybami'],
        correct: 0,
        explanation: 'Pomalé tempo buduje přesnou svalovou paměť bez zbytečného napětí v ruce.'
      },
      {
        question: 'Kde by měly zůstávat prsty, které zrovna nehrají?',
        options: [
          'Těsně nad strunami (cca 1–2 mm od hmatníku), připravené k okamžitému úderu',
          'Trčet 10 cm do vzduchu',
          'Zastrčené v kapse',
          'Opřené o tělo kytary'
        ],
        correct: 0,
        explanation: 'Minimální pohyb prstů (ekonomie pohybu) je tajemstvím bleskové rychlosti.'
      },
      {
        question: 'Jak se při cvičení pohybuje trsátko v pravé ruce?',
        options: [
          'Přísně střídavě dolů a nahoru (Alternate Picking: ↓ ↑ ↓ ↑)',
          'Pouze údery dolů',
          'Pouze údery nahoru',
          'Trsátko se nepoužívá'
        ],
        correct: 0,
        explanation: 'Střídavé trnkání (Alternate Picking) je jedinou cestou k rychlé a čisté sólové hře.'
      }
    ]
  },
  {
    id: 46,
    title: 'Zvuk na stadionu: Zesilovače, efekty a pódiový tón',
    stage: 6,
    stageEmoji: '🏟️',
    stageName: 'Stadion',
    type: 'theory',
    typeLabel: 'Teorie',
    description: 'Od kytary k uším 80 tisíc lidí! Pronikni do tajů lampových aparátů, overdrive, delaye a pódiového zvuku.',
    xpReward: 120,
    steps: [
      {
        title: 'Signálový řetězec stadionového zvuku',
        content: `
          <p class="lead">Na velkém pódiu netvoří tvůj tón pouze samotná kytara, ale celý <strong>signálový řetězec (Signal Chain)</strong>.</p>
          <div class="card p-3 my-3 bg-surface-2 font-mono">
            <h4 class="text-accent font-bold mb-2">Správné pořadí krabiček (Pedalboard):</h4>
            <p class="mb-1">1. Ladička (Tuner) &bull; 2. Wah-wah (Kvadélko)</p>
            <p class="mb-1">3. Gain efekty (Overdrive &bull; Distortion &bull; Fuzz)</p>
            <p class="mb-1">4. Modulační efekty (Chorus &bull; Flanger &bull; Phaser)</p>
            <p class="mb-0">5. Časové efekty (Delay &bull; Reverb) na konci před zesilovačem!</p>
          </div>
        `
      },
      {
        title: 'Ekvalizace v kapele (EQ cut)',
        content: `
          <p>Když cvičíš sám doma, chceš hodně basů. Ale na stadionu basy přenech baskytaře a velkému bubnu! Kytara je <strong>středový nástroj</strong> — prořízne zvukový mix kapely právě díky silným středovým frekvencím (Mids)!</p>
        `
      }
    ],
    quiz: [
      {
        question: 'Kam v signálovém řetězci správně patří časové efekty jako Reverb (dozvuk) a Delay (ozvěna)?',
        options: ['Až na konec řetězce před zesilovač (nebo do efektové smyčky)', 'Na úplný začátek před ladičku', 'Reverb se nezapojuje', 'Přímo do strun'],
        correct: 0,
        explanation: 'Reverb a delay mají prostorově zpracovat již zkreslený a vytvarovaný signál na konci řetězce.'
      },
      {
        question: 'Které frekvenční pásmo je pro elektrickou kytaru v kapele nejdůležitější, aby byla dobře slyšet v mixu?',
        options: ['Středové frekvence (Mids)', 'Sub-basy', 'Pouze neslyšitelné ultrazvuky', 'Žádné frekvence'],
        correct: 0,
        explanation: 'Kytara kraluje střednímu pásmu. Pokud přidáš příliš basů, utopíš se v baskytaře a bicích.'
      },
      {
        question: 'Jaký je rozdíl mezi efektem Overdrive a Distortion?',
        options: [
          'Overdrive simuluje jemné, teplé nasycení lampového zesilovače, zatímco Distortion signál ostře a tvrdě ořízne',
          'Oba dělají úplné ticho',
          'Overdrive mění barvu na modrou',
          'Mezi nimi není žádný rozdíl'
        ],
        correct: 0,
        explanation: 'Overdrive reaguje dynamicky na sílu úderu, distortion nabízí tvrdé, agresivní rockové zkreslení.'
      },
      {
        question: 'Co dělá kytarový kompresor (Compressor pedal)?',
        options: [
          'Zarovnává dynamiku — zesiluje příliš tiché tóny a krotí příliš hlasité špičky pro dlouhý vyrovnaný sustain',
          'Zmenšuje rozměry kytary',
          'Přetrhne struny',
          'Mění ladění o oktávu'
        ],
        correct: 0,
        explanation: 'Kompresor vyrovnává hlasitost úderů a prodlužuje zpěvný dozvuk sóla.'
      }
    ]
  },
  {
    id: 47,
    title: 'Mistrovská pódiová improvizace',
    stage: 6,
    stageEmoji: '🏟️',
    stageName: 'Stadion',
    type: 'exercise',
    typeLabel: 'Praxe',
    description: 'Propoj bendy, vibrato, slidování i rychlé běhy v pentatonice na plný stadionový doprovod.',
    xpReward: 140,
    practiceWorkout: {
      title: 'Stadionové sólové vystoupení',
      chords: ['Em', 'C', 'G', 'D'],
      strummingPattern: 'rock',
      bpm: 115,
      bars: 24
    },
    steps: [
      {
        title: 'Čas zazářit v záři reflektorů',
        content: `
          <p class="lead">Stojíš na rampě pódia, reflektory oslňují a kapela za tebou drží neochvějný rockový groove v tónině E moll.</p>
          <p>Nyní zapojíš vše, co ses naučil v 47 lekcích Melodria:</p>
          <ul class="lesson-list">
            <li>Začni melodickým motivem a zpěvným vibratem.</li>
            <li>Zvedni energii přesným bendingem o celý tón na 14. nebo 15. pražci.</li>
            <li>Propleť rychlý sestup přes Hammer-on a Pull-off v pentatonice.</li>
            <li>Využij Blue Note pro bluesové napětí a zakonči na základním tónu E!</li>
          </ul>
        `
      }
    ],
    quiz: [
      {
        question: 'Co dělá kytarové sólo skutečně zapamatovatelným pro publikum?',
        options: [
          'Silná zpěvná melodie, struktura (začátek, gradace, vrchol) a emoce (nikoliv pouhé bezduché chrlení tónů)',
          'Hrát co nejvíce tónů za vteřinu bez ladu a skladu',
          'Otočit se k lidem zády',
          'Rozbít zesilovač'
        ],
        correct: 0,
        explanation: 'Skvělé sólo vypráví příběh s melodickým motivem, ke kterému se posluchač vrací.'
      },
      {
        question: 'Která nota tvoří bezpečný a stabilní „domov“ při improvizaci v E moll?',
        options: ['Základní tón E (tónika)', 'Jakýkoliv náhodný tón', 'Tón F', 'Tón C#'],
        correct: 0,
        explanation: 'Návrat k základnímu tónu E uzavírá hudební myšlenku do klidu a jistoty.'
      },
      {
        question: 'Proč je důležité v sólové hře pracovat s tichem a pomlkami?',
        options: [
          'Pomlky dávají hudbě prostor dýchat a dělají následující tóny mnohem působivějšími',
          'Aby kytarista stihl pít vodu',
          'Publikum má rádo ticho',
          'Pomlky jsou zakázané'
        ],
        correct: 0,
        explanation: 'Jak říkal Miles Davis: „Hudba není v tónech, ale v tichu mezi nimi.“'
      },
      {
        question: 'Která poslední zkouška tě čeká v lekci 48?',
        options: [
          'Velké finále Melodria a zisk titulu Bůh kytary',
          'Návrat do první třídy',
          'Odinstalace aplikace',
          'Žádná'
        ],
        correct: 0,
        explanation: 'Čeká tě velkolepá 48. lekce — završení celé akademie!'
      }
    ]
  },
  {
    id: 48,
    title: 'Velké finále: Kytarový bůh Melodria',
    stage: 6,
    stageEmoji: '🏟️',
    stageName: 'Stadion',
    type: 'exercise',
    typeLabel: 'Praxe / Mistrovská zkouška',
    description: 'Vrchol celé kytarové akademie! Zavrcholených 48 lekcí, velkolepá píseň a vstup na kytarový Olymp.',
    xpReward: 250,
    practiceWorkout: {
      title: 'Mistrovské finále: G – Em – C – D',
      chords: ['G', 'Em', 'C', 'D'],
      strummingPattern: 'ballad',
      bpm: 70,
      bars: 32
    },
    unlockedSongId: 25,
    steps: [
      {
        title: 'Vítej u absolutního vrcholu kytarové akademie!',
        content: `
          <div class="card p-4 my-3 bg-surface-2 border-primary text-center">
            <h1 class="text-4xl text-primary font-black mb-2">👑 Kytarový Olymp</h1>
            <p class="text-lg text-white font-bold mb-2">Dokončil jsi všech 48 lekcí ve všech 6 etapách Melodria!</p>
            <p class="text-muted max-w-xl mx-auto mb-0">Začal jsi v Garáži učením částí kytary a držením trsátka. Prošel jsi Otevřenou scénou, Hospodou, Klubem i Koncertním sálem. Dnes stojíš na vyprodaném Stadionu jako mistr nástroje.</p>
          </div>
          <p>Tvá závěrečná mistrovská zkouška spojuje vše: akordovou jistotu, citlivou dynamiku, rytmickou neochvějnost i melodický tón v nádherné písni <strong>Perfect</strong> od Eda Sheerana.</p>
        `
      },
      {
        title: 'Tvá celoživotní hudební cesta teprve začíná',
        content: `
          <p>Kytara je přítel na celý život. Ovládáš teorii, hmatník, 20+ akordů, vybrnkávání, blues, rock i sóla. Nyní vezmi svůj nástroj a hraj pro rodinu, přátele, u táboráku i na pódiích!</p>
        `
      }
    ],
    quiz: [
      {
        question: 'Kolik etap a lekcí jsi úspěšně absolvoval v kytarové akademii Melodrio?',
        options: ['Všech 6 etap a 48 kompletních lekcí', 'Pouze 1 etapu', '10 lekcí', 'Žádnou'],
        correct: 0,
        explanation: 'Zvládl jsi všech 48 ucelených lekcí od základů až po vrcholné mistrovství!'
      },
      {
        question: 'Který světový megahit Eda Sheerana završuje tvou cestu na Stadionu?',
        options: ['Perfect', 'Zombie', 'Kometa', 'Stánky'],
        correct: 0,
        explanation: 'Romantická a harmonicky dokonalá píseň Perfect je odměnou za zvládnutí 48. lekce.'
      },
      {
        question: 'Jaký nejvyšší titul v Melodriu získáváš po dokončení celé kytarové cesty?',
        options: ['Bůh kytary (Olymp)', 'Věčný začátečník', 'Ladič kytar', 'Divák'],
        correct: 0,
        explanation: 'Získáváš nejvyšší možný status kytarového boha na Olympu!'
      },
      {
        question: 'Co je největším posláním hudebníka a kytaristy?',
        options: [
          'Přinášet radost sobě i ostatním, vyjadřovat emoce a spojovat lidi skrze hudbu',
          'Soutěžit o co nejdražší nástroj',
          'Hrát pouze sám v zamčeném pokoji',
          'Kritizovat ostatní muzikanty'
        ],
        correct: 0,
        explanation: 'Hudba spojuje lidi, léčí duši a přináší radost. Gratulujeme, Mistře!'
      }
    ]
  }
];