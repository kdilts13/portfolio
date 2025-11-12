terraform {
  required_version = ">= 1.5.0, < 1.6.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.39"  # Compatible with Terraform 1.5.x
    }
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 5.39"
    }
  }
}
