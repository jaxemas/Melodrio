# Build PowerPoint Presentation from slides_data.json
$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.IO.Compression.FileSystem

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $scriptDir) { $scriptDir = "C:\Users\matej\.gemini\antigravity\scratch\melodrio" }
$jsonPath = Join-Path $scriptDir "slides_data.json"
$sourcePptx = "C:\Users\matej\Downloads\Boston.pptx"
$outPptxRepo = Join-Path $scriptDir "prezentace_melodrio_faze1.pptx"
$outPptxDown = "C:\Users\matej\Downloads\prezentace_melodrio_faze1.pptx"
$tempDir = Join-Path $env:TEMP "melodrio_build_$(Get-Random)"

Write-Output "Reading slides data from $jsonPath..."
$slidesJson = Get-Content -Path $jsonPath -Raw -Encoding UTF8 | ConvertFrom-Json

Write-Output "Extracting base archive from $sourcePptx..."
if (Test-Path $tempDir) { Remove-Item -Recurse -Force $tempDir }
New-Item -ItemType Directory -Path $tempDir | Out-Null
[System.IO.Compression.ZipFile]::ExtractToDirectory($sourcePptx, $tempDir)

function Escape-Xml([string]$str) {
    if ([string]::IsNullOrEmpty($str)) { return "" }
    return $str.Replace("&", "&amp;").Replace("<", "&lt;").Replace(">", "&gt;").Replace('"', "&quot;")
}

function New-Shape([int]$id, [string]$name, [int]$x, [int]$y, [int]$cx, [int]$cy, [string]$fillHex, [string]$borderHex = "", [int]$borderWidth = 0, [string]$geom = "roundRect", [string]$txBodyXml = "") {
    $fillXml = if ($fillHex -eq "") { "<a:noFill/>" } else { "<a:solidFill><a:srgbClr val=""$fillHex""/></a:solidFill>" }
    $lnXml = if ($borderHex -eq "" -or $borderWidth -le 0) { "<a:ln><a:noFill/></a:ln>" } else { "<a:ln w=""$borderWidth""><a:solidFill><a:srgbClr val=""$borderHex""/></a:solidFill></a:ln>" }
    $avLst = if ($geom -eq "roundRect") { "<a:avLst><a:gd name=""adj"" fmla=""val 2500""/></a:avLst>" } else { "<a:avLst/>" }

    $body = if ($txBodyXml -ne "") { $txBodyXml } else { "" }

    return @"
<p:sp>
  <p:nvSpPr>
    <p:cNvPr id="$id" name="$(Escape-Xml $name)"/>
    <p:cNvSpPr/>
    <p:nvPr/>
  </p:nvSpPr>
  <p:spPr>
    <a:xfrm><a:off x="$x" y="$y"/><a:ext cx="$cx" cy="$cy"/></a:xfrm>
    <a:prstGeom prst="$geom">$avLst</a:prstGeom>
    $fillXml
    $lnXml
  </p:spPr>
  $body
</p:sp>
"@
}

function New-TextParagraph([string]$text, [string]$colorHex = "F8FAFC", [int]$szPt = 14, [bool]$bold = $false, [string]$bulletChar = "", [string]$align = "l", [int]$spaceBefore = 40000, [int]$spaceAfter = 30000) {
    $szEmu = $szPt * 100
    $bAttr = if ($bold) { 'b="1"' } else { 'b="0"' }
    $buXml = if ($bulletChar -ne "") {
        "<a:pPr algn=""$align"" spaceBefore=""$spaceBefore"" spaceAfter=""$spaceAfter""><a:buFont typeface=""Segoe UI""/><a:buChar char=""$bulletChar""/></a:pPr>"
    } else {
        "<a:pPr algn=""$align"" spaceBefore=""$spaceBefore"" spaceAfter=""$spaceAfter""/>"
    }

    $escaped = Escape-Xml $text
    return @"
<a:p>
  $buXml
  <a:r>
    <a:rPr lang="cs-CZ" sz="$szEmu" $bAttr dirty="0">
      <a:solidFill><a:srgbClr val="$colorHex"/></a:solidFill>
      <a:latin typeface="Segoe UI"/>
      <a:cs typeface="Segoe UI"/>
    </a:rPr>
    <a:t>$escaped</a:t>
  </a:r>
</a:p>
"@
}

