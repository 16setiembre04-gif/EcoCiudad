# Supabase Database Migrations

This folder contains all database migrations for the EcoCiudad project.

## Structure

```
supabase/
├── migrations/
│   ├── 001_initial_schema.sql    # Initial database schema
│   └── ...                       # Future migrations
└── README.md                     # This file
```

## Migration Naming Convention

Migrations should be named with a sequential number prefix:
- `001_initial_schema.sql`
- `002_add_reports_table.sql`
- `003_add_events_table.sql`

## Running Migrations

### Using Supabase CLI

```bash
# Apply all pending migrations
supabase db push

# Reset database (WARNING: deletes all data)
supabase db reset

# Generate migration from local changes
supabase db diff -f migration_name
```

### Manual Execution

1. Connect to your Supabase database
2. Execute migration files in order
3. Verify RLS policies are applied

## Migration Guidelines

1. **Always include RLS policies** when creating new tables
2. **Use transactions** for complex migrations
3. **Test migrations** in development before production
4. **Document breaking changes** in commit messages
5. **Never modify** applied migrations, create new ones

## Current Schema

The initial schema includes:
- User profiles (extends Supabase auth)
- Operators and Administrators
- Environmental reports
- Communities and members
- Events and attendees
- Recycling centers and recyclers
- Collection trucks and routes
- Notifications
- Achievements and eco points
- Favorites and user settings

See `001_initial_schema.sql` for complete schema details.
