$ErrorActionPreference = "Stop"

$secureKey = Read-Host "New OpenAI API key" -AsSecureString
$plainKey = [System.Net.NetworkCredential]::new("", $secureKey).Password
$tempFile = New-TemporaryFile
$tempPath = $tempFile.FullName

try {
    [System.IO.File]::WriteAllText($tempPath, $plainKey)

    if (-not (Test-Path $tempPath)) {
        throw "Temporary secret file was not created."
    }

    gcloud secrets versions add portfolio-api-openai-key `
        --data-file="$tempPath"

    if ($LASTEXITCODE -ne 0) {
        throw "Failed to create the Secret Manager version."
    }

    gcloud run services update api `
        --region=us-central1 `
        --update-secrets=APP_OPENAI_API_KEY=portfolio-api-openai-key:latest

    if ($LASTEXITCODE -ne 0) {
        throw "Failed to deploy a new Cloud Run revision."
    }
}
finally {
    if (Test-Path $tempPath) {
        Remove-Item $tempPath -Force
    }

    Remove-Variable plainKey -ErrorAction SilentlyContinue
    Remove-Variable secureKey -ErrorAction SilentlyContinue
    Remove-Variable tempFile -ErrorAction SilentlyContinue
    Remove-Variable tempPath -ErrorAction SilentlyContinue
}
