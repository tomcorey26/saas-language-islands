# commit-push-pr

Creates a commit, pushes to remote, and opens a pull request in one workflow.

## Pre-computed Context

```bash
# Git status
git status --short

# Staged and unstaged changes
git diff HEAD

# Recent commits for message style
git log -5 --pretty=format:"%s"

# Current branch
git rev-parse --abbrev-ref HEAD

# Commits not yet pushed
git log origin/main..HEAD --oneline 2>/dev/null || echo "No unpushed commits"
```

## Instructions

1. Review the git status and diff above to understand all changes
2. Stage all relevant changes (avoid staging secrets, .env files, or temp files)
3. Create a commit message that:
   - Follows this repo's commit style (see recent commits)
   - Focuses on "why" not "what"
   - Is concise (1-2 sentences)
   - Ends with: Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
4. Push to remote with upstream tracking
5. Create a PR using `gh pr create` with:
   - Clear title summarizing the change
   - Body with:
     - ## Summary (2-4 bullet points)
     - ## Test plan (checklist of what to verify)
     - Footer: 🤖 Generated with [Claude Code](https://claude.com/claude-code)
6. Return the PR URL

**Important:**
- Do NOT run additional commands to explore code
- Do NOT use TodoWrite tool
- Use HEREDOC for commit messages to ensure proper formatting
