#!/usr/bin/env python3
"""
JARVIS Heartbeat Scheduler

Manages launchd (macOS) scheduled jobs for autonomous heartbeat execution.

This script creates and manages launchd plist files that trigger the heartbeat
executor at specified times.

Usage:
    python scheduler.py --install    # Install all heartbeat schedules
    python scheduler.py --uninstall  # Remove all heartbeat schedules
    python scheduler.py --status     # Show status of all schedules
    python scheduler.py --list       # List all scheduled jobs
"""

import argparse
import plistlib
import subprocess
import sys
from pathlib import Path
from typing import Dict, List

# Paths
JARVIS_ROOT = Path("/Users/terrybyrd/Library/CloudStorage/Dropbox/jarvis")
EXECUTOR_SCRIPT = JARVIS_ROOT / "scripts/heartbeat/executor.py"
LAUNCHD_DIR = Path.home() / "Library/LaunchAgents"
LABEL_PREFIX = "com.jarvis.heartbeat"

# Ensure launchd directory exists
LAUNCHD_DIR.mkdir(parents=True, exist_ok=True)


class HeartbeatScheduler:
    """Manages launchd schedules for JARVIS heartbeat"""

    def __init__(self):
        self.schedules = self.define_schedules()

    def define_schedules(self) -> List[Dict]:
        """
        Define all heartbeat schedules.

        Returns a list of schedule definitions with:
        - name: Schedule name
        - label: LaunchD label
        - mode: Heartbeat mode (morning/evening/weekly/monthly)
        - schedule: When to run (hour, minute, weekday)
        """
        return [
            {
                'name': 'Morning Market Check',
                'label': f'{LABEL_PREFIX}.morning',
                'mode': 'morning',
                'hour': 9,
                'minute': 0,
                'weekday': [1, 2, 3, 4, 5],  # Monday-Friday
                'description': 'Daily morning market check (9:00 AM, M-F)'
            },
            {
                'name': 'Evening Summary',
                'label': f'{LABEL_PREFIX}.evening',
                'mode': 'evening',
                'hour': 20,  # 8:00 PM
                'minute': 0,
                'weekday': [1, 2, 3, 4, 5],  # Monday-Friday
                'description': 'Daily evening summary (8:00 PM, M-F)'
            },
            {
                'name': 'Weekly Review',
                'label': f'{LABEL_PREFIX}.weekly',
                'mode': 'weekly',
                'hour': 8,
                'minute': 0,
                'weekday': [0],  # Sunday (0=Sunday in launchd)
                'description': 'Weekly portfolio review (8:00 AM, Sunday)'
            },
            {
                'name': 'Monthly Review',
                'label': f'{LABEL_PREFIX}.monthly',
                'mode': 'monthly',
                'hour': 10,
                'minute': 0,
                'day': 1,  # First day of month
                'description': 'Monthly strategy review (10:00 AM, 1st of month)'
            }
        ]

    def create_plist(self, schedule: Dict) -> Path:
        """
        Create a launchd plist file for the given schedule.

        Args:
            schedule: Schedule definition dict

        Returns:
            Path to created plist file
        """
        plist_path = LAUNCHD_DIR / f"{schedule['label']}.plist"

        # Base plist structure
        plist_data = {
            'Label': schedule['label'],
            'ProgramArguments': [
                '/usr/bin/python3',
                str(EXECUTOR_SCRIPT),
                '--mode', schedule['mode']
            ],
            'StandardOutPath': str(JARVIS_ROOT / 'logs/heartbeat' / f"{schedule['mode']}.log"),
            'StandardErrorPath': str(JARVIS_ROOT / 'logs/heartbeat' / f"{schedule['mode']}.error.log"),
            'WorkingDirectory': str(JARVIS_ROOT),
        }

        # Add schedule
        start_calendar_interval = {}

        if 'weekday' in schedule:
            # For daily/weekly schedules
            if isinstance(schedule['weekday'], list):
                # Multiple weekdays - need multiple calendar intervals
                # LaunchD doesn't support array of weekdays directly
                # We'll create separate entries or use single weekday
                # For now, use first weekday (will need separate plists for each day)
                start_calendar_interval['Weekday'] = schedule['weekday'][0]
            else:
                start_calendar_interval['Weekday'] = schedule['weekday']

        if 'day' in schedule:
            # Monthly schedule
            start_calendar_interval['Day'] = schedule['day']

        start_calendar_interval['Hour'] = schedule['hour']
        start_calendar_interval['Minute'] = schedule['minute']

        plist_data['StartCalendarInterval'] = start_calendar_interval

        # For weekday schedules with multiple days, we need array of intervals
        if 'weekday' in schedule and isinstance(schedule['weekday'], list) and len(schedule['weekday']) > 1:
            intervals = []
            for weekday in schedule['weekday']:
                interval = {
                    'Weekday': weekday,
                    'Hour': schedule['hour'],
                    'Minute': schedule['minute']
                }
                intervals.append(interval)
            plist_data['StartCalendarInterval'] = intervals

        # Write plist
        with open(plist_path, 'wb') as f:
            plistlib.dump(plist_data, f)

        print(f"✅ Created: {plist_path}")
        print(f"   {schedule['description']}")

        return plist_path

    def load_plist(self, label: str) -> bool:
        """Load a launchd plist"""
        plist_path = LAUNCHD_DIR / f"{label}.plist"

        if not plist_path.exists():
            print(f"❌ Plist not found: {plist_path}")
            return False

        try:
            result = subprocess.run(
                ['launchctl', 'load', str(plist_path)],
                capture_output=True,
                text=True
            )

            if result.returncode == 0:
                print(f"✅ Loaded: {label}")
                return True
            else:
                print(f"❌ Failed to load {label}: {result.stderr}")
                return False

        except Exception as e:
            print(f"❌ Error loading {label}: {e}")
            return False

    def unload_plist(self, label: str) -> bool:
        """Unload a launchd plist"""
        try:
            result = subprocess.run(
                ['launchctl', 'unload', str(LAUNCHD_DIR / f"{label}.plist")],
                capture_output=True,
                text=True
            )

            if result.returncode == 0 or "Could not find specified service" in result.stderr:
                print(f"✅ Unloaded: {label}")
                return True
            else:
                print(f"⚠️  {label}: {result.stderr}")
                return False

        except Exception as e:
            print(f"❌ Error unloading {label}: {e}")
            return False

    def install_all(self):
        """Install all heartbeat schedules"""
        print("=" * 60)
        print("Installing JARVIS Heartbeat Schedules")
        print("=" * 60)

        for schedule in self.schedules:
            print(f"\n📅 Setting up: {schedule['name']}")

            # Create plist
            plist_path = self.create_plist(schedule)

            # Load into launchd
            self.load_plist(schedule['label'])

        print("\n" + "=" * 60)
        print("✅ Installation Complete")
        print("=" * 60)
        print("\nHeartbeat schedules:")
        for schedule in self.schedules:
            print(f"  • {schedule['description']}")
        print(f"\nLogs: {JARVIS_ROOT}/logs/heartbeat/")
        print(f"Reports: {JARVIS_ROOT}/reports/heartbeat/")

    def uninstall_all(self):
        """Uninstall all heartbeat schedules"""
        print("=" * 60)
        print("Uninstalling JARVIS Heartbeat Schedules")
        print("=" * 60)

        for schedule in self.schedules:
            print(f"\n🗑️  Removing: {schedule['name']}")

            # Unload from launchd
            self.unload_plist(schedule['label'])

            # Remove plist file
            plist_path = LAUNCHD_DIR / f"{schedule['label']}.plist"
            if plist_path.exists():
                plist_path.unlink()
                print(f"   Deleted: {plist_path}")

        print("\n" + "=" * 60)
        print("✅ Uninstallation Complete")
        print("=" * 60)

    def show_status(self):
        """Show status of all heartbeat schedules"""
        print("=" * 60)
        print("JARVIS Heartbeat Status")
        print("=" * 60)

        # Get list of loaded jobs
        result = subprocess.run(
            ['launchctl', 'list'],
            capture_output=True,
            text=True
        )
        loaded_jobs = result.stdout

        for schedule in self.schedules:
            label = schedule['label']
            plist_path = LAUNCHD_DIR / f"{label}.plist"

            print(f"\n📅 {schedule['name']}")
            print(f"   Schedule: {schedule['description']}")
            print(f"   Label: {label}")

            # Check if plist exists
            if plist_path.exists():
                print(f"   Plist: ✅ Installed")
            else:
                print(f"   Plist: ❌ Not found")

            # Check if loaded
            if label in loaded_jobs:
                print(f"   Status: ✅ Active")
            else:
                print(f"   Status: ❌ Not loaded")

        print("\n" + "=" * 60)

    def list_jobs(self):
        """List all JARVIS heartbeat jobs"""
        print("=" * 60)
        print("JARVIS Heartbeat Jobs")
        print("=" * 60)

        result = subprocess.run(
            ['launchctl', 'list'],
            capture_output=True,
            text=True
        )

        jarvis_jobs = [
            line for line in result.stdout.split('\n')
            if LABEL_PREFIX in line
        ]

        if jarvis_jobs:
            print("\nActive jobs:")
            for job in jarvis_jobs:
                print(f"  {job}")
        else:
            print("\nNo JARVIS heartbeat jobs currently loaded")

        print("\n" + "=" * 60)


def main():
    parser = argparse.ArgumentParser(
        description="JARVIS Heartbeat Scheduler - Manage autonomous execution schedules"
    )

    action = parser.add_mutually_exclusive_group(required=True)
    action.add_argument(
        '--install',
        action='store_true',
        help='Install all heartbeat schedules'
    )
    action.add_argument(
        '--uninstall',
        action='store_true',
        help='Remove all heartbeat schedules'
    )
    action.add_argument(
        '--status',
        action='store_true',
        help='Show status of all schedules'
    )
    action.add_argument(
        '--list',
        action='store_true',
        help='List all scheduled jobs'
    )

    args = parser.parse_args()

    scheduler = HeartbeatScheduler()

    if args.install:
        scheduler.install_all()
    elif args.uninstall:
        scheduler.uninstall_all()
    elif args.status:
        scheduler.show_status()
    elif args.list:
        scheduler.list_jobs()


if __name__ == "__main__":
    main()
