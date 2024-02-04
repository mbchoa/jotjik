terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.14"
    }
  }
}

provider "google" {
  credentials = file("credentials.json")
  project = var.project_id
  region  = var.region
}

resource "google_storage_bucket" "backup_bucket" {
  name          = var.bucket_name
  location      = var.bucket_location
  force_destroy = true
  versioning {
    enabled = true
  } 

  lifecycle_rule {
    condition {
      age = 30 // Number of days to keep the backups
    }
    action {
      type = "Delete"
    }
  }
}

resource "google_storage_bucket_iam_member" "service_account_object_creator" {
  bucket = google_storage_bucket.backup_bucket.name
  role   = "roles/storage.objectCreator"
  member = "serviceAccount:${var.service_account_email}"
}

resource "google_storage_bucket_iam_member" "owner_full_permissions" {
  bucket = google_storage_bucket.backup_bucket.name
  role   = "roles/storage.admin"
  member = "user:${var.owner_email}"
}