function New-TextBox([int]$id, [string]$name, [int]$x, [int]$y, [int]$cx, [int]$cy, [string[]]$paragraphs, [int]$padL = 120000, [int]$padT = 120000) {
    $pXml = $paragraphs -join "`n"
    $txBody = @"
<p:txBody>
  <a:bodyPr lIns="$padL" tIns="$padT" rIns="$padL" bIns="$padT" wrap="square" anchor="t"/>
  <a:lstStyle/>
  $pXml
</p:txBody>
"@
    return New-Shape $id $name $x $y $cx $cy "" "" 0 "rect" $txBody
}

$generatedSlides = @{}

foreach ($slideData in $slidesJson) {
    $slideNum = $slideData.slideNum
    $shapes = [System.Collections.Generic.List[string]]::new()

    # 1. Background
    $shapes.Add((New-Shape 10 "Background" 0 0 12192000 6858000 "0A0F1D" "" 0 "rect"))
    # Top decorative glow stripe
    $shapes.Add((New-Shape 11 "TopGlow" 0 0 12192000 60000 $slideData.badgeColor "" 0 "rect"))

    # 2. Badge pill
    $badgeP = @(New-TextParagraph $slideData.badgeText "FFFFFF" 11 $true "" "ctr" 0 0)
    $badgeTx = @"
<p:txBody>
  <a:bodyPr lIns="80000" tIns="40000" rIns="80000" bIns="40000" wrap="square" anchor="ctr"/>
  <a:lstStyle/>
  $($badgeP -join "`n")
</p:txBody>
"@
    $shapes.Add((New-Shape 12 "BadgePill" 700000 420000 3200000 360000 $slideData.badgeColor "" 0 "roundRect" $badgeTx))

    # 3. Slide Title
    $titleP = @(New-TextParagraph $slideData.title "FFFFFF" 26 $true "" "l" 0 0)
    $shapes.Add((New-TextBox 13 "SlideTitle" 700000 860000 10800000 650000 $titleP 0 0))

    # 4. Slide Subtitle
    $subP = @(New-TextParagraph $slideData.subtitle "94A3B8" 14 $false "" "l" 0 0)
    $shapes.Add((New-TextBox 14 "SlideSubtitle" 700000 1520000 10800000 450000 $subP 0 0))

    # 5. Content based on type
    if ($slideData.type -eq "title") {
        # Hero box for title slide
        $shapes.Add((New-Shape 101 "HeroCard" 1400000 2100000 9392000 3800000 "131B2E" "4F46E5" 25400 "roundRect"))
        $hP = @(
            (New-TextParagraph $slideData.tagline "F8FAFC" 18 $true "" "ctr" 0 80000),
            (New-TextParagraph $slideData.inspiration "38BDF8" 16 $true "" "ctr" 0 120000),
            (New-TextParagraph $slideData.meta "A7F3D0" 13 $false "" "ctr" 0 0)
        )
        $shapes.Add((New-TextBox 102 "HeroText" 1600000 2600000 8992000 2800000 $hP 0 0))
    }
    elseif ($slideData.type -eq "twoCard") {
        # Card 1 (Left)
        $shapes.Add((New-Shape 101 "Card1Bg" 700000 2050000 5250000 4250000 "131B2E" "334155" 19050 "roundRect"))
        $c1P = [System.Collections.Generic.List[string]]::new()
        $c1P.Add((New-TextParagraph $slideData.card1.title $slideData.card1.color 17 $true "" "l" 0 80000))
        foreach ($b in $slideData.card1.bullets) {
            $c1P.Add((New-TextParagraph $b "CBD5E1" 13 $false "" "l" 40000 40000))
        }
        $shapes.Add((New-TextBox 102 "Card1Text" 740000 2120000 5170000 4100000 $c1P.ToArray() 140000 140000))

        # Card 2 (Right)
        $shapes.Add((New-Shape 103 "Card2Bg" 6240000 2050000 5250000 4250000 "131B2E" "334155" 19050 "roundRect"))
        $c2P = [System.Collections.Generic.List[string]]::new()
        $c2P.Add((New-TextParagraph $slideData.card2.title $slideData.card2.color 17 $true "" "l" 0 80000))
        foreach ($b in $slideData.card2.bullets) {
            $c2P.Add((New-TextParagraph $b "CBD5E1" 13 $false "" "l" 40000 40000))
        }
        $shapes.Add((New-TextBox 104 "Card2Text" 6280000 2120000 5170000 4100000 $c2P.ToArray() 140000 140000))
    }
    elseif ($slideData.type -eq "threeCard") {
        $xOffsets = @(700000, 4390000, 8080000)
        $w = 3400000
        for ($cIdx = 0; $cIdx -lt 3; $cIdx++) {
            $cData = $slideData.cards[$cIdx]
            $x = $xOffsets[$cIdx]
            $idBase = 100 + ($cIdx * 2)

            $shapes.Add((New-Shape ($idBase + 1) "Col$($cIdx)Bg" $x 2050000 $w 4250000 "131B2E" "334155" 19050 "roundRect"))
            $cP = [System.Collections.Generic.List[string]]::new()
            $cP.Add((New-TextParagraph $cData.title $cData.color 16 $true "" "l" 0 70000))
            foreach ($b in $cData.bullets) {
                $cP.Add((New-TextParagraph $b "CBD5E1" 12 $false "" "l" 35000 35000))
            }
            $shapes.Add((New-TextBox ($idBase + 2) "Col$($cIdx)Text" ($x + 30000) 2110000 ($w - 60000) 4100000 $cP.ToArray() 120000 120000))
        }
    }

    # 6. Footer
    $footerL = @(New-TextParagraph "Melodrio - Kytarova akademie (1. Faze ze 3)" "64748B" 10 $false "" "l" 0 0)
    $shapes.Add((New-TextBox 19 "FooterLeft" 700000 6450000 6000000 300000 $footerL 0 0))

    $footerR = @(New-TextParagraph "Slide $slideNum / 10" "94A3B8" 10 $true "" "r" 0 0)
    $shapes.Add((New-TextBox 20 "FooterRight" 9500000 6450000 2000000 300000 $footerR 0 0))

    $inner = $shapes -join "`n"
    $slideXml = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" 
       xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" 
       xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld>
    <p:spTree>
      <p:nvGrpSpPr>
        <p:cNvPr id="1" name=""/>
        <p:cNvGrpSpPr/>
        <p:nvPr/>
      </p:nvGrpSpPr>
      <p:grpSpPr>
        <a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm>
      </p:grpSpPr>
      $inner
    </p:spTree>
  </p:cSld>
  <p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr>
</p:sld>
"@
    $generatedSlides[$slideNum] = $slideXml
    Write-Output "Built XML for Slide $slideNum"
}

