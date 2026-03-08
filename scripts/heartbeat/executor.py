#!/usr/bin/env python3
"""
JARVIS Heartbeat Executor

Parses context/heartbeat.md and executes the defined autonomous routines.

This script is the core of JARVIS's proactive intelligence - it runs on schedule
without user intervention to monitor markets, protect capital, and surface opportunities.

Usage:
    python executor.py --mode morning    # Run morning market check
    python executor.py --mode evening    # Run evening summary
    python executor.py --mode weekly     # Run Sunday portfolio review
    python executor.py --mode monthly    # Run first-Sunday monthly review
    python executor.py --check           # Dry run - show what would execute
"""

import argparse
import subprocess
import sys
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional

# JARVIS paths
JARVIS_ROOT = Path("/Users/terrybyrd/Library/CloudStorage/Dropbox/jarvis")
HEARTBEAT_MD = JARVIS_ROOT / "context/heartbeat.md"
LOGS_DIR = JARVIS_ROOT / "logs/heartbeat"
REPORTS_DIR = JARVIS_ROOT / "reports/heartbeat"
SKILLS_DIR = JARVIS_ROOT / "skills"

# Ensure directories exist
LOGS_DIR.mkdir(parents=True, exist_ok=True)
REPORTS_DIR.mkdir(parents=True, exist_ok=True)


