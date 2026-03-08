# JARVIS Skill Security Model

**Version:** 2.0.0 (Phase 5)
**Last Updated:** March 8, 2026

## Overview

JARVIS implements a security-first approach to skill execution with three-level classification and human-in-the-loop approval for high-risk operations.

**Key Principles:**
1. **Least Privilege** - Skills only get permissions they need
2. **Human-in-the-Loop** - High-risk operations require explicit approval
3. **Transparency** - All actions logged and auditable
4. **Defense in Depth** - Multiple validation layers

---

## Security Levels

### Low Security (Auto-Approved)

**Characteristics:**
- Read-only operations
- No side effects
- Non-destructive
- Analysis and monitoring

**Operations Allowed:**
- `read` - Read files, APIs, databases
- `network` - Make API calls (read-only)

**Examples:**
- `market-analysis` - Analyze stock data
- `market-insights` - Read YouTube videos
- `gmail-insights` - Read emails
- `performance-tracker` - Calculate performance metrics

**Approval:** None required (auto-approved)

### Medium Security (Auto-Approved with Logging)

**Characteristics:**
- Can create/modify content
- Can send notifications
- Can schedule tasks
- Moderate risk if misused

**Operations Allowed:**
- `read` - Read operations
- `write` - Write files, create content
- `network` - Make API calls (read/write)

**Examples:**
- `calendar-scheduler` - Schedule events
- `slack-notifier` - Send notifications
- `youtube-monitor` - Check for new videos
- `byrddynasty-video-creator` - Create video content

**Approval:** None required, but logged for audit

### High Security (Requires Explicit Approval)

**Characteristics:**
- Financial impact
- Public visibility
- Destructive potential
- Irreversible actions

**Operations Allowed:**
- All operations (read/write/delete/execute/network)
- But only after explicit user approval

**Examples:**
- `portfolio-builder` - Deploy capital ($100K+)
- `social-poster` - Public social media posts

**Approval:** REQUIRED before execution

**Approval Process:**
1. Skill requests approval via `ApprovalHandler`
2. User sees: action description, parameters, risks
3. User approves/denies
4. Decision logged to `~/.jarvis/approvals.log`
5. Skill proceeds or aborts

---

## Allowed Operations

### Read
- Read files from disk
- Query databases
- Fetch API data
- Parse documents

**Risk Level:** Low
**Requires Approval:** No

### Write
- Write files to disk
- Create database records
- Post API data (non-destructive)
- Generate content

**Risk Level:** Medium
**Requires Approval:** Only if high-security skill

### Delete
- Delete files
- Remove database records
- Cancel scheduled tasks
- Clear data

**Risk Level:** High
**Requires Approval:** Always

### Execute
- Run shell commands
- Execute scripts
- Start processes
- System operations

**Risk Level:** High
**Requires Approval:** Always

### Network
- Make HTTP requests
- Call APIs
- Send emails/notifications
- Upload/download data

**Risk Level:** Medium
**Requires Approval:** Only if destructive (delete, post publicly)

---

## Security Validation Process

### 1. Skill Declaration

Skills declare security metadata in `SKILL.md` frontmatter:

```yaml
---
name: portfolio-builder
description: Construct portfolio allocation with position sizing
metadata:
  jarvis:
    security_level: high
    requires_approval: true
    allowed_operations:
      - read
      - write
      - network
---
```

### 2. Pre-Execution Validation

Before skill executes, `SkillSecurityValidator` checks:

```python
from ecosystem.security.skill_security_validator import SkillSecurityValidator

validator = SkillSecurityValidator()
validation = validator.validate_skill_execution(
    skill_name="portfolio-builder",
    requested_operations=["read", "write", "network"],
    params={"amount": 100000}
)

if not validation.is_valid:
    raise SecurityError(f"Blocked: {validation.reason}")

if validation.requires_approval:
    # Request human approval
    approved = request_approval(...)
    if not approved:
        raise SecurityError("User denied approval")
```

### 3. Approval Flow (High Security)

```python
from ecosystem.security.approval_handler import ApprovalHandler

handler = ApprovalHandler()
response = handler.request_approval(
    skill_name="portfolio-builder",
    action_description="Allocate $100K portfolio",
    security_level="high",
    operations=["read", "write", "network"],
    params={"capital": 100000},
    risks=["Financial transaction", "Portfolio modification"]
)

if response.approved:
    # Execute skill
    execute_skill()
else:
    # Abort
    log_denial(response.reason)
```

### 4. Execution Logging

All high-security operations logged to:
- `~/.jarvis/approvals.log` - Approval decisions
- `context/memory/work-status.md` - Execution results
- Memory system - Learnings and outcomes

---

## Destructive Operation Detection

`SkillSecurityValidator` scans parameters for destructive patterns:

**Patterns Detected:**
- `delete`, `remove`, `drop`, `truncate` → Delete operations
- `overwrite`, `replace`, `force` → Overwrite operations
- `reset`, `clear`, `wipe` → Reset operations
- `force-push`, `--force` → Force operations
- `--no-verify`, `skip-hooks` → Bypass safety checks

**If Detected:**
- Automatically requires approval
- User shown warning
- Must explicitly confirm

**Example:**

