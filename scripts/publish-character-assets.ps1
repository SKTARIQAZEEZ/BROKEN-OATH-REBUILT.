param(
  [Parameter(Mandatory=$true)][string]$RepositoryPath,
  [Parameter(Mandatory=$true)][string]$CharacterZip,
  [Parameter(Mandatory=$true)][string]$NpcZip
)
$ErrorActionPreference = "Stop"

function Invoke-Git([string[]]$GitArgs) {
  & git @GitArgs
  if ($LASTEXITCODE -ne 0) { throw "Git command failed: git $($GitArgs -join ' ')" }
}

if (!(Test-Path -LiteralPath $RepositoryPath)) { throw "Repository folder not found: $RepositoryPath" }
if (!(Test-Path -LiteralPath $CharacterZip)) { throw "Character ZIP not found: $CharacterZip" }
if (!(Test-Path -LiteralPath $NpcZip)) { throw "NPC ZIP not found: $NpcZip" }
if (!(Test-Path (Join-Path $RepositoryPath ".git"))) { throw "RepositoryPath must be a Git clone of SKTARIQAZEEZ/BROKEN-OATH-REBUILT." }

Push-Location $RepositoryPath
try {
  $remote = & git remote get-url origin
  if ($LASTEXITCODE -ne 0 -or $remote -notmatch "SKTARIQAZEEZ/BROKEN-OATH-REBUILT") {
    throw "The origin remote is not the BROKEN-OATH-REBUILT repository."
  }

  & git lfs version *> $null
  if ($LASTEXITCODE -ne 0) {
    throw "Git LFS is not installed. Install Git LFS from https://git-lfs.com/, restart PowerShell, then rerun this script."
  }

  Invoke-Git @("lfs", "install")
  & powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path $PSScriptRoot "install-character-assets.ps1") -CharacterZip $CharacterZip -NpcZip $NpcZip
  if ($LASTEXITCODE -ne 0) { throw "Character/NPC asset extraction failed." }

  Invoke-Git @("add", ".gitattributes", "public/assets/characters", "public/assets/npcs")
  $staged = & git diff --cached --name-only
  if (!$staged) { Write-Host "No asset changes to publish."; exit 0 }

  Invoke-Git @("commit", "-m", "Add all authored character and NPC GLB assets")
  Invoke-Git @("push", "origin", "HEAD")
  Write-Host "SUCCESS: authored GLB assets were committed and pushed through Git LFS."
  Write-Host "Verify the GitHub Actions build before treating the hosted game as complete."
}
finally {
  Pop-Location
}
