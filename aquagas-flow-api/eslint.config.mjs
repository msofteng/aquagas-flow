import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [
    {
        ignores: ["src/public/"],
    }, ...compat.extends(
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
    ), {
        plugins: {
            "@typescript-eslint": typescriptEslint,
        },

        languageOptions: {
            parser: tsParser,
            ecmaVersion: 5,
            sourceType: "script",

            parserOptions: {
                project: "./tsconfig.json",
            },
        },

        settings: {
            node: {
                tryExtensions: [".js", ".json", ".node", ".ts"],
            }
        },

        rules: {
            "@typescript-eslint/explicit-member-accessibility": "warn",
            "@typescript-eslint/no-misused-promises": 0,
            "@typescript-eslint/no-floating-promises": 0,

            "max-len": ["warn", {
                code: 100,
            }],

            "comma-dangle": ["warn", "always-multiline"],
            "no-console": 1,
            "no-extra-boolean-cast": 0,
            semi: 1,
            indent: ["warn", 4],
            quotes: ["warn", "single"],
        },
    }
];