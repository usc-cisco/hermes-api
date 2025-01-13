# Database Restoration Guide

How to restore the database in case the current one gets corrupted or deleted.

1. Identify the backup file to restore from (see `hermes-db-snapshots/`)
2. Copy the file into the subdomain directory

```bash
# Assuming you're in hermes-db-snapshots/
cp snapshot-file.db ../hermes.dcism.org/sqlite.db

# The file HAS to be renamed to sqlite.db as that's
# what the ORM is expecting
```

1. Restart the server process
```bash
# Assuming you're in hermes-db-snapshots/
cd ../hermes.dcism.org
npx pm2 restart hermes
```