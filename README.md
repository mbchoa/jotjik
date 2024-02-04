This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, spin up your Postgres container:

```bash
docker build -t jotjik_db .
docker run -d --name jotjik_db -p 5432:5432 jotjik_db:latest
```

Second, run Prisma migration command to setup database tables:

```bash
npx prisma migrate dev
```

Third, copy the `env.example` to a `.env` file and update the environment variables in there with your own Google OAuth API keys:

```
GOOGLE_CLIENT_ID=YOUR_KEY_HERE
GOOGLE_CLIENT_SECRET=YOUR_KEY_HERE
```

Lastly, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Scheduled Database Backup Job

There's a GitHub Actions workflow that runs a scheduled job to backup the app database every day. GCP Cloud Storage is used to store the backups. Follow the steps below to setup the GCP Cloud Storage.

### Setup GCP Cloud Storage

1. Create a new project in the [Google Cloud Console](https://console.cloud.google.com/).

2. Enable the Cloud Storage API for the project.

3. Create a service account with the `Storage Admin` role.

4. Create a new JSON key for the service account and download it.

6. Navigate to the terraform/setup-gcp-cloud-storage folder

7. Create a new file called `terraform.tfvars` and add the following content:

    ```hcl
    project_id = "YOUR_PROJECT_ID"
    bucket_name = "NAME_OF_YOUR_BUCKET"
    service_account_email = "YOUR_SERVICE_ACCOUNT_EMAIL"
    owner_email = "YOUR_EMAIL"
    ```
    THe `owner_email` is the email address of the person who will be managing the GCP Cloud Storage bucket. This should have a role of `Owner` in the GCP project.

7. Initialize the Terraform project, plan and apply the configuration:

    ```bash
    terraform init
    terraform plan
    terraform apply
    ```

    The Terraform configuration will create a new GCP Cloud Storage bucket and a new service account with the `Storage Object Admin` role. The service account will be used to upload the database backups to the bucket.

### Setup GitHub Secrets

1. Navigate to the GitHub repository settings and add the following secrets:

    - `GCP_SA_KEY`: Copy the contents of the service account JSON key file and paste it here.
    - `BUCKET_NAME`: The name of the GCP Cloud Storage bucket.
    - `DATABASE_URL`: The URL of the production app database.

## Restore from Backup

To restore the app database from a backup, follow the steps below:

1. Download the backup file from the GCP Cloud Storage bucket. Make sure to save it as `dump.tar` at the root of the project.

2. Run the `db:restore` npm script. This will restore the database from the backup file.

    ```bash
    npm run db:restore
    ```
