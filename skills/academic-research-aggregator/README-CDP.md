## CDP Mode Setup for Auburn Library

**CDP (Chrome DevTools Protocol)** lets agent-browser connect to an already-running Chrome browser. This is the most reliable way to maintain Auburn Library authentication.

### One-Time Setup

1. **Start Chrome with remote debugging:**
   ```bash
   /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 &
   ```

2. **Log into Auburn Library** in that Chrome window

3. **Navigate to Business Source Premier** (or any database to verify access)

4. **Keep Chrome running** - don't close it

### Daily Usage

Once Chrome is running with Auburn login:

```bash
# Run the research aggregator
cd /Users/terrybyrd/Dropbox/jarvis/skills/academic-research-aggregator
python3 aggregate-research.py latest --output research-digest.md
```

The script will automatically connect to your running Chrome (port 9222) and use your active Auburn login.

### Tips

- **Keep Chrome open** while running research aggregator
- **Re-login if expired** - just log in again in the Chrome window
- **One Chrome instance** - don't open multiple Chrome windows with debugging port

### Testing

Test that CDP connection works:

```bash
# agent-browser will auto-detect CDP mode
agent-browser open "https://research.ebsco.com/c/j6vsfb/topics"
agent-browser get title
agent-browser close
```

If you see "Auburn University Libraries" or "Business Source Premier" in the title, it's working!
