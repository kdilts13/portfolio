variable "cloudflare_api_token" {
  type      = string
  sensitive = true
}

variable "cloudflare_zone_id" {
  type = string
}

variable "google_site_verification" {
  type        = string
  description = "Value of the google-site-verification TXT record"
  default     = "google-site-verification=ONE-3vpM3HdPRt3SZPQn40-DVuHxzlSQar9-O_8mCGM"
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

locals {
  apex_a_records = [
    "216.239.32.21",
    "216.239.34.21",
    "216.239.36.21",
    "216.239.38.21",
  ]

  apex_aaaa_records = [
    "2001:4860:4802:32::15",
    "2001:4860:4802:34::15",
    "2001:4860:4802:36::15",
    "2001:4860:4802:38::15",
  ]
}

# Apex A records (proxied, TTL auto)
resource "cloudflare_record" "apex_a" {
  for_each = toset(local.apex_a_records)

  zone_id = var.cloudflare_zone_id
  name    = "kdilts.net"
  type    = "A"
  content = each.value
  proxied = true
  ttl     = 1 # "Auto" in Cloudflare
}

# Apex AAAA records (proxied, TTL auto)
resource "cloudflare_record" "apex_aaaa" {
  for_each = toset(local.apex_aaaa_records)

  zone_id = var.cloudflare_zone_id
  name    = "kdilts.net"
  type    = "AAAA"
  content = each.value
  proxied = true
  ttl     = 1 # "Auto" in Cloudflare
}

# www -> ghs.googlehosted.com (proxied, TTL auto)
resource "cloudflare_record" "www" {
  zone_id = var.cloudflare_zone_id
  name    = "www"
  type    = "CNAME"
  content = "ghs.googlehosted.com"
  proxied = true
  ttl     = 1 # "Auto"
}

# google-site-verification TXT (DNS only, TTL 1 hour)
resource "cloudflare_record" "google_site_verification" {
  zone_id = var.cloudflare_zone_id
  name    = "kdilts.net"
  type    = "TXT"
  content = var.google_site_verification

  proxied = false
  ttl     = 3600
}
