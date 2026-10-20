# Complete Native PowerPoint Presentation Builder using PowerPoint COM
$ErrorActionPreference = "Stop"

function HexToRgb([string]$hex) {
    $hex = $hex.TrimStart('#')
    $r = [Convert]::ToInt32($hex.Substring(0, 2), 16)
    $g = [Convert]::ToInt32($hex.Substring(2, 2), 16)
    $b = [Convert]::ToInt32($hex.Substring(4, 2), 16)
    return [int]($r + ($g * 256) + ($b * 65536))
}

$repoPath = "C:\Users\matej\.gemini\antigravity\scratch\melodrio"
$jsonPath = Join-Path $repoPath "slides_data.json"
$outPptxRepo = Join-Path $repoPath "prezentace_melodrio_faze1.pptx"
$outPptxDown = "C:\Users\matej\Downloads\prezentace_melodrio_faze1.pptx"

Write-Output "Loading slide data from $jsonPath..."
$slides = Get-Content -Path $jsonPath -Raw -Encoding UTF8 | ConvertFrom-Json

# Detailed speaker notes for each slide
$speechNotes = @{
    1 = "Úvod (0:00 - 0:45):`r`nDobrý den. Představuji vám projekt Melodrio - interaktivní kytarovou akademii, jejímž cílem je přenést výuku hry na kytaru do 21. století.`r`nDnes hodnotíme dokončenou první fázi ze tří plánovaných. Během 5 až 10 minut vám představím produktovou vizi, klíčové funkce, vyřešené výzvy a roadmapu pro Fázi 2 a 3."
    2 = "Filozofie (0:45 - 1:45):`r`nProč Melodrio vzniklo? 90 % začátečníků skončí do 3 měsíců kvůli nudné teorii z knížek.`r`nProto jsme spojili 3 ověřené světy:`r`n1. Duolingo: psychologie návyku (Daily Streak, XP, levely, odznaky).`r`n2. Simply Guitar: moderní kytarová didaktika, interaktivní akordy, ladička a metronom.`r`n3. Haxagon: struktura postupného odemykání výzev a God Mode pro evaluaci."
    3 = "Fázování projektu (1:45 - 2:30):`r`nJe zásadní zdůraznit, že stojíme na konci 1. FÁZE ZE TŘÍ.`r`nFáze 1 (NYNÍ): Jádro aplikace, 16 lekcí, repertoár 25 písní, ladička/metronom a profil.`r`nFáze 2 (DALŠÍ KROK): Živý poslech kytary přes mikrofon počítače a běžící tabulatura.`r`nFáze 3 (BUDOUCNOST): Multiplayerové kytarové duely přátel a týdenní ligy."
    4 = "Co uživatel může dělat (2:30 - 3:30):`r`nStudent má v aplikaci kompletní tréninkové zázemí:`r`nNa levé straně prochází 16 lekcemi (Fáze 1: základy, ladění, akordy Em, Am, C; Fáze 2: akordy G, D a rytmy).`r`nNa pravé straně má kompaktní sticky panel s rychlým přístupem, chromatickou ladičkou a nastavitelným metronomem."
    5 = "Repertoár 25 písní (3:30 - 4:30):`r`nStudent se učí na reálné hudbě (Knockin' on Heaven's Door, Wonderwall, Stand By Me...).`r`nAby nedocházelo k frustraci, písničky jsou zamčené podle lekcí. Pokud student klikne na zamčenou píseň, vyskočí asistenční popup modal, který mu řekne přesnou lekci a nabídne tlačítko pro přechod do výuky."
    6 = "Gamifikace a motivace (4:30 - 5:30):`r`nGamifikace je motorem úspěchu. V profilu studenta máme oddělené statistiky (XP, Level, Fáze 1 a 2).`r`nZavedli jsme striktní Daily Streak (0 nebo 1 den), který podporuje denní cvičební návyk.`r`nSystém 16 aspiračních odznaků vizuálně ukazuje zamčené cíle, kterých chce hráč dosáhnout."
    7 = "God Mode (5:30 - 6:30):`r`nPro zkoušení, testování a prezentaci slouží účet 'god' s heslem 'godballs'.`r`nOdemkne veškerý obsah bez nutnosti hrát lekce.`r`nProfil boha má královský zlatý vzhled, 10 000 XP, hotovo všech 16 lekcí, nekonečný streak ∞ dní a všechny odznaky. Běžný uživatel má stále svá reálná data."
    8 = "Výzvy a překážky (6:30 - 7:30):`r`nUpřímný pohled na problémy, které jsme během 1. fáze vyřešili:`r`n1. Bug se streakem [object Object] způsobený serializací - opraveno na striktní číslo 0/1.`r`n2. Vizuální artefakt s malým písmenem před jménem v profilu odstraněn.`r`n3. Nevyvážený dashboard s prázdnou pravou stranou předělán na moderní 2 sloupce."
    9 = "Technické řešení (7:30 - 8:30):`r`nAplikace je postavená na čistém Vanilla JS a moderním CSS bez obřích knihoven - načítá se bleskově a funguje i offline.`r`nWeb Audio API je připravené na analýzu mikrofonu ve Fázi 2.`r`nProjekt je důsledně verzován v Gitu (větve main a god-mode, tag v-god-mode)."
    10 = "Závěr a Q&A (8:30 - 10:00):`r`n1. fáze položila pevný základ. Ve 2. fázi oživíme mikrofon pro poslech hry v reálném čase.`r`nOdpovědi na předpokládané otázky:`r`nProč web? Okamžitá dostupnost na PC/notebooku před kytaristou.`r`nJe Web Audio API dost rychlé? Ano, latence pod 15 ms je skvělá.`r`nDěkuji za pozornost, prostor pro vaše dotazy!"
}

