window.STAGE4_LESSONS = [
  {
    id: 25,
    title: 'Sedmičkové akordy & Bluesová teorie',
    stage: 4,
    stageEmoji: '🎪',
    stageName: 'Klub',
    type: 'theory',
    typeLabel: 'Teorie',
    description: 'Objev kouzlo dominantního septakordu — jak přidání malé septimy vytváří nezaměnitelný bluesový a rockový náboj.',
    xpReward: 80,
    steps: [
      {
        title: 'Vítej v Klubu — 4. etapě tvého růstu!',
        content: `
          <p class="lead">Vítej v hudebním Klubu! Zde opouštíme bezpečí táboráků a vstupujeme do světa rock'n'rollu, blues, synkop a energických riffů.</p>
          <p>Prvním krokem k rockovému a bluesovému zvuku je pochopení <strong>dominantního septakordu</strong> (značí se číslicí 7, např. A7, E7, D7, G7, C7).</p>
          <div class="card p-3 my-3 bg-surface-2 border-accent">
            <h4 class="text-accent font-bold mb-1">Co je to „sedmička“?</h4>
            <p class="mb-0">Klasický durový akord má 3 tóny (základní tón + velká tercie + čistá kvinta). Dominantní septakord přidává 4. tón: <strong>malou septimu</strong>. Tento tón vytváří jemnou disonanci (tritonus), který touží po dalším pohybu a dává hudbě dravost a bluesový šmrnc!</p>
          </div>
        `
      },
      {
        title: 'Porovnání: Dur vs. Dominantní 7',
        content: `
          <ul class="lesson-list font-mono">
            <li><strong>A dur:</strong> Tóny A - C# - E (stabilní, jasný, klidný)</li>
            <li><strong>A7:</strong> Tóny A - C# - E - <strong>G</strong> (napínavý, bluesový, zemitý)</li>
          </ul>
          <p class="mt-2">Všimni si: na kytaře stačí často uvolnit jediný prst a otevřít strunu, čímž zazní právě malá septima!</p>
        `
      }
    ],
    quiz: [
      {
        question: 'Který tón se přidává k durovému kvintakordu, aby vznikl dominantní septakord (např. E7)?',
        options: ['Malá septima (7. stupeň snížený o půltón)', 'Oktáva', 'Pouze další tercie', 'Žádný tón'],
        correct: 0,
        explanation: 'Dominantní septakord vzniká přidáním malé septimy k durovému trojzvuku.'
      },
      {
        question: 'Pro které hudební žánry jsou sedmičkové akordy zcela zásadní?',
        options: ['Blues, rock\'n\'roll, funk a jazz', 'Pouze středověký chorál', 'Čistě elektronická hudba', 'Thrash metal'],
        correct: 0,
        explanation: 'Blues a z něj vycházející rock\'n\'roll jsou postaveny na zvuku dominantních septakordů.'
      },
      {
        question: 'Jaký pocit v posluchači dominantní septakord vyvolává?',
        options: [
          'Příjemné harmonické napětí a energii, která táhne skladbu kupředu',
          'Úplný klid a ticho',
          'Nutnost ihned přestat hrát',
          'Pocit rozladěného nástroje'
        ],
        correct: 0,
        explanation: 'Napětí mezi tercií a septimou (tritonus) dává dominantnímu akordu jeho typický drive.'
      },
      {
        question: 'Jak se dominantní septakord značí v akordových zápisech?',
        options: ['Písmenem tónu s číslicí 7 (např. A7, D7, E7)', 'Písmenem m (např. Am)', 'Křížkem (A#)', 'Písmenem dim'],
        correct: 0,
        explanation: 'Dominantní septakordy se značí jednoduše číslicí 7 za názvem základního tónu.'
      }
    ]
  },
  {
    id: 26,
    title: 'Otevřené septakordy: A7, D7 a E7',
    stage: 4,
    stageEmoji: '🎪',
    stageName: 'Klub',
    type: 'exercise',
    typeLabel: 'Praxe',
    description: 'Vyzkoušej otevřené hmaty A7, D7 a E7 — hrají se snadněji než běžné akordy a znějí fantasticky!',
    xpReward: 80,
    practiceWorkout: {
      title: 'Bluesové kolečko E7 – A7 – B7',
      chords: ['E7', 'A7', 'H7'],
      strummingPattern: 'rock',
      bpm: 95,
      bars: 16
    },
    unlockedSongId: 7,
    steps: [
      {
        title: 'Jednoduché hmaty plné blues',
        content: `
          <p class="lead">Paradox kytary: sedmičkové akordy často vyžadují MÉNĚ prstů než základní durové akordy!</p>
          <div class="card p-3 my-3 bg-surface-2 font-mono">
            <p class="mb-2"><strong>Akord E7 (pouze 1 prst!):</strong> 1. pražec na 3. struně G (ukazovák). Všechny ostatní struny znějí volně! Nebo klasický dvouprstý tvar.</p>
            <p class="mb-2"><strong>Akord A7 (pouze 2 prsty!):</strong> 2. pražec na 4. struně (D) a 2. pražec na 2. struně (B). Struna 3 (G) zní volně uprostřed!</p>
            <p class="mb-0"><strong>Akord D7 (obrácený trojúhelník):</strong> 1. pražec na 2. struně B (ukazovák), 2. pražec na 3. struně G (prostředník) a 2. pražec na 1. struně e (prsteník).</p>
          </div>
        `
      },
      {
        title: 'Odemkni megahit Wonderwall od Oasis!',
        content: `
          <p>Zvládnutím těchto otevřených septakordových tvarů a jemných harmonických obohacení si odemykáš jeden z největších hitů 90. let — <strong>Wonderwall</strong> od britských Oasis!</p>
        `
      }
    ],
    quiz: [
      {
        question: 'Kolik prstů potřebuješ na minimální hmat akordu E7?',
        options: ['Pouze 1 prst (nebo 2 v plnější verzi)', 'Všechny 4 prsty', '3 prsty', 'Hraje se bez rukou'],
        correct: 0,
        explanation: 'Akord E7 lze zahrát pouhým jedním prstem na 1. pražci 3. struny G, případně s přidaným prstem na 2. pražci struny A.'
      },
      {
        question: 'Která struna zní u otevřeného akordu A7 volně mezi dvěma stisknutými prsty?',
        options: ['3. struna (G)', '5. struna (A)', '1. struna (e)', '6. struna (E)'],
        correct: 0,
        explanation: 'Prázdná 3. struna G zní přesně uprostřed akordu jako malá septima tóniny A.'
      },
      {
        question: 'Jaký geometrický tvar připomíná prstoklad akordu D7 na hmatníku?',
        options: ['Obrácený trojúhelník směrem k hlavičce kytary', 'Přímku', 'Čtverec', 'Kruh'],
        correct: 0,
        explanation: 'Oproti běžnému D dur má D7 vrchol trojúhelníku (1. pražec) otočený směrem k nultému pražci.'
      },
      {
        question: 'Která slavná britská hymna kapely Oasis využívá septakordové barvy?',
        options: ['Wonderwall', 'Yesterday', 'Smoke on the Water', 'Stánky'],
        correct: 0,
        explanation: 'Wonderwall je proslulá svými specifickými otevřenými hmaty s drženými prsty na strunách B a e.'
      }
    ]
  },
  {
    id: 27,
    title: '12taktové blues (12-Bar Blues)',
    stage: 4,
    stageEmoji: '🎪',
    stageName: 'Klub',
    type: 'exercise',
    typeLabel: 'Praxe',
    description: 'Nauč se formu, na které stojí celá moderní hudba od Chucka Berryho po Led Zeppelin a AC/DC.',
    xpReward: 90,
    practiceWorkout: {
      title: '12-taktové blues v E dur',
      chords: ['E7', 'A7', 'H7'],
      strummingPattern: 'rock',
      bpm: 100,
      bars: 12
    },
    unlockedSongId: 23,
    steps: [
      {
        title: 'Posvátná forma 12 taktů',
        content: `
          <p class="lead">12taktové blues je nejúspěšnější hudební stavebnicí v historii lidstva. Pokud znáš toto schéma, můžeš přijít na jakékoliv jam session na světě a ihned hrát s kapelou bez jediné zkoušky!</p>
          <div class="card p-4 my-3 bg-surface-2 text-center font-mono">
            <h4 class="text-accent font-bold mb-3">Harmonické schéma 12-Bar Blues v E:</h4>
            <p class="mb-1 text-white font-bold">| &nbsp; E7 &nbsp; | &nbsp; E7 &nbsp; | &nbsp; E7 &nbsp; | &nbsp; E7 &nbsp; | &nbsp; (takty 1–4, Tónika)</p>
            <p class="mb-1 text-accent font-bold">| &nbsp; A7 &nbsp; | &nbsp; A7 &nbsp; | &nbsp; E7 &nbsp; | &nbsp; E7 &nbsp; | &nbsp; (takty 5–8, Subdominanta)</p>
            <p class="mb-0 text-white font-bold">| &nbsp; H7 &nbsp; | &nbsp; A7 &nbsp; | &nbsp; E7 &nbsp; | &nbsp; H7 &nbsp; | &nbsp; (takty 9–12, Dominantní obrat)</p>
          </div>
        `
      },
      {
        title: 'Tzv. Turnaround (Návratový obrat)',
        content: `
          <p>Ve 12. taktu zahraješ akord <strong>H7 (B7)</strong>. Tento akord vytvoří maximální napětí, které posluchače přímo vystřelí zpět do prvního taktu na akord E7. Cyklus se opakuje!</p>
        `
      },
      {
        title: 'Odemkni Take Me Home, Country Roads!',
        content: `
          <p>Zvládnutí této pevné formy ti odemyká celosvětový klenot <strong>Take Me Home, Country Roads</strong> od Johna Denvera!</p>
        `
      }
    ],
    quiz: [
      {
        question: 'Kolik taktů trvá jedno kompletní kolo klasického bluesového schématu?',
        options: ['Přesně 12 taktů', '8 taktů', '16 taktů', '4 takty'],
        correct: 0,
        explanation: 'Klasická bluesová forma má přesně 12 taktů rozdělených do 3 čtyřtaktových frází.'
      },
      {
        question: 'Které tři akordy tvoří 12taktové blues v tónině E?',
        options: ['E7 (I), A7 (IV) a H7 (V)', 'C, D, G', 'Am, Dm, Em', 'F, B, C'],
        correct: 0,
        explanation: 'Stupně I, IV a V v tónině E jsou akordy E7, A7 a H7.'
      },
      {
        question: 'Co znamená pojem „Turnaround“ v posledních dvou taktech blues?',
        options: [
          'Hudební motiv a akord V (dominanta), který připraví ucho na návrat na začátek formy',
          'Otočení kytary vzhůru nohama',
          'Vypnutí zesilovače',
          'Zrychlení tempa na dvojnásobek'
        ],
        correct: 0,
        explanation: 'Turnaround harmonicky uzavírá 12taktovou frázi a vrací skladbu zpět do tóniky.'
      },
      {
        question: 'Který hudební styl přímo vyrostl ze základů 12taktového blues?',
        options: ['Rock and Roll', 'Klasická renesanční mše', 'Valčík', 'Trap'],
        correct: 0,
        explanation: 'Rock and roll (Chuck Berry, Elvis Presley, Little Richard) je přímým potomkem 12taktového blues.'
      }
    ]
  },
  {
    id: 28,
    title: 'Palm Muting – Tlumení hranou dlaně',
    stage: 4,
    stageEmoji: '🎪',
    stageName: 'Klub',
    type: 'theory',
    typeLabel: 'Teorie & Praxe',
    description: 'Zvládni ikonický perkusivní zvuk rocku a metalu — těžký, úderný rytmus s tlumením strun na kobylce.',
    xpReward: 85,
    practiceWorkout: {
      title: 'Palm Muting riff: E – G – A',
      chords: ['Em', 'G', 'A'],
      strummingPattern: 'rock',
      bpm: 110,
      bars: 16
    },
    steps: [
      {
        title: 'Co je technika Palm Muting (P.M.)?',
        content: `
          <p class="lead"><strong>Palm Muting (P.M.)</strong> je technika pravé ruky, bez které by neexistoval moderní rock, punk ani metal. Místo dlouhého dozvuku získá kytara suchý, dunivý a perkusivní úder („chug-chug“).</p>
          <div class="card p-3 my-3 bg-surface-2 border-accent">
            <h4 class="text-accent font-bold mb-1">Jak na to přesně:</h4>
            <p class="mb-0">Polož masitou hranu své pravé dlaně (stranu u malíčku) <strong>přesně na místo, kde struny vystupují z kobylkových kamenů</strong> (sedla). Lehce přitlač a trsátkem zahraj úder dolů přes basové struny.</p>
          </div>
        `
      },
      {
        title: 'Zlatá střední cesta: Ani moc, ani málo',
        content: `
          <ul class="lesson-list">
            <li><strong>Příliš daleko dopředu (k ozvučnému otvoru):</strong> Zvuk je úplně mrtvý, tón vůbec nezazní (jen lupnutí).</li>
            <li><strong>Příliš vzadu (za kobylkou):</strong> Tlumení nefunguje, struna zvoní dál volně.</li>
            <li><strong>Přesně na hraně kobylky:</strong> Tón má výšku, ale dozvuk je okamžitě zkrocený, hutný a úderný.</li>
          </ul>
        `
      }
    ],
    quiz: [
      {
        question: 'Kterou částí pravé ruky se provádí technika Palm Muting?',
        options: [
          'Vnější malíkovou hranou dlaně položenou na kobylku',
          'Kloubem palce',
          'Konečky nehtů',
          'Celým předloktím'
        ],
        correct: 0,
        explanation: 'Hrana dlaně u malíčku jemně tlumí kmity strun těsně u jejich ukotvení na kobylce.'
      },
      {
        question: 'Jak se technika Palm Muting obvykle značí v tabulaturách a notách?',
        options: ['Zkratkou P.M. s tečkovanou linkou nad taktem', 'Značkou STOP', 'Křížkem #', 'Otazníkem'],
        correct: 0,
        explanation: 'V kytarových tabulaturách najdeš pod notami nápis „P.M.-------“.'
      },
      {
        question: 'Jaký je zvukový výsledek správného Palm Mutingu?',
        options: [
          'Hutný, perkusivní, krátký a úderný basový tón',
          'Dlouhý nekonečný dozvuk',
          'Pískání kytary',
          'Úplné ticho bez tónu'
        ],
        correct: 0,
        explanation: 'Palm muting zkrotí dozvuk a dodá rytmu rytmickou pevnost a energii.'
      },
      {
        question: 'Kde přesně musí ležet hrana ruky pro ideální zvuk?',
        options: [
          'Přímo na kobylkovém pražci (sedle)',
          'Uprostřed krku na 12. pražci',
          'Na hlavě kytary u ladících kolíků',
          'Na dřevě zadní desky'
        ],
        correct: 0,
        explanation: 'Těsně u styku strun se sedlem kobylky vzniká perfektní rovnováha mezi tónem a útlumem.'
      }
    ]
  },
  {
    id: 29,
    title: 'Power akordy (E5, A5, D5, G5)',
    stage: 4,
    stageEmoji: '🎪',
    stageName: 'Klub',
    type: 'exercise',
    typeLabel: 'Praxe',
    description: 'Dvouprsté rockové kvintakordy, které můžeš posouvat po celém hmatníku a hrát rock, punk i metal.',
    xpReward: 90,
    practiceWorkout: {
      title: 'Power akordy: E5 – G5 – A5',
      chords: ['E5', 'G5', 'A5'],
      strummingPattern: 'rock',
      bpm: 120,
      bars: 16
    },
    unlockedSongId: 16,
    steps: [
      {
        title: 'Co je to Power akord (Kvintakord)?',
        content: `
          <p class="lead"><strong>Power akordy (značí se číslicí 5, např. E5, G5, A5, C5, D5)</strong> jsou králem rockové hudby. Nemají v sobě tercii — obsahují pouze základní tón a čistou kvintu (plus případně oktávu).</p>
          <div class="card p-3 my-3 bg-surface-2 border-accent">
            <h4 class="text-accent font-bold mb-1">Proč nemají tercii?</h4>
            <p class="mb-0">Díky absenci tercie nejsou power akordy ani durové (veselé), ani mollové (smutné). Znějí mohutně, neutrálně, nezkreslují se ani při silném zkreslení (distorzi) zesilovače a fungují v jakémkoliv kontextu!</p>
          </div>
        `
      },
      {
        title: 'Univerzální posuvný tvar po hmatníku',
        content: `
          <p>Stačí se naučit jediný prstoklad na dvou sousedních strunách:</p>
          <ul class="lesson-list font-mono">
            <li><strong>1. prst (ukazovák):</strong> Základní tón (např. 3. pražec na 6. struně E = tón G)</li>
            <li><strong>3. prst (prsteník):</strong> O 2 pražce dále na vedlejší struně (5. pražec na 5. struně A = tón D)</li>
          </ul>
          <p class="mt-2">A máš akord <strong>G5</strong>! Když tento tvar posuneš o dva pražce výš, máš <strong>A5</strong>. Posuneš na 1. pražec, máš <strong>F5</strong>. Jeden hmat = desítky akordů!</p>
        `
      },
      {
        title: 'Odemkni hit Černí andělé od Lucie!',
        content: `
          <p>Zvládnutí power akordů a rockového tahu ti odemyká legendární český rockový hit <strong>Černí andělé</strong> od kapely Lucie!</p>
        `
      }
    ],
    quiz: [
      {
        question: 'Z kterých tónů se skládá klasický power akord (kvintakord)?',
        options: ['Ze základního tónu a čisté kvinty (1. a 5. stupeň)', 'Ze všech tónů stupnice', 'Pouze z tercie a septimy', 'Z náhodných tónů'],
        correct: 0,
        explanation: 'Power akord obsahuje pouze základní tón a čistou kvintu (odtud označení 5).'
      },
      {
        question: 'Je power akord C5 durový, nebo mollový?',
        options: [
          'Není ani durový, ani mollový — neobsahuje totiž tercii, která určuje náladu',
          'Vždy přísně durový',
          'Vždy mollový',
          'Záleží na barvě kytary'
        ],
        correct: 0,
        explanation: 'Absence tercie dává power akordu neutrální a masivní charakter.'
      },
      {
        question: 'Jaký je vztah pražců v základním tvaru power akordu?',
        options: [
          'Ukazovák na základním tónu a prsteník o 2 pražce výše na sousední tenčí struně',
          'Oba prsty na stejném pražci',
          'Prsty musí být 5 pražců od sebe',
          'Pouze otevřené struny'
        ],
        correct: 0,
        explanation: 'Klasický tvar power akordu má rozteč 2 pražců mezi sousedními strunami.'
      },
      {
        question: 'Která česká rocková kapela proslavila hit Černí andělé?',
        options: ['Lucie', 'Olympic', 'Kabát', 'Chinaski'],
        correct: 0,
        explanation: 'Černí andělé je jeden z největších hitů legendární rockové kapely Lucie.'
      }
    ]
  },
  {
    id: 30,
    title: 'Synkopy & Rytmické akcenty',
    stage: 4,
    stageEmoji: '🎪',
    stageName: 'Klub',
    type: 'theory',
    typeLabel: 'Teorie & Praxe',
    description: 'Dej svému doprovodu švih a groove! Nauč se hrát na odrazy, synkopy a perkusivní údery.',
    xpReward: 85,
    practiceWorkout: {
      title: 'Synkopický groove: D – C – G',
      chords: ['D', 'C', 'G'],
      strummingPattern: 'rock',
      bpm: 98,
      bars: 16
    },
    unlockedSongId: 22,
    steps: [
      {
        title: 'Co je to synkopa?',
        content: `
          <p class="lead">Zatímco začátečníci hrají přesně na těžké doby (1, 2, 3, 4), zkušení kluboví kytaristé vytvářejí vzrušení tím, že akcentují <strong>lehké doby a mezidoby</strong> (na „a“).</p>
          <p>Tomuto jevu se říká <strong>synkopa (off-beat)</strong>. Posluchač očekává úder na těžkou dobu, ale ty udeříš o osminu dříve na úder nahoru [↑] a těžkou dobu necháš vyznít. Hudba tím získá neuvěřitelný tah!</p>
        `
      },
      {
        title: 'Mrtvé údery (Dead Notes / Chucking)',
        content: `
          <p>Když povolíš stisk levé ruky tak, že prsty pouze leží na strunách bez domáčknutí k pražci, a pravou rukou švihneš přes struny trsátkem, ozve se suché perkusivní „čvachtnutí“ (v notách značeno jako <strong>✕</strong>).</p>
          <p>Tím nahradíš v doprovodu bicí soupravu a malý bubínek (snare drum)!</p>
        `
      },
      {
        title: 'Odemkni Sweet Home Alabama!',
        content: `
          <p>Synkopický groove v plné kráse prověříš na světoznámém jižanském megahitu <strong>Sweet Home Alabama</strong> od Lynyrd Skynyrd (akordy D, C, G)!</p>
        `
      }
    ],
    quiz: [
      {
        question: 'Co je to synkopa v hudebním rytmu?',
        options: [
          'Přenesení rytmického přízvuku na lehkou dobu nebo mezidobu (např. na osminu „a“)',
          'Zastavení hudby',
          'Zlomení struny',
          'Hraní falešných tónů'
        ],
        correct: 0,
        explanation: 'Synkopa narušuje pravidelný puls a vytváří vzrušující rytmické napětí.'
      },
      {
        question: 'Jak se na kytaru vytváří perkusivní mrtvý tón (dead note / chuck)?',
        options: [
          'Položením prstů na struny bez domáčknutí k pražci a úderem trsátka',
          'Úderem do ladičky',
          'Odpojením kabelu',
          'Brnknutím o kobylku'
        ],
        correct: 0,
        explanation: 'Tlumené struny bez znějícího tónu vydají suchý perkusivní zvuk bicích.'
      },
      {
        question: 'Kterým úderem pravé ruky se na kytaru nejčastěji hrají synkopy?',
        options: ['Úderem nahoru [↑]', 'Úderem palce', 'Pouze úderem dolů', 'Zuby'],
        correct: 0,
        explanation: 'Údery nahoru přirozeně padají na osminové mezidoby („a“), kde vznikají synkopy.'
      },
      {
        question: 'Který světový klenot Lynyrd Skynyrd je postaven na synkopickém groovu akordů D, C a G?',
        options: ['Sweet Home Alabama', 'Hallelujah', 'Kometa', 'Wonderwall'],
        correct: 0,
        explanation: 'Sweet Home Alabama je učebnicovým příkladem kytarového synkopického riffu.'
      }
    ]
  },
  {
    id: 31,
    title: 'Mollová pentatonika v E moll',
    stage: 4,
    stageEmoji: '🎪',
    stageName: 'Klub',
    type: 'exercise',
    typeLabel: 'Praxe',
    description: 'Otevři bránu ke kytarovým sólům! Nauč se nejslavnější 5tónovou stupnici rockových legend.',
    xpReward: 95,
    steps: [
      {
        title: 'Královna kytarových stupnic: Pentatonika',
        content: `
          <p class="lead">Slovo <em>penta</em> znamená v řečtině pět. <strong>Mollová pentatonika</strong> je stupnice složená z 5 pečlivě vybraných tónů, které k sobě dokonale ladí a ze kterých nelze zahrát „špatný tón“!</p>
          <div class="card p-3 my-3 bg-surface-2 text-center font-mono">
            <h4 class="text-accent font-bold mb-1">Tóny E mollové pentatoniky:</h4>
            <p class="text-xl text-white font-bold mb-0">E &nbsp;—&nbsp; G &nbsp;—&nbsp; A &nbsp;—&nbsp; H &nbsp;—&nbsp; D &nbsp;—&nbsp; (E)</p>
          </div>
        `
      },
      {
        title: 'První box na 12. pražci (a na otevřených strunách)',
        content: `
          <p>Tento tvar se na kytaře hraje neuvěřitelně snadno na 12. pražci (nebo s prázdnými strunami na 0. a 3. pražci):</p>
          <ul class="lesson-list font-mono">
            <li>6. struna (E): 0. pražec — 3. pražec</li>
            <li>5. struna (A): 0. pražec — 2. pražec</li>
            <li>4. struna (D): 0. pražec — 2. pražec</li>
            <li>3. struna (G): 0. pražec — 2. pražec</li>
            <li>2. struna (B): 0. pražec — 3. pražec</li>
            <li>1. struna (e): 0. pražec — 3. pražec</li>
          </ul>
          <p class="mt-2">Zahraj tyto tóny shora dolů a zpět — právě jsi zahrál své první kytarové sólo!</p>
        `
      }
    ],
    quiz: [
      {
        question: 'Kolik různých tónů obsahuje pentatonická stupnice v jedné oktávě?',
        options: ['5 tónů', '7 tónů', '12 tónů', '3 tóny'],
        correct: 0,
        explanation: 'Penta znamená pět – stupnice obsahuje přesně 5 tónů.'
      },
      {
        question: 'Které tóny tvoří pentatoniku v E moll?',
        options: ['E, G, A, H, D', 'C, D, E, F, G', 'Pouze tóny E a H', 'F#, G#, A#, C#, D#'],
        correct: 0,
        explanation: 'E mollová pentatonika se skládá z tónů E, G, A, H (B) a D.'
      },
      {
        question: 'Proč je mollová pentatonika tak oblíbená mezi kytaristy pro improvizaci?',
        options: [
          'Neobsahuje půltónové třenice, takže v doprovodu téměř nelze udělat vyslovenou chybu',
          'Má nejvíce tónů ze všech stupnic',
          'Hraje se pouze jedním prstem',
          'Vymyslel ji Mozart'
        ],
        correct: 0,
        explanation: 'Vynechání citlivých tónů dává pentatonice stoprocentní melodickou jistotu.'
      },
      {
        question: 'Kteří slavní kytaristé postavili svá legendární sóla na mollové pentatonice?',
        options: [
          'Jimi Hendrix, Eric Clapton, Slash, Angus Young i David Gilmour',
          'Pouze hráči na harfu',
          'Nikdo ze známých hudebníků',
          'Výhradně klavíristé'
        ],
        correct: 0,
        explanation: 'Prakticky všichni velikáni rockové a bluesové kytary vycházejí z pentatoniky.'
      }
    ]
  },
  {
    id: 32,
    title: 'První kytarový rockový riff (Klubové finále)',
    stage: 4,
    stageEmoji: '🎪',
    stageName: 'Klub',
    type: 'exercise',
    typeLabel: 'Praxe',
    description: 'Velké finále 4. etapy! Spoj power akordy, tlumení a pentatonické vyhrávky do strhujícího klubového vystoupení.',
    xpReward: 130,
    practiceWorkout: {
      title: 'Klubový rockový maraton',
      chords: ['E5', 'G5', 'A5'],
      strummingPattern: 'rock',
      bpm: 125,
      bars: 20
    },
    steps: [
      {
        title: 'Gratulujeme k dosažení finále Klubu!',
        content: `
          <p class="lead">Za 8 lekcí v Klubu jsi ušel obrovský kus cesty. Už nejsi jen táborákový doprovazeč — ovládáš dominantní sedmičky, 12taktové blues, Palm Muting, power akordy i mollovou pentatoniku!</p>
          <p>Nyní spojíš všechny tyto techniky do jediného energického rockového riffu. Ukaž plnému klubu, jak zní opravdová rocková energie!</p>
        `
      },
      {
        title: 'Získej titul Hráč a vstupenku do Koncertního sálu!',
        content: `
          <p>Dokončením lekce 32 získáš prestižní odznak <strong>Klubová hvězda</strong> a postupuješ do 5. etapy: <strong>Koncertní sál</strong>, kde tě čeká největší zkouška každého kytaristy — plné barré akordy a fingerpicking!</p>
        `
      }
    ],
    quiz: [
      {
        question: 'Co je to kytarový „riff“ v rockové hudbě?',
        options: [
          'Krátký, chytlavý a opakující se hudební motiv tvořící páteř skladby',
          'Chyba při hraní',
          'Přeladění nástroje',
          'Dlouhé desetiminutové ticho'
        ],
        correct: 0,
        explanation: 'Riff (např. Smoke on the Water, Whole Lotta Love) je ikonická melodická fráze.'
      },
      {
        question: 'Které techniky pravé i levé ruky jsi v Klubu úspěšně zvládl?',
        options: [
          'Palm Muting, power akordy, sedmičky, synkopy a pentatoniku',
          'Pouze foukání do ozvučnice',
          'Žádné nové techniky',
          'Pouze ladění kolíků'
        ],
        correct: 0,
        explanation: 'Ovládl jsi kompletní arzenál moderního rockového kytaristy.'
      },
      {
        question: 'Co je nejdůležitější při hraní energického riffu ve svižném tempu?',
        options: [
          'Uvolněné zápěstí a přesné trefování basových strun bez zbytečného napětí v těle',
          'Držet dech po celou dobu skladby',
          'Hrát co nejfalešněji',
          'Zavřít oči'
        ],
        correct: 0,
        explanation: 'Uvolněnost těla a zápěstí je klíčem k rychlosti a čistotě bez únavy.'
      },
      {
        question: 'Jaká velká výzva tě čeká v následující 5. etapě (Koncertní sál)?',
        options: [
          'Barré akordy (F dur, H moll), stavba akordů a folkový fingerpicking',
          'Zahodit kytaru a koupit bicí',
          'Návrat do Garáže',
          'Pouze zpěv bez nástroje'
        ],
        correct: 0,
        explanation: 'V Koncertním sále pokoříš legendárního strašáka — akord F dur a barré hmaty!'
      }
    ]
  }
];