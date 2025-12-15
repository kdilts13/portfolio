locals {
  repo_path = "${var.region}-docker.pkg.dev/${var.project_id}/${var.ar_repo}"
}

# Enable required services (idempotent)
resource "google_project_service" "services" {
  for_each = toset([
    "run.googleapis.com",
    "artifactregistry.googleapis.com",
    "iam.googleapis.com",
    "iamcredentials.googleapis.com",
    "sts.googleapis.com",
    "secretmanager.googleapis.com",
    "firebase.googleapis.com",
    "firestore.googleapis.com",
    "identitytoolkit.googleapis.com",
  ])
  service            = each.value
  disable_on_destroy = false
}

# Artifact Registry repo (if not yet created)
resource "google_artifact_registry_repository" "apps" {
  location      = var.region
  repository_id = var.ar_repo
  format        = "DOCKER"
  description   = "Containers for portfolio apps"
  lifecycle {
    prevent_destroy = true
  }
}

# Runtime service accounts (Cloud Run)
resource "google_service_account" "run_api" {
  account_id   = "run-api"
  display_name = "Cloud Run API runtime"
  lifecycle {
    prevent_destroy = true
  }
}

resource "google_service_account" "run_web" {
  account_id   = "run-web"
  display_name = "Cloud Run Web runtime"
  lifecycle {
    prevent_destroy = true
  }
}

# Grant Firestore access to API runtime
resource "google_project_iam_member" "api_datastore_user" {
  project = var.project_id
  role    = "roles/datastore.user"
  member  = "serviceAccount:${google_service_account.run_api.email}"
}

# Cloud Run services
resource "google_cloud_run_v2_service" "api" {
  name     = "api"
  location = var.region

  template {
    service_account = google_service_account.run_api.email

    # Scale-to-zero + cap max instances
    scaling {
      min_instance_count = 0
      max_instance_count = 3
    }

    containers {
      image = "${local.repo_path}/${var.api_image}:latest"

      env {
        name  = "SPRING_PROFILES_ACTIVE"
        value = "prod"
      }
    }
  }

  depends_on = [google_artifact_registry_repository.apps]
}

resource "google_cloud_run_v2_service" "web" {
  name     = "web"
  location = var.region

  template {
    service_account = google_service_account.run_web.email

    # Scale-to-zero + cap max instances
    scaling {
      min_instance_count = 0
      max_instance_count = 3
    }

    containers {
      image = "${local.repo_path}/${var.web_image}:latest"

      env {
        name  = "NODE_ENV"
        value = "production"
      }

      env {
        name  = "API_BASE"
        value = "https://api-y3wnybmuqa-uc.a.run.app"
      }
    }
  }

  depends_on = [google_artifact_registry_repository.apps]
}


# Allow unauthenticated access (optional to include project; harmless)
resource "google_cloud_run_v2_service_iam_member" "web_invoker_all" {
  project  = var.project_id
  location = var.region
  name     = google_cloud_run_v2_service.web.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# Allow ONLY the web Cloud Run service account to call the API service
resource "google_cloud_run_v2_service_iam_binding" "api_invokers" {
  project  = var.project_id
  location = var.region
  name     = google_cloud_run_v2_service.api.name
  role    = "roles/run.invoker"
  members = [
    "serviceAccount:${google_service_account.run_web.email}",
  ]
}

# Service account for deploying Firebase/Firestore rules from CI
resource "google_service_account" "firebase_rules_deployer" {
  account_id   = "firebase-rules-deployer"
  display_name = "Firebase Rules deployer (CI)"

  lifecycle {
    prevent_destroy = true
  }
}

# IAM role so it can deploy Firestore / Firebase rules
resource "google_project_iam_member" "firebase_rules_admin" {
  project = var.project_id
  role    = "roles/firebaserules.admin"
  member  = "serviceAccount:${google_service_account.firebase_rules_deployer.email}"
}

# IAM role so it can call the Service Usage API (needed by firebase CLI)
resource "google_project_iam_member" "firebase_rules_serviceusage_viewer" {
  project = var.project_id
  role    = "roles/serviceusage.serviceUsageViewer"
  member  = "serviceAccount:${google_service_account.firebase_rules_deployer.email}"
}

# TEMP: should trigger tfsec failure
resource "google_cloud_run_v2_service_iam_member" "api_invoker_all_temp" {
  project  = var.project_id
  location = var.region
  name     = google_cloud_run_v2_service.api.name

  role   = "roles/run.invoker"
  member = "allUsers"
}
