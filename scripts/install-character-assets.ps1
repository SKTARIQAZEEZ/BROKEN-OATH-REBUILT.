param([Parameter(Mandatory=$true)][string]$CharacterZip,[Parameter(Mandatory=$true)][string]$NpcZip)
$ErrorActionPreference="Stop"
$root=Split-Path -Parent $PSScriptRoot
$tmp=Join-Path $env:TEMP ("bo-"+[guid]::NewGuid())
$a=Join-Path $tmp "a";$b=Join-Path $tmp "b"
$ca=Join-Path $root "public/assets/characters";$na=Join-Path $root "public/assets/npcs"
New-Item -ItemType Directory -Force -Path $a,$b,$ca,$na | Out-Null
Expand-Archive -LiteralPath (Resolve-Path $CharacterZip) -DestinationPath $a
Expand-Archive -LiteralPath (Resolve-Path $NpcZip) -DestinationPath $b
foreach($n in @("Azeez","Ranvir","Ananya","Anjali","Devraj","Child_Azeez","Child_Ranvir","Child_Ananya")){$f=Get-ChildItem $a -Recurse -Filter "$n.glb" | Select-Object -First 1;if(!$f){throw "Missing $n.glb"};Copy-Item $f.FullName (Join-Path $ca "$n.glb") -Force}
$ga=Join-Path $ca "Gang_Members";New-Item -ItemType Directory -Force $ga | Out-Null
Get-ChildItem $a -Recurse -Filter "random_*.glb" | ForEach-Object {Copy-Item $_.FullName (Join-Path $ga $_.Name) -Force}
Get-ChildItem $b -Recurse -Filter "*.glb" | ForEach-Object {Copy-Item $_.FullName (Join-Path $na $_.Name) -Force}
Write-Host "Assets installed. Run npm run build, then git add public/assets and git commit."
Remove-Item $tmp -Recurse -Force
