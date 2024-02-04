#!/bin/bash

# Set the database URL
DB_URL="postgres://jotjik:jotjik@localhost:6000/jotjik"

# Set the database name
DB_NAME="jotjik"

# Set the file path
SQL_FILE="dump.tar"

# Set the dump folder path
DUMP_FOLDER="./dump"

# Check if the .sql file exists
if [ ! -f "$SQL_FILE" ]; then
  echo "Error: $SQL_FILE does not exist."
  exit 1
fi

# Cleanup tmp folder
rm -rf $DUMP_FOLDER
mkdir -p $DUMP_FOLDER

# Unzip the dump file to the temporary folder
tar -xf "$SQL_FILE"

# Restore the database from the temporary folder
pg_restore -j 8 --no-owner --no-privileges --format=d -d "$DB_URL" "$DUMP_FOLDER"

# Check if the restore was successful
if [ $? -eq 0 ]; then
  echo "Database restore completed successfully."
else
  echo "Error: Database restore failed."
fi
