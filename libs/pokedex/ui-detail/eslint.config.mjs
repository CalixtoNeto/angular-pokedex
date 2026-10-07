import baseConfig from "../../../eslint.base.config.mjs";
import nx from "@nx/eslint-plugin";
import pokedex from "../../../tools/lint-rules/index.mjs";

export default [
    ...baseConfig,
    ...nx.configs["flat/angular"],
    ...nx.configs["flat/angular-template"],
    {
        files: [
            "**/*.ts"
        ],
        rules: {
            "@angular-eslint/directive-selector": [
                "error",
                {
                    type: "attribute",
                    prefix: "app",
                    style: "camelCase"
                }
            ],
            "@angular-eslint/component-selector": [
                "error",
                {
                    type: "element",
                    prefix: "app",
                    style: "kebab-case"
                }
            ]
        }
    },
    {
        files: ["**/*.ts"],
        plugins: { pokedex },
        rules: { "pokedex/dumb-component": "error" }
    },
    {
        files: [
            "**/*.html"
        ],
        // Override or add rules here
        rules: {}
    }
];
