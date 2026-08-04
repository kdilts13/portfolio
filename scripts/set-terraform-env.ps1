$ErrorActionPreference = "Stop"

Write-Host "Configuring Terraform environment..." -ForegroundColor Cyan

#
# Non-secret configuration
#

$env:TF_VAR_project_id = "kd-portfolio-prod"
$env:TF_VAR_deployer_sa = "gh-deployer@kd-portfolio-prod.iam.gserviceaccount.com"
$env:TF_VAR_cloudflare_zone_id = "48b36a82447e9134817e43a69463bd49"

#
# Prompt for Cloudflare API token
#

$secureToken = Read-Host "Cloudflare API token" -AsSecureString

$env:TF_VAR_cloudflare_api_token =
    [System.Net.NetworkCredential]::new("", $secureToken).Password

Remove-Variable secureToken -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "Terraform environment configured for this PowerShell session." -ForegroundColor Green