class HeartbeatExecutor:
    """Executes JARVIS heartbeat routines defined in heartbeat.md"""

    def __init__(self, mode: str, dry_run: bool = False):
        self.mode = mode
        self.dry_run = dry_run
        self.timestamp = datetime.now()
        self.date_str = self.timestamp.strftime("%Y-%m-%d")
        self.log_file = LOGS_DIR / f"{self.date_str}.log"
        self.results = []

    def log(self, message: str, level: str = "INFO"):
        """Log to both console and log file"""
        timestamp = datetime.now().strftime("%H:%M:%S")
        log_line = f"[{timestamp}] [{level}] {message}"
        print(log_line)

        with open(self.log_file, "a") as f:
            f.write(log_line + "\n")

    def run_skill(self, skill_name: str, args: List[str] = None) -> Dict:
        """
        Execute a JARVIS skill and return results.

        Args:
            skill_name: Name of skill to run (e.g., 'etf-screener')
            args: Optional arguments to pass to skill

        Returns:
            Dict with 'success', 'output', 'error' keys
        """
        skill_path = SKILLS_DIR / skill_name

        if not skill_path.exists():
            return {
                'success': False,
                'output': '',
                'error': f"Skill not found: {skill_name}"
            }

        # Construct command
        # Most skills have a main script to run
        # This will need to be customized based on actual skill structure
        cmd = ["python3", str(skill_path / "run.py")]
        if args:
            cmd.extend(args)

        if self.dry_run:
            self.log(f"[DRY RUN] Would execute: {' '.join(cmd)}", "INFO")
            return {
                'success': True,
                'output': '[DRY RUN] Skill not actually executed',
                'error': ''
            }

        try:
            self.log(f"Executing skill: {skill_name}", "INFO")
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=300,  # 5 minute timeout
                cwd=skill_path
            )

            return {
                'success': result.returncode == 0,
                'output': result.stdout,
                'error': result.stderr if result.returncode != 0 else ''
            }

        except subprocess.TimeoutExpired:
            return {
                'success': False,
                'output': '',
                'error': f"Skill timed out after 5 minutes: {skill_name}"
            }
        except Exception as e:
            return {
                'success': False,
                'output': '',
                'error': f"Error executing skill: {str(e)}"
            }

    def morning_check(self):
        """Execute morning market check routine"""
        self.log("=" * 60, "INFO")
        self.log("🌅 MORNING MARKET CHECK", "INFO")
        self.log("=" * 60, "INFO")

        tasks = [
            {
                'name': 'Quick ETF Scan',
                'skill': 'etf-screener',
                'args': ['--mode', 'light', '--check-stages'],
                'emoji': '📊'
            },
            {
                'name': 'Portfolio Guard',
                'skill': 'portfolio-monitor',
                'args': ['--mode', 'daily', '--check-stops'],
                'emoji': '🛡️'
            },
            {
                'name': 'Expert Check',
                'skill': 'market-insights',
                'args': ['--check-new-videos'],
                'emoji': '🎥'
            }
        ]

        for task in tasks:
            self.log(f"\n{task['emoji']} Running: {task['name']}", "INFO")
            result = self.run_skill(task['skill'], task['args'])

            self.results.append({
                'task': task['name'],
                'success': result['success'],
                'output': result['output'],
                'error': result['error']
            })

            if result['success']:
                self.log(f"✅ {task['name']} completed", "INFO")
            else:
                self.log(f"❌ {task['name']} failed: {result['error']}", "ERROR")

        self.generate_morning_summary()

    def evening_summary(self):
        """Execute evening summary routine"""
        self.log("=" * 60, "INFO")
        self.log("🌆 EVENING SUMMARY", "INFO")
        self.log("=" * 60, "INFO")

        tasks = [
            {
                'name': 'Market Close Summary',
                'skill': 'market-data',
                'args': ['--daily-close', '--etfs-only'],
                'emoji': '📈'
            },
            {
                'name': 'Content Aggregation',
                'skill': 'youtube-content-aggregator',
                'args': ['--check-today'],
                'emoji': '📺'
            },
            {
                'name': 'News Digest',
                'skill': 'news-aggregator',
                'args': ['--digest'],
                'emoji': '📰'
            }
        ]

        for task in tasks:
            self.log(f"\n{task['emoji']} Running: {task['name']}", "INFO")
            result = self.run_skill(task['skill'], task['args'])

            self.results.append({
                'task': task['name'],
                'success': result['success'],
                'output': result['output'],
                'error': result['error']
            })

            if result['success']:
                self.log(f"✅ {task['name']} completed", "INFO")
            else:
                self.log(f"❌ {task['name']} failed: {result['error']}", "ERROR")

        self.generate_evening_summary()

    def weekly_review(self):
        """Execute Sunday portfolio review"""
        self.log("=" * 60, "INFO")
        self.log("📅 WEEKLY PORTFOLIO REVIEW", "INFO")
        self.log("=" * 60, "INFO")

        tasks = [
            {
                'name': 'Complete ETF Screening',
                'skill': 'etf-screener',
                'args': ['--mode', 'full'],
                'emoji': '📊'
            },
            {
                'name': 'Portfolio Health Check',
                'skill': 'portfolio-monitor',
                'args': ['--mode', 'weekly'],
                'emoji': '💼'
            },
            {
                'name': 'YouTube Weekly Digest',
                'skill': 'youtube-content-aggregator',
                'args': ['--weekly-digest'],
                'emoji': '📺'
            },
            {
                'name': 'Learning Update',
                'skill': 'learning-updater',
                'args': ['--weekly'],
                'emoji': '🧠'
            }
        ]

        for task in tasks:
            self.log(f"\n{task['emoji']} Running: {task['name']}", "INFO")
            result = self.run_skill(task['skill'], task['args'])

            self.results.append({
                'task': task['name'],
                'success': result['success'],
                'output': result['output'],
                'error': result['error']
            })

            if result['success']:
                self.log(f"✅ {task['name']} completed", "INFO")
            else:
                self.log(f"❌ {task['name']} failed: {result['error']}", "ERROR")

        self.generate_weekly_summary()

    def monthly_review(self):
        """Execute first-Sunday monthly review"""
        self.log("=" * 60, "INFO")
        self.log("📆 MONTHLY STRATEGY REVIEW", "INFO")
        self.log("=" * 60, "INFO")

        tasks = [
            {
                'name': 'Performance Tracking',
                'skill': 'performance-tracker',
                'args': ['--monthly'],
                'emoji': '📈'
            },
            {
                'name': 'Strategy Review',
                'skill': 'strategy-reviewer',
                'args': ['--monthly'],
                'emoji': '🎯'
            },
            {
                'name': 'Memory Consolidation',
                'skill': 'memory-consolidator',
                'args': ['--consolidate-month'],
                'emoji': '🧠'
            }
        ]

        for task in tasks:
            self.log(f"\n{task['emoji']} Running: {task['name']}", "INFO")
            result = self.run_skill(task['skill'], task['args'])

            self.results.append({
                'task': task['name'],
                'success': result['success'],
                'output': result['output'],
                'error': result['error']
            })

            if result['success']:
                self.log(f"✅ {task['name']} completed", "INFO")
            else:
                self.log(f"❌ {task['name']} failed: {result['error']}", "ERROR")

        self.generate_monthly_summary()

    def generate_morning_summary(self):
        """Generate concise morning briefing"""
        summary_file = REPORTS_DIR / f"morning-brief-{self.date_str}.md"

        # Count successes
        successes = sum(1 for r in self.results if r['success'])
        total = len(self.results)

        summary = f"""# Morning Market Check - {self.date_str}

**Execution Time:** {self.timestamp.strftime("%I:%M %p")}
**Tasks Completed:** {successes}/{total}

---

## Quick Summary

"""

        # Add task summaries
        for result in self.results:
            status = "✅" if result['success'] else "❌"
            summary += f"**{status} {result['task']}**\n"
            if result['success'] and result['output']:
                # Extract key lines from output (first 3 lines)
                lines = result['output'].strip().split('\n')[:3]
                for line in lines:
                    summary += f"  {line}\n"
            elif result['error']:
                summary += f"  Error: {result['error']}\n"
            summary += "\n"

        summary += """---

## Action Items

(Review full reports in reports/heartbeat/ for details)

---

*Generated automatically by JARVIS Heartbeat*
"""

        with open(summary_file, 'w') as f:
            f.write(summary)

        self.log(f"\n📄 Morning brief saved: {summary_file}", "INFO")

        # Print summary to console
        print("\n" + "=" * 60)
        print("🌅 MORNING BRIEF")
        print("=" * 60)
        print(f"Tasks: {successes}/{total} completed")
        for result in self.results:
            status = "✅" if result['success'] else "❌"
            print(f"{status} {result['task']}")
        print(f"\nFull report: {summary_file}")
        print("=" * 60)

    def generate_evening_summary(self):
        """Generate evening summary"""
        summary_file = REPORTS_DIR / f"evening-summary-{self.date_str}.md"

        successes = sum(1 for r in self.results if r['success'])
        total = len(self.results)

        summary = f"""# Evening Summary - {self.date_str}

**Execution Time:** {self.timestamp.strftime("%I:%M %p")}
**Tasks Completed:** {successes}/{total}

---

## Summary

"""

        for result in self.results:
            status = "✅" if result['success'] else "❌"
            summary += f"**{status} {result['task']}**\n"
            if result['output']:
                lines = result['output'].strip().split('\n')[:5]
                for line in lines:
                    summary += f"  {line}\n"
            summary += "\n"

        summary += """---

*Generated automatically by JARVIS Heartbeat*
"""

        with open(summary_file, 'w') as f:
            f.write(summary)

        self.log(f"\n📄 Evening summary saved: {summary_file}", "INFO")

    def generate_weekly_summary(self):
        """Generate weekly review summary"""
        summary_file = REPORTS_DIR / f"weekly-review-{self.date_str}.md"

        successes = sum(1 for r in self.results if r['success'])
        total = len(self.results)

        summary = f"""# Weekly Portfolio Review - {self.date_str}

**Execution Time:** {self.timestamp.strftime("%I:%M %p")}
**Tasks Completed:** {successes}/{total}

---

## Weekly Summary

"""

        for result in self.results:
            status = "✅" if result['success'] else "❌"
            summary += f"**{status} {result['task']}**\n"
            if result['output']:
                lines = result['output'].strip().split('\n')[:10]
                for line in lines:
                    summary += f"  {line}\n"
            summary += "\n"

        summary += """---

## Strategic Recommendations

(See full reports for detailed analysis)

---

*Generated automatically by JARVIS Heartbeat*
"""

        with open(summary_file, 'w') as f:
            f.write(summary)

        self.log(f"\n📄 Weekly review saved: {summary_file}", "INFO")

    def generate_monthly_summary(self):
        """Generate monthly review summary"""
        summary_file = REPORTS_DIR / f"monthly-review-{self.date_str}.md"

        successes = sum(1 for r in self.results if r['success'])
        total = len(self.results)

        summary = f"""# Monthly Strategy Review - {self.date_str}

**Execution Time:** {self.timestamp.strftime("%I:%M %p")}
**Tasks Completed:** {successes}/{total}

---

## Monthly Summary

"""

        for result in self.results:
            status = "✅" if result['success'] else "❌"
            summary += f"**{status} {result['task']}**\n"
            if result['output']:
                summary += f"```\n{result['output']}\n```\n"
            summary += "\n"

        summary += """---

## Strategic Adjustments

(Review performance tracker and strategy reviewer reports)

---

*Generated automatically by JARVIS Heartbeat*
"""

        with open(summary_file, 'w') as f:
            f.write(summary)

        self.log(f"\n📄 Monthly review saved: {summary_file}", "INFO")

    def execute(self):
        """Main execution entry point"""
        self.log(f"Starting JARVIS Heartbeat - Mode: {self.mode}", "INFO")

        if self.mode == "morning":
            self.morning_check()
        elif self.mode == "evening":
            self.evening_summary()
        elif self.mode == "weekly":
            self.weekly_review()
        elif self.mode == "monthly":
            self.monthly_review()
        else:
            self.log(f"Unknown mode: {self.mode}", "ERROR")
            return 1

        self.log("Heartbeat execution complete", "INFO")
        return 0


def main():
    parser = argparse.ArgumentParser(
        description="JARVIS Heartbeat Executor - Autonomous proactive routines"
    )
    parser.add_argument(
        "--mode",
        choices=["morning", "evening", "weekly", "monthly"],
        required=True,
        help="Which heartbeat routine to run"
    )
    parser.add_argument(
        "--check",
        action="store_true",
        help="Dry run - show what would execute without running"
    )

    args = parser.parse_args()

    executor = HeartbeatExecutor(mode=args.mode, dry_run=args.check)
    exit_code = executor.execute()
    sys.exit(exit_code)


if __name__ == "__main__":
    main()
