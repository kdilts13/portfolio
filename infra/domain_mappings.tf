# Root domain mapping -> Cloud Run service "web"
resource "google_cloud_run_domain_mapping" "root" {
  provider = google-beta
  location = var.region
  name     = "kdilts.net"

  metadata {
    namespace = var.project_id
  }

  spec {
    route_name = google_cloud_run_v2_service.web.name
  }
}

# www domain mapping -> Cloud Run service "web"
resource "google_cloud_run_domain_mapping" "www" {
  provider = google-beta
  location = var.region
  name     = "www.kdilts.net"

  metadata {
    namespace = var.project_id
  }

  spec {
    route_name = google_cloud_run_v2_service.web.name
  }
}
