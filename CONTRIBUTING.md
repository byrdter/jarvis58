# Contributing to JARVIS

Thank you for your interest in contributing to JARVIS! This document provides guidelines and instructions for contributing.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Creating Skills](#creating-skills)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Documentation](#documentation)

---

## Code of Conduct

Be respectful, inclusive, and constructive. We're all here to build something useful.

---

## How Can I Contribute?

### 🐛 Reporting Bugs

**Before submitting:**
- Check if the bug has already been reported
- Collect relevant information (OS, Python version, error messages)

**When reporting:**
- Use a clear, descriptive title
- Describe steps to reproduce
- Include expected vs actual behavior
- Provide error messages and logs
- Note your environment details

### 💡 Suggesting Features

**Before suggesting:**
- Check if it's already been suggested
- Consider if it fits JARVIS's scope and philosophy

**When suggesting:**
- Use a clear, descriptive title
- Explain the use case
- Describe the desired behavior
- Consider implementation complexity
- Note any alternatives you've considered

### 🔧 Contributing Code

#### Types of Contributions

1. **Bug fixes** - Always welcome
2. **New skills** - Domain-agnostic skills encouraged
3. **Documentation** - Clarifications, examples, guides
4. **Tests** - Increase coverage
5. **Ecosystem improvements** - Core functionality enhancements

---

## Development Setup

### Prerequisites

- Python 3.10+
- Node.js 18+ (optional, for some skills)
- Claude Code installed
- Git

### Setup Steps

1. **Fork and clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/jarvis.git
   cd jarvis
   ```

2. **Create environment**
   ```bash
   cp .env.example .env
   # Edit .env with your keys
   ```

3. **Install CLI tools**
   ```bash
   cd cli-tools/market-data
   pip install -e ".[dev]"  # includes test dependencies

   cd ../jarvis-skill
   pip install -e ".[dev]"
   ```

4. **Verify installation**
   ```bash
   jarvis-price --version
   jarvis-skill --version
   ```

5. **Run tests**
   ```bash
   pytest
   ```

### Development Workflow

1. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

2. **Make changes**
   - Write code
   - Add tests
   - Update documentation

3. **Test locally**
   ```bash
   pytest
   ```

4. **Commit**
   ```bash
   git add .
   git commit -m "feat: add new skill for X"
   # or
   git commit -m "fix: resolve issue with Y"
   ```

5. **Push and create PR**
   ```bash
   git push origin your-branch-name
   # Then create PR on GitHub
   ```

---

## Creating Skills

### Skill Structure

```
skills/
└── your-skill-name/
    ├── SKILL.md              # Required: Skill definition
    ├── README.md             # Required: Documentation
    ├── skill.py              # Main implementation
    ├── config.yaml           # Optional: Configuration
    ├── requirements.txt      # Python dependencies
    └── tests/                # Tests
        └── test_skill.py
```

### SKILL.md Format

```markdown
---
name: your-skill-name
version: 1.0.0
description: Brief description of what the skill does
author: Your Name
metadata:
  jarvis:
    security_level: medium
    requires_approval: false
    allowed_operations: [read, network]
    requires:
      bins: ["some-cli-tool"]
      env: ["API_KEY"]
    tags: [category, domain]
---

# Your Skill Name

## Purpose

What problem does this skill solve?

## Usage

\```bash
# How to use the skill
\```

## Configuration

What needs to be configured?

## Examples

Provide examples.

## Limitations

What doesn't it do?
```

### Security Levels

Choose appropriate security level:

- **low**: Read-only, no external calls
- **medium**: Read + network (API calls)
- **high**: Write, execute, or delete operations (requires approval)

### Skill Generator

Use the skill generator:

```bash
jarvis-skill create your-skill-name
```

This creates the proper structure with templates.

### Skill Best Practices

1. **Single Responsibility** - One skill, one purpose
2. **Clear Documentation** - Explain what, why, and how
3. **Proper Error Handling** - Graceful failures with helpful messages
4. **Configuration** - Use environment variables for secrets
5. **Testing** - Include unit tests
6. **Dependencies** - Document all dependencies
7. **Security** - Follow principle of least privilege

### Educational Disclaimer

For any skill that could be construed as advice (financial, legal, medical, etc.), include:

```markdown
⚠️ **EDUCATIONAL PURPOSES ONLY**

This skill is for educational and demonstration purposes only.
It is not [financial/legal/medical] advice. Use at your own risk.
Consult qualified professionals for [domain] decisions.
```

---

## Coding Standards

### Python Style

Follow PEP 8 with these specifics:

- **Line length**: 100 characters (not 79)
- **Imports**: Group stdlib, third-party, local (with blank lines between)
- **Docstrings**: Google style
- **Type hints**: Use where it improves clarity

```python
from typing import Dict, List, Optional

def analyze_market(symbol: str, days: int = 30) -> Dict[str, float]:
    """
    Analyze market data for a given symbol.

    Args:
        symbol: Stock/ETF ticker symbol
        days: Number of days to analyze (default: 30)

    Returns:
        Dictionary containing analysis results

    Raises:
        ValueError: If symbol is invalid
        APIError: If data fetch fails
    """
    pass
```

### JavaScript/TypeScript Style

- Use Prettier with default settings
- ES6+ features encouraged
- Async/await over callbacks

### YAML/JSON

- Use 2-space indentation
- Keep files under 200 lines when possible
- Comments for non-obvious configuration

### Shell Scripts

- Use bash
- Include shebang: `#!/usr/bin/env bash`
- Use `set -euo pipefail`
- Quote variables: `"$var"`

---

## Testing

### Test Structure

```
tests/
├── unit/           # Unit tests
├── integration/    # Integration tests
└── fixtures/       # Test data
```

### Writing Tests

```python
import pytest
from your_skill import analyze_market

def test_analyze_market_valid_symbol():
    """Test market analysis with valid symbol"""
    result = analyze_market("SPY", days=30)
    assert "current_price" in result
    assert result["current_price"] > 0

def test_analyze_market_invalid_symbol():
    """Test market analysis with invalid symbol"""
    with pytest.raises(ValueError):
        analyze_market("INVALID")
```

### Running Tests

```bash
# All tests
pytest

# Specific file
pytest tests/test_skill.py

# With coverage
pytest --cov=skills --cov-report=html

# Watch mode
pytest-watch
```

### Test Requirements

- **Unit tests**: Required for new code
- **Integration tests**: Required for skills with external dependencies
- **Coverage**: Aim for 80%+ on new code
- **Mocking**: Mock external APIs in tests

---

## Pull Request Process

### Before Submitting

- [ ] Tests pass locally
- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] CHANGELOG.md updated (if applicable)
- [ ] No merge conflicts
- [ ] Commits are clear and atomic

