#!/usr/bin/env python3
"""
JARVIS Registry CLI Tool

Manage the JARVIS ecosystem app registry.

Commands:
  add <manifest_path>      Add app to registry
  remove <app_id>          Remove app from registry
  list                     List all registered apps
  show <app_id>            Show app details
  validate <manifest_path> Validate manifest against schema
  refresh                  Refresh registry from all manifests
"""

import json
import sys
import os
from pathlib import Path
from datetime import datetime
import argparse

# Paths
REGISTRY_DIR = Path(__file__).parent
APPS_JSON = REGISTRY_DIR / "apps.json"
SCHEMA_JSON = REGISTRY_DIR / "manifest-schema.json"
APPS_DIR = REGISTRY_DIR.parent.parent / "apps"


def load_json(file_path):
    """Load JSON file"""
    try:
        with open(file_path, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Error: File not found: {file_path}")
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON in {file_path}: {e}")
        sys.exit(1)


def save_json(file_path, data):
    """Save JSON file"""
    with open(file_path, 'w') as f:
        json.dump(data, f, indent=2)
    print(f"✅ Saved: {file_path}")


def validate_manifest(manifest_path):
    """Validate manifest against schema"""
    manifest = load_json(manifest_path)
    schema = load_json(SCHEMA_JSON)

    # Simple validation (check required fields)
    required_fields = schema.get('required', [])
    missing_fields = []

    for field in required_fields:
        if field not in manifest:
            missing_fields.append(field)

    if missing_fields:
        print(f"❌ Validation failed: Missing required fields: {', '.join(missing_fields)}")
        return False

    # Validate app_id format
    app_id = manifest.get('app_id', '')
    if not app_id or not app_id.replace('-', '').replace('_', '').isalnum():
        print(f"❌ Validation failed: Invalid app_id format: {app_id}")
        return False

    print(f"✅ Manifest valid: {manifest['name']} ({manifest['app_id']})")
    return True


def add_app(manifest_path):
    """Add app to registry"""
    manifest_path = Path(manifest_path)

    if not manifest_path.exists():
        print(f"❌ Error: Manifest not found: {manifest_path}")
        sys.exit(1)

    # Validate manifest
    if not validate_manifest(manifest_path):
        sys.exit(1)

    # Load manifest and registry
    manifest = load_json(manifest_path)
    registry = load_json(APPS_JSON)

    app_id = manifest['app_id']

    # Check if already registered
    if app_id in registry['apps']:
        print(f"⚠️  Warning: App already registered: {app_id}")
        print("Use 'jarvis-registry refresh' to update")
        return

    # Add to registry
    registry['apps'].append(app_id)
    registry['app_count'] = len(registry['apps'])

    # Add domain if not present
    domain = manifest.get('domain')
    if domain and domain not in registry['domains']:
        registry['domains'].append(domain)

    # Update timestamp
    registry['last_updated'] = datetime.now().isoformat() + 'Z'

    # Save registry
    save_json(APPS_JSON, registry)

    print(f"✅ Added app: {manifest['name']} ({app_id})")
    print(f"   Domain: {domain}")
    print(f"   Capabilities: {len(manifest.get('capabilities', []))}")
    print(f"   Location: {manifest.get('location')}")


def remove_app(app_id):
    """Remove app from registry"""
    registry = load_json(APPS_JSON)

    if app_id not in registry['apps']:
        print(f"❌ Error: App not found in registry: {app_id}")
        sys.exit(1)

    # Remove from registry
    registry['apps'].remove(app_id)
    registry['app_count'] = len(registry['apps'])

    # Update timestamp
    registry['last_updated'] = datetime.now().isoformat() + 'Z'

    # Save registry
    save_json(APPS_JSON, registry)

    print(f"✅ Removed app: {app_id}")


def list_apps():
    """List all registered apps"""
    registry = load_json(APPS_JSON)

    print(f"\n{'='*60}")
    print(f"JARVIS Ecosystem Registry")
    print(f"{'='*60}")
    print(f"Version: {registry['registry_version']}")
    print(f"Last Updated: {registry['last_updated']}")
    print(f"Total Apps: {registry['app_count']}")
    print(f"Domains: {', '.join(registry['domains'])}")
    print(f"{'='*60}\n")

    if not registry['apps']:
        print("No apps registered.")
        return

    print(f"{'App ID':<30} {'Domain':<15} {'Status':<10}")
    print(f"{'-'*60}")

    for app_id in registry['apps']:
        # Load manifest
        manifest_path = APPS_DIR / app_id.replace('jarvis-', '').replace('-aggregator', '') / "manifest.json"

        # Handle different app directory structures
        if not manifest_path.exists():
            manifest_path = APPS_DIR / app_id / "manifest.json"

        if manifest_path.exists():
            manifest = load_json(manifest_path)
            domain = manifest.get('domain', 'unknown')
            status = manifest.get('status', 'unknown')
            print(f"{app_id:<30} {domain:<15} {status:<10}")
        else:
            print(f"{app_id:<30} {'not found':<15} {'error':<10}")

    print()


def show_app(app_id):
    """Show detailed app information"""
    registry = load_json(APPS_JSON)

    if app_id not in registry['apps']:
        print(f"❌ Error: App not found in registry: {app_id}")
        sys.exit(1)

    # Find and load manifest
    manifest_path = None

    # Try different directory structures
    possible_paths = [
        APPS_DIR / app_id.replace('jarvis-', '').replace('-aggregator', '') / "manifest.json",
        APPS_DIR / app_id / "manifest.json",
    ]

    for path in possible_paths:
        if path.exists():
            manifest_path = path
            break

    if not manifest_path:
        print(f"❌ Error: Manifest not found for app: {app_id}")
        sys.exit(1)

    manifest = load_json(manifest_path)

    # Display details
    print(f"\n{'='*60}")
    print(f"{manifest['name']}")
    print(f"{'='*60}")
    print(f"App ID: {manifest['app_id']}")
    print(f"Version: {manifest['version']}")
    print(f"Domain: {manifest['domain']}")
    print(f"Status: {manifest['status']}")
    print(f"Description: {manifest['description']}")
    print(f"Location: {manifest['location']}")
    print(f"\nCapabilities ({len(manifest['capabilities'])}):")
    for cap in manifest['capabilities']:
        print(f"  - {cap['name']} ({cap['id']})")
        print(f"    {cap['description']}")

    print(f"\nData Types ({len(manifest['data_types'])}):")
    for dt in manifest['data_types']:
        queryable = "✓" if dt['queryable'] else "✗"
        print(f"  - {dt['type']} [{queryable}]")
        print(f"    {dt['description']}")

    print(f"\nIntegration:")
    print(f"  Required: {manifest['integration']['required']}")
    print(f"  Integrates with: {', '.join(manifest['integration']['integrates_with']) or 'none'}")
    print(f"  Provides to: {', '.join(manifest['integration']['provides_to']) or 'none'}")
    print(f"  Consumes from: {', '.join(manifest['integration']['consumes_from']) or 'none'}")

    print(f"\nInterface:")
    print(f"  API: {manifest['interface']['api'] or 'not available'}")
    print(f"  CLI: {manifest['interface']['cli'] or 'not available'}")
    print(f"  Web: {manifest['interface']['web'] or 'not available'}")

    if 'metadata' in manifest:
        print(f"\nMetadata:")
        for key, value in manifest['metadata'].items():
            if isinstance(value, list):
                value = ', '.join(str(v) for v in value)
            print(f"  {key}: {value}")

    print()


def refresh_registry():
    """Refresh registry from all manifests in apps directory"""
    print("Refreshing registry from app manifests...")

    registry = load_json(APPS_JSON)
    found_apps = []
    found_domains = []

    # Scan apps directory
    if not APPS_DIR.exists():
        print(f"❌ Error: Apps directory not found: {APPS_DIR}")
        sys.exit(1)

    for app_dir in APPS_DIR.iterdir():
        if not app_dir.is_dir():
            continue

        manifest_path = app_dir / "manifest.json"
        if not manifest_path.exists():
            continue

        # Load and validate manifest
        try:
            manifest = load_json(manifest_path)

            if validate_manifest(manifest_path):
                app_id = manifest['app_id']
                domain = manifest['domain']

                found_apps.append(app_id)

                if domain not in found_domains:
                    found_domains.append(domain)

                print(f"  ✓ {manifest['name']} ({app_id})")
        except Exception as e:
            print(f"  ✗ Error loading {app_dir.name}: {e}")

    # Update registry
    registry['apps'] = sorted(found_apps)
    registry['app_count'] = len(found_apps)
    registry['domains'] = sorted(found_domains)
    registry['last_updated'] = datetime.now().isoformat() + 'Z'

    # Save
    save_json(APPS_JSON, registry)

    print(f"\n✅ Registry refreshed: {len(found_apps)} apps, {len(found_domains)} domains")


def main():
    parser = argparse.ArgumentParser(
        description='JARVIS Registry CLI - Manage ecosystem apps'
    )

    subparsers = parser.add_subparsers(dest='command', help='Commands')

    # Add command
    add_parser = subparsers.add_parser('add', help='Add app to registry')
    add_parser.add_argument('manifest_path', help='Path to app manifest.json')

    # Remove command
    remove_parser = subparsers.add_parser('remove', help='Remove app from registry')
    remove_parser.add_argument('app_id', help='App ID to remove')

    # List command
    subparsers.add_parser('list', help='List all registered apps')

    # Show command
    show_parser = subparsers.add_parser('show', help='Show app details')
    show_parser.add_argument('app_id', help='App ID to show')

    # Validate command
    validate_parser = subparsers.add_parser('validate', help='Validate manifest')
    validate_parser.add_argument('manifest_path', help='Path to app manifest.json')

    # Refresh command
    subparsers.add_parser('refresh', help='Refresh registry from all manifests')

    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        sys.exit(1)

    # Execute command
    if args.command == 'add':
        add_app(args.manifest_path)
    elif args.command == 'remove':
        remove_app(args.app_id)
    elif args.command == 'list':
        list_apps()
    elif args.command == 'show':
        show_app(args.app_id)
    elif args.command == 'validate':
        validate_manifest(args.manifest_path)
    elif args.command == 'refresh':
        refresh_registry()


if __name__ == '__main__':
    main()