```python
params = {
    "action": "delete",
    "force": True
}

validation = validator.validate_skill_execution(
    skill_name="portfolio-manager",
    params=params
)

# Result:
# validation.warnings = ["Destructive pattern: 'delete' (delete)",
#                        "Destructive pattern: 'force' (overwrite)"]
# validation.requires_approval = True
```

---

## Security by Domain

### Investment Domain
- **Portfolio Builder** (HIGH) - Financial transactions
- **Market Analysis** (LOW) - Read-only analysis
- **ETF Screener** (LOW) - Read-only screening
- **Portfolio Monitor** (MEDIUM) - Monitoring + alerts
- **Performance Tracker** (LOW) - Performance analytics

### Content Creation Domain
- **Social Poster** (HIGH) - Public posting
- **Video Creator** (MEDIUM) - Content generation
- **Image Generator** (MEDIUM) - Image creation
- **Script Optimizer** (LOW) - Text optimization

### Productivity Domain
- **Calendar Scheduler** (MEDIUM) - Event creation
- **Slack Notifier** (MEDIUM) - Notifications
- **Obsidian Manager** (MEDIUM) - Note organization

---

## Audit Trail

All security-relevant events logged:

### Approval Log (`~/.jarvis/approvals.log`)

```json
{
  "request": {
    "skill_name": "portfolio-builder",
    "action_description": "Allocate $100K portfolio",
    "security_level": "high",
    "operations": ["read", "write", "network"],
    "params": {...},
    "risks": [...],
    "timestamp": "2026-03-08T14:30:00"
  },
  "response": {
    "approved": true,
    "reason": "User approved",
    "timestamp": "2026-03-08T14:30:15"
  }
}
```

### Query Approval History

```bash
# Show approval history
python3 ecosystem/security/approval-handler.py --history

# Show statistics
python3 ecosystem/security/approval-handler.py --stats

# Filter by skill
python3 ecosystem/security/approval-handler.py --history --skill portfolio-builder
```

---

## Security Report

Generate security report for all skills:

```bash
python3 ecosystem/security/skill-security-validator.py --report
```

**Output:**

```
# JARVIS Skill Security Report
======================================================================

Total Skills: 20
  Low Security: 10
  Medium Security: 8
  High Security: 2

## High Security Skills (Require Approval)
----------------------------------------------------------------------
- portfolio-builder (investment)
  Operations: read, write, network
  Requires Approval: True

- social-poster (content-creation)
  Operations: read, write, network
  Requires Approval: True

## Skills Requiring Explicit Approval: 2
----------------------------------------------------------------------
- portfolio-builder (investment) - high
- social-poster (content-creation) - high
```

---

## Best Practices

### For Skill Authors

1. **Declare Minimum Permissions**
   - Only request operations you actually need
   - Don't request `delete` unless truly necessary

2. **Set Appropriate Security Level**
   - LOW: Read-only, analysis
   - MEDIUM: Content creation, notifications
   - HIGH: Financial, public, destructive

3. **Require Approval for High-Risk**
   - Set `requires_approval: true` for sensitive operations
   - Provide clear action descriptions
   - List all risks explicitly

4. **Validate Inputs**
   - Check parameters for sanity
   - Reject obviously wrong inputs
   - Fail safely

### For Users

1. **Review Approval Requests Carefully**
   - Read the action description
   - Check the parameters
   - Understand the risks

2. **Deny if Unsure**
   - Better to deny and investigate
   - Can always approve later

3. **Review Approval History**
   - Periodically check `~/.jarvis/approvals.log`
   - Look for unexpected patterns

4. **Report Security Issues**
   - If a skill bypasses security, report it
   - If approval flow is confusing, suggest improvements

---

## Security Model Validation

### Test High-Security Skills

```bash
# Test portfolio-builder approval
python3 ecosystem/security/approval-handler.py --test

# Validate portfolio-builder security
python3 ecosystem/security/skill-security-validator.py --validate portfolio-builder

# List all high-security skills
python3 ecosystem/security/skill-security-validator.py --high-security
```

### Verify No Regressions

```bash
# Run skill discovery
python3 ecosystem/registry/skill-discovery.py

# Verify all skills have security metadata
python3 ecosystem/registry/skill-validator.py skills/*/SKILL.md

# Generate security report
python3 ecosystem/security/skill-security-validator.py --report
```

---

## Future Enhancements

### Phase 6+ (Future)

1. **Role-Based Access Control**
   - Define roles (admin, user, viewer)
   - Skills require specific roles

2. **Rate Limiting**
   - Limit high-security operations per day
   - Prevent rapid-fire approvals

3. **Multi-User Approval**
   - Require 2+ approvals for critical operations
   - Team collaboration on approvals

4. **Automated Risk Scoring**
   - ML-based risk assessment
   - Dynamic security level adjustment

5. **Security Policies**
   - Custom policy definitions
   - Per-domain security rules

---

## Summary

JARVIS security model provides:

✅ **Three-level classification** (low/medium/high)
✅ **Human-in-the-loop approval** for high-risk operations
✅ **Operation-level permissions** (read/write/delete/execute/network)
✅ **Destructive pattern detection** (delete, force, reset)
✅ **Complete audit trail** (all decisions logged)
✅ **Transparent validation** (security reports)

**Result:** Secure by default, flexible when needed, auditable always.

---

**Last Updated:** March 8, 2026 (Phase 5 Complete)
