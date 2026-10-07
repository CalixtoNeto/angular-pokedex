import nx from "@nx/eslint-plugin";

export default [
    ...nx.configs["flat/base"],
    ...nx.configs["flat/typescript"],
    ...nx.configs["flat/javascript"],
    {
        ignores: [
            "**/dist",
            "**/out-tsc"
        ]
    },
    {
        files: [
            "**/*.ts",
            "**/*.tsx",
            "**/*.js",
            "**/*.jsx"
        ],
        rules: {
            "@nx/enforce-module-boundaries": [
                "error",
                {
                    enforceBuildableLibDependency: true,
                    allow: [
                        "^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$"
                    ],
                    depConstraints: [
                        // O app compõe tudo: é o único lugar que escolhe a implementação do repositório.
                        { sourceTag: "type:app", onlyDependOnLibsWithTags: ["type:feature", "type:data-access", "type:ui", "type:domain"] },
                        // Features (componentes smart) falam com o domínio e desenham com a ui; nunca com a API.
                        { sourceTag: "type:feature", onlyDependOnLibsWithTags: ["type:domain", "type:ui"] },
                        // Componentes dumb só recebem dados do domínio por input.
                        { sourceTag: "type:ui", onlyDependOnLibsWithTags: ["type:domain"] },
                        { sourceTag: "type:data-access", onlyDependOnLibsWithTags: ["type:domain"] },
                        { sourceTag: "type:domain", onlyDependOnLibsWithTags: ["type:domain"] }
                    ]
                }
            ]
        }
    },
    {
        files: [
            "**/*.ts",
            "**/*.tsx",
            "**/*.cts",
            "**/*.mts",
            "**/*.js",
            "**/*.jsx",
            "**/*.cjs",
            "**/*.mjs"
        ],
        // Override or add rules here
        rules: {}
    }
];
