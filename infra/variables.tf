variable "project_id" {
  type = string
}

variable "region" {
  type    = string
  default = "us-central1"
}

variable "ar_repo" {
  type    = string
  default = "apps"
}

variable "web_image" {
  type    = string
  default = "web"
}

variable "api_image" {
  type    = string
  default = "api"
}

variable "deployer_sa" {
  type        = string
  description = "Service account email used by GitHub Actions for Terraform"
}
