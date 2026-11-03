window.STAGE1_LESSONS = [
  {
    id: 1,
    title: 'Části kytary',
    stage: 1,
    stageEmoji: '🏠',
    stageName: 'Garáž',
    type: 'theory',
    typeLabel: 'Teorie',
    description: 'Poznej svůj nástroj — naučíš se pojmenovat každou část kytary od hlavičky po kobylku.',
    xpReward: 50,
    steps: [
      {
        title: 'Vítej v Melodriu a první lekci!',
        content: `
          <p class="lead">Vítej ve světě kytary! Kytara je jeden z nejúžasnějších, nejuniverzálnějších a nejpopulárnějších nástrojů v historii hudby.</p>
          <p>Než poprvé položíš prsty na struny a zahraješ svůj první tón, je nezbytné detailně poznat stavbu svého nástroje. Každá část kytary plní specifickou a nezastupitelnou roli — od přesného ladění přes tvorbu tónu až po jeho přirozené zesílení.</p>
          <div class="card p-4 my-3 bg-surface-2 border-primary">
            <h4 class="text-primary font-bold mb-2">💡 Věděl jsi?</h4>
            <p class="mb-0">Ať už hraješ na klasickou španělku s nylonovými strunami, westernovou akustickou kytaru s kovovými strunami, nebo elektrickou kytaru, základní anatomie těla, krku a hlavičky zůstává téměř totožná!</p>
          </div>
          <p>V následujících krocích si projdeme každou klíčovou součástku. Po dokončení teorie tě čeká krátký kvíz, kterým si ověříš nově nabyté znalosti a získáš své první XP!</p>
        `
      },
      {
        title: 'Hlavička a ladící mechaniky',
        content: `
          <p>Začneme na samém horním konci nástroje:</p>
          <h4 class="font-bold text-accent mt-3">Hlavička (Headstock)</h4>
          <p>Hlavička je rozšířená část na horním konci krku. Slouží především jako pevný základ pro uchycení ladících mechanik a nese tah všech šesti napnutých strun.</p>
          <h4 class="font-bold text-accent mt-3">Ladící mechaniky (Tuning pegs / kolíky)</h4>
          <p>Na hlavičce najdeš 6 otočných kolíků s šnekovým převodem. Otáčením těchto kolíků měníš napětí jednotlivých strun:</p>
          <ul class="lesson-list">
            <li><strong>Utahování (napínání struny)</strong> → tón se zvyšuje (stoupá).</li>
            <li><strong>Povolování struny</strong> → tón se snižuje (klesá).</li>
          </ul>
          <div class="card p-3 my-3 bg-surface-2">
            <p class="mb-0">🎯 <em>Tip:</em> S kolíky zacházej vždy s citem. Příliš prudké přetažení struny může způsobit její prasknutí!</p>
          </div>
        `
      },
      {
        title: 'Krk, hmatník a pražce',
        content: `
          <p>Krk je oblast, kde se odehrává veškeré kouzlo levé ruky při mačkání tónů a akordů.</p>
          <h4 class="font-bold text-accent mt-3">Krk (Neck)</h4>
          <p>Dlouhá masivní dřevěná část spojující tělo kytary s hlavičkou. Zezadu na krk pokládáš palec, který slouží jako stabilní opora pro celou ruku. Uvnitř krku akustických a elektrických kytar je zabudovaná ocelová výztuha (truss rod), která chrání krk před prohnutím vlivem tahu strun.</p>
          <h4 class="font-bold text-accent mt-3">Hmatník (Fretboard / Fingerboard)</h4>
          <p>Přední rovná deska nalepená na krku kytary. Právě sem pokládáš bříška prstů při hraní.</p>
          <h4 class="font-bold text-accent mt-3">Pražce (Frets) a půltóny</h4>
          <p>Kovové proužky zapuštěné napříč hmatníkem. Každý pražec zkracuje vibrující část struny přesně o <strong>jeden půltón</strong>. Čím blíže k tělu kytary tiskneš strunu, tím vyšší tón kytara vydá.</p>
          <div class="card p-3 my-3 bg-surface-2">
            <p class="mb-0">📍 <strong>Orientační značky:</strong> Tečky na 3., 5., 7., 9. a 12. pražci ti umožňují rychlou orientaci bez počítání pražců od začátku. Dvojitá tečka na 12. pražci značí přesně jednu oktávu.</p>
          </div>
        `
      },
      {
        title: 'Nultý pražec (Nut)',
        content: `
          <p>Na pomezí mezi hlavičkou a hmatníkem se nachází malá, ale mimořádně důležitá součástka.</p>
          <h4 class="font-bold text-accent mt-3">Nultý pražec (Nut)</h4>
          <p>Úzká lišta vyrobená z kosti, plastu nebo syntetického grafitu. Má v sobě šest přesně vybroušených drážek pro každou strunu.</p>
          <h4 class="font-bold text-accent mt-3">K čemu slouží?</h4>
          <ul class="lesson-list">
            <li><strong>Udržuje rozestupy:</strong> Dbá na to, aby byly struny přesně stejně vzdálené jedna od druhé.</li>
            <li><strong>Určuje výšku (dohmat):</strong> Definuje výšku strun nad prvním pražcem. Příliš vysoký nultý pražec způsobuje těžké mačkání, příliš nízký zase drnčení strun.</li>
            <li><strong>Vibrační bod:</strong> Když brnkneš na strunu bez stisknutí pražce ("otevřená struna"), struna kmitá právě mezi nultým pražcem a kobylkou.</li>
          </ul>
        `
      },
      {
        title: 'Tělo, ozvučnice a kobylka',
        content: `
          <p>Tělo tvoří největší část kytary a je zodpovědné za hlasitost a barvu nástroje.</p>
          <h4 class="font-bold text-accent mt-3">Tělo (Body)</h4>
          <p>U akustické kytary slouží jako rezonanční ozvučná skříň. Skládá se z přední desky (top), lubů (boky) a zadní desky (back). Přední deska je srdcem kytary — nejčastěji ze smrku nebo cedru — a její kmity tvoří výsledný tón.</p>
          <h4 class="font-bold text-accent mt-3">Ozvučný otvor (Sound hole)</h4>
          <p>Kruhový otvor v přední desce těla. Zesílené akustické vlny vznikající rezonancí uvnitř těla vystupují tímto otvorem přímo k uším posluchače.</p>
          <h4 class="font-bold text-accent mt-3">Kobylka (Bridge) a sedlo (Saddle)</h4>
          <p>Dřevěný můstek na přední desce kytary, ve kterém jsou ukotveny konce strun (u akustických kytar pomocí kolíčků — bridge pins). Na kobylce je usazen kobylkový plátek (sedlo), přes který se vibrace strun přenášejí do rezonanční desky.</p>
        `
      },
      {
        title: 'Šest strun a mnemotechnická pomůcka',
        content: `
          <p>Standardní kytara má <strong>6 strun</strong>. Číslujeme je od nejtenčí k nejtlustší (1. až 6. struna), ale ladíme a jmenujeme je obvykle od nejhlubší basové k nejvyšší:</p>
          <div class="card p-3 my-3 bg-surface-2 font-mono">
            <p class="mb-1"><strong>6. struna:</strong> E (tlustá, hluboký bas E₂)</p>
            <p class="mb-1"><strong>5. struna:</strong> A (basová A₂)</p>
            <p class="mb-1"><strong>4. struna:</strong> D (středová basová D₃)</p>
            <p class="mb-1"><strong>3. struna:</strong> G (středová G₃)</p>
            <p class="mb-1"><strong>2. struna:</strong> B / H (melodická B₃ / H₃)</p>
            <p class="mb-0"><strong>1. struna:</strong> E (tenká, vysoké e E₄)</p>
          </div>
          <div class="card p-3 my-3 bg-surface-2 border-accent">
            <h5 class="text-accent font-bold mb-1">Mnemotechnická pomůcka:</h5>
            <p class="mb-0 text-lg font-semibold">"Ema A Dáša Grilují Biftek Extra"</p>
            <p class="text-sm text-muted mt-1">(nebo v tradičním českém značení s tónem H: <em>"Emil Hodil Granát Do Atomové Elektrárny"</em> pozpátku od 1. k 6.)</p>
          </div>
          <p>Gratulujeme! Znáš všechny základní části kytary. Nyní klikni na tlačítko níže a vyzkoušej si kvíz!</p>
        `
      }
    ],
    quiz: [
      {
        question: 'Jak se nazývá přední plocha krku kytary osazená kovovými pražci?',
        options: ['Hlavička', 'Hmatník', 'Kobylka', 'Ozvučnice'],
        correct: 1,
        explanation: 'Hmatník (fretboard) je plocha na krku kytary, na kterou tiskneš struny prsty.'
      },
      {
        question: 'K čemu slouží kruhový ozvučný otvor (sound hole) na akustické kytaře?',
        options: [
          'Slouží pouze jako dekorace',
          'Umožňuje rezonujícím zvukovým vlnám vycházet z těla nástroje',
          'Slouží k ukládání trsátek a ladičky',
          'Uchycují se do něj konce strun'
        ],
        correct: 1,
        explanation: 'Ozvučný otvor vypouští zesílené akustické kmity ven z rezonanční komory těla kytary.'
      },
      {
        question: 'Jaké je správné pořadí strun od nejtlustší basové po nejtenčí ve standardním ladění?',
        options: ['E - A - D - G - B - E', 'E - B - G - D - A - E', 'C - D - E - F - G - A', 'D - G - C - F - A - D'],
        correct: 0,
        explanation: 'Standardní ladění je E-A-D-G-B-E (od 6. nejtlustší k 1. nejtenčí struně).'
      },
      {
        question: 'Kde přesně na kytaře najdeš nultý pražec (nut)?',
        options: [
          'Uprostřed těla kytary pod ozvučným otvorem',
          'Na 12. pražci hmatníku',
          'Na rozhraní mezi hlavičkou a krkem kytary',
          'Na zadní straně těla nástroje'
        ],
        correct: 2,
        explanation: 'Nultý pražec tvoří předěl mezi hlavičkou a krkem a vymezuje rozestupy strun.'
      }
    ]
  },
  {
    id: 2,
    title: 'Jak držet kytaru',
    stage: 1,
    stageEmoji: '🏠',
    stageName: 'Garáž',
    type: 'practical',
    typeLabel: 'Praxe',
    description: 'Správné držení těla a rukou je základem pro pohodlnou a čistou hru bez bolesti.',
    xpReward: 50,
    steps: [
      {
        title: 'Správný sed a poloha těla',
        content: `
          <p class="lead">Způsob, jakým držíš kytaru, rozhoduje o tom, jak snadno se ti bude hrát a zda tě po 15 minutách nezačnou bolet záda či zápěstí.</p>
          <ul class="lesson-list">
            <li><strong>Stabilní židle:</strong> Seď na pevné židli bez područek (loketních opěrek), které by ti překážely v pohybu. Seď vzpřímeně na přední polovině sedáku.</li>
            <li><strong>Kytara na pravém stehně (pro praváky):</strong> Výřez těla kytary polož na pravé stehno. Zadní desku kytary zlehka přitiskni k hrudníku.</li>
            <li><strong>Úhel krku kytary:</strong> Krk kytary by neměl viset vodorovně ani směřovat k zemi. Měl by mířit mírně šikmo vzhůru v úhlu zhruba 30° až 45°.</li>
            <li><strong>Uvolněná ramena:</strong> Ramena měj volně spuštěná, nezvedej je ke krku a nedělej ze zad hrb.</li>
          </ul>
        `
      },
      {
        title: 'Levá ruka (hmatníková ruka)',
        content: `
          <p>Levá ruka má za úkol přesně mačkat struny na hmatníku. Zde platí několik zlatých pravidel:</p>
          <h4 class="font-bold text-accent mt-3">Poloha palce</h4>
          <p>Palec levé ruky spočívá <strong>přibližně uprostřed zadní strany krku</strong>. Funguje jako opora pro protitlak ostatních prstů. Nikdy krk kytary nesvírej křečovitě jako baseballovou pálku s palcem trčícím vysoko přes hmatník!</p>
          <h4 class="font-bold text-accent mt-3">Klenba prstů jako drápky</h4>
          <p>Prsty levé ruky musí být přirozeně zaoblené v každém kloubu. Představ si, že v dlani držíš tenisový míček.</p>
          <h4 class="font-bold text-accent mt-3">Tlak bříšky špiček</h4>
          <p>Struny tiskni kolmo bříšky samotných špiček prstů. Pokud prst položíš naplocho, nechtěně ztlumíš sousední struny!</p>
          <div class="card p-3 my-3 bg-surface-2 border-primary">
            <p class="mb-0">✂️ <strong>Důležité:</strong> Nehty na levé ruce musí být ostříhané nakrátko. Dlouhý nehet narazí do dřeva hmatníku a zabrání ti strunu čistě domáčknout.</p>
          </div>
        `
      },
      {
        title: 'Pravá ruka (brnkací ruka)',
        content: `
          <p>Pravá ruka je motor kytary — dává hře rytmus, dynamiku a energii.</p>
          <ul class="lesson-list">
            <li><strong>Opora předloktí:</strong> Předloktí pravé ruky volně spočívá na horní zaoblené hraně těla kytary. Loket by neměl být ztuhlý ani přišpendlený.</li>
            <li><strong>Pozice ruky:</strong> Dlaň je umístěna přirozeně nad ozvučným otvorem kytary.</li>
            <li><strong>Uvolněné zápěstí:</strong> Zápěstí musí zůstat vláčné, pružné a uvolněné. Pohyb při úhozu vychází především z pružného zápěstí, nikoliv křečovitým máváním celou paží od ramene.</li>
          </ul>
        `
      },
      {
        title: 'Jak správně držet trsátko (Plektrum)',
        content: `
          <p>Trsátko je malý kousek plastu, který dokáže dát tvému zvuku obrovskou jiskru a hlasitost.</p>
          <h4 class="font-bold text-accent mt-3">Postup uchopení trsátka:</h4>
          <ol class="lesson-list">
            <li>Mírně pokrč ukazováček pravé ruky.</li>
            <li>Polož trsátko na první článek ukazováčku z vnější strany.</li>
            <li>Přiklop trsátko bříškem palce tak, aby špička trsátka směřovala kolmo ven z prstů.</li>
            <li>Špička trsátka by měla vyčnívat pouze přibližně <strong>3 až 5 milimetrů</strong>.</li>
          </ol>
          <div class="card p-3 my-3 bg-surface-2">
            <p class="mb-0">⚖️ <em>Pravidlo stisku:</em> Drž trsátko dostatečně pevně, aby ti nevypadlo z ruky, ale zároveň dostatečně uvolněně, aby při přejezdu přes struny pružilo.</p>
          </div>
        `
      }
    ],
    quiz: [
      {
        question: 'Kde by měl správně spočívat palec levé ruky při mačkání tónů na hmatníku?',
        options: [
          'Pevně obtočený přes horní hranu hmatníku',
          'Přibližně uprostřed zadní zaoblené strany krku kytary',
          'V kapse nebo volně ve vzduchu',
          'Přímo na kovových pražcích'
        ],
        correct: 1,
        explanation: 'Palec uprostřed zadní strany krku dává prstům volnost a umožňuje správné zaoblení kloubů.'
      },
      {
        question: 'Jakou částí prstů levé ruky správně tiskneme struny na hmatníku?',
        options: [
          'Plochou celého prstu naplocho přes všechny struny',
          'Klouby prstů',
          'Bříšky samotných špiček prstů se zaoblenými klouby',
          'Nehty prstů'
        ],
        correct: 2,
        explanation: 'Pouze kolmý stisk špičkou prstu zajistí čistý tón bez nechtěného zatlumení sousedních strun.'
      },
      {
        question: 'Kolik milimetrů špičky trsátka by mělo zhruba vyčnívat z prstů?',
        options: ['Alespoň 2 centimetry', 'Přibližně 3 až 5 milimetrů', 'Žádná špička, drží se za hranu', 'Celé trsátko'],
        correct: 1,
        explanation: 'Přibližně 3-5 mm poskytuje ideální kontrolu, čistý tón a zabraňuje nechtěnému zachytávání za struny.'
      },
      {
        question: 'Odkud by měl primárně vycházet pohyb pravé ruky při rytmickém doprovodu?',
        options: ['Z uvolněného a pružného zápěstí', 'Z křečovitě napnutého lokte', 'Z krční páteře', 'Z prstů levé ruky'],
        correct: 0,
        explanation: 'Pružné zápěstí je základem čistého, dynamického a neunavujícího rytmu.'
      }
    ]
  },
  {
    id: 3,
    title: 'Ladění kytary',
    stage: 1,
    stageEmoji: '🏠',
    stageName: 'Garáž',
    type: 'practical',
    typeLabel: 'Praxe',
    description: 'Čistý tón začíná správným naladěním. Nauč se naladit všech 6 strun.',
    xpReward: 50,
    steps: [
      {
        title: 'Proč je ladění naprosto klíčové',
        content: `
          <p class="lead">I kdybys byl nejlepším kytaristou planety s dokonalou prstovou technikou, na rozladěné kytaře bude tvá hra znít falešně a nepříjemně.</p>
          <p>Dřevo kytary neustále pracuje vlivem změn teploty a vlhkosti vzduchu. Kytara se navíc přirozeně rozlaďuje samotným hraním a stárnutím strun. Zvykni si na železné pravidlo: <strong>vždy zkontroluj ladění dříve, než začneš hrát!</strong></p>
          <div class="card p-3 my-3 bg-surface-2 border-accent">
            <p class="mb-0">👂 Laděním si od prvního dne cvičíš svůj hudební sluch. Tvé ucho si rychle zvykne na čisté harmonické intervaly.</p>
          </div>
        `
      },
      {
        title: 'Standardní ladění E-A-D-G-B-E',
        content: `
          <p>Většina světové populární hudby, rocku i folku využívá tzv. <strong>standardní ladění (Standard Tuning)</strong>.</p>
          <p>Tóny jednotlivých strun od nejtlustší 6. k nejtenčí 1.:</p>
          <ul class="lesson-list">
            <li><strong>6. struna (tlusté E)</strong> — tón E₂ (frekvence cca 82.4 Hz)</li>
            <li><strong>5. struna (A)</strong> — tón A₂ (110 Hz)</li>
            <li><strong>4. struna (D)</strong> — tón D₃ (146.8 Hz)</li>
            <li><strong>3. struna (G)</strong> — tón G₃ (196 Hz)</li>
            <li><strong>2. struna (B / H)</strong> — tón B₃ (246.9 Hz)</li>
            <li><strong>1. struna (tenké e)</strong> — tón E₄ (329.6 Hz)</li>
          </ul>
          <p class="mt-3">Pamatuj na naši mnemotechnickou pomůcku: <em>"Ema A Dáša Grilují Biftek Extra"</em>.</p>
        `
      },
      {
        title: 'Zlaté pravidlo: Vždy laď zdola nahoru!',
        content: `
          <p>Otáčením ladícího kolíku měníš výšku tónu:</p>
          <ul class="lesson-list">
            <li><strong>Pokud je struna podladěná (tón je příliš nízký):</strong> otáčej kolíkem tak, abys strunu napínal, dokud tón nestoupne na požadovanou výšku.</li>
            <li><strong>Pokud je struna přeladěná (tón je příliš vysoký):</strong> NEPOVOLUJ ji pouze k cíli! Nejprve kolík povol tak, aby byl tón výrazně pod cílovou výškou, a poté <strong>dolaďuj směrem nahoru</strong>.</li>
          </ul>
          <div class="card p-3 my-3 bg-surface-2 border-primary">
            <h5 class="text-primary font-bold mb-1">Proč ladit vždy zdola nahoru?</h5>
            <p class="mb-0">Při dotahování se struna na kolíku pevně usadí v drážce a převod mechaniky je pod stálým tahem. Pokud bys ladil shora dolů (povolením), převod v mechanice by mohl povolit při prvním silnějším úderu trsátka a kytara by se okamžitě rozladila!</p>
          </div>
        `
      },
      {
        title: 'Ladička v Melodriu a digitální pomocníci',
        content: `
          <p>V moderní době nemusíš ladit podle ladičky s ladičkovou vidličkou. V aplikaci Melodrio máš vestavěnou chromatickou ladičku!</p>
          <h4 class="font-bold text-accent mt-3">Jak číst digitální ladičku:</h4>
          <ul class="lesson-list">
            <li><strong>Ručička vlevo (červená barva):</strong> Tón je příliš nízký (bém / flat). Strunu je potřeba utáhnout nahoru.</li>
            <li><strong>Ručička uprostřed (zelená barva):</strong> Perfektní tón! Struna je přesně naladěná.</li>
            <li><strong>Ručička vpravo (červená barva):</strong> Tón je příliš vysoký (křížek / sharp). Povol strunu pod cíl a pomalu dotáhni k zelenému středu.</li>
          </ul>
        `
      }
    ],
    quiz: [
      {
        question: 'Které tóny tvoří standardní ladění kytary od 6. struny (nejtlustší) k 1. struně (nejtenčí)?',
        options: ['E - A - D - G - B - E', 'C - E - G - B - D - F', 'E - G - B - D - F - A', 'A - D - G - C - E - A'],
        correct: 0,
        explanation: 'Standardní ladění je E-A-D-G-B-E.'
      },
      {
        question: 'Proč se doporučuje ladit struny vždy směrem zdola nahoru (dotahováním k tónu)?',
        options: [
          'Protože se tím struna neopotřebovává',
          'Protože mechanika zůstane pod stálým tahem a ladění lépe drží',
          'Nemá to žádný vliv, je to jen zvyk',
          'Při povolování struna vždy okamžitě praskne'
        ],
        correct: 1,
        explanation: 'Dotažením nahoru se vymezí vůle v převodu mechaniky a struna se samovolně nepovolí.'
      },
      {
        question: 'Co znamená, když ručička ladičky ukazuje doleva od středu a svítí červeně?',
        options: [
          'Tón je perfektní a přesně naladěný',
          'Struna je přeladěná (příliš vysoká)',
          'Struna je podladěná (příliš nízká) a je třeba ji utáhnout',
          'Baterie v ladičce je vybitá'
        ],
        correct: 2,
        explanation: 'Ručička vlevo signalizuje nízký tón (podladění) vyžadující napnutí struny.'
      },
      {
        question: 'Jaký je vztah mezi 6. strunou (tlusté E) a 1. strunou (tenké e)?',
        options: [
          'Mají úplně jiný tón bez jakékoliv souvislosti',
          'Hrají stejný tón E, ale ve vzdálenosti 2 oktáv',
          'Obě struny mají přesně stejnou frekvenci',
          'Jedna je v dur a druhá v moll'
        ],
        correct: 1,
        explanation: 'Obě struny mají základní tón E, tenká struna je však o dvě oktávy výše než tlustá basová struna.'
      }
    ]
  },
  {
    id: 4,
    title: 'První tóny na strunách',
    stage: 1,
    stageEmoji: '🏠',
    stageName: 'Garáž',
    type: 'practical',
    typeLabel: 'Praxe',
    description: 'Zahraj si první tóny na otevřených strunách a seznam se s jejich barvou.',
    xpReward: 50,
    steps: [
      {
        title: 'Co je to otevřená struna (Open string)',
        content: `
          <p class="lead">Je čas poprvé rozeznít kytaru! Začneme nejjednodušším možným způsobem — hrou na otevřené struny.</p>
          <p>Pojem <strong>"otevřená struna"</strong> znamená, že levou rukou nemačkáš žádný pražec na hmatníku. Struna volně vibruje v celé své délce mezi nultým pražcem a kobylkou.</p>
          <div class="card p-3 my-3 bg-surface-2 border-primary">
            <p class="mb-0">V kytarových tabulaturách a notových zápisech se otevřená struna vždy označuje <strong>číslem 0</strong>.</p>
          </div>
        `
      },
      {
        title: 'Hluboká basová struna E (6. struna)',
        content: `
          <p>Začni na nejtlustší struně — <strong>6. struna E</strong>.</p>
          <ul class="lesson-list">
            <li>Polož bříško palce pravé ruky (nebo trsátko) shora na 6. strunu.</li>
            <li>Plynulým pohybem směrem dolů přes strunu přejeď a nech ji zaznít.</li>
            <li>Vnímej hluboké, hutné basové vibrace, které rezonují celým tělem kytary.</li>
            <li>Tento tón tvoří základ nespočtu rockových riffů i folkového basování!</li>
          </ul>
        `
      },
      {
        title: 'Basové struny A (5.) a D (4.) a středové G (3.)',
        content: `
          <p>Pokračuj v prozkoumávání dalších strun směrem dolů:</p>
          <ul class="lesson-list">
            <li><strong>5. struna (A):</strong> Druhá nejtlustší struna. Brnkni na ni a poslouchej — tón je o něco vyšší než u tlustého E, ale stále si zachovává basový charakter.</li>
            <li><strong>4. struna (D):</strong> Střední basová struna. Tvoří most mezi basovými a melodickými strunami.</li>
            <li><strong>3. struna (G):</strong> Poslední z basovějších vinutých strun (u akustických kytar). Její tón už jasně vystupuje do středního pásma.</li>
          </ul>
        `
      },
      {
        title: 'Melodické struny B (2.) a tenké E (1.)',
        content: `
          <p>Nyní se přesuneme na dvě nejtenčí struny:</p>
          <ul class="lesson-list">
            <li><strong>2. struna (B / H):</strong> Hladká ocelová (nebo nylonová) struna. Má jasný a pronikavý zvuk.</li>
            <li><strong>1. struna (tenké e):</strong> Úplně nejtenčí struna na samém spodku hmatníku. Zvoní čistým, jasným tónem, který je skvěle slyšet v sólech a vyhrávkách.</li>
          </ul>
          <div class="card p-3 my-3 bg-surface-2">
            <p class="mb-0">✨ <em>Porovnání:</em> Brnkni nejprve na 6. strunu (E) a hned poté na 1. strunu (e). Slyšíš ten obrovský rozsah? Přestože obě struny nesou název E, tenká struna vibruje čtyřikrát rychleji!</p>
          </div>
        `
      },
      {
        title: 'Cvičení: Kytarový vodopád',
        content: `
          <p>Vyzkoušej si své první koordinační cvičení pro pravou ruku!</p>
          <h4 class="font-bold text-accent mt-3">Postup cvičení:</h4>
          <ol class="lesson-list">
            <li>Zahraj postupně shora dolů: <strong>6. strunu → 5. strunu → 4. strunu → 3. strunu → 2. strunu → 1. strunu</strong>.</li>
            <li>Dbej na to, aby každý tón zněl rovnoměrně nahlas a čistě. Nespěchej!</li>
            <li>A nyní v opačném směru: <strong>1. struna → 2. struna → 3. struna → 4. struna → 5. struna → 6. struna</strong>.</li>
            <li>Opakuj tuto sekvenci 5× za sebou. Sleduj, jak se tvá pravá ruka učí přesně nacházet jednotlivé struny bez dívání.</li>
          </ol>
        `
      }
    ],
    quiz: [
      {
        question: 'Co přesně znamená termín "otevřená struna"?',
        options: [
          'Struna je roztržená a visí z kobylky',
          'Struna zní volně bez stisknutí jakéhokoliv pražce levou rukou',
          'Struna je naladěná na otevřené prostranství',
          'Hraje se na ni výhradně bez trsátka'
        ],
        correct: 1,
        explanation: 'Otevřená struna kmitá v celé své délce bez přitlačení prstem na hmatník.'
      },
      {
        question: 'Jakým symbolem nebo číslem se otevřená struna značí v tabulaturách?',
        options: ['Písmenem O', 'Číslem 0', 'Křížkem X', 'Vykřičníkem !'],
        correct: 1,
        explanation: 'Číslo 0 na příslušné lince tabulatury označuje otevřenou strunu.'
      },
      {
        question: 'Která struna na standardně naladěné kytaře vydává nejhlubší tón?',
        options: ['1. struna (tenké e)', '3. struna (G)', '6. struna (tlusté E)', '4. struna (D)'],
        correct: 2,
        explanation: 'Nejtlustší 6. struna E produkuje nejhlubší basový kmitočet.'
      },
      {
        question: 'Kolik strun má běžná standardní kytara?',
        options: ['4 struny', '5 strun', '6 strun', '8 strun'],
        correct: 2,
        explanation: 'Standardní akustická, klasická i elektrická kytara má 6 strun.'
      }
    ]
  },
  {
    id: 5,
    title: 'Čtení tabulatury',
    stage: 1,
    stageEmoji: '🏠',
    stageName: 'Garáž',
    type: 'theory',
    typeLabel: 'Teorie',
    description: 'Tabulatura je kytarový jazyk. Nauč se číst tóny a akordy během 5 minut.',
    xpReward: 50,
    steps: [
      {
        title: 'Co je to kytarová tabulatura (TAB)',
        content: `
          <p class="lead">Zatímco klasičtí hudebníci se musí roky učit složitý notový zápis v houslovém a basovém klíči, kytaristé mají obrovskou výhodu: <strong>tabulaturu (TAB)</strong>.</p>
          <p>Tabulatura je vizuální zápis vytvořený přímo pro hmatník kytary. Neukazuje ti abstraktní hudební noty, ale přesně ti říká: <em>"Na které struně a na kterém pražci máš zmáčknout prst."</em></p>
          <p>Díky tomu se zvládneš naučit své oblíbené písničky a riffy doslova za několik minut!</p>
        `
      },
      {
        title: 'Šest linek — zrcadlo kytary',
        content: `
          <p>Tabulatura se skládá ze <strong>šesti vodorovných linek</strong>. Každá linka představuje jednu strunu kytary:</p>
          <div class="card p-3 my-3 bg-surface-2 font-mono">
            <pre class="mb-0 text-accent font-bold">
e|----------------------------------| (1. struna - nejtenčí, nahoře)
B|----------------------------------| (2. struna)
G|----------------------------------| (3. struna)
D|----------------------------------| (4. struna)
A|----------------------------------| (5. struna)
E|----------------------------------| (6. struna - nejtlustší, dole)
            </pre>
          </div>
          <div class="card p-3 my-3 bg-surface-2 border-primary">
            <h5 class="text-primary font-bold mb-1">Pozor na orientaci:</h5>
            <p class="mb-0">Mnoho začátečníků je zpočátku zmateno tím, že <strong>horní linka představuje nejtenčí strunu e</strong> a spodní linka nejtlustší strunu E. Představ si, že se na kytaru díváš shora dolů, když ji máš položenou na klíně — tenké struny jsou dále a opticky výše!</p>
          </div>
        `
      },
      {
        title: 'Význam čísel na linkách',
        content: `
          <p>Na linkách jsou zapsána <strong>čísla</strong>. Číslo označuje konkrétní <strong>pražec</strong>, který máš na dané struně stisknout:</p>
          <ul class="lesson-list">
            <li><strong>0</strong> = otevřená struna (žádný pražec nemačkáš).</li>
            <li><strong>1</strong> = stiskni strunu na 1. pražci.</li>
            <li><strong>3</strong> = stiskni strunu na 3. pražci.</li>
            <li><strong>5</strong> = stiskni strunu na 5. pražci atd.</li>
          </ul>
          <h4 class="font-bold text-accent mt-3">Jak se tabulatura čte v čase:</h4>
          <p>Tabulatura se čte <strong>zleva doprava</strong>, úplně stejně jako text v knize. Tóny jdoucí po sobě hraješ postupně v čase:</p>
          <div class="card p-3 my-2 bg-surface-2 font-mono">
            <pre class="mb-0 text-accent">
e|-----------------------------------|
B|-----------------------------------|
G|-----------------------------------|
D|---------0---2---3-----------------|
A|-----3-----------------------------|
E|-----------------------------------|
            </pre>
            <p class="text-sm text-muted mt-2 mb-0">Zde zahraješ nejprve strunu A na 3. pražci, poté otevřenou strunu D (0), následně strunu D na 2. pražci a nakonec strunu D na 3. pražci.</p>
          </div>
        `
      },
      {
        title: 'Akordy v tabulatuře',
        content: `
          <p>Co se stane, když se v tabulatuře objeví více čísel svisle přímo nad sebou?</p>
          <div class="card p-3 my-3 bg-surface-2 font-mono">
            <pre class="mb-0 text-accent font-bold">
e|---0---|
B|---0---|
G|---0---|
D|---2---|
A|---2---|
E|---0---|
            </pre>
          </div>
          <h4 class="font-bold text-accent mt-3">Čísla nad sebou = Akord!</h4>
          <p>Pokud jsou čísla zapsána ve stejném sloupci svisle nad sebou, znamená to, že se mají <strong>zahrát současně jedním úderem</strong>. V ukázce výše vidíš zápis akordu Em (E moll) — jedním úderem rozezníš všech 6 strun najednou!</p>
          <div class="card p-3 my-3 bg-surface-2">
            <p class="mb-0">🚫 <em>Značka X:</em> Pokud je na některé lince písmeno <strong>X</strong>, znamená to, že daná struna se v akordu <strong>nesmí hrát</strong> (musí zůstat ztlumená).</p>
          </div>
        `
      }
    ],
    quiz: [
      {
        question: 'Která linka v kytarové tabulatuře představuje nejtenčí 1. strunu (vysoké e)?',
        options: ['Úplně spodní linka', 'Úplně horní linka', 'Třetí linka odspodu', 'Tabulatura nerozlišuje struny'],
        correct: 1,
        explanation: 'Horní linka tabulatury vždy odpovídá nejtenčí 1. struně (vysoké e).'
      },
      {
        question: 'Co znamená číslo 2 na páté lince odspodu (struna B)?',
        options: [
          'Zahraj strunu B dvakrát po sobě',
          'Stiskni strunu B na 2. pražci a brnkni na ni',
          'Zahraj otevřenou strunu B',
          'Vynechej strunu B'
        ],
        correct: 1,
        explanation: 'Číslo udává konkrétní pražec, který máš na příslušné struně stisknout.'
      },
      {
        question: 'Jak v tabulatuře poznáš, že máš zahrát akord (více tónů najednou)?',
        options: [
          'Čísla jsou zapsána svisle v jednom sloupci přímo nad sebou',
          'Všechna čísla jsou podtržená vlnovkou',
          'Čísla jsou zapsána za sebou s pomlčkou',
          'Na začátku řádku je vykřičník'
        ],
        correct: 0,
        explanation: 'Čísla nad sebou v jednom sloupci značí současný úhoz — tedy akord.'
      },
      {
        question: 'Co znamená písmeno "X" na lince v kytarové tabulatuře?',
        options: [
          'Strunu zahraj s maximální silou',
          'Struna se nemá hrát (má být ztlumena)',
          'Struna se ladí o tón výše',
          'Zahraj tón na desátém pražci'
        ],
        correct: 1,
        explanation: 'Značka X znamená ztlumenou strunu, která se při úhozu nesmí ozvat.'
      }
    ]
  },
  {
    id: 6,
    title: 'Akord Em (E minor)',
    stage: 1,
    stageEmoji: '🏠',
    stageName: 'Garáž',
    type: 'practical',
    typeLabel: 'Praxe',
    description: 'Tvůj první skutečný akord! E moll vyžaduje jen dva prsty a zní skvěle.',
    xpReward: 50,
    steps: [
      {
        title: 'Co je to akord a jak vzniká',
        content: `
          <p class="lead">Doposud jsme hráli jednotlivé tóny. Nyní vstupujeme do světa harmonie — naučíme se tvůj vůbec první kytarový akord!</p>
          <p><strong>Akord</strong> je harmonický souzvuk nejméně tří různých tónů zahraných současně. Tvoří hudební základ a doprovod pro zpěv a melodické nástroje.</p>
          <p>Akordy dělíme na dvě hlavní rodiny:</p>
          <ul class="lesson-list">
            <li><strong>Durové akordy (Major):</strong> znějí vesele, optimisticky, jasně a energicky.</li>
            <li><strong>Mollové akordy (Minor):</strong> znějí teskně, tajemně, melancholicky nebo vážně. Značí se malým písmenem <em>m</em> (např. Em, Am, Dm).</li>
          </ul>
        `
      },
      {
        title: 'Proč začínáme akordem Em (E moll)',
        content: `
          <p>Akord <strong>Em (E moll)</strong> je považován za nejjednodušší a nejpřívětivější akord na kytaru z několika důvodů:</p>
          <ul class="lesson-list">
            <li>Potřebuješ k němu <strong>pouze dva prsty</strong> levé ruky.</li>
            <li>Oba prsty leží na stejném (2.) pražci, takže nemusíš prsty složitě roztahovat.</li>
            <li>Rozeznívá se <strong>všech 6 strun</strong>, takže se nemusíš bát nechtěného zavadění o jakoukoliv strunu.</li>
            <li>Má plný, temně sametový a bohatý zvuk s mohutným basovým základem.</li>
          </ul>
        `
      },
      {
        title: 'Prstoklad akordu Em krok za krokem',
        content: `
          <p>Pojďme na to! Připrav si levou ruku a hmatník:</p>
          <ol class="lesson-list">
            <li><strong>Prostředníček (prst 2):</strong> polož na <strong>2. pražec 5. struny (A)</strong>.</li>
            <li><strong>Prsteníček (prst 3):</strong> polož hned vedle na <strong>2. pražec 4. struny (D)</strong>.</li>
            <li>Ostatní struny (6, 3, 2 a 1) nechej zcela volné — budou znít jako otevřené.</li>
            <li>Zkontroluj, že jsou prsty zaoblené jako most a jejich bříška se nedotýkají vedlejších volných strun (3. a 6. struny).</li>
          </ol>
          <div class="card p-3 my-3 bg-surface-2 font-mono">
            <h5 class="text-accent font-bold mb-1">Tabulatura akordu Em:</h5>
            <pre class="mb-0 font-bold">
e|---0---| (otevřená)
B|---0---| (otevřená)
G|---0---| (otevřená)
D|---2---| (prsteníček, 2. pražec)
A|---2---| (prostředníček, 2. pražec)
E|---0---| (otevřená basová)
            </pre>
          </div>
        `
      },
      {
        title: 'Zahrání akordu a kontrola čistoty',
        content: `
          <p>Nyní vezmi trsátko nebo palec pravé ruky a plynulým, sebevědomým pohybem přejeď přes všech 6 strun od shora dolů (od 6. k 1. struně).</p>
          <h4 class="font-bold text-accent mt-3">Test čistoty tónu (Arpeggio test):</h4>
          <p>Nyní zahraj každou strunu <strong>jednu po druhé</strong> pomalu za sebou:</p>
          <ul class="lesson-list">
            <li>Zní každá struna jasně a zvonivě jako zvon? <strong>Skvěle!</strong></li>
            <li>Drnčí 4. nebo 5. struna tupě? <strong>Zatlač na pražci o trochu silněji</strong> těsně za kovový drát.</li>
            <li>Mlčí 3. struna (G)? <strong>Tvůj prsteníček se o ni zespodu opírá.</strong> Zvedni klouby do většího oblouku, aby prst stál kolmo k hmatníku!</li>
          </ul>
        `
      },
      {
        title: 'Zlatá pravidla pro čistý tón bez bolesti',
        content: `
          <p>Zde jsou 3 neocenitelné rady pro tvé začátky:</p>
          <ul class="lesson-list">
            <li><strong>Tlač těsně za pražcovým drátem:</strong> Prsty neumisťuj doprostřed pražcového pole ani přímo na kovový drát. Nejčistší tón s nejmenší potřebnou silou získáš těsně za kovovým pražcem (cca 1–2 mm za ním).</li>
            <li><strong>Nekřečuj:</strong> Tlač jen takovou silou, která stačí k čistému rozeznění tónu. Zbytečně velký tlak unavuje ruku a deformuje ladění.</li>
            <li><strong>Citlivost bříšek prstů:</strong> První 2 až 3 týdny tě mohou mírně pálit bříška prstů. To je zcela normální — kůže se brzy zpevní a vytvoří si přirozený ochranný polštářek!</li>
          </ul>
        `
      }
    ],
    quiz: [
      {
        question: 'Kolik prstů levé ruky potřebuješ ke stisknutí základního akordu Em?',
        options: ['1 prst', '2 prsty', '3 prsty', 'Všechny 4 prsty'],
        correct: 1,
        explanation: 'Akord Em vyžaduje pouze 2 prsty — prostředníček a prsteníček na 2. pražci.'
      },
      {
        question: 'Na kterých strunách leží prsty při hraní akordu Em?',
        options: [
          'Na 1. a 2. struně',
          'Na 5. struně (A) a 4. struně (D)',
          'Na 6. struně (E) a 1. struně (e)',
          'Na 3. a 2. struně'
        ],
        correct: 1,
        explanation: 'Prsty jsou položeny na 5. struně (A) a 4. struně (D) na 2. pražci.'
      },
      {
        question: 'Kolik strun se rozeznívá úderem pravé ruky při hraní akordu Em?',
        options: ['Pouze 2 struny', 'Pouze 4 struny', 'Všech 6 strun', 'Žádná, je to tichý akord'],
        correct: 2,
        explanation: 'Při akordu Em hrajeme plným úhozem přes všech 6 strun kytary.'
      },
      {
        question: 'Co obvykle způsobuje, že 3. struna (G) při hraní akordu Em nezní a je zatlumená?',
        options: [
          'Kytara je rozladěná',
          'Prsteníček leží příliš naplocho a dotýká se vedlejší 3. struny',
          'Struna G se v akordu Em nesmí hrát',
          'Trsátko je příliš měkké'
        ],
        correct: 1,
        explanation: 'Plochý prst se zespodu opírá o sousední strunu. Pomůže postavit prsty kolmo do oblouku.'
      }
    ]
  },
  {
    id: 7,
    title: 'Akord Am (A minor)',
    stage: 1,
    stageEmoji: '🏠',
    stageName: 'Garáž',
    type: 'practical',
    typeLabel: 'Praxe',
    description: 'Druhý nejdůležitější mollový akord — nauč se A moll a ovládni hru 5 strun.',
    xpReward: 50,
    steps: [
      {
        title: 'Seznámení s akordem Am (A moll)',
        content: `
          <p class="lead">Gratulujeme ke zvládnutí Em! Nyní se seznámíme s jeho nerozlučným bratrem — akordem <strong>Am (A moll)</strong>.</p>
          <p>Akord A moll má nádherný, nostalgický, folkový zvuk. Spolu s akordem Em tvoří základ nespočtu táborákových písní, balad i rockových hitů (např. <em>Stairway to Heaven</em> nebo <em>Losing My Religion</em>).</p>
          <p>Akord Am vyžaduje 3 prsty, ale má obrovskou výhodu: jeho tvar je téměř identický s dalším akordem, který se brzy naučíš (E dur)!</p>
        `
      },
      {
        title: 'Prstoklad akordu Am krok za krokem',
        content: `
          <p>Zapojíme tři prsty levé ruky:</p>
          <ol class="lesson-list">
            <li><strong>Ukazováček (prst 1):</strong> polož na <strong>1. pražec 2. struny (B / H)</strong>.</li>
            <li><strong>Prostředníček (prst 2):</strong> polož na <strong>2. pražec 4. struny (D)</strong>.</li>
            <li><strong>Prsteníček (prst 3):</strong> polož na <strong>2. pražec 3. struny (G)</strong> (přímo pod prostředníček).</li>
            <li>Tenká 1. struna (e) a 5. struna (A) zůstávají volné — otevřené.</li>
          </ol>
          <div class="card p-3 my-3 bg-surface-2 font-mono">
            <h5 class="text-accent font-bold mb-1">Tabulatura akordu Am:</h5>
            <pre class="mb-0 font-bold">
e|---0---| (otevřená)
B|---1---| (ukazováček, 1. pražec)
G|---2---| (prsteníček, 2. pražec)
D|---2---| (prostředníček, 2. pražec)
A|---0---| (otevřená basová struna A)
E|---X---| (NEHRÁT!)
            </pre>
          </div>
        `
      },
      {
        title: 'Zásadní pravidlo: 6. strunu nehrajeme!',
        content: `
          <p>Všimni si písmene <strong>X</strong> u 6. struny v tabulatuře. Toto je extrémně důležitý moment tvého kytarového vývoje:</p>
          <h4 class="font-bold text-accent mt-3">Proč se 6. struna nehraje?</h4>
          <p>Základním tónem (kořenem) akordu A moll je tón <strong>A</strong>. Tento tón se nachází na otevřené 5. struně. Pokud bys zahrál i tlustou 6. strunu E, basový tón E by zamlžil čistý charakter akordu A moll.</p>
          <h4 class="font-bold text-accent mt-3">Jak 6. strunu vynechat:</h4>
          <ul class="lesson-list">
            <li><strong>Pravou rukou:</strong> začínej úder trsátkem až od 5. struny (A) dolů.</li>
            <li><strong>Tlumící technika palce:</strong> Můžeš nechat špičku palce levé ruky lehce shora zavadit o 6. strunu. Tím ji bezpečně utlumíš, takže nevydá žádný tón ani v případě, že o ni trsátkem nechtěně zavadíš!</li>
          </ul>
        `
      },
      {
        title: 'Srovnání tvaru: Em vs. Am',
        content: `
          <p>Podívej se pozorně na prsty prostředníčku a prsteníčku:</p>
          <div class="card p-3 my-3 bg-surface-2">
            <p>U <strong>Em</strong> máš tyto dva prsty na 5. a 4. struně na 2. pražci.</p>
            <p class="mb-0">U <strong>Am</strong> jsou tyto dva prsty posunuty o jednu strunu níže — na 4. a 3. strunu — a přibyl ukazováček na 1. pražci 2. struny!</p>
          </div>
          <p>Tato vizuální podobnost ti pomůže rychle si tvar akordu zapamatovat. Nyní brnkni po jednotlivých strunách od 5. k 1. a ujisti se, že všech 5 strun zní čistě.</p>
        `
      }
    ],
    quiz: [
      {
        question: 'Kolik strun se standardně rozeznívá při úhozu na akord Am?',
        options: ['Všech 6 strun', 'Pouze 5 strun (od struny A dolů)', 'Pouze 3 struny', 'Pouze 1 struna'],
        correct: 1,
        explanation: 'Akord Am se hraje přes 5 strun — od 5. struny A dolů. Tlustá 6. struna se nehraje.'
      },
      {
        question: 'Na kterém pražci a struně leží ukazováček levé ruky v akordu Am?',
        options: [
          '1. pražec na 2. struně (B / H)',
          '2. pražec na 5. struně',
          '3. pražec na 1. struně',
          'Ukazováček se v akordu Am nepoužívá'
        ],
        correct: 0,
        explanation: 'Ukazováček tiskne 1. pražec na 2. struně (B / H).'
      },
      {
        question: 'Která struna slouží jako základní basový tón pro akord Am?',
        options: ['6. struna (tlusté E)', '5. struna (otevřené A)', '1. struna (tenké e)', '4. struna (D)'],
        correct: 1,
        explanation: 'Základním basem je otevřená 5. struna A, podle které se akord jmenuje.'
      },
      {
        question: 'Jak může levá ruka bezpečně zabránit nechtěnému zaznění 6. struny?',
        options: [
          'Odmontováním 6. struny z kytary',
          'Lehkým dotykem špičky palce shora o 6. strunu (zatlumením)',
          'Silným stiskem 6. struny na 5. pražci',
          'Nelze tomu nijak zabránit'
        ],
        correct: 1,
        explanation: 'Lehký dotek hrany nebo špičky palce o 6. strunu ji spolehlivě utlumí.'
      }
    ]
  },
  {
    id: 8,
    title: 'Střídání akordů Em–Am',
    stage: 1,
    stageEmoji: '🏠',
    stageName: 'Garáž',
    type: 'exercise',
    typeLabel: 'Cvičení',
    description: 'Získej plynulost v přechodech mezi akordy Em a Am bez zbytečných záseků.',
    xpReward: 50,
    steps: [
      {
        title: 'Proč je plynulý přechod klíčem ke hře',
        content: `
          <p class="lead">Nyní znáš své první dva akordy — Em a Am. Umět chytit akord samostatně je však jen polovina úspěchu. Skutečná hudba začíná ve chvíli, kdy dokážeš <strong>plynule přecházet z jednoho akordu do druhého</strong> bez přerušení rytmu!</p>
          <p>Nejčastější problém začátečníků: zahrají akord, zastaví pravou ruku, začnou očima hledat struny, po jednom prstu poskládají nový akord a teprve pak znovu brnknou. Tím se rytmus úplně rozpadne.</p>
          <p>V této lekci tě naučíme profesionální techniku plynulého střídání!</p>
        `
      },
      {
        title: 'Zásada společného pohybu prstů',
        content: `
          <p>Tajemství rychlého přehmatávání spočívá v tom, že se prsty pohybují <strong>najednou jako jeden koordinovaný celek</strong>.</p>
          <h4 class="font-bold text-accent mt-3">Postup nácviku "na sucho":</h4>
          <ol class="lesson-list">
            <li>Chyť akord <strong>Em</strong>.</li>
            <li>Zvedni všechny prsty zhruba 1 cm nad hmatník, ale <strong>ponechej je ve tvaru akordu</strong>.</li>
            <li>Ve vzduchu přesuň ruku do tvaru <strong>Am</strong>.</li>
            <li>Polož všechny tři prsty na hmatník <strong>ve stejný okamžik</strong>!</li>
            <li>Opakuj tento pohyb sem a tam bez brnkání pravou rukou po dobu 2 minut. Tvé svaly si vytvoří potřebnou paměťovou stopu.</li>
          </ol>
        `
      },
      {
        title: 'Tréninkové cvičení ve 4 dobách',
        content: `
          <p>Nyní zapojíme rytmus a pravou ruku ve čtyřdobém taktu (4/4):</p>
          <div class="card p-3 my-3 bg-surface-2 font-mono">
            <p class="text-accent font-bold mb-1">Cvičební vzorec:</p>
            <p class="mb-1">[Takt 1] <strong>Em:</strong> ↓ (doba 1) - ↓ (doba 2) - ↓ (doba 3) - ↓ (doba 4)</p>
            <p class="mb-0">[Takt 2] <strong>Am:</strong> ↓ (doba 1) - ↓ (doba 2) - ↓ (doba 3) - ↓ (doba 4)</p>
          </div>
          <h4 class="font-bold text-accent mt-3">Zlatý trik pro přechod:</h4>
          <p>Na dobu <strong>4</strong> v prvním taktu už začni prsty levé ruky uvolňovat a přesouvat. Na dobu <strong>1</strong> dalšího taktu musí akord Am pevně dosednout a zaznít!</p>
          <p>Počítej si nahlas: <em>"Raz, dva, tři, čtyři — změna, dva, tři, čtyři!"</em></p>
        `
      },
      {
        title: 'Ekonomie pohybu a kotevní technika',
        content: `
          <p>Zde je pravidlo, které odlišuje zkušené kytaristy od věčných začátečníků:</p>
          <h4 class="font-bold text-accent mt-3">Ekonomie pohybu</h4>
          <p>Při zvedání prstů z akordu Em neodtahuj prsty 5 centimetrů daleko od hmatníku! Čím dále prsty odletí, tím delší cestu musí urazit zpět a tím větší je šance, že netrefí správný pražec. Drž prsty co nejblíže strunám — jako by se jich téměř dotýkaly.</p>
          <div class="card p-3 my-3 bg-surface-2 border-accent">
            <h5 class="text-accent font-bold mb-1">🏆 Gratulujeme k dokončení Garáže!</h5>
            <p class="mb-0">Zvládl jsi 8 lekcí první fáze! Máš perfektní základy držení, ladění, tabulatur i první akordové přechody. Odemkl jsi další úroveň své hudební cesty: <strong>Otevřenou scénu 🎤</strong>!</p>
          </div>
        `
      }
    ],
    quiz: [
      {
        question: 'Jak by se měly prsty levé ruky ideálně pohybovat při změně akordu?',
        options: [
          'Postupně jeden po druhém pomalu skládat na struny',
          'Současně jako jeden tvar a dopadnout na hmatník ve stejný okamžik',
          'Vždy zvednout pouze palec a ostatní prsty táhnout po strunách',
          'Prsty se při změně akordu nesmí zvednout'
        ],
        correct: 1,
        explanation: 'Současný pohyb všech prstů je základem plynulého a rychlého přechodu mezi akordy.'
      },
      {
        question: 'Co znamená pojem "ekonomie pohybu" v kytarové technice?',
        options: [
          'Kupovat co nejlevnější trsátka a struny',
          'Pohybovat prsty co nejmenší možnou dráhou a držet je blízko hmatníku',
          'Hrát pouze na dvě struny z ekonomických důvodů',
          'Hrát písničky co nejrychleji'
        ],
        correct: 1,
        explanation: 'Ekonomie pohybu znamená minimální nutný pohyb prstů pro maximální rychlost a přesnost.'
      },
      {
        question: 'Na kterou dobu v taktu musí nový akord přesně zaznít?',
        options: [
          'Na jakoukoliv dobu, na tempu nezáleží',
          'Na první dobu (těžkou dobu) nového taktu',
          'Až po skončení taktu',
          'Výhradně mezi dobami'
        ],
        correct: 1,
        explanation: 'Akord musí pevně zaznít na první dobu taktu, aby nebyl narušen rytmus skladby.'
      },
      {
        question: 'Které dva prsty mají stejný rozestup v akordu Em i Am (jen posunutý o strunu níže)?',
        options: [
          'Palec a ukazováček',
          'Prostředníček a prsteníček',
          'Malíček a palec',
          'Ukazováček a malíček'
        ],
        correct: 1,
        explanation: 'Prostředníček a prsteníček si zachovávají vzájemnou polohu, pouze se posunou z strun 5-4 na struny 4-3.'
      }
    ]
  },
];
