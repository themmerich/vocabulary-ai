# Skills

Agent skills for this repository live under `.claude/skills/`. Each skill folder contains a
`SKILL.md` plus optional `references/`, `scripts/`, or `assets/` support files loaded just in time.
They fall into two groups: **third-party skills** copied or adapted from public sources, and
**custom skills** authored in this repository.

To keep this index honest, run the
[`update-skills-directory`](.claude/skills/update-skills-directory/SKILL.md) skill whenever a
skill is added, renamed, or removed – it verifies skill frontmatter, support-file structure, and
links from this index.

## Third-party skills

Copied or adapted from public sources; the origin column records where each skill came from.

| Skill                                                          | What it does                                                                                           | Origin                                                      |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------- |
| [angular-developer](.claude/skills/angular-developer/SKILL.md) | Generates Angular code and architectural guidance, version-aware, with a `ng build` verification loop. | [`angular/skills`](https://github.com/angular/skills)       |
| [brainstorming](.claude/skills/brainstorming/SKILL.md)         | Design-first gate: turn an idea into an approved spec before any code is written.                       | [`obra/superpowers`](https://github.com/obra/superpowers)   |
| [grill-me](.claude/skills/grill-me/SKILL.md)                   | Interrogates a plan one question at a time to stress-test it before building.                           | [`mattpocock/skills`](https://github.com/mattpocock/skills) |

## Custom skills

Authored in this repository; each row summarizes what the skill does and links to its `SKILL.md`.

| Skill                                                                      | What it does                                                                                           |
| -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| [create-a-skill](.claude/skills/create-a-skill/SKILL.md)                   | Meta-skill for authoring, editing, and improving agent skills.                                         |
| [grill-with-style](.claude/skills/grill-with-style/SKILL.md)               | Grilling session aware of this project's domain model and style guide.                                 |
| [ng-accessibility](.claude/skills/ng-accessibility/SKILL.md)               | Makes Angular apps accessible – semantic HTML, keyboard/focus, ARIA, CDK a11y, router & forms, WCAG AA.|
| [ng-review-architecture](.claude/skills/ng-review-architecture/SKILL.md)   | Reviews Angular architecture against DDD and module depth.                                             |
| [ng-styling](.claude/skills/ng-styling/SKILL.md)                           | Audits Angular styling (SCSS, bindings, encapsulation, tokens, frameworks) against three style guides. |
| [update-skills-directory](.claude/skills/update-skills-directory/SKILL.md) | Audits the skills directory so every skill is structured correctly and linked here.                    |
