# Contributing to ECE Trading Cards

## Welcome Contributors! 🎉

Thank you for your interest in contributing to the ECE Trading Cards project! This guide will help you get started with contributing to our multi-platform trading card ecosystem.

## Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** (v8 or higher) 
- **Git** (latest version)
- **TypeScript** experience
- **React/Next.js** knowledge for frontend
- **Prisma/PostgreSQL** knowledge for backend

### Development Environment Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/elicharlese/ECE.git
   cd ECE
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**
   ```bash
   # Copy environment template
   cp .env.example .env.local
   
   # Edit with your configuration
   nano .env.local
   ```

4. **Set Up Database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma db push
   
   # Seed with test data
   npm run seed
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

### Project Structure
```
ECE/
├── apps/
│   ├── ece-web/          # Next.js web application
│   ├── ece-mobile/       # React Native mobile app
│   └── desktop/          # Electron desktop application
├── libs/
│   ├── shared-ui/        # Shared UI components
│   ├── shared-business-logic/  # Business logic
│   └── shared-types/     # TypeScript definitions
├── docs/                 # Documentation
├── scripts/              # Build and deployment scripts
└── prisma/              # Database schema and migrations
```

## How to Contribute

### Types of Contributions

1. **🐛 Bug Fixes** - Fix existing issues in the codebase
2. **✨ New Features** - Add new functionality to the application
3. **📚 Documentation** - Improve or add to the documentation
4. **🎨 UI/UX Improvements** - Enhance user interface and experience
5. **⚡ Performance Optimizations** - Improve application performance
6. **🧪 Testing** - Add or improve test coverage
7. **🔧 Tooling** - Improve development tools and processes

### Contribution Workflow