# Write slides to temp folder
$slidesDir = Join-Path $tempDir "ppt\slides"
$relsDir = Join-Path $slidesDir "_rels"

Get-ChildItem $slidesDir -Filter "slide*.xml" | Remove-Item -Force
Get-ChildItem $relsDir -Filter "slide*.xml.rels" | Remove-Item -Force

$slideRelContent = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout7.xml"/>
</Relationships>
"@

for ($i = 1; $i -le 10; $i++) {
    $slidePath = Join-Path $slidesDir "slide$i.xml"
    $relPath = Join-Path $relsDir "slide$i.xml.rels"

    [System.IO.File]::WriteAllText($slidePath, $generatedSlides[$i], [System.Text.Encoding]::UTF8)
    [System.IO.File]::WriteAllText($relPath, $slideRelContent, [System.Text.Encoding]::UTF8)
}

# Update ppt/presentation.xml
$presXmlPath = Join-Path $tempDir "ppt\presentation.xml"
$sldIdLstXml = (@(for ($i = 1; $i -le 10; $i++) {
    $id = 255 + $i
    $rId = "rIdSlide$i"
    "<p:sldId id=""$id"" r:id=""$rId""/>"
}) -join "")

$presContent = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" 
                xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" 
                xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" saveSubsetFonts="1">
  <p:sldMasterIdLst>
    <p:sldMasterId id="2147483690" r:id="rIdMaster1"/>
  </p:sldMasterIdLst>
  <p:sldIdLst>
    $sldIdLstXml
  </p:sldIdLst>
  <p:sldSz cx="12192000" cy="6858000"/>
  <p:notesSz cx="6858000" cy="9144000"/>
  <p:defaultTextStyle>
    <a:defPPr><a:defRPr lang="cs-CZ"/></a:defPPr>
  </p:defaultTextStyle>
