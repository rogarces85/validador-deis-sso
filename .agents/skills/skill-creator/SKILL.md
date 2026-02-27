---
name: Skill Creator
description: Guides the generation of new Antigravity skills, ensuring they follow the standard directory structure, YAML frontmatter, and instruction format.
---

# Skill Creator

This skill is specialized in facilitating the creation of new **skills** for the Antigravity environment. It ensures consistency, high-quality documentation, and proper structure according to the official standard.

---

## What is an Antigravity Skill?

A skill is a directory within `.agent/skills/` that extends the AI assistant's capabilities for specialized tasks. The system automatically detects any folder containing a `SKILL.md` file.

---

## Target Structure

```
.agent/skills/<skill-name-in-kebab-case>/
├── SKILL.md              # (Required) Main instructions and metadata
├── scripts/              # (Optional) Helper scripts and utilities
├── examples/             # (Optional) Reference implementations
└── resources/            # (Optional) Templates, assets, and extra files
```

---

## Creation Workflow

When a user requests a new skill, follow these steps systematically:

### Step 1 — Requirement Gathering

Ensure you have the following information:
1.  **Skill Name**: A clear, legible name (e.g., "Deployment Manager").
2.  **Short Description**: 1-2 sentences explaining the purpose.
3.  **Core Objective**: What specific problem does it solve?
4.  **Language**: Preferred language for instructions (Default: Spanish).
5.  **Additional Assets**: Does it need scripts (Bash/Node/Python), examples, or resources?

### Step 2 — Directory Initialization

-   Create the folder: `.agent/skills/<skill-name-in-kebab-case>/`.
-   Avoid special characters or spaces in the directory name.

### Step 3 — Constructing `SKILL.md`

Every `SKILL.md` MUST start with YAML frontmatter:

```yaml
---
name: [Public Name]
description: [Short one-line description]
---
```

Followed by a structured Markdown body:
1.  **# [Skill Name]**: Main header.
2.  **Overview**: Brief context.
3.  **Prerequisites**: Tools or config needed.
4.  **Instructions**: Step-by-step guide for the AI.
5.  **Conventions**: Rules for naming, formatting, etc.
6.  **Examples**: Reference code snippets.
7.  **Notes**: Limitations or tips.

### Step 4 — Optional Components

-   **`scripts/`**: Place automation scripts here.
-   **`resources/`**: Place templates or config files here.
-   **`examples/`**: Place reference files here.

---

## Best Practices

1.  **High Granularity**: One skill should solve one specific domain. If it gets too complex, split it.
2.  **Instruction Clarity**: Use imperative language and specific examples.
3.  **Self-Contained**: Ensure the skill includes everything needed to perform its task.
4.  **Metadata Quality**: The `description` in the YAML frontmatter is what the system uses to decide when to activate the skill. Make it precise.

---

## Validation Checklist

- [ ] Folder is in `.agent/skills/`
- [ ] Folder name is `kebab-case`
- [ ] `SKILL.md` exists and contains valid YAML frontmatter
- [ ] Instructions are actionable and clear
- [ ] (If applicable) Scripts have execution permissions or clear runners
