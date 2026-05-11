module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      ["feat", "fix", "docs", "style", "refactor", "test", "chore", "perf", "build", "ci", "revert"],
    ],
    "scope-enum": [
      1,
      "always",
      ["front", "back", "legacy-front", "legacy-back", "db", "infra", "design", "claude", "deps"],
    ],
    "subject-case": [0],
    "subject-full-stop": [2, "never", "."],
    "header-max-length": [2, "always", 72],
  },
};