Write-Output "Starting PowerPoint COM engine..."
$ppt = New-Object -ComObject PowerPoint.Application
# $ppt.Visible = 0

try {
    $pres = $ppt.Presentations.Add(0) # 0 = msoFalse (hidden)
    $pres.PageSetup.SlideWidth = 960
    $pres.PageSetup.SlideHeight = 540

    $slideIndex = 1

    foreach ($slideData in $slides) {
        Write-Output "Building Slide $($slideData.slideNum): $($slideData.title)..."
        $slide = $pres.Slides.Add($slideIndex, 12) # 12 = ppLayoutBlank

        # 1. Background
        $bg = $slide.Shapes.AddShape(1, 0, 0, 960, 540) # msoShapeRectangle
        $bg.Fill.Solid()
        $bg.Fill.ForeColor.RGB = HexToRgb "0A0F1D"
        $bg.Line.Visible = 0

        # Top decorative glow
        $glow = $slide.Shapes.AddShape(1, 0, 0, 960, 4)
        $glow.Fill.Solid()
        $glow.Fill.ForeColor.RGB = HexToRgb $slideData.badgeColor
        $glow.Line.Visible = 0

        # 2. Badge pill
        $badge = $slide.Shapes.AddShape(5, 45, 25, 230, 24) # msoShapeRoundedRectangle
        $badge.Fill.Solid()
        $badge.Fill.ForeColor.RGB = HexToRgb $slideData.badgeColor
        $badge.Line.Visible = 0
        $badge.TextFrame.WordWrap = 0
        $badge.TextFrame.MarginLeft = 8
        $badge.TextFrame.MarginTop = 2
        $badge.TextFrame.MarginRight = 8
        $badge.TextFrame.MarginBottom = 2
        $bTr = $badge.TextFrame.TextRange
        $bTr.Text = $slideData.badgeText
        $bTr.Font.Name = "Segoe UI"
        $bTr.Font.Size = 10
        $bTr.Font.Bold = 1
        $bTr.Font.Color.RGB = HexToRgb "FFFFFF"

        # 3. Slide Title
        $titleBox = $slide.Shapes.AddTextbox(1, 45, 54, 870, 42)
        $titleBox.TextFrame.WordWrap = 1
        $titleBox.TextFrame.MarginLeft = 0
        $titleBox.TextFrame.MarginTop = 0
        $tTr = $titleBox.TextFrame.TextRange
        $tTr.Text = $slideData.title
        $tTr.Font.Name = "Segoe UI"
        $tTr.Font.Size = 22
        $tTr.Font.Bold = 1
        $tTr.Font.Color.RGB = HexToRgb "FFFFFF"

        # 4. Slide Subtitle
        $subBox = $slide.Shapes.AddTextbox(1, 45, 100, 870, 26)
        $subBox.TextFrame.WordWrap = 1
        $subBox.TextFrame.MarginLeft = 0
        $subBox.TextFrame.MarginTop = 0
        $sTr = $subBox.TextFrame.TextRange
        $sTr.Text = $slideData.subtitle
        $sTr.Font.Name = "Segoe UI"
        $sTr.Font.Size = 12
        $sTr.Font.Color.RGB = HexToRgb "94A3B8"

        # 5. Content Layout
        if ($slideData.type -eq "title") {
            # Hero Card
            $hero = $slide.Shapes.AddShape(5, 80, 150, 800, 310)
            $hero.Fill.Solid()
            $hero.Fill.ForeColor.RGB = HexToRgb "131B2E"
            $hero.Line.Visible = 1
            $hero.Line.ForeColor.RGB = HexToRgb "4F46E5"
            $hero.Line.Weight = 2

            $tf = $hero.TextFrame
            $tf.WordWrap = 1
            $tf.VerticalAnchor = 3 # msoAnchorMiddle
            $tf.MarginLeft = 30
            $tf.MarginRight = 30

            $hTr = $tf.TextRange
            $hTr.Text = "MELODRIO`r`nInteraktivní kytarová akademie nové generace`r`n`r`n" + $slideData.tagline + "`r`n`r`n" + $slideData.inspiration + "`r`n`r`n" + $slideData.meta
            $hTr.Font.Name = "Segoe UI"
            $hTr.Font.Size = 14
            $hTr.Font.Color.RGB = HexToRgb "CBD5E1"
            $hTr.Paragraphs(1).Font.Size = 32
            $hTr.Paragraphs(1).Font.Bold = 1
            $hTr.Paragraphs(1).Font.Color.RGB = HexToRgb "818CF8"
            $hTr.Paragraphs(2).Font.Size = 18
            $hTr.Paragraphs(2).Font.Bold = 1
            $hTr.Paragraphs(2).Font.Color.RGB = HexToRgb "FFFFFF"
        }
        elseif ($slideData.type -eq "twoCard") {
            # Card 1 (Left)
            $c1 = $slide.Shapes.AddShape(5, 45, 145, 420, 335)
            $c1.Fill.Solid()
            $c1.Fill.ForeColor.RGB = HexToRgb "131B2E"
            $c1.Line.Visible = 1
            $c1.Line.ForeColor.RGB = HexToRgb "334155"
            $c1.Line.Weight = 1.5

            $c1Tf = $c1.TextFrame
            $c1Tf.WordWrap = 1
            $c1Tf.VerticalAnchor = 1 # msoAnchorTop
            $c1Tf.MarginLeft = 18
            $c1Tf.MarginRight = 18
            $c1Tf.MarginTop = 16

            $bList1 = ($slideData.card1.bullets | ForEach-Object { "▶  $_" }) -join "`r`n`r`n"
            $c1Tr = $c1Tf.TextRange
            $c1Tr.Text = $slideData.card1.title + "`r`n`r`n" + $bList1
            $c1Tr.Font.Name = "Segoe UI"
            $c1Tr.Font.Size = 11.5
            $c1Tr.Font.Color.RGB = HexToRgb "CBD5E1"
            $c1Tr.Paragraphs(1).Font.Size = 15
            $c1Tr.Paragraphs(1).Font.Bold = 1
            $c1Tr.Paragraphs(1).Font.Color.RGB = HexToRgb $slideData.card1.color

            # Card 2 (Right)
            $c2 = $slide.Shapes.AddShape(5, 495, 145, 420, 335)
            $c2.Fill.Solid()
            $c2.Fill.ForeColor.RGB = HexToRgb "131B2E"
            $c2.Line.Visible = 1
            $c2.Line.ForeColor.RGB = HexToRgb "334155"
            $c2.Line.Weight = 1.5

            $c2Tf = $c2.TextFrame
            $c2Tf.WordWrap = 1
            $c2Tf.VerticalAnchor = 1 # msoAnchorTop
            $c2Tf.MarginLeft = 18
            $c2Tf.MarginRight = 18
            $c2Tf.MarginTop = 16

            $bList2 = ($slideData.card2.bullets | ForEach-Object { "▶  $_" }) -join "`r`n`r`n"
            $c2Tr = $c2Tf.TextRange
            $c2Tr.Text = $slideData.card2.title + "`r`n`r`n" + $bList2
            $c2Tr.Font.Name = "Segoe UI"
            $c2Tr.Font.Size = 11.5
            $c2Tr.Font.Color.RGB = HexToRgb "CBD5E1"
            $c2Tr.Paragraphs(1).Font.Size = 15
            $c2Tr.Paragraphs(1).Font.Bold = 1
            $c2Tr.Paragraphs(1).Font.Color.RGB = HexToRgb $slideData.card2.color
        }
        elseif ($slideData.type -eq "threeCard") {
            $xPositions = @(45, 345, 645)
            $cardW = 270

            for ($k = 0; $k -lt 3; $k++) {
                $cData = $slideData.cards[$k]
                $colX = $xPositions[$k]

                $col = $slide.Shapes.AddShape(5, $colX, 145, $cardW, 335)
                $col.Fill.Solid()
                $col.Fill.ForeColor.RGB = HexToRgb "131B2E"
                $col.Line.Visible = 1
                $col.Line.ForeColor.RGB = HexToRgb "334155"
                $col.Line.Weight = 1.5

                $colTf = $col.TextFrame
                $colTf.WordWrap = 1
                $colTf.VerticalAnchor = 1
                $colTf.MarginLeft = 14
                $colTf.MarginRight = 14
                $colTf.MarginTop = 16

                $bListCol = ($cData.bullets | ForEach-Object { "•  $_" }) -join "`r`n`r`n"
                $colTr = $colTf.TextRange
                $colTr.Text = $cData.title + "`r`n`r`n" + $bListCol
                $colTr.Font.Name = "Segoe UI"
                $colTr.Font.Size = 10.5
                $colTr.Font.Color.RGB = HexToRgb "CBD5E1"
                $colTr.Paragraphs(1).Font.Size = 14
                $colTr.Paragraphs(1).Font.Bold = 1
                $colTr.Paragraphs(1).Font.Color.RGB = HexToRgb $cData.color
            }
        }

        # 6. Footer
        $fL = $slide.Shapes.AddTextbox(1, 45, 495, 400, 25)
        $fL.TextFrame.WordWrap = 0
        $fLTr = $fL.TextFrame.TextRange
        $fLTr.Text = "Melodrio • Kytarová akademie (1. Fáze ze 3)"
        $fLTr.Font.Name = "Segoe UI"
        $fLTr.Font.Size = 9
        $fLTr.Font.Color.RGB = HexToRgb "64748B"

        $fR = $slide.Shapes.AddTextbox(1, 750, 495, 165, 25)
        $fR.TextFrame.WordWrap = 0
        $fRTr = $fR.TextFrame.TextRange
        $fRTr.Text = "Slide $($slideData.slideNum) / 10"
        $fRTr.Font.Name = "Segoe UI"
        $fRTr.Font.Size = 9
        $fRTr.Font.Bold = 1
        $fRTr.Font.Color.RGB = HexToRgb "94A3B8"

        # 7. Speaker Notes
        if ($speechNotes.ContainsKey($slideData.slideNum)) {
            $slide.NotesPage.Shapes.Item(2).TextFrame.TextRange.Text = $speechNotes[$slideData.slideNum]
        }

        $slideIndex++
    }

    # Save to repo
    if (Test-Path $outPptxRepo) { Remove-Item -Force $outPptxRepo }
    $pres.SaveAs($outPptxRepo)
    Write-Output "Saved native presentation to $outPptxRepo"

    # Save to Downloads
    if (Test-Path $outPptxDown) { Remove-Item -Force $outPptxDown }
    $pres.SaveAs($outPptxDown)
    Write-Output "Saved native presentation to $outPptxDown"

    $pres.Close()
    Write-Output "Presentation generated and closed successfully!"
} finally {
    $ppt.Quit()
    [System.Runtime.InteropServices.Marshal]::ReleaseComObject($ppt) | Out-Null
    Write-Output "PowerPoint engine terminated."
}
