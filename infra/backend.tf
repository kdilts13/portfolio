terraform {
  backend "gcs" {
    bucket = "kd-portfolio-prod-tfstate"
    prefix = "terraform/state"
  }
}
