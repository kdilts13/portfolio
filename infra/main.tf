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
    containers {
      image = "${local.repo_path}/${var.web_image}:latest"
      env {
        name  = "NODE_ENV"
        value = "production"
      }
       env {
        name  = "NEXT_PUBLIC_API_BASE"
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

resource "google_cloud_run_v2_service_iam_member" "api_invoker_all" {
  project  = var.project_id
  location = var.region
  name     = google_cloud_run_v2_service.api.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# === CI/CD permissions for gh-deployer (GitHub Actions) ===
# Allows creating/running Cloud Build jobs
resource "google_project_iam_member" "gh_cb_builds_editor" {
  project = var.project_id
  role    = "roles/cloudbuild.builds.editor"
  member  = "serviceAccount:gh-deployer@${var.project_id}.iam.gserviceaccount.com"
}

# Allows calling enabled services (fixes serviceusage.services.use)
resource "google_project_iam_member" "gh_serviceusage_consumer" {
  project = var.project_id
  role    = "roles/serviceusage.serviceUsageConsumer"
  member  = "serviceAccount:gh-deployer@${var.project_id}.iam.gserviceaccount.com"
}

# Allows uploading source tarballs to the Cloud Build GCS bucket
resource "google_project_iam_member" "gh_storage_object_admin" {
  project = var.project_id
  role    = "roles/storage.objectAdmin"
  member  = "serviceAccount:gh-deployer@${var.project_id}.iam.gserviceaccount.com"
}
