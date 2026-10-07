import nx from "@nx/eslint-plugin";
import baseConfig from "../../../eslint.base.config.mjs";

export default [
    ...nx.configs["flat/angular"],
    ...nx.configs["flat/angular-template"],
    ...baseConfig,
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
        rules: {
            "no-restricted-imports": ["error", {
                paths: [{ name: "@angular/common/http", message: "Feature não fala com HTTP: dependa do PokemonRepository (@pokedex/domain)." }]
            }]
        }
    },
    {
        files: [
            "**/*.html"
        ],
        // Override or add rules here
        rules: {}
    }
];
