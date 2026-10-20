# Native PowerPoint Presentation Builder using PowerPoint COM
# Pure ASCII script - all content is loaded directly from UTF-8 JSON
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

Write-Output "Loading slide data from $jsonPath using UTF-8..."
$rawJson = [System.IO.File]::ReadAllText($jsonPath, [System.Text.Encoding]::UTF8)
$slides = $rawJson | ConvertFrom-Json

Write-Output "Starting PowerPoint COM engine..."
$ppt = New-Object -ComObject PowerPoint.Application

try {
    $pres = $ppt.Presentations.Add(0)
    $pres.PageSetup.SlideWidth = 960
    $pres.PageSetup.SlideHeight = 540

    $slideIndex = 1
    $bulletPrefix = "- "
    $fontFamily = "Calibri"

    foreach ($slideData in $slides) {
        Write-Output ("Building Slide " + $slideData.slideNum + "...")
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
        $bTr.Font.Name = $fontFamily
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
        $tTr.Font.Name = $fontFamily
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
        $sTr.Font.Name = $fontFamily
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
            $hTr.Text = $slideData.title + "`r`n" + $slideData.subtitle + "`r`n`r`n" + $slideData.tagline + "`r`n`r`n" + $slideData.inspiration + "`r`n`r`n" + $slideData.meta
            $hTr.Font.Name = $fontFamily
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

            $bList1 = ($slideData.card1.bullets | ForEach-Object { $bulletPrefix + $_ }) -join "`r`n`r`n"
            $c1Tr = $c1Tf.TextRange
            $c1Tr.Text = $slideData.card1.title + "`r`n`r`n" + $bList1
            $c1Tr.Font.Name = $fontFamily
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

            $bList2 = ($slideData.card2.bullets | ForEach-Object { $bulletPrefix + $_ }) -join "`r`n`r`n"
            $c2Tr = $c2Tf.TextRange
            $c2Tr.Text = $slideData.card2.title + "`r`n`r`n" + $bList2
            $c2Tr.Font.Name = $fontFamily
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

                $bListCol = ($cData.bullets | ForEach-Object { $bulletPrefix + $_ }) -join "`r`n`r`n"
                $colTr = $colTf.TextRange
                $colTr.Text = $cData.title + "`r`n`r`n" + $bListCol
                $colTr.Font.Name = $fontFamily
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
        $fLTr.Text = "Melodrio - Kytarova akademie (1. Faze ze 3)"
        $fLTr.Font.Name = $fontFamily
        $fLTr.Font.Size = 9
        $fLTr.Font.Color.RGB = HexToRgb "64748B"

        $fR = $slide.Shapes.AddTextbox(1, 750, 495, 165, 25)
        $fR.TextFrame.WordWrap = 0
        $fRTr = $fR.TextFrame.TextRange
        $fRTr.Text = "Slide " + $slideData.slideNum + " / 10"
        $fRTr.Font.Name = $fontFamily
        $fRTr.Font.Size = 9
        $fRTr.Font.Bold = 1
        $fRTr.Font.Color.RGB = HexToRgb "94A3B8"

        # 7. No notes - left completely clean as requested by the user

        $slideIndex++
    }

    # Save to repo
    if (Test-Path $outPptxRepo) { Remove-Item -Force $outPptxRepo }
    $pres.SaveAs($outPptxRepo)
    Write-Output ("Saved presentation to " + $outPptxRepo)

    # Save to Downloads
    if (Test-Path $outPptxDown) { Remove-Item -Force $outPptxDown }
    $pres.SaveAs($outPptxDown)
    Write-Output ("Saved presentation to " + $outPptxDown)

    $pres.Close()
    Write-Output "Presentation generated and closed successfully without notes!"
} finally {
    $ppt.Quit()
    [System.Runtime.InteropServices.Marshal]::ReleaseComObject($ppt) | Out-Null
    Write-Output "PowerPoint engine terminated."
}
