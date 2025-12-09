# Git Setup Instructions

Follow these steps to initialize the Git repository and push to GitHub.

## Step 1: Initialize Local Git Repository

```bash
cd /path/to/catch-on

# Initialize git
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Catch On mobile app v1.0.0"
```

## Step 2: Create GitHub Repository

1. Go to [GitHub](https://github.com/new)
2. Fill in the following:
   - **Repository name:** `catch-on`
   - **Description:** A modern fitness and wellness mobile app built with React Native
   - **Visibility:** Public
   - **Initialize with:** None (we already have files)
3. Click "Create repository"

## Step 3: Add Remote and Push

```bash
# Add GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/catch-on.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

## Step 4: Configure Repository Settings

### On GitHub:

1. **Go to Settings → General**
   - Add description
   - Add website URL (if available)
   - Add topics: `react-native`, `fitness`, `meditation`, `mobile-app`, `health`

2. **Go to Settings → Branches**
   - Set default branch to `main`
   - Add branch protection rule for `main`:
     - Require pull request reviews
     - Require status checks to pass
     - Require branches to be up to date

3. **Go to Settings → Collaborators**
   - Add team members if needed

4. **Go to Code and automation → Actions**
   - Set up CI/CD workflows (optional)

## Step 5: Create Release

```bash
# Create a tag
git tag -a v1.0.0 -m "Release version 1.0.0"

# Push tag to GitHub
git push origin v1.0.0
```

Then on GitHub:
1. Go to Releases
2. Click "Create a new release"
3. Select tag `v1.0.0`
4. Add release notes
5. Upload APK/AAB files
6. Publish release

## Step 6: Set Up GitHub Pages (Optional)

If you want to host documentation:

1. Go to Settings → Pages
2. Select "Deploy from a branch"
3. Choose `main` branch and `/root` folder
4. Save

## Useful Git Commands

### Daily Development

```bash
# Check status
git status

# Create a new branch
git checkout -b feature/feature-name

# Stage changes
git add .

# Commit changes
git commit -m "Add feature description"

# Push branch
git push origin feature/feature-name

# Create pull request on GitHub
```

### Updating from Remote

```bash
# Fetch updates
git fetch origin

# Pull updates
git pull origin main

# Rebase instead of merge
git pull --rebase origin main
```

### Viewing History

```bash
# View commit log
git log

# View commit log with graph
git log --graph --oneline --all

# View changes
git diff

# View staged changes
git diff --staged
```

## GitHub Actions (CI/CD)

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm install --legacy-peer-deps
    
    - name: Run linter
      run: npm run lint
    
    - name: Run tests
      run: npm test
```

## Troubleshooting

### "fatal: not a git repository"
```bash
git init
```

### "Permission denied (publickey)"
- Add SSH key to GitHub
- Or use HTTPS instead of SSH

### "Everything up-to-date"
- Make sure you have committed changes
- Check branch name matches

### Merge conflicts
```bash
# View conflicts
git status

# Resolve conflicts in editor

# Mark as resolved
git add .

# Complete merge
git commit -m "Resolve merge conflicts"
```

## Best Practices

1. **Commit Messages**
   - Use present tense: "Add feature" not "Added feature"
   - Be descriptive: "Fix login button alignment" not "Fix bug"
   - Reference issues: "Fix #123"

2. **Branching**
   - Use feature branches: `feature/feature-name`
   - Use bugfix branches: `bugfix/bug-name`
   - Use release branches: `release/v1.0.0`

3. **Pull Requests**
   - Write clear descriptions
   - Link related issues
   - Request reviews
   - Keep PRs focused and small

4. **Code Review**
   - Review code thoroughly
   - Suggest improvements
   - Approve when ready
   - Merge after approval

## Resources

- [GitHub Docs](https://docs.github.com)
- [Git Documentation](https://git-scm.com/doc)
- [GitHub Flow Guide](https://guides.github.com/introduction/flow/)
- [Conventional Commits](https://www.conventionalcommits.org/)

## Support

For Git-related questions:
- Check [GitHub Docs](https://docs.github.com)
- Search existing issues
- Create a new issue
- Contact: support@catchon.app

---

Ready to push to GitHub! 🚀
