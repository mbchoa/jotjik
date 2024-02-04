variable "project_id" {
  description = "The GCP project ID."
  type        = string
}

variable "region" {
  description = "The GCP region for resources."
  type        = string
  default     = "us-west1"
}

variable "bucket_name" {
  description = "The name of the Google Cloud Storage bucket."
  type        = string
}

variable "bucket_location" {
  description = "The location of the Google Cloud Storage bucket."
  type        = string
  default     = "US"
}

variable "service_account_email" {
  description = "The email address of a service account."
  type        = string
}

variable "owner_email" {
  description = "The email address of the project owner (your personal account)."
  type        = string
}
