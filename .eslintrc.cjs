/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
    "root": true,
    "extends": [
        "plugin:vue/vue3-essential",
        "eslint:recommended",
        "@vue/eslint-config-prettier"
    ],
    "plugins": ["jest"],
    rules: {
        "no-console": ["error", {allow: ["warn", "error"]}],
        "no-alert": "error",
        "no-unused-vars": ["error", {"ignoreRestSiblings": true}],
    },
    "env": {
        "node": true,
        "commonjs": true,
        "vue/setup-compiler-macros": true,
        "jest/globals": true,
    },
}
