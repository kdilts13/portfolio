$ErrorActionPreference = "Stop"

$variables = @(
    "TF_VAR_project_id",
    "TF_VAR_deployer_sa",
    "TF_VAR_cloudflare_zone_id",
    "TF_VAR_cloudflare_api_token"
)

foreach ($variable in $variables) {
    Remove-Item "Env:$variable" -ErrorAction SilentlyContinue
}

Write-Host "Terraform environment variables removed." -ForegroundColor Green