### PR Title Format

Use conventional commits:

- `feat: add new skill for X`
- `fix: resolve bug in Y`
- `docs: update README for Z`
- `test: add tests for W`
- `refactor: improve V`
- `chore: update dependencies`

### PR Description Template

```markdown
## Summary
Brief description of changes.

## Motivation
Why is this change needed?

## Changes
- Change 1
- Change 2
- Change 3

## Testing
How was this tested?

## Screenshots (if applicable)
Add screenshots for UI changes.

## Checklist
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No breaking changes (or clearly documented)
- [ ] Educational disclaimer added (if applicable)
```

### Review Process

1. **Automated checks** - Must pass CI/CD
2. **Code review** - At least one approval required
3. **Testing** - Reviewer tests locally if needed
4. **Merge** - Squash and merge (clean history)

### After Merge

- Your PR will be included in the next release
- You'll be added to contributors list
- Thank you! 🎉

---

## Documentation

### Types of Documentation

1. **Code comments** - Explain "why", not "what"
2. **Docstrings** - Document functions, classes, modules
3. **README files** - Overview and usage for each component
4. **User guides** - Step-by-step instructions
5. **API docs** - Reference documentation

### Documentation Standards

- **Clear**: Write for someone unfamiliar with the code
- **Concise**: Remove unnecessary words
- **Current**: Update docs when code changes
- **Examples**: Include practical examples
- **Links**: Reference related documentation

### Building Docs Locally

```bash
# Install dependencies
pip install -r docs/requirements.txt

# Build docs
cd docs
make html

# View docs
open _build/html/index.html
```

---

## Questions?

- **General questions**: [GitHub Discussions](https://github.com/yourusername/jarvis/discussions)
- **Bug reports**: [GitHub Issues](https://github.com/yourusername/jarvis/issues)
- **Security issues**: Email directly (do not create public issue)

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Forever appreciated 🙏

---

Thank you for contributing to JARVIS! 🚀