</p:presentation>
"@
[System.IO.File]::WriteAllText($presXmlPath, $presContent, [System.Text.Encoding]::UTF8)

# Update ppt/_rels/presentation.xml.rels
$presRelsPath = Join-Path $tempDir "ppt\_rels\presentation.xml.rels"
$slideRelsXml = (@(for ($i = 1; $i -le 10; $i++) {
    "<Relationship Id=""rIdSlide$i"" Type=""http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide"" Target=""slides/slide$i.xml""/>"
}) -join "`n  ")

$presRelsContent = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rIdMaster1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="slideMasters/slideMaster1.xml"/>
  <Relationship Id="rIdPresProps" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/presProps" Target="presProps.xml"/>
  <Relationship Id="rIdViewProps" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/viewProps" Target="viewProps.xml"/>
  <Relationship Id="rIdTheme1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="theme/theme1.xml"/>
  <Relationship Id="rIdTableStyles" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/tableStyles" Target="tableStyles.xml"/>
  $slideRelsXml
</Relationships>
"@
[System.IO.File]::WriteAllText($presRelsPath, $presRelsContent, [System.Text.Encoding]::UTF8)

# Update [Content_Types].xml
$contentTypesPath = Join-Path $tempDir "[Content_Types].xml"
$slideOverrides = (@(for ($i = 1; $i -le 10; $i++) {
    "<Override PartName=""/ppt/slides/slide$i.xml"" ContentType=""application/vnd.openxmlformats-officedocument.presentationml.slide+xml""/>"
}) -join "`n  ")

$ctXml = [System.IO.File]::ReadAllText($contentTypesPath, [System.Text.Encoding]::UTF8)
$ctXml = [System.Text.RegularExpressions.Regex]::Replace($ctXml, '<Override PartName="/ppt/slides/slide\d+\.xml"[^/]*/>', "")
$ctXml = $ctXml.Replace("</Types>", "  $slideOverrides`n</Types>")
[System.IO.File]::WriteAllText($contentTypesPath, $ctXml, [System.Text.Encoding]::UTF8)

# Repackage into PPTX
if (Test-Path $outPptxRepo) { Remove-Item -Force $outPptxRepo }
Write-Output "Compiling PPTX archive to $outPptxRepo..."
[System.IO.Compression.ZipFile]::CreateFromDirectory($tempDir, $outPptxRepo)

# Also copy to Downloads folder for instant access
Copy-Item -Path $outPptxRepo -Destination $outPptxDown -Force
Write-Output "Copied PPTX to $outPptxDown"

# Clean up temp
Remove-Item -Recurse -Force $tempDir -ErrorAction SilentlyContinue

Write-Output "SUCCESS: Presentation generated with 10 slides!"
