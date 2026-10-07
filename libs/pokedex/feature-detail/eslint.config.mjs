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
        // Todo texto visível passa pela tradução, com um id fixo (@@) para a tradução não se perder quando o texto mudar.
        rules: {
            "@angular-eslint/template/i18n": ["error", {
                checkId: true,
                ignoreAttributes: ["aria-current", "data-defense", "decoding", "hreflang", "lang", "loading", "scope"]
            }]
        }
    }
];
