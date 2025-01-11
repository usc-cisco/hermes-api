# Server Setup Guide

Before running the `deploy.yml` workflow, ensure that the server is properly set up. Without completing this setup, the workflow will not work as expected.

## Step 1: SSH into the DCISM Server

SSH into the server using the instructions provided at `admin.dcism.org`.

## Step 2: Clone the Repository

Clone the repository to the subdomain:

```bash
cd {{ HERMES_SUBDOMAIN }}
git clone https://github.com/usc-cisco/hermes-api.git
cd hermes-api
mv * .[^.]* ../  # Move all files, including hidden ones, to the parent directory
cd ..
rmdir hermes-api  # Remove the now-empty directory
```

> [!NOTE]
> Make sure to replace {{ HERMES_SUBDOMAIN }} with the actual subdomain.

## Step 3: Install Dependencies

Install the necessary dependencies using Bun:

```bash
bun install
```

## Step 4: Initialize the SQLite Database

Generate, migrate, and seed the SQLite database:

```bash
bun db:init
```

## Step 5: Build the Server

Build the server for production:

```bash
bun run build
```

## Step 6: Start the Server

Start the server using PM2:

```bash
bun pm2 start ./dist/hermes --name hermes
```

## Step 7: Configure `.htaccess`

Create or update the `.htaccess` file with the following rules:

```bash
DirectoryIndex disabled

RewriteEngine on

RewriteCond %{SERVER_PORT} 80
RewriteRule ^.*$ https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]

RewriteRule (.*) http://127.0.0.1:8888%{REQUEST_URI} [P,L]
```

This configuration ensures:

- Redirects HTTP traffic to HTTPS.
- Proxies traffic to `127.0.0.1:8888`.

---

Once this setup is complete, you can proceed with the `deploy.yml` workflow.
