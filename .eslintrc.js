const path = require("path");

module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  parser: "@typescript-eslint/parser",
  extends: [
    "eslint:recommended",
    "plugin:prettier/recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:@typescript-eslint/strict",
    "plugin:@typescript-eslint/recommended",
    "standard-with-typescript",
    "eslint-config-prettier",
    "prettier",
  ],
  overrides: [
    {
      files: ["*.ts", "*.mts", "*.cts", "*.tsx"],
      rules: {
        "no-undef": "off",
      },
    },
  ],
  parserOptions: {
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
      globalReturn: false,
    },
    allowImportExportEverywhere: false,
    ecmaVersion: "2020",
    project: ["./tsconfig.json"],
    tsconfigRootDir: __dirname,
  },
  plugins: ["react"],
  rules: {
    "import/no-unresolved": "error",
  },
  settings: {
    react: {
      version: "detect", // 버전 명시를 하여 자잘한 warn 메세지를 삭제
    },
    "import/resolver": {
      node: {
        paths: ["src"],
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
      webpack: {
        config: path.join(__dirname, "webpack.config.js"),
      },
    },
  },
  ignorePatterns: [".eslintrc.js", "webpack.*.js"],
};