1. **Find or Create an Issue**
   - Browse [existing issues](https://github.com/elicharlese/ECE/issues)
   - Create a new issue for bugs or feature requests
   - Discuss approach in the issue before starting work

2. **Fork and Branch**
   ```bash
   # Fork the repository on GitHub
   # Clone your fork
   git clone https://github.com/YOUR_USERNAME/ECE.git
   
   # Create a feature branch
   git checkout -b feature/your-feature-name
   ```

3. **Make Changes**
   - Follow our coding standards (see below)
   - Write tests for new functionality
   - Update documentation as needed
   - Ensure all tests pass

4. **Commit Changes**
   ```bash
   # Stage your changes
   git add .
   
   # Commit with descriptive message
   git commit -m "feat: add new trading card filter options"
   ```

5. **Push and Create Pull Request**
   ```bash
   # Push to your fork
   git push origin feature/your-feature-name
   
   # Create pull request on GitHub
   ```

### Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(marketplace): add advanced search filters
fix(wallet): resolve transaction history loading issue
docs(api): update authentication endpoint documentation
style(ui): apply consistent button styling across components
```

## Coding Standards

### TypeScript Guidelines

1. **Use TypeScript Everywhere**
   - All new code must be written in TypeScript
   - Avoid `any` types - use proper typing
   - Define interfaces for all data structures

2. **Type Safety**
   ```typescript
   // Good
   interface User {
     id: string;
     email: string;
     profile: UserProfile;
   }
   
   // Avoid
   const user: any = { id: 1, email: "test@example.com" };
   ```

3. **Naming Conventions**
   - Use PascalCase for components and interfaces
   - Use camelCase for variables and functions
   - Use UPPER_CASE for constants
   - Use descriptive names

### React/Next.js Guidelines

1. **Component Structure**
   ```typescript
   // Component definition
   interface Props {
     // Props interface
   }
   
   export const ComponentName: React.FC<Props> = ({ prop1, prop2 }) => {
     // Component logic
     return (
       // JSX
     );
   };
   ```

2. **Hooks Usage**
   - Use custom hooks for reusable logic
   - Keep components focused and simple
   - Use proper dependency arrays in useEffect

3. **State Management**
   - Use React Context for shared state
   - Keep local state in components when possible
   - Use custom hooks for complex state logic

### CSS/Styling Guidelines

1. **Tailwind CSS**
   - Use Tailwind utility classes
   - Follow Beach Monokai color palette
   - Implement responsive design patterns

2. **Color Usage**
   ```css
   /* Beach Monokai Colors */
   --accent: #F92672;          /* Buttons, highlights */
   --success: #A6E22E;         /* Success states */
   --info: #66D9EF;            /* Links, info */
   --secondary: #E6DB74;       /* Secondary backgrounds */
   --light: #F8EFD6;           /* Light backgrounds */
   --dark: #272822;            /* Dark backgrounds */
   --primary: #819AFF;         /* Primary buttons */
   --muted: #75715E;           /* Muted text */
   ```

3. **Glassmorphism Effects**
   ```css
   .glass-effect {
     backdrop-filter: blur(10px);
     background: rgba(255, 255, 255, 0.1);
     border: 1px solid rgba(255, 255, 255, 0.2);
   }
   ```

### Backend Guidelines

1. **API Design**
   - Follow RESTful principles
   - Use consistent response formats
   - Implement proper error handling
   - Add comprehensive validation

2. **Database**
   - Use Prisma for all database operations
   - Write migrations for schema changes
   - Optimize queries with proper indexing
   - Follow data normalization principles

3. **Security**
   - Validate all inputs
   - Use parameterized queries
   - Implement proper authentication
   - Follow OWASP security guidelines

## Testing Guidelines

### Test Structure
```
src/
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   └── Button.test.tsx    # Component tests
│   └── __tests__/             # Additional tests
├── utils/
│   ├── helpers.ts
│   └── helpers.test.ts        # Utility tests
└── __tests__/
    ├── integration/           # Integration tests
    └── e2e/                   # End-to-end tests
```

### Testing Requirements

1. **Unit Tests**
   - Test all utility functions
   - Test component logic
   - Aim for 80%+ coverage

2. **Integration Tests**
   - Test API endpoints
   - Test database operations
   - Test component interactions

3. **E2E Tests**
   - Test critical user flows
   - Test cross-platform functionality
   - Test responsive design

### Running Tests
```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run specific test file
npm run test Button.test.tsx
```

## Documentation Guidelines

### Writing Documentation

1. **Be Clear and Concise**
   - Use simple, direct language
   - Provide examples for complex concepts
   - Structure content logically

2. **Keep It Updated**
   - Update docs when changing functionality
   - Review docs during code reviews
   - Deprecate outdated information

3. **Use Consistent Formatting**
   - Follow markdown standards
   - Use proper headings hierarchy
   - Include code examples with syntax highlighting

### Documentation Types

1. **Code Comments**
   ```typescript
   /**
    * Calculates the total value of a user's card collection
    * @param cards Array of cards owned by the user
    * @param marketPrices Current market prices for cards
    * @returns Total collection value in ECE tokens
    */
   export const calculateCollectionValue = (
     cards: Card[],
     marketPrices: MarketPrice[]
   ): number => {
     // Implementation
   };
   ```

2. **README Files**
   - Project overview
   - Setup instructions
   - Usage examples
   - Contributing guidelines

3. **API Documentation**
   - Endpoint descriptions
   - Request/response examples
   - Error codes and handling
   - Authentication requirements

## Pull Request Process

### Before Submitting

1. **Code Quality Checks**
   ```bash
   # Run linting
   npm run lint
   
   # Run type checking
   npm run type-check
   
   # Run tests
   npm run test
   
   # Build project
   npm run build
   ```

2. **Documentation Updates**
   - Update relevant documentation
   - Add/update API documentation
   - Update changelog if applicable

3. **Self Review**
   - Review your own code first
   - Check for console.logs or debugging code
   - Ensure proper error handling

### Pull Request Template

```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring

## Testing
- [ ] Tests pass locally
- [ ] New tests added for new functionality
- [ ] Manual testing completed

## Screenshots/Videos
Add screenshots or videos for UI changes.

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] Tests added/updated
```

### Review Process

1. **Automated Checks**
   - CI/CD pipeline runs automatically
   - Code quality and security scans
   - Test suite execution

2. **Peer Review**
   - At least one maintainer review required
   - Address all feedback and suggestions
   - Re-request review after changes

3. **Merge**
   - All checks must pass
   - Conflicts resolved
   - Approved by maintainers

## Community Guidelines

### Code of Conduct

1. **Be Respectful**
   - Treat all contributors with respect
   - Be constructive in feedback
   - Help newcomers get started

2. **Be Collaborative**
   - Work together to solve problems
   - Share knowledge and expertise
   - Credit others for their contributions

3. **Be Professional**
   - Keep discussions focused and on-topic
   - Avoid personal attacks or harassment
   - Follow project guidelines and standards

### Getting Help

1. **Documentation First**
   - Check existing documentation
   - Search for similar issues
   - Review code comments and examples

2. **Community Support**
   - Ask questions in GitHub discussions
   - Join our Discord community
   - Participate in community forums

3. **Direct Support**
   - Contact maintainers for complex issues
   - Request mentorship for large contributions
   - Seek guidance on architectural decisions

## Release Process

### Version Management

We follow [Semantic Versioning](https://semver.org/):
- **Major** (1.0.0): Breaking changes
- **Minor** (1.1.0): New features (backwards compatible)
- **Patch** (1.1.1): Bug fixes (backwards compatible)

### Release Schedule

- **Patch releases**: Weekly (bug fixes, small improvements)
- **Minor releases**: Monthly (new features)
- **Major releases**: Quarterly (significant changes)

### Pre-release Testing

1. **Alpha**: Internal testing
2. **Beta**: Community testing
3. **Release Candidate**: Final testing before release

## Recognition

### Contributor Recognition

We recognize contributors through:
- **GitHub Contributors** page
- **Release notes** acknowledgments
- **Community highlights** in announcements
- **Special badges** for significant contributions

### Contribution Levels

1. **First-time Contributor**: Welcome package and guidance
2. **Regular Contributor**: Recognition in release notes
3. **Core Contributor**: Invitation to maintainer discussions
4. **Maintainer**: Direct commit access and review responsibilities

---

## Thank You! 🙏

Your contributions make ECE Trading Cards better for everyone. Whether you're fixing a typo, adding a feature, or helping other contributors, every contribution is valuable and appreciated.

For questions about contributing, please reach out to the maintainer team or join our community discussions. We're here to help you succeed!

**Happy coding!** 🚀
