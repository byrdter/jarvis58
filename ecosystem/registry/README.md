# JARVIS Ecosystem Registry

The central registry for all JARVIS ecosystem applications.

## Overview

The registry maintains a catalog of all apps in the JARVIS ecosystem, including their capabilities, data types, integration requirements, and interfaces. The Master Orchestrator uses this registry to route requests, discover capabilities, and enable conversational access to all apps.

## Structure

```
registry/
├── apps.json                 # Registry database (app IDs and metadata)
├── manifest-schema.json      # Validation schema for app manifests
├── jarvis-registry.py        # CLI tool for managing registry
└── README.md                 # This file
```

## App Manifests

Each app declares its capabilities in a `manifest.json` file located in its app directory:

```
jarvis/apps/
├── investment/
│   └── manifest.json
├── research/
│   └── manifest.json
├── content-creation/
│   └── manifest.json
└── knowledge-management/
    └── manifest.json
```

## CLI Tool Usage

The `jarvis-registry.py` tool manages the registry:

### List All Apps
```bash
python3 jarvis-registry.py list
```

Shows all registered apps with their domains and status.

### Show App Details
```bash
python3 jarvis-registry.py show <app_id>
```

Example:
```bash
python3 jarvis-registry.py show jarvis-investment
```

Displays detailed information about an app including capabilities, data types, integration, and interface.

### Add App to Registry
```bash
python3 jarvis-registry.py add <path_to_manifest.json>
```

Example:
```bash
python3 jarvis-registry.py add ../../apps/new-app/manifest.json
```

Validates and adds a new app to the registry.

### Remove App from Registry
```bash
python3 jarvis-registry.py remove <app_id>
```

Example:
```bash
python3 jarvis-registry.py remove old-app-id
```

Removes an app from the registry (does not delete files).

### Validate Manifest
```bash
python3 jarvis-registry.py validate <path_to_manifest.json>
```

Validates a manifest against the schema without adding to registry.

### Refresh Registry
```bash
python3 jarvis-registry.py refresh
```

Scans the `apps/` directory and rebuilds the registry from all found manifests. Use this after:
- Adding new apps
- Updating existing manifests
- Recovering from registry corruption

## Manifest Structure

Each app manifest must include:

### Required Fields
- `app_id` - Unique identifier (kebab-case)
- `name` - Human-readable name
- `version` - Semantic version (e.g., 1.0.0)
- `domain` - Primary domain (investments, research, content, knowledge, etc.)
- `status` - active, inactive, development, or deprecated
- `description` - What the app does
- `location` - Relative path to app directory
- `capabilities` - Array of capabilities the app provides
- `data_types` - Array of data types the app manages
- `integration` - Integration requirements and relationships
- `interface` - API, CLI, and web interfaces

### Capability Structure
```json
{
  "id": "capability_name",
  "name": "Human Readable Name",
  "description": "What this capability does",
  "input": ["param1", "param2"],
  "output": "result_type",
  "endpoint": "/api/app/capability",
  "keywords": ["keyword1", "keyword2"]
}
```

Keywords are used by the Master Orchestrator for intent matching.

### Data Type Structure
```json
{
  "type": "data_type_name",
  "description": "What this data represents",
  "queryable": true,
  "endpoint": "/api/app/data/type",
  "keywords": ["keyword1", "keyword2"]
}
```

### Integration Structure
```json
{
  "required": false,
  "integrates_with": ["other-app-id"],
  "provides_to": ["dashboard", "voice-interface"],
  "consumes_from": ["another-app-id"]
}
```

## Current Registry

As of 2026-02-06, the registry contains:

**4 Apps across 4 Domains:**

1. **jarvis-investment** (investments)
   - 6 capabilities: analyze_etf, screen_opportunities, build_portfolio, monitor_portfolio, track_performance, get_market_insights
   - 4 data types: portfolio, analysis, recommendations, market_data

2. **research-aggregator** (research)
   - 5 capabilities: aggregate_news, aggregate_youtube, aggregate_academic, get_transcripts, get_market_insights_transcripts
   - 4 data types: news_articles, video_transcripts, research_papers, market_insights

3. **content-creation** (content)
   - 5 capabilities: create_script, generate_images, create_launch_package, assemble_video, list_projects
   - 4 data types: video_scripts, launch_packages, video_projects, generated_images

4. **knowledge-management** (knowledge)
   - 6 capabilities: organize_vault, query_notes, update_context, get_learnings, get_work_status, get_preferences
   - 5 data types: notes, context, learnings, work_status, preferences

## Adding a New App

1. **Create app directory:**
   ```bash
   mkdir -p jarvis/apps/new-app
   ```

2. **Create manifest.json:**
   Copy template from existing app or use schema as guide.

3. **Add to registry:**
   ```bash
   python3 jarvis-registry.py add jarvis/apps/new-app/manifest.json
   ```

   Or simply refresh to auto-discover:
   ```bash
   python3 jarvis-registry.py refresh
   ```

4. **Verify:**
   ```bash
   python3 jarvis-registry.py show new-app-id
   ```

The Master Orchestrator will automatically discover and route to the new app on next startup!

## Schema Validation

The manifest schema (`manifest-schema.json`) ensures all manifests follow the correct structure. Validation happens automatically when adding apps or refreshing the registry.

To manually validate a manifest:
```bash
python3 jarvis-registry.py validate path/to/manifest.json
```

## Registry Database

`apps.json` contains the registry metadata:
- List of registered app IDs
- Registry version
- Last updated timestamp
- List of domains
- App count

The registry is intentionally lightweight - full app details are stored in individual manifests, and the registry just maintains references.

## Future Enhancements

- **PostgreSQL backend** - Migrate from JSON to database for better querying
- **Capability search** - Search for apps by capability keywords
- **Dependency checking** - Validate app dependencies are satisfied
- **Auto-discovery** - Automatic detection of new apps via file watching
- **Web interface** - Visual registry browser and editor
- **Version control** - Track manifest changes over time

## Related Documentation

- [MASTER-ORCHESTRATOR-DESIGN.md](../../MASTER-ORCHESTRATOR-DESIGN.md) - Overall architecture
- [ECOSYSTEM-ARCHITECTURE.md](../../ECOSYSTEM-ARCHITECTURE.md) - App inventory and integration
- [ARCHITECTURE-ASSESSMENT.md](../../ARCHITECTURE-ASSESSMENT.md) - Gap analysis and roadmap
