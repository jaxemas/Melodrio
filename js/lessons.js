/**
 * Melodrio - Kytarová škola (Lessons Module)
 * Obsahuje kompletní data lekcí 1-15 a veškerou logiku vykreslování lekcí, kroků a kvízů.
 */

const LESSONS_DATA = [
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
  {
    id: 9,
    title: 'Akord E dur',
    stage: 2,
    stageEmoji: '🎤',
    stageName: 'Otevřená scéna',
    type: 'practical',
    typeLabel: 'Praxe',
    description: 'Přejdi do dur! Akord E dur je jasný, energický a otevírá dveře k rockové klasice.',
    xpReward: 50,
    steps: [
      {
        title: 'Rozdíl mezi dur a moll v praxi',
        content: `
          <p class="lead">Vítej na Otevřené scéně! Dnes vstoupíme do světa <strong>durových akordů</strong>.</p>
          <p>Zatímco dosud známé akordy Em a Am měly zádumlivý, melancholický nádech, durové akordy vnášejí do hudby světlo, radost, sílu a optimismus. Jsou základním stavebním kamenem rock 'n' rollu, popu i country.</p>
          <p>Prvním durovým akordem, který si osvojíš, je <strong>E dur (označovaný jednoduše jako E)</strong>.</p>
        `
      },
      {
        title: 'Seznámení s akordem E dur',
        content: `
          <p>Máme pro tebe skvělou zprávu: akord E dur už z 80 % znáš!</p>
          <p>Jeho prstoklad vychází přímo z akordu Em (E moll), který už máš dokonale v prstech. Stačí vzít prstoklad Em a <strong>přidat jeden jediný prst navíc</strong>.</p>
          <div class="card p-3 my-3 bg-surface-2 border-primary">
            <p class="mb-0">Tento jediný tón navíc (tón G# na 1. pražci) způsobí magickou proměnu: změní mollovou tercii na durovou a celý akord rázem prozáří energickým jasem!</p>
          </div>
        `
      },
      {
        title: 'Prstoklad akordu E dur krok za krokem',
        content: `
          <p>Jak akord E dur chytit:</p>
          <ol class="lesson-list">
            <li><strong>Prostředníček (2):</strong> polož na <strong>2. pražec 5. struny (A)</strong>.</li>
            <li><strong>Prsteníček (3):</strong> polož na <strong>2. pražec 4. struny (D)</strong>.</li>
            <li><strong>Ukazováček (1):</strong> polož na <strong>1. pražec 3. struny (G)</strong>!</li>
            <li>Ostatní struny (6, 2, 1) zůstávají otevřené.</li>
          </ol>
          <div class="card p-3 my-3 bg-surface-2 font-mono">
            <h5 class="text-accent font-bold mb-1">Tabulatura akordu E dur:</h5>
            <pre class="mb-0 font-bold">
e|---0---| (otevřená)
B|---0---| (otevřená)
G|---1---| (ukazováček, 1. pražec)
D|---2---| (prsteníček, 2. pražec)
A|---2---| (prostředníček, 2. pražec)
E|---0---| (otevřená basová)
            </pre>
          </div>
          <p class="mt-2">Přejeď přes <strong>všech 6 strun</strong> shora dolů. Slyšíš ten mohutný, jasný a průrazný tón?</p>
        `
      },
      {
        title: 'Přímé srovnání: E dur vs. E moll',
        content: `
          <p>Vyzkoušej si skvělý sluchový experiment:</p>
          <ol class="lesson-list">
            <li>Chyť akord <strong>E dur</strong> a zahraj úder dolů. Vnímej radostný, energický charakter.</li>
            <li>Nyní pouze <strong>zvedni ukazováček</strong> z 1. pražce 3. struny (vznikne akord <strong>Em</strong>) a znovu zahraj.</li>
            <li>Slyšíš, jak se atmosféra v místnosti v mžiku změnila v tajuplný smutek?</li>
            <li>Znovu polož ukazováček na 1. pražec — a slunce opět svítí!</li>
          </ol>
          <p>Střídej takto E a Em. Je to fascinující ukázka toho, jak jediný půltón ovládá lidské emoce v hudbě.</p>
        `
      }
    ],
    quiz: [
      {
        question: 'Jaký je jediný rozdíl v prstokladu mezi akordy E dur a Em (E moll)?',
        options: [
          'U akordu E dur se nehraje 6. struna',
          'V akordu E dur přibývá ukazováček na 1. pražci 3. struny',
          'Všechny prsty se posunou o pražec výše',
          'E dur vyžaduje hru malíčkem na 5. pražci'
        ],
        correct: 1,
        explanation: 'Akord E dur se liší od Em pouze přidáním ukazováčku na 1. pražec 3. struny (tón G#).'
      },
      {
        question: 'Kolik strun rozezníváme při hraní akordu E dur?',
        options: ['Pouze 4 struny', 'Pouze 5 strun', 'Všech 6 strun', 'Pouze 3 basové struny'],
        correct: 2,
        explanation: 'Při akordu E dur hrajeme plný úhoz přes všech 6 strun kytary.'
      },
      {
        question: 'Jakou náladu a charakter obvykle vyvolávají durové akordy v hudbě?',
        options: [
          'Veselou, jasnou, energickou a pozitivní',
          'Temnou, strašidelnou a disonantní',
          'Truchlivou a plačtivou',
          'Durové akordy nemají žádnou náladu'
        ],
        correct: 0,
        explanation: 'Durové akordy obecně působí světle, optimisticky a energicky.'
      },
      {
        question: 'Tvar kterého dříve naučeného akordu je zcela identický s tvarem akordu E dur (pouze posunutý o strunu níže)?',
        options: ['Akord Em', 'Akord Am', 'Akord C', 'Žádný takový není'],
        correct: 1,
        explanation: 'Tvar akordu Am je naprosto shodný s E dur, pouze leží o jednu strunu níže (na strunách 4, 3, 2).'
      }
    ]
  },
  {
    id: 10,
    title: 'Akord A dur',
    stage: 2,
    stageEmoji: '🎤',
    stageName: 'Otevřená scéna',
    type: 'practical',
    typeLabel: 'Praxe',
    description: 'Tři prsty na jednom pražci. Ovládni zářivý a oblíbený durový akord A.',
    xpReward: 50,
    steps: [
      {
        title: 'Zářivý a energický akord A dur',
        content: `
          <p class="lead">Akord <strong>A dur (A)</strong> patří k nejpoužívanějším akordům v rockové, popové i country hudbě. Má zvonivý, otevřený a průrazný tón.</p>
          <p>Představuje však zajímavou technickou výzvu: musíš poskládat <strong>tři prsty vedle sebe na stejný (2.) pražec</strong>! Zpočátku se může zdát, že je na pražci příliš málo místa, ale s naším osvědčeným trikem to zvládneš levou zadní.</p>
        `
      },
      {
        title: 'Prstoklad akordu A dur',
        content: `
          <p>Klasický prstoklad využívá ukazováček, prostředníček a prsteníček na 2. pražci:</p>
          <ol class="lesson-list">
            <li><strong>Ukazováček (1):</strong> polož na <strong>2. pražec 4. struny (D)</strong>.</li>
            <li><strong>Prostředníček (2):</strong> polož na <strong>2. pražec 3. struny (G)</strong>.</li>
            <li><strong>Prsteníček (3):</strong> polož na <strong>2. pražec 2. struny (B / H)</strong>.</li>
            <li><strong>5. struna (A)</strong> a <strong>1. struna (e)</strong> znějí otevřené!</li>
            <li><strong>6. strunu (E) NEHRAJEME!</strong></li>
          </ol>
          <div class="card p-3 my-3 bg-surface-2 font-mono">
            <h5 class="text-accent font-bold mb-1">Tabulatura akordu A dur:</h5>
            <pre class="mb-0 font-bold">
e|---0---| (otevřená)
B|---2---| (prsteníček, 2. pražec)
G|---2---| (prostředníček, 2. pražec)
D|---2---| (ukazováček, 2. pražec)
A|---0---| (otevřená basová struna A)
E|---X---| (NEHRÁT!)
            </pre>
          </div>
        `
      },
      {
        title: 'Trik: Jak se pohodlně vejít na 2. pražec',
        content: `
          <p>Pokud se ti zdá, že se tři prsty vedle sebe mezi kovové dráty nevejdou, vyzkoušej tento trik:</p>
          <div class="card p-3 my-3 bg-surface-2 border-accent">
            <h5 class="text-accent font-bold mb-1">Trik s mírným natočením ruky:</h5>
            <p class="mb-0">Neklaď prsty vodorovně v jedné kolmé přímce. <strong>Natoč zápěstí a prsty mírně šikmo</strong> vůči pražcům! Prsty se pak poskládají jako střešní tašky mírně za sebe: prsteníček bude nejblíže pražcovému drátu, prostředníček uprostřed a ukazováček mírně vzadu. Všechny tři struny budou znít dokonale čistě!</p>
          </div>
        `
      },
      {
        title: 'Srovnání A dur vs. A moll a správný bas',
        content: `
          <p>Podívejme se na rozdíl mezi A dur a A moll:</p>
          <ul class="lesson-list">
            <li><strong>Am (A moll):</strong> ukazováček je na 1. pražci 2. struny.</li>
            <li><strong>A (A dur):</strong> ukazováček se posouvá na 2. pražec a všechny tři struny (D, G, B) jsou na 2. pražci.</li>
          </ul>
          <p>Stejně jako u akordu Am, i u akordu A dur je základním tónem otevřená 5. struna A. Proto <strong>úder pravé ruky směřuj přes 5 strun</strong> (od 5. k 1. struně) a 6. strunu vynech nebo utlum hranou palce.</p>
        `
      }
    ],
    quiz: [
      {
        question: 'Na kterém pražci leží všechny tři mačkané struny v základním akordu A dur?',
        options: ['Na 1. pražci', 'Na 2. pražci', 'Na 3. pražci', 'Každý prst je na jiném pražci'],
        correct: 1,
        explanation: 'V akordu A dur jsou všechny 3 stisknuté struny (D, G, B) na 2. pražci.'
      },
      {
        question: 'Která struna se při hraní akordu A dur nesmí hrát?',
        options: ['1. struna (tenké e)', '5. struna (A)', '6. struna (tlusté E)', '3. struna (G)'],
        correct: 2,
        explanation: 'Tlustá 6. struna E se nehraje; akord zní od otevřené 5. struny A.'
      },
      {
        question: 'Co pomůže, pokud se tři prsty nevejdou vedle sebe na jeden pražec v akordu A dur?',
        options: [
          'Natočit zápěstí a prsty mírně šikmo k pražci jako diagonálu',
          'Použít kladivo',
          'Ostříhat si prsty',
          'Vynechat jednu ze strun'
        ],
        correct: 0,
        explanation: 'Mírné diagonální natočení prstů umožní pohodlné seskupení tří prstů na jediném pražci.'
      },
      {
        question: 'Kolik strun celkem se rozeznívá při čistém zahrání akordu A dur?',
        options: ['3 struny', '4 struny', '5 strun', 'Všech 6 strun'],
        correct: 2,
        explanation: 'Hraje se 5 strun: otevřená 5. struna, tři mačkané struny na 2. pražci a otevřená 1. struna.'
      }
    ]
  },
  {
    id: 11,
    title: 'Akord D dur',
    stage: 2,
    stageEmoji: '🎤',
    stageName: 'Otevřená scéna',
    type: 'practical',
    typeLabel: 'Praxe',
    description: 'Zvonivý trojúhelník na tenkých strunách. D dur dodá tvé hře lesk a jiskru.',
    xpReward: 50,
    steps: [
      {
        title: 'Jasný a zvonivý tón akordu D dur',
        content: `
          <p class="lead">Akord <strong>D dur (D)</strong> je třetím královským durovým akordem naší série. Má neobyčejně jasný, zvonivý a radostný charakter.</p>
          <p>Zatímco akordy E a A zapojovaly i hluboké basové struny, akord D se soustředí především na <strong>čtyři nejtenčí struny</strong>. Díky tomu skvěle prořezává zvuk kapely a dodává kytarovému doprovodu vzdušnost.</p>
        `
      },
      {
        title: 'Prstoklad "trojúhelníku" krok za krokem',
        content: `
          <p>Prsty levé ruky tvoří na hmatníku tvar malého trojúhelníku:</p>
          <ol class="lesson-list">
            <li><strong>Ukazováček (1):</strong> polož na <strong>2. pražec 3. struny (G)</strong>.</li>
            <li><strong>Prostředníček (2):</strong> polož na <strong>2. pražec 1. struny (tenké e)</strong>.</li>
            <li><strong>Prsteníček (3):</strong> polož na <strong>3. pražec 2. struny (B / H)</strong> (vklouzne mezi ně o pražec dál).</li>
            <li><strong>4. struna (D)</strong> zní otevřená jako základní bas!</li>
            <li><strong>6. a 5. strunu NEHRAJEME!</strong></li>
          </ol>
          <div class="card p-3 my-3 bg-surface-2 font-mono">
            <h5 class="text-accent font-bold mb-1">Tabulatura akordu D dur:</h5>
            <pre class="mb-0 font-bold">
e|---2---| (prostředníček, 2. pražec)
B|---3---| (prsteníček, 3. pražec)
G|---2---| (ukazováček, 2. pražec)
D|---0---| (otevřená basová struna D)
A|---X---| (NEHRÁT!)
E|---X---| (NEHRÁT!)
            </pre>
          </div>
        `
      },
      {
        title: 'Rozsah úderu: Pouze 4 nejtenčí struny!',
        content: `
          <p>U akordu D dur je přesnost pravé ruky klíčová:</p>
          <p>Základním basovým tónem je otevřená <strong>4. struna D</strong>. Dvě nejtlustší struny (6. struna E a 5. struna A) nesmí zaznít!</p>
          <div class="card p-3 my-3 bg-surface-2 border-primary">
            <h5 class="text-primary font-bold mb-1">Jak na přesný úhoz:</h5>
            <p class="mb-0">Pravou ruku nasměruj tak, aby trsátko zahájilo úder přesně na 4. struně a projelo dolů přes 3., 2. a 1. strunu. Palec levé ruky můžeš nechat shora lehce spočívat na strunách 6 a 5 a tím je pro jistotu zatlumit.</p>
          </div>
        `
      },
      {
        title: 'Prevence tlumení tenké struny e',
        content: `
          <p>Nejčastější chyba začátečníků u akordu D dur:</p>
          <p>Prsteníček položený na 3. pražci 2. struny se často spodní hranou opře o tenkou 1. strunu e a způsobí její ztlumení nebo nepříjemné drnčení.</p>
          <h4 class="font-bold text-accent mt-3">Jak to napravit:</h4>
          <ul class="lesson-list">
            <li>Postav prsteníček <strong>přísně kolmo</strong> na špičku.</li>
            <li>Mírně posuň zápěstí levé ruky dopředu pod krk kytary — tím se prsty přirozeně vyklenou do dokonalého oblouku.</li>
            <li>Zkontroluj tón po tónu: 4 (D) → 3 (G) → 2 (B) → 1 (e). Všechny 4 tóny musí čistě zvonit!</li>
          </ul>
        `
      }
    ],
    quiz: [
      {
        question: 'Kolik strun se standardně hraje při úderu na akord D dur?',
        options: ['Všech 6 strun', '5 strun', 'Pouze 4 nejtenčí struny (od struny D dolů)', 'Pouze 2 struny'],
        correct: 2,
        explanation: 'Akord D dur se hraje pouze přes 4 struny — od 4. struny D dolů.'
      },
      {
        question: 'Na kterém pražci leží prsteníček v akordu D dur (na 2. struně)?',
        options: ['Na 1. pražci', 'Na 2. pražci', 'Na 3. pražci', 'Na 4. pražci'],
        correct: 2,
        explanation: 'Prsteníček je na 3. pražci 2. struny a tvoří špičku pomyslného trojúhelníku.'
      },
      {
        question: 'Která struna slouží jako základní basový tón akordu D dur?',
        options: ['Otevřená 4. struna (D)', '6. struna (E)', '5. struna (A)', '1. struna (tenké e)'],
        correct: 0,
        explanation: 'Základním basovým tónem je otevřená 4. struna D.'
      },
      {
        question: 'Jaký geometrický tvar připomíná rozmístění prstů akordu D dur na hmatníku?',
        options: ['Čtverec', 'Rovná přímka', 'Trojúhelník', 'Kružnice'],
        correct: 2,
        explanation: 'Prsty 1 a 2 na 2. pražci a prst 3 na 3. pražci vytvářejí charakteristický trojúhelníkový tvar.'
      }
    ]
  },
  {
    id: 12,
    title: 'Rytmus a strumming',
    stage: 2,
    stageEmoji: '🎤',
    stageName: 'Otevřená scéna',
    type: 'practical',
    typeLabel: 'Praxe',
    description: 'Pravá ruka je motor kytary. Osvoj si údery dolů, nahoru a slavný táborákový rytmus.',
    xpReward: 50,
    steps: [
      {
        title: 'Co je to strumming a jak uvolnit zápěstí',
        content: `
          <p class="lead">Znáš už pět skvělých akordů (Em, Am, E, A, D). Nyní je čas vdechnout jim život tím nejdůležitějším prvkem hudby — <strong>rytmem</strong>!</p>
          <p><strong>Strumming</strong> (česky rytmový doprovod nebo "drnkání") je plynulý přejezd trsátka přes struny. Většina energie a kouzla kytary nespočívá v tom, jaké akordy držíš, ale <strong>jakým rytmem je hraješ</strong>.</p>
          <div class="card p-3 my-3 bg-surface-2 border-primary">
            <h5 class="text-primary font-bold mb-1">Pravidlo kyvadla:</h5>
            <p class="mb-0">Představ si své pravé předloktí a zápěstí jako neúnavné kyvadlo nástěnných hodin. Ruka se neustále pohybuje nahoru a dolů v pravidelném tempu, i když zrovna v dané chvíli žádnou strunu nezasáhne!</p>
          </div>
        `
      },
      {
        title: 'Úder dolů (Downstroke ↓)',
        content: `
          <p>Základní stavební kámen rytmu:</p>
          <ul class="lesson-list">
            <li>Označuje se symbolem <strong>↓</strong> (nebo šipkou dolů).</li>
            <li>Pohyb začíná nad nejtlustší hranou strun a trsátko přirozeně sklouzne dolů k tenkým strunám.</li>
            <li>Trsátko drž v mírném úhlu, aby po strunách hladce přejelo a nezasekávalo se.</li>
            <li>Tento úder nese hlavní energii a těžkou dobu taktu.</li>
          </ul>
        `
      },
      {
        title: 'Úder nahoru (Upstroke ↑)',
        content: `
          <p>Zpětný pohyb kyvadla:</p>
          <ul class="lesson-list">
            <li>Označuje se symbolem <strong>↑</strong> (nebo šipkou nahoru).</li>
            <li>Trsátko se vrací zdola nahoru.</li>
            <li><strong>Kriticky důležitý tip:</strong> Při úderu nahoru se NESNAŽ zasáhnout všech 6 strun! Stačí zavadit pouze o <strong>2 až 4 nejtenčí struny</strong>. Zvuk bude lehký, vzdušný a ruka se neunaví.</li>
          </ul>
        `
      },
      {
        title: 'Základní čtyřdobý rytmický vzor (4/4)',
        content: `
          <p>Většina populární hudby se počítá na 4 doby v taktu. Začneme jednoduchým počítáním:</p>
          <div class="card p-3 my-3 bg-surface-2 font-mono text-center">
            <h4 class="text-accent font-bold mb-2">Počítání: 1 - 2 - 3 - 4</h4>
            <h3 class="text-white font-bold tracking-widest mb-0">↓ &nbsp;&nbsp; ↓ &nbsp;&nbsp; ↓ &nbsp;&nbsp; ↓</h3>
            <p class="text-sm text-muted mt-2 mb-0">(čtyři rovnoměrné údery dolů)</p>
          </div>
          <p>Chyť akord <strong>Em</strong> a vyzkoušej si to. Počítej nahlas: <em>"Prv-ní, dru-há, tře-tí, čtvr-tá"</em> a na každé slovo zahraj úder dolů. Drž tempo stabilní jako metronom!</p>
        `
      },
      {
        title: 'Legendární táborákový rytmus (Old faithful)',
        content: `
          <p>A teď přichází král všech kytarových rytmů! Tento vzor tvoří základ pro více než 70 % všech folkových, popových a rockových písniček:</p>
          <div class="card p-3 my-3 bg-surface-2 font-mono text-center">
            <h4 class="text-accent font-bold mb-2">Počítání: 1 &nbsp; 2 a &nbsp; (a) 4 a</h4>
            <h3 class="text-white font-bold tracking-widest mb-0">↓ &nbsp;&nbsp;&nbsp; ↓ ↑ &nbsp;&nbsp;&nbsp; ↑ ↓ ↑</h3>
            <p class="text-sm text-accent mt-2 mb-0">Dolu — Dolu Nahoru — Nahoru Dolu Nahoru</p>
          </div>
          <h4 class="font-bold text-accent mt-3">Jak na to:</h4>
          <ol class="lesson-list">
            <li>Doba 1: <strong>Úder dolů (↓)</strong></li>
            <li>Doba 2: <strong>Dolů a hned nahoru (↓ ↑)</strong></li>
            <li>Doba 3: <strong>Ruka mine struny dolů a zahraje až nahoru (↑)</strong></li>
            <li>Doba 4: <strong>Dolů a nahoru (↓ ↑)</strong></li>
          </ol>
          <p>Tento rytmus se ti brzy dostane hluboko pod kůži a budeš ho hrát zcela automaticky!</p>
        `
      }
    ],
    quiz: [
      {
        question: 'Odkud by měl primárně vycházet pohyb pravé ruky při strummingu?',
        options: ['Z uvolněného a pružného zápěstí', 'Z křečovitého ramene', 'Ze sevřeného lokte', 'Z prstů levé ruky'],
        correct: 0,
        explanation: 'Pružné zápěstí zaručuje lehkost, plynulost a správnou dynamiku hry.'
      },
      {
        question: 'Kolik strun je ideální zasáhnout při úderu nahoru (upstroke)?',
        options: [
          'Všech 6 strun s maximální silou',
          'Pouze nejtlustší 6. strunu',
          'Pouze 2 až 4 nejtenčí struny',
          'Žádnou strunu'
        ],
        correct: 2,
        explanation: 'Úder nahoru má být lehký a vzdušný, proto stačí zachytit jen spodní 2 až 4 struny.'
      },
      {
        question: 'Jak zní nejslavnější univerzální kytarový rytmický vzor (tzv. táborákový vzor)?',
        options: [
          '↓  ↓  ↓  ↓',
          '↓  ↓↑  ↑↓↑',
          '↑  ↑  ↑  ↑',
          '↓↑↓↑↓↑↓↑'
        ],
        correct: 1,
        explanation: 'Vzor [↓  ↓↑  ↑↓↑] (Dolů, Dolů-Nahoru, Nahoru-Dolů-Nahoru) je nejuniverzálnějším rytmem.'
      },
      {
        question: 'Proč je při cvičení rytmu důležité počítat si nahlas?',
        options: [
          'Abychom probudili sousedy',
          'Pomáhá to zafixovat vnitřní metronom a udržet rovnoměrné tempo',
          'Zlepšuje to ladění strun',
          'Počítání nemá žádný vliv'
        ],
        correct: 1,
        explanation: 'Hlasité počítání pomáhá udržet rovnoměrný rytmický puls a brání zrychlování či zpomalování.'
      }
    ]
  },
  {
    id: 13,
    title: 'Akord C dur',
    stage: 2,
    stageEmoji: '🎤',
    stageName: 'Otevřená scéna',
    type: 'practical',
    typeLabel: 'Praxe',
    description: 'Základní stavební kámen hudební teorie. Zvládni široký rozsah prstů akordu C dur.',
    xpReward: 50,
    steps: [
      {
        title: 'Význam a majestátnost akordu C dur',
        content: `
          <p class="lead">Akord <strong>C dur (C)</strong> je králem hudební harmonie. V hudební teorii je stupnice C dur základním měřítkem, protože nemá žádné křížky ani béčka.</p>
          <p>Pro každého začínajícího kytaristu představuje akord C první opravdovou zkoušku roztažení prstů. Na rozdíl od předchozích akordů jsou jeho tři prsty rozloženy <strong>přes tři různé pražce</strong> (1., 2. a 3. pražec).</p>
          <p>Jakmile tento akord zvládneš, tvoje prstová nezávislost udělá obrovský skok kupředu!</p>
        `
      },
      {
        title: 'Prstoklad akordu C dur krok za krokem',
        content: `
          <p>Pojďme si prsty rozložit postupně odspodu nahoru:</p>
          <ol class="lesson-list">
            <li><strong>Ukazováček (1):</strong> polož na <strong>1. pražec 2. struny (B / H)</strong> (stejně jako u Am!).</li>
            <li><strong>Prostředníček (2):</strong> polož na <strong>2. pražec 4. struny (D)</strong> (opět stejné jako u Am!).</li>
            <li><strong>Prsteníček (3):</strong> natáhni na <strong>3. pražec 5. struny (A)</strong>!</li>
            <li>Struny 3 (G) a 1 (e) zůstávají otevřené.</li>
            <li><strong>6. strunu (E) NEHRAJEME!</strong></li>
          </ol>
          <div class="card p-3 my-3 bg-surface-2 font-mono">
            <h5 class="text-accent font-bold mb-1">Tabulatura akordu C dur:</h5>
            <pre class="mb-0 font-bold">
e|---0---| (otevřená)
B|---1---| (ukazováček, 1. pražec)
G|---0---| (otevřená)
D|---2---| (prostředníček, 2. pražec)
A|---3---| (prsteníček, 3. pražec)
E|---X---| (NEHRÁT!)
            </pre>
          </div>
        `
      },
      {
        title: 'Vedení basu a tlumení tlusté struny E',
        content: `
          <p>Základním basovým tónem akordu C dur je tón <strong>C na 3. pražci 5. struny</strong>.</p>
          <p>Hrajeme tedy <strong>5 strun dolů</strong> (od 5. k 1. struně). Šestá struna E se nesmí ozvat.</p>
          <div class="card p-3 my-3 bg-surface-2 border-accent">
            <h5 class="text-accent font-bold mb-1">Fígl s prsteníčkem:</h5>
            <p class="mb-0">Mírně posuň prsteníček na 5. struně tak, aby se svou horní měkkou hranou lehce dotýkal tlusté 6. struny E. Tím ji bezpečně utlumíš, takže i když o ni pravou rukou zavadíš, nevydá žádný rušivý tón!</p>
          </div>
        `
      },
      {
        title: 'Jak snadno zvládnout roztažení prstů',
        content: `
          <p>Máš pocit, že prsteníček na 3. pražec 5. struny zkrátka nedosáhne bez křeče? Zde je fyziologické řešení:</p>
          <ul class="lesson-list">
            <li><strong>Spusť palec níže:</strong> Pokud držíš palec příliš vysoko nad horní hranou krku, prsty nemají prostor se roztáhnout. Posuň palec na zadní straně krku o kousek níže.</li>
            <li><strong>Vysuň zápěstí vpřed:</strong> Lehce posuň zápěstí a dlaň dopředu pod hmatník. Klouby prstů se okamžitě zaoblí a prsteníček bez námahy dosáhne na 3. pražec!</li>
          </ul>
        `
      }
    ],
    quiz: [
      {
        question: 'Kolik různých pražců pokrývají prsty levé ruky při hraní základního akordu C dur?',
        options: ['1 pražec', '2 pražce', '3 různé pražce (1., 2. a 3. pražec)', 'Všech 5 pražců'],
        correct: 2,
        explanation: 'Akord C dur využívá prsty rozprostřené přes 1., 2. a 3. pražec.'
      },
      {
        question: 'Který prst a na kterém pražci drží základní basový tón akordu C dur?',
        options: [
          'Prsteníček na 3. pražci 5. struny (A)',
          'Ukazováček na 1. pražci 1. struny',
          'Prostředníček na 2. pražci 6. struny',
          'Malíček na 4. pražci'
        ],
        correct: 0,
        explanation: 'Základním basem akordu C je tón C na 3. pražci 5. struny držený prsteníčkem.'
      },
      {
        question: 'Která struna se u akordu C dur standardně nehraje?',
        options: ['1. struna (tenké e)', '3. struna (G)', '6. struna (tlusté E)', '4. struna (D)'],
        correct: 2,
        explanation: 'Tlustá 6. struna E se nehraje; úhoz směřuje od 5. struny dolů.'
      },
      {
        question: 'Co nejlépe pomůže, pokud ti prsteníček nedosahuje na 3. pražec akordu C?',
        options: [
          'Stáhnout palec na zadní straně krku níže a posunout zápěstí mírně dopředu pod hmatník',
          'Zatáhnout za struny kleštěmi',
          'Položit ruku celou dlaní na hmatník',
          'Hrát akord bez prsteníčku'
        ],
        correct: 0,
        explanation: 'Snížení palce a vysunutí zápěstí uvolní klenbu prstů a umožní snadné roztažení.'
      }
    ]
  },
  {
    id: 14,
    title: 'Akord G dur',
    stage: 2,
    stageEmoji: '🎤',
    stageName: 'Otevřená scéna',
    type: 'practical',
    typeLabel: 'Praxe',
    description: 'Mohutný, bohatý a majestátní akord G dur. Zvládni plný zvuk všech šesti strun.',
    xpReward: 50,
    steps: [
      {
        title: 'Síla a plnost akordu G dur',
        content: `
          <p class="lead">Akord <strong>G dur (G)</strong> je jedním z největších milníků každého kytaristy. Má ze všech otevřených akordů ten nejbohatší, nejplnější a nejmohutnější zvuk.</p>
          <p>Důvodem je, že rozeznívá <strong>všech 6 strun</strong> od nejhlubšího basového tónu G až po zvonivé vysoké tóny. Spolu s akordy C a D tvoří slavnou "svatou trojici" kytarové hudby.</p>
        `
      },
      {
        title: 'Tradiční tříprstý prstoklad',
        content: `
          <p>Základní klasická verze akordu G dur:</p>
          <ol class="lesson-list">
            <li><strong>Prostředníček (2):</strong> polož na <strong>3. pražec 6. struny (tlusté E)</strong> — toto je základní basový tón G!</li>
            <li><strong>Ukazováček (1):</strong> polož na <strong>2. pražec 5. struny (A)</strong>.</li>
            <li><strong>Prsteníček (3):</strong> polož na <strong>3. pražec 1. struny (tenké e)</strong>.</li>
            <li>Struny 4, 3 a 2 znějí otevřené.</li>
          </ol>
          <div class="card p-3 my-3 bg-surface-2 font-mono">
            <h5 class="text-accent font-bold mb-1">Tabulatura akordu G dur (tradiční):</h5>
            <pre class="mb-0 font-bold">
e|---3---| (prsteníček, 3. pražec)
B|---0---| (otevřená)
G|---0---| (otevřená)
D|---0---| (otevřená)
A|---2---| (ukazováček, 2. pražec)
E|---3---| (prostředníček, 3. pražec)
            </pre>
          </div>
        `
      },
      {
        title: 'Moderní čtyřprstá rocková varianta (Folk-Rock G)',
        content: `
          <p>Mnoho slavných kytaristů (jako Ed Sheeran, Oasis nebo Green Day) dává přednost čtyřprsté variantě:</p>
          <div class="card p-3 my-3 bg-surface-2 font-mono">
            <pre class="mb-0 text-accent font-bold">
e|---3---| (malíček, 3. pražec)
B|---3---| (prsteníček, 3. pražec)
G|---0---| (otevřená)
D|---0---| (otevřená)
A|---2---| (ukazováček, 2. pražec)
E|---3---| (prostředníček, 3. pražec)
            </pre>
          </div>
          <h4 class="font-bold text-accent mt-3">Proč je tato varianta tak populární?</h4>
          <ul class="lesson-list">
            <li>Zní ještě moderněji a plněji.</li>
            <li>Prsteníček a malíček zůstávají "ukotvené" na 3. pražci dvou tenkých strun i při přechodu na akord Cadd9 a D dur, což umožňuje bleskurychlé přehmaty!</li>
          </ul>
        `
      },
      {
        title: 'G dur jako středobod repertoáru',
        content: `
          <p>Gratulujeme! V tuto chvíli máš ve svém arzenálu sedm nejdůležitějších otevřených akordů:</p>
          <div class="card p-3 my-3 bg-surface-2 text-center">
            <h3 class="text-accent font-bold mb-0">Em • Am • E • A • D • C • G</h3>
          </div>
          <p>S těmito sedmi akordy je před tebou otevřená brána k tisícům písniček všech žánrů. V příští závěrečné lekci spojíme akordy G, C a D do nejslavnější progrese všech dob!</p>
        `
      }
    ],
    quiz: [
      {
        question: 'Který prst drží tlustou 6. strunu na 3. pražci v tradičním prstokladu G dur?',
        options: ['Ukazováček (prst 1)', 'Prostředníček (prst 2)', 'Palec', 'Malíček'],
        correct: 1,
        explanation: 'V tradičním prstokladu drží 6. strunu na 3. pražci prostředníček.'
      },
      {
        question: 'Kolik strun se rozeznívá při zahrání akordu G dur?',
        options: ['Pouze 3 struny', 'Pouze 4 struny', 'Pouze 5 strun', 'Všech 6 strun'],
        correct: 3,
        explanation: 'Akord G dur rozeznívá všech 6 strun nástroje plným mohutným úhozem.'
      },
      {
        question: 'Čím se vyznačuje moderní 4-prstá rocková varianta akordu G dur?',
        options: [
          'Přidává prsteníček na 3. pražec 2. struny a malíček na 3. pražec 1. struny',
          'Hraje se bez použití ukazováčku',
          'Vynechává basovou 6. strunu',
          'Hraje se výhradně na 12. pražci'
        ],
        correct: 0,
        explanation: 'Moderní rocková varianta přidává tón D na 3. pražci 2. struny (struny 1 a 2 jsou na 3. pražci).'
      },
      {
        question: 'Se kterými dvěma akordy tvoří G dur nejslavnější harmonickou trojici v populární hudbě?',
        options: ['S akordy C dur a D dur', 'S akordy B moll a F#', 'S akordy D# a G#', 'Pouze s akordem Em'],
        correct: 0,
        explanation: 'Trojice akordů G, C a D je základem tisíců světových hitů.'
      }
    ]
  },
  {
    id: 15,
    title: 'Akordová progrese G–C–D',
    stage: 2,
    stageEmoji: '🎤',
    stageName: 'Otevřená scéna',
    type: 'exercise',
    typeLabel: 'Cvičení',
    description: 'Zahraj svou první opravdovou píseň! Progrese G–C–D je nejslavnější v historii hudby.',
    xpReward: 50,
    steps: [
      {
        title: 'Co je to akordová progrese',
        content: `
          <p class="lead">Vítej v závěrečné lekci Otevřené scény! Dnes spojíš všechno, co ses naučil — akordy, rytmus, přechody i cit pro tempo — do uceleného hudebního tvaru.</p>
          <p><strong>Akordová progrese (Chord progression)</strong> je řada za sebou jdoucích akordů, které vytvářejí harmonický příběh skladby. V hudbě to funguje podobně jako věta v jazyce: jednotlivé tóny jsou písmena, akordy jsou slova a akordová progrese je celá věta vyjadřující myšlenku.</p>
        `
      },
      {
        title: 'Magie harmonie: Spojení I - IV - V v G dur',
        content: `
          <p>V hudební teorii existuje jedno zázračné pravidlo zvané <strong>stupňová harmonie I - IV - V</strong>:</p>
          <ul class="lesson-list">
            <li><strong>Akord G (Stupeň I - Tónika):</strong> Představuje "domov", klid, stabilitu a jistotu.</li>
            <li><strong>Akord C (Stupeň IV - Subdominanta):</strong> Vnáší do skladby pohyb, napětí a rozvíjí melodii.</li>
            <li><strong>Akord D (Stupeň V - Dominanta):</strong> Vrchol napětí! Tvé ucho touží po vyřešení a návratu zpět domů do akordu G.</li>
          </ul>
          <p class="mt-2">Toto harmonické spojení provází lidstvo po staletí od lidových písní přes Mozarta až po moderní pop music a rock!</p>
        `
      },
      {
        title: 'Metodika cvičení plynulých přechodů',
        content: `
          <p>Nyní si zahrajeme klasické 4-taktové kolečko ve 4/4 taktu:</p>
          <div class="card p-3 my-3 bg-surface-2 font-mono text-center">
            <h4 class="text-accent font-bold mb-2">Akordové schéma:</h4>
            <h3 class="text-white font-bold tracking-wider mb-0">| &nbsp; G (4 doby) &nbsp; | &nbsp; C (4 doby) &nbsp; | &nbsp; D (4 doby) &nbsp; | &nbsp; G (4 doby) &nbsp; |</h3>
          </div>
          <h4 class="font-bold text-accent mt-3">Postup nácviku:</h4>
          <ol class="lesson-list">
            <li><strong>Krok 1 (Velmi pomalu):</strong> Začni v pomalém tempu (cca 50–60 BPM). Na každý takt zahraj pouze jeden úder dolů na první dobu a zbytek taktu využij k přípravě prstů na další akord.</li>
            <li><strong>Krok 2 (Čtyři údery dolů):</strong> Zahraj 4 údery dolů na každý akord: [↓ ↓ ↓ ↓].</li>
            <li><strong>Krok 3 (Táborákový vzor):</strong> Jakmile přechody zvládáš bez zaváhání, aplikuj rytmus [↓  ↓↑  ↑↓↑] na každý akord!</li>
          </ol>
        `
      },
      {
        title: 'Světové hity postavené na akordech G, C a D',
        content: `
          <p>S touto jedinou progresí můžeš okamžitě vzít kytaru a předvést přátelům desítky světových megahitů:</p>
          <ul class="lesson-list">
            <li><strong>Bob Dylan / Guns N' Roses</strong> – <em>Knockin' on Heaven's Door</em> (G - D - C)</li>
            <li><strong>Creedence Clearwater Revival</strong> – <em>Bad Moon Rising</em> (D - A - G)</li>
            <li><strong>Lynyrd Skynyrd</strong> – <em>Sweet Home Alabama</em> (D - C - G)</li>
            <li><strong>The Beatles</strong> – <em>Twist and Shout</em> (D - G - A)</li>
            <li><strong>Tradiční české písně:</strong> desítky táborákových a folkových písniček od Nedvědů, Žalmana či Nohavici!</li>
          </ul>
        `
      },
      {
        title: 'Velká gratulace: Jsi kytarista!',
        content: `
          <div class="card p-4 my-3 bg-surface-2 border-primary text-center">
            <h2 class="text-primary font-bold mb-2">🎉 Skvělá práce, absolvente!</h2>
            <p class="text-lg mb-2">Dokončil jsi všech 15 lekcí základního kurzu Melodria.</p>
            <p class="mb-0 text-muted">Znáš anatomii nástroje, správné držení, ladění, tabulatury, rytmus a 7 základních otevřených akordů. Tvá hudební cesta právě začíná — pokračuj v cvičení písniček, trénuj v našem modulu a staň se mistrem kytary!</p>
          </div>
        `
      }
    ],
    quiz: [
      {
        question: 'Které harmonické stupně tvoří akordy G, C a D v tónině G dur?',
        options: [
          'Stupně I (tónika), IV (subdominanta) a V (dominanta)',
          'Stupně II, III a VI',
          'Pouze náhodné akordy bez teoretického vztahu',
          'Všechny představují stejný stupeň'
        ],
        correct: 0,
        explanation: 'V tónině G dur je G I. stupeň (tónika), C IV. stupeň a D V. stupeň (dominanta).'
      },
      {
        question: 'Která světoznámá píseň využívá právě akordy z rodiny G, C a D?',
        options: ['Knockin\' on Heaven\'s Door', 'Sweet Home Alabama', 'Bad Moon Rising', 'Všechny uvedené písně'],
        correct: 3,
        explanation: 'Všechny tyto legendární skladby jsou postaveny na progresi akordů G, C a D.'
      },
      {
        question: 'Co je nejdůležitější při nácviku akordové progrese s rytmem?',
        options: [
          'Hrát co nejrychleji i za cenu zastavování a drnčení',
          'Udržet stabilní a rovnoměrný rytmus v pomalejším tempu',
          'Pokaždé vyměnit trsátko',
          'Hrát bez držení akordů'
        ],
        correct: 1,
        explanation: 'Rovnoměrnost a čistota přechodů v klidném tempu je základem pro pozdější rychlou hru.'
      },
      {
        question: 'Kolik základních otevřených akordů ses v prvních 15 lekcích Melodria naučil?',
        options: ['2 akordy', '4 akordy', '7 akordů (Em, Am, E, A, D, C, G)', 'Pouze 1 akord'],
        correct: 2,
        explanation: 'Zvládl jsi 7 klíčových otevřených akordů: Em, Am, E, A, D, C a G.'
      }
    ]
  }
];

