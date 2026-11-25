param([Parameter(Mandatory=$true)][string]$CharacterZip,[Parameter(Mandatory=$true)][string]$NpcZip)
$ErrorActionPreference="Stop"
$root=Split-Path -Parent $PSScriptRoot
$tmp=Join-Path $env:TEMP ("bo-"+[guid]::NewGuid())
$a=Join-Path $tmp "a";$b=Join-Path $tmp "b"
$ca=Join-Path $root "public/assets/characters";$na=Join-Path $root "public/assets/npcs"
function Assert-Glb([string]$Path){
 if(!(Test-Path -LiteralPath $Path)){throw "Missing GLB: $Path"}
 $stream=[IO.File]::OpenRead($Path)
 try{$bytes=New-Object byte[] 4;if($stream.Read($bytes,0,4)-ne 4 -or [Text.Encoding]::ASCII.GetString($bytes)-ne "glTF"){throw "Invalid GLB header: $Path"}}finally{$stream.Dispose()}
}
try{
 New-Item -ItemType Directory -Force -Path $a,$b,$ca,$na | Out-Null
 Expand-Archive -LiteralPath (Resolve-Path $CharacterZip) -DestinationPath $a
 Expand-Archive -LiteralPath (Resolve-Path $NpcZip) -DestinationPath $b
 foreach($n in @("Azeez","Ranvir","Ananya","Anjali","Devraj","Child_Azeez","Child_Ranvir","Child_Ananya")){
  $f=Get-ChildItem $a -Recurse -Filter "$n.glb" | Select-Object -First 1
  if(!$f){throw "Missing $n.glb"}
  $dest=Join-Path $ca "$n.glb";Copy-Item $f.FullName $dest -Force;Assert-Glb $dest
 }
 $gang=Get-ChildItem $a -Recurse -Filter "random_*.glb"
 if($gang.Count -ne 12){throw "Expected 12 gang variants; found $($gang.Count)"}
 $ga=Join-Path $ca "Gang_Members";New-Item -ItemType Directory -Force $ga | Out-Null
 foreach($f in $gang){$dest=Join-Path $ga $f.Name;Copy-Item $f.FullName $dest -Force;Assert-Glb $dest}
 $npcs=Get-ChildItem $b -Recurse -Filter "*.glb"
 if($npcs.Count -ne 19){throw "Expected 19 NPC models; found $($npcs.Count)"}
 foreach($f in $npcs){$dest=Join-Path $na $f.Name;Copy-Item $f.FullName $dest -Force;Assert-Glb $dest}
 Write-Host "Validated and installed 8 cast models, 12 gang variants and 19 NPC models."
 Write-Host "Next: npm run build; then commit public/assets so hosted builds can fetch the GLBs."
}finally{if(Test-Path $tmp){Remove-Item $tmp -Recurse -Force}}
