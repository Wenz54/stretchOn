# Contributing to Catch On

Thank you for your interest in contributing to Catch On! We welcome contributions from everyone.

## Code of Conduct

Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps which reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed after following the steps**
- **Explain which behavior you expected to see instead and why**
- **Include screenshots and animated GIFs if possible**
- **Include your environment details** (OS, React Native version, device/emulator)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a step-by-step description of the suggested enhancement**
- **Provide specific examples to demonstrate the steps**
- **Describe the current behavior and the expected behavior**
- **Explain why this enhancement would be useful**

### Pull Requests

- Fill in the required template
- Follow the JavaScript/TypeScript styleguides
- End all files with a newline
- Avoid platform-specific code

## Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/catch-on.git
   cd catch-on
   ```

3. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

4. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

5. Make your changes and test them

6. Commit your changes:
   ```bash
   git commit -m 'Add some feature'
   ```

7. Push to the branch:
   ```bash
   git push origin feature/your-feature-name
   ```

8. Open a Pull Request

## Styleguides

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

### JavaScript/TypeScript Styleguide

- Use 2 spaces for indentation
- Use semicolons
- Use single quotes for strings
- Use camelCase for variable and function names
- Use PascalCase for component names
- Add JSDoc comments for functions and components

### React Native Styleguide

- Use functional components with hooks
- Keep components small and focused
- Use proper prop types or TypeScript
- Extract reusable logic into custom hooks
- Use meaningful component names

## Testing

Before submitting a pull request:

1. Test on both Android and iOS if possible
2. Test on different device sizes
3. Test with different network conditions
4. Run linter: `npm run lint`
5. Test your changes: `npm test`

## Additional Notes

### Issue and Pull Request Labels

This section lists the labels we use to help organize and categorize issues and pull requests.

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements or additions to documentation
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `question` - Further information is requested

## Recognition

Contributors will be recognized in the project README and release notes.

Thank you for contributing to Catch On! 🎉