window.Lessons = {
  data: LESSONS_DATA,

  getAllLessons() {
    return this.data;
  },

  getLesson(id) {
    const numId = Number(id);
    return this.data.find(l => l.id === numId);
  },

  getLessonsByStage(stageId) {
    const numStage = Number(stageId);
    return this.data.filter(l => l.stage === numStage);
  },

  renderLessonList() {
    const listContainer = document.getElementById('lessons-list');
    const detailContainer = document.getElementById('lesson-detail');

    if (!listContainer) {
      console.warn('[Lessons] Kontejner #lessons-list nebyl nalezen.');
      return;
    }

    if (detailContainer) {
      detailContainer.classList.add('hidden');
    }
    listContainer.classList.remove('hidden');

    const completedIds = window.Progress ? window.Progress.getCompletedLessons() : [];
    const isGod = Boolean(window.Auth && typeof window.Auth.isGod === 'function' && window.Auth.isGod());

    const stages = [
      { id: 1, name: 'Garáž', emoji: '🏠', subtitle: 'Lekce 1–8: Seznámení s nástrojem a první mollové akordy' },
      { id: 2, name: 'Otevřená scéna', emoji: '🎤', subtitle: 'Lekce 9–15: Durové akordy, strumming a slavná progrese G–C–D' }
    ];

    let html = '';

    stages.forEach(stage => {
      const stageLessons = this.getLessonsByStage(stage.id);
      if (stageLessons.length === 0) return;

      const stageCompletedCount = stageLessons.filter(l => completedIds.includes(l.id)).length;

      html += `
        <div class="stage-section my-6">
          <div class="stage-header flex justify-between items-center mb-4">
            <div>
              <h2 class="text-2xl font-bold flex items-center gap-2">
                <span>${stage.emoji}</span>
                <span>Fáze ${stage.id}: ${stage.name}</span>
              </h2>
              <p class="text-sm text-muted mt-1">${stage.subtitle}</p>
            </div>
            <div class="stage-stats">
              <span class="badge ${stageCompletedCount === stageLessons.length ? 'earned' : ''}">
                ${stageCompletedCount} / ${stageLessons.length} hotovo
              </span>
            </div>
          </div>
          <div class="lessons-grid">
      `;

      stageLessons.forEach(lesson => {
        const isCompleted = completedIds.includes(lesson.id);
        const prevCompleted = lesson.id === 1 || completedIds.includes(lesson.id - 1);
        const isUnlocked = isGod || isCompleted || prevCompleted;
        const isCurrent = !isGod && !isCompleted && isUnlocked;

        let statusClass = 'locked';
        let statusBadge = '<span class="badge locked">🔒 Zamčeno</span>';
        let buttonText = 'Zamčeno';
        let buttonClass = 'btn btn-ghost btn-sm';
        let disabledAttr = 'disabled';

        if (isCompleted) {
          statusClass = 'completed';
          statusBadge = '<span class="badge earned">✓ Dokončeno</span>';
          buttonText = 'Zopakovat lekci';
          buttonClass = 'btn btn-secondary btn-sm';
          disabledAttr = '';
        } else if (isCurrent) {
          statusClass = 'current active';
          statusBadge = '<span class="badge" style="background: rgba(59, 130, 246, 0.25); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.4);">🎯 Na řadě</span>';
          buttonText = 'Spustit lekci →';
          buttonClass = 'btn btn-primary btn-sm';
          disabledAttr = '';
        } else if (isGod) {
          statusClass = 'current god-unlocked active';
          statusBadge = '<span class="badge" style="background: rgba(245, 158, 11, 0.25); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.5);">⚡ Odemčeno (Bůh)</span>';
          buttonText = 'Spustit lekci ⚡';
          buttonClass = 'btn btn-secondary btn-sm';
          disabledAttr = '';
        }

        html += `
          <div class="lesson-card card ${statusClass} ${isUnlocked ? 'cursor-pointer' : 'opacity-60'}" data-lesson-id="${lesson.id}">
            <div class="lesson-card-header flex justify-between items-center mb-2">
              <span class="lesson-type-badge badge">${lesson.typeLabel}</span>
              ${statusBadge}
            </div>
            <div class="lesson-card-body">
              <span class="lesson-number text-xs text-muted font-bold uppercase tracking-wider">Lekce ${lesson.id}</span>
              <h3 class="lesson-card-title text-xl font-bold mt-1 mb-2">${lesson.title}</h3>
              <p class="lesson-card-desc text-sm text-muted mb-4">${lesson.description}</p>
            </div>
            <div class="lesson-card-footer flex justify-between items-center pt-3 border-t border-surface-border mt-auto">
              <div class="lesson-meta flex items-center gap-3 text-xs text-muted">
                <span>⭐ +${lesson.xpReward} XP</span>
                <span>•</span>
                <span>${lesson.steps.length} kroků + kvíz</span>
              </div>
              <button class="${buttonClass} start-lesson-btn" data-lesson-id="${lesson.id}" ${disabledAttr}>
                ${buttonText}
              </button>
            </div>
          </div>
        `;
      });

      html += `
          </div>
        </div>
      `;
    });

    listContainer.innerHTML = html;

    listContainer.querySelectorAll('.lesson-card').forEach(card => {
      const lessonId = Number(card.dataset.lessonId);
      const isCompleted = completedIds.includes(lessonId);
      const isUnlocked = isGod || lessonId === 1 || isCompleted || completedIds.includes(lessonId - 1);

      if (isUnlocked) {
        card.addEventListener('click', (e) => {
          if (e.target.closest('button') && e.target.closest('button').disabled) return;
          if (window.Sounds && typeof window.Sounds.playClick === 'function') {
            window.Sounds.playClick();
          }
          window.location.hash = `#/lesson/${lessonId}`;
        });
      }
    });
  },

  _currentLessonId: null,
  _currentStep: 0,
  _quizState: {
    currentQuestion: 0,
    correct: 0,
    total: 0,
    answered: [],
    hadErrorInQuestion: false,
    perfectScore: true
  },

  renderLessonDetail(id) {
    const lesson = this.getLesson(id);
    if (!lesson) {
      console.error(`[Lessons] Lekce s ID ${id} nebyla nalezena.`);
      return;
    }

    const listContainer = document.getElementById('lessons-list');
    const detailContainer = document.getElementById('lesson-detail');

    if (!detailContainer) {
      console.warn('[Lessons] Kontejner #lesson-detail nebyl nalezen.');
      return;
    }

    if (listContainer) {
      listContainer.classList.add('hidden');
    }
    detailContainer.classList.remove('hidden');

    this._currentLessonId = lesson.id;
    this._currentStep = 0;
    this._quizState = {
      currentQuestion: 0,
      correct: 0,
      total: lesson.quiz.length,
      answered: [],
      hadErrorInQuestion: false,
      perfectScore: true
    };

    detailContainer.innerHTML = `
      <div class="view-header lesson-detail-header animate-fadeIn mb-6">
        <div class="flex justify-between items-center mb-3">
          <button class="btn btn-ghost flex items-center gap-2" id="btn-back-to-lessons">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Zpět na přehled lekcí
          </button>
          <div class="flex items-center gap-2">
            <span class="rank-badge">${lesson.stageEmoji} ${lesson.stageName}</span>
            <span class="badge">${lesson.typeLabel}</span>
            <span class="badge" style="background: rgba(245, 158, 11, 0.2); color: #f59e0b;">+${lesson.xpReward} XP</span>
          </div>
        </div>

        <div class="lesson-header-info">
          <span class="text-xs uppercase font-bold text-accent tracking-widest">Lekce ${lesson.id}</span>
          <h1 class="text-3xl font-extrabold mt-1 mb-2">${lesson.title}</h1>
          <p class="text-muted text-sm">${lesson.description}</p>
        </div>

        <div class="lesson-progress-box card p-3 mt-4 bg-surface-2">
          <div class="flex justify-between items-center text-xs font-semibold mb-1">
            <span id="lesson-progress-text">Krok 1 z ${lesson.steps.length}</span>
            <span id="lesson-progress-percent">0%</span>
          </div>
          <div class="xp-bar">
            <div class="xp-bar-fill" id="lesson-progress-fill" style="width: 0%"></div>
          </div>
        </div>
      </div>

      <div id="lesson-step-container" class="card p-6 animate-slideInUp"></div>
    `;

    const backBtn = document.getElementById('btn-back-to-lessons');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        if (window.Sounds && typeof window.Sounds.playClick === 'function') {
          window.Sounds.playClick();
        }
        window.location.hash = '#/lessons';
      });
    }

    this._renderStep(lesson, 0);
  },

  _renderStep(lesson, stepIndex) {
    const stepContainer = document.getElementById('lesson-step-container');
    if (!stepContainer) return;

    this._currentStep = stepIndex;
    const step = lesson.steps[stepIndex];
    const totalStepsAndQuiz = lesson.steps.length + 1;
    const progressPercent = Math.round((stepIndex / totalStepsAndQuiz) * 100);

    const progressText = document.getElementById('lesson-progress-text');
    const progressPercentEl = document.getElementById('lesson-progress-percent');
    const progressFill = document.getElementById('lesson-progress-fill');

    if (progressText) progressText.innerText = `Krok ${stepIndex + 1} z ${lesson.steps.length}: ${step.title}`;
    if (progressPercentEl) progressPercentEl.innerText = `${progressPercent}%`;
    if (progressFill) progressFill.style.width = `${progressPercent}%`;

    const isFirstStep = stepIndex === 0;
    const isLastStep = stepIndex === lesson.steps.length - 1;

    stepContainer.innerHTML = `
      <div class="step-header flex justify-between items-center pb-4 border-b border-surface-border mb-6">
        <div>
          <span class="text-xs uppercase font-bold text-muted">Krok ${stepIndex + 1} z ${lesson.steps.length}</span>
          <h2 class="text-2xl font-bold text-white mt-1">${step.title}</h2>
        </div>
        <div class="step-indicators flex gap-1">
          ${lesson.steps.map((_, i) => `
            <span class="w-2.5 h-2.5 rounded-full transition-all ${i === stepIndex ? 'bg-primary scale-125' : i < stepIndex ? 'bg-accent' : 'bg-surface-3'}" title="Krok ${i + 1}"></span>
          `).join('')}
          <span class="w-2.5 h-2.5 rounded-full bg-surface-3" title="Kvíz"></span>
        </div>
      </div>

      <div class="step-content lesson-text-content leading-relaxed mb-8">
        ${step.content}
      </div>

      <div class="step-navigation flex justify-between items-center pt-4 border-t border-surface-border">
        <button class="btn btn-secondary" id="btn-prev-step" ${isFirstStep ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : ''}>
          ← Předchozí krok
        </button>

        ${isLastStep ? `
          <button class="btn btn-primary" id="btn-start-quiz">
            Přejít na kvíz (${lesson.quiz.length} otázek) 🎯
          </button>
        ` : `
          <button class="btn btn-primary" id="btn-next-step">
            Další krok →
          </button>
        `}
      </div>
    `;

    const prevBtn = document.getElementById('btn-prev-step');
    const nextBtn = document.getElementById('btn-next-step');
    const startQuizBtn = document.getElementById('btn-start-quiz');

    if (prevBtn && !isFirstStep) {
      prevBtn.addEventListener('click', () => {
        if (window.Sounds && typeof window.Sounds.playClick === 'function') {
          window.Sounds.playClick();
        }
        this._renderStep(lesson, stepIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (window.Sounds && typeof window.Sounds.playClick === 'function') {
          window.Sounds.playClick();
        }
        this._renderStep(lesson, stepIndex + 1);
      });
    }

    if (startQuizBtn) {
      startQuizBtn.addEventListener('click', () => {
        if (window.Sounds && typeof window.Sounds.playClick === 'function') {
          window.Sounds.playClick();
        }
        this._renderQuiz(lesson);
      });
    }
  },

  _renderQuiz(lesson) {
    const stepContainer = document.getElementById('lesson-step-container');
    if (!stepContainer) return;

    const qIdx = this._quizState.currentQuestion;
    const totalQ = lesson.quiz.length;
    const q = lesson.quiz[qIdx];

    const totalStepsAndQuiz = lesson.steps.length + 1;
    const quizProgress = lesson.steps.length + ((qIdx) / totalQ);
    const progressPercent = Math.round((quizProgress / totalStepsAndQuiz) * 100);

    const progressText = document.getElementById('lesson-progress-text');
    const progressPercentEl = document.getElementById('lesson-progress-percent');
    const progressFill = document.getElementById('lesson-progress-fill');

    if (progressText) progressText.innerText = `Kvíz — Otázka ${qIdx + 1} z ${totalQ}`;
    if (progressPercentEl) progressPercentEl.innerText = `${progressPercent}%`;
    if (progressFill) progressFill.style.width = `${progressPercent}%`;

    const isLastQ = qIdx === totalQ - 1;

    stepContainer.innerHTML = `
      <div class="quiz-header flex justify-between items-center pb-4 border-b border-surface-border mb-6">
        <div>
          <span class="badge" style="background: rgba(236, 72, 153, 0.2); color: #ec4899;">Ověření znalostí</span>
          <h2 class="text-xl font-bold text-white mt-2">Otázka ${qIdx + 1} z ${totalQ}</h2>
        </div>
        <div class="score-pill badge">
          Skóre: ${this._quizState.correct} / ${qIdx}
        </div>
      </div>

      <div class="quiz-question-box mb-6">
        <h3 class="text-xl font-bold text-white mb-4 leading-snug">${q.question}</h3>
        <div class="quiz-options-grid grid gap-3" id="quiz-options-container">
          ${q.options.map((option, index) => `
            <button class="quiz-option text-left p-4 rounded-xl border border-surface-border transition-all flex items-center justify-between" data-index="${index}">
              <span class="option-text">${option}</span>
              <span class="option-indicator opacity-0 font-bold"></span>
            </button>
          `).join('')}
        </div>
      </div>

      <div id="quiz-feedback-box" class="quiz-feedback-container mb-6 hidden"></div>

      <div class="quiz-footer flex justify-end pt-4 border-t border-surface-border">
        <button class="btn btn-primary hidden" id="btn-quiz-next">
          ${isLastQ ? 'Dokončit kvíz a vyhodnotit 🎉' : 'Další otázka →'}
        </button>
      </div>
    `;

    const optionsContainer = document.getElementById('quiz-options-container');
    const feedbackBox = document.getElementById('quiz-feedback-box');
    const nextBtn = document.getElementById('btn-quiz-next');
    let hasAnsweredCurrent = false;

    optionsContainer.querySelectorAll('.quiz-option').forEach(btn => {
      btn.addEventListener('click', () => {
        if (hasAnsweredCurrent) return;
        hasAnsweredCurrent = true;

        const selectedIndex = Number(btn.dataset.index);
        const isCorrect = selectedIndex === q.correct;

        optionsContainer.querySelectorAll('.quiz-option').forEach(b => {
          b.disabled = true;
          b.style.cursor = 'default';
        });

        if (isCorrect) {
          btn.classList.add('correct');
          const indicator = btn.querySelector('.option-indicator');
          if (indicator) {
            indicator.innerText = '✓';
            indicator.style.opacity = '1';
          }

          if (!this._quizState.hadErrorInQuestion) {
            this._quizState.correct++;
          }

          if (window.Sounds && typeof window.Sounds.playSuccess === 'function') {
            window.Sounds.playSuccess();
          }

          feedbackBox.className = 'quiz-feedback-container p-4 rounded-xl bg-success-bg border border-success text-success animate-fadeIn mb-6';
          feedbackBox.innerHTML = `
            <div class="flex items-start gap-2">
              <span class="text-xl">✓</span>
              <div>
                <strong>Správná odpověď!</strong>
                <p class="text-sm mt-1 mb-0">${q.explanation || 'Výborně, pokračuj na další otázku.'}</p>
              </div>
            </div>
          `;
          feedbackBox.classList.remove('hidden');
        } else {
          btn.classList.add('wrong', 'animate-shake');
          const wrongIndicator = btn.querySelector('.option-indicator');
          if (wrongIndicator) {
            wrongIndicator.innerText = '✕';
            wrongIndicator.style.opacity = '1';
          }

          this._quizState.hadErrorInQuestion = true;
          this._quizState.perfectScore = false;

          const correctBtn = optionsContainer.querySelector(`[data-index="${q.correct}"]`);
          if (correctBtn) {
            correctBtn.classList.add('correct');
            const rightIndicator = correctBtn.querySelector('.option-indicator');
            if (rightIndicator) {
              rightIndicator.innerText = '✓';
              rightIndicator.style.opacity = '1';
            }
          }

          if (window.Sounds && typeof window.Sounds.playError === 'function') {
            window.Sounds.playError();
          }

          feedbackBox.className = 'quiz-feedback-container p-4 rounded-xl bg-error-bg border border-error text-error animate-fadeIn mb-6';
          feedbackBox.innerHTML = `
            <div class="flex items-start gap-2">
              <span class="text-xl">✕</span>
              <div>
                <strong>Bohužel špatně.</strong>
                <p class="text-sm mt-1 mb-0">${q.explanation || `Správná odpověď byla: <strong>${q.options[q.correct]}</strong>.`}</p>
              </div>
            </div>
          `;
          feedbackBox.classList.remove('hidden');
        }

        if (nextBtn) {
          nextBtn.classList.remove('hidden');
          nextBtn.classList.add('animate-scaleIn');
        }
      });
    });

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (window.Sounds && typeof window.Sounds.playClick === 'function') {
          window.Sounds.playClick();
        }

        if (isLastQ) {
          this._showQuizResults(lesson);
        } else {
          this._quizState.currentQuestion++;
          this._quizState.hadErrorInQuestion = false;
          this._renderQuiz(lesson);
        }
      });
    }
  },

  _showQuizResults(lesson) {
    const stepContainer = document.getElementById('lesson-step-container');
    if (!stepContainer) return;

    const correct = this._quizState.correct;
    const total = lesson.quiz.length;
    const isPerfect = (correct === total) && this._quizState.perfectScore;

    const baseXP = lesson.xpReward || 50;
    const perfectBonus = isPerfect ? 25 : 0;
    const noMistakesBonus = isPerfect ? 15 : 0;
    const totalEarnedXP = baseXP + perfectBonus + noMistakesBonus;

    if (window.Progress) {
      window.Progress.addXP(totalEarnedXP);
      window.Progress.markLessonComplete(lesson.id);
      if (typeof window.Progress.recordPracticeActivity === 'function') {
        window.Progress.recordPracticeActivity();
      }

      if (isPerfect) {
        window.Progress.recordPerfectQuiz();
      } else {
        window.Progress.resetPerfectQuizStreak();
      }
    }

    if (isPerfect) {
      if (window.UI && typeof window.UI.showConfetti === 'function') {
        window.UI.showConfetti();
      }
    }

    if (window.Sounds && typeof window.Sounds.playComplete === 'function') {
      window.Sounds.playComplete();
    }

    const progressText = document.getElementById('lesson-progress-text');
    const progressPercentEl = document.getElementById('lesson-progress-percent');
    const progressFill = document.getElementById('lesson-progress-fill');

    if (progressText) progressText.innerText = 'Lekce dokončena!';
    if (progressPercentEl) progressPercentEl.innerText = '100%';
    if (progressFill) progressFill.style.width = '100%';

    const nextLesson = this.getLesson(lesson.id + 1);

    stepContainer.innerHTML = `
      <div class="results-view text-center py-6 animate-scaleIn">
        <div class="result-icon text-6xl mb-4">
          ${isPerfect ? '🏆' : '🎉'}
        </div>
        <h2 class="text-3xl font-extrabold text-white mb-2">
          ${isPerfect ? 'Bezchybný výsledek!' : 'Skvělá práce, lekce dokončena!'}
        </h2>
        <p class="text-muted max-w-md mx-auto mb-6">
          Úspěšně jsi dokončil lekci <strong>${lesson.id}. ${lesson.title}</strong> a posunul se dále na své kytarové cestě.
        </p>

        <div class="results-stats-card card p-5 max-w-md mx-auto bg-surface-2 text-left mb-6">
          <div class="flex justify-between items-center py-2 border-b border-surface-border">
            <span class="text-muted">Správné odpovědi v kvízu:</span>
            <span class="font-bold text-white">${correct} z ${total}</span>
          </div>
          <div class="flex justify-between items-center py-2 border-b border-surface-border">
            <span class="text-muted">Základní odměna za lekci:</span>
            <span class="font-bold text-accent">+${baseXP} XP</span>
          </div>
          ${isPerfect ? `
            <div class="flex justify-between items-center py-2 border-b border-surface-border text-success">
              <span>Bonus za 100% v kvízu:</span>
              <span class="font-bold">+${perfectBonus} XP</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-surface-border text-success">
              <span>Bonus za lekci bez jediné chyby:</span>
              <span class="font-bold">+${noMistakesBonus} XP</span>
            </div>
          ` : ''}
          <div class="flex justify-between items-center pt-3 text-lg font-extrabold text-primary">
            <span>Celkem získáno:</span>
            <span>+${totalEarnedXP} XP</span>
          </div>
        </div>

        <div class="results-actions flex flex-wrap justify-center gap-4">
          <button class="btn btn-secondary" id="btn-result-overview">
            Zpět na přehled lekcí
          </button>
          <button class="btn btn-ghost" id="btn-result-retry">
            Zopakovat lekci
          </button>
          ${nextLesson ? `
            <button class="btn btn-primary" id="btn-result-next">
              Další lekce (${nextLesson.id}. ${nextLesson.title}) →
            </button>
          ` : `
            <button class="btn btn-primary" id="btn-result-overview-2">
              Hotovo! Přehled lekcí
            </button>
          `}
        </div>
      </div>
    `;

    const overviewBtn = document.getElementById('btn-result-overview');
    const overviewBtn2 = document.getElementById('btn-result-overview-2');
    const retryBtn = document.getElementById('btn-result-retry');
    const nextBtn = document.getElementById('btn-result-next');

    const goToOverview = () => {
      if (window.Sounds && typeof window.Sounds.playClick === 'function') {
        window.Sounds.playClick();
      }
      window.location.hash = '#/lessons';
    };

    if (overviewBtn) overviewBtn.addEventListener('click', goToOverview);
    if (overviewBtn2) overviewBtn2.addEventListener('click', goToOverview);

    if (retryBtn) {
      retryBtn.addEventListener('click', () => {
        if (window.Sounds && typeof window.Sounds.playClick === 'function') {
          window.Sounds.playClick();
        }
        this.renderLessonDetail(lesson.id);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (window.Sounds && typeof window.Sounds.playClick === 'function') {
          window.Sounds.playClick();
        }
        window.location.hash = `#/lesson/${nextLesson.id}`;
      });
    }
  }
};
