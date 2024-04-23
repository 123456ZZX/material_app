module.exports = {
  env: {
    browser: true,
    es6: true,
    commonjs: true,
    node: true,
  },
  extends: ["eslint:recommended", "plugin:vue/essential", "prettier"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
    parser: "babel-eslint",
  },
  plugins: ["vue"],
  rules: {
    "no-console": [2, { allow: ["warn", "error"] }],
  },
};
