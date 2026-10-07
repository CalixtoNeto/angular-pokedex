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
        // Todo texto visível passa pela tradução, com um id fixo (@@) para a tradução não se perder quando o texto mudar.
        rules: {
            "@angular-eslint/template/i18n": ["error", {
                checkId: true,
                ignoreAttributes: ["aria-current", "data-defense", "decoding", "hreflang", "lang", "loading", "scope"]
            }]
        }
    }
];
