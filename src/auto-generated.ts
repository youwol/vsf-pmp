
const runTimeDependencies = {
    "externals": {
        "@youwol/vsf-core": "^0.3.3",
        "@youwol/webpm-client": "^3.0.7",
        "rxjs": "^7.5.6",
        "three": "^0.152.0"
    },
    "includedInBundle": {}
}
const externals = {
    "@youwol/vsf-core": {
        "commonjs": "@youwol/vsf-core",
        "commonjs2": "@youwol/vsf-core",
        "root": "@youwol/vsf-core_APIv03"
    },
    "@youwol/webpm-client": {
        "commonjs": "@youwol/webpm-client",
        "commonjs2": "@youwol/webpm-client",
        "root": "@youwol/webpm-client_APIv3"
    },
    "rxjs": {
        "commonjs": "rxjs",
        "commonjs2": "rxjs",
        "root": "rxjs_APIv7"
    },
    "rxjs/operators": {
        "commonjs": "rxjs/operators",
        "commonjs2": "rxjs/operators",
        "root": [
            "rxjs_APIv7",
            "operators"
        ]
    },
    "three": {
        "commonjs": "three",
        "commonjs2": "three",
        "root": "three_APIv0152"
    }
}
const exportedSymbols = {
    "@youwol/vsf-core": {
        "apiKey": "03",
        "exportedSymbol": "@youwol/vsf-core"
    },
    "@youwol/webpm-client": {
        "apiKey": "3",
        "exportedSymbol": "@youwol/webpm-client"
    },
    "rxjs": {
        "apiKey": "7",
        "exportedSymbol": "rxjs"
    },
    "three": {
        "apiKey": "0152",
        "exportedSymbol": "three"
    }
}

const mainEntry : {entryFile: string,loadDependencies:string[]} = {
    "entryFile": "./lib/toolbox.ts",
    "loadDependencies": [
        "@youwol/vsf-core"
    ]
}

const secondaryEntries : {[k:string]:{entryFile: string, name: string, loadDependencies:string[]}}= {
    "adaptive-remeshing": {
        "entryFile": "./lib/adaptive-remeshing.module.ts",
        "loadDependencies": [
            "@youwol/vsf-core",
            "@youwol/webpm-client",
            "rxjs"
        ],
        "name": "adaptive-remeshing"
    },
    "explicit-smoothing": {
        "entryFile": "./lib/explicit-smoothing.module.ts",
        "loadDependencies": [
            "@youwol/vsf-core",
            "@youwol/webpm-client",
            "rxjs"
        ],
        "name": "explicit-smoothing"
    },
    "from-three": {
        "entryFile": "./lib/from-three.module.ts",
        "loadDependencies": [
            "@youwol/vsf-core",
            "rxjs"
        ],
        "name": "from-three"
    },
    "implicit-smoothing": {
        "entryFile": "./lib/implicit-smoothing.module.ts",
        "loadDependencies": [
            "@youwol/vsf-core",
            "@youwol/webpm-client",
            "rxjs"
        ],
        "name": "implicit-smoothing"
    },
    "to-three": {
        "entryFile": "./lib/to-three.module.ts",
        "loadDependencies": [
            "@youwol/vsf-core",
            "three",
            "rxjs"
        ],
        "name": "to-three"
    },
    "uniform-remeshing": {
        "entryFile": "./lib/uniform-remeshing.module.ts",
        "loadDependencies": [
            "@youwol/vsf-core",
            "@youwol/webpm-client",
            "rxjs"
        ],
        "name": "uniform-remeshing"
    }
}

const entries = {
     '@youwol/vsf-pmp': './lib/toolbox.ts',
    ...Object.values(secondaryEntries).reduce( (acc,e) => ({...acc, [`@youwol/vsf-pmp/${e.name}`]:e.entryFile}), {})
}
export const setup = {
    name:'@youwol/vsf-pmp',
        assetId:'QHlvdXdvbC92c2YtcG1w',
    version:'0.3.0',
    shortDescription:"Visual Studio Flow toolbox wrapping the library PMP (Polygon Mesh Processing).",
    developerDocumentation:'https://platform.youwol.com/applications/@youwol/cdn-explorer/latest?package=@youwol/vsf-pmp&tab=doc',
    npmPackage:'https://www.npmjs.com/package/@youwol/vsf-pmp',
    sourceGithub:'https://github.com/youwol/vsf-pmp',
    userGuide:'',
    apiVersion:'03',
    runTimeDependencies,
    externals,
    exportedSymbols,
    entries,
    secondaryEntries,
    getDependencySymbolExported: (module:string) => {
        return `${exportedSymbols[module].exportedSymbol}_APIv${exportedSymbols[module].apiKey}`
    },

    installMainModule: ({cdnClient, installParameters}:{
        cdnClient:{install:(unknown) => Promise<WindowOrWorkerGlobalScope>},
        installParameters?
    }) => {
        const parameters = installParameters || {}
        const scripts = parameters.scripts || []
        const modules = [
            ...(parameters.modules || []),
            ...mainEntry.loadDependencies.map( d => `${d}#${runTimeDependencies.externals[d]}`)
        ]
        return cdnClient.install({
            ...parameters,
            modules,
            scripts,
        }).then(() => {
            return window[`@youwol/vsf-pmp_APIv03`]
        })
    },
    installAuxiliaryModule: ({name, cdnClient, installParameters}:{
        name: string,
        cdnClient:{install:(unknown) => Promise<WindowOrWorkerGlobalScope>},
        installParameters?
    }) => {
        const entry = secondaryEntries[name]
        if(!entry){
            throw Error(`Can not find the secondary entry '${name}'. Referenced in template.py?`)
        }
        const parameters = installParameters || {}
        const scripts = [
            ...(parameters.scripts || []),
            `@youwol/vsf-pmp#0.3.0~dist/@youwol/vsf-pmp/${entry.name}.js`
        ]
        const modules = [
            ...(parameters.modules || []),
            ...entry.loadDependencies.map( d => `${d}#${runTimeDependencies.externals[d]}`)
        ]
        return cdnClient.install({
            ...parameters,
            modules,
            scripts,
        }).then(() => {
            return window[`@youwol/vsf-pmp/${entry.name}_APIv03`]
        })
    },
    getCdnDependencies(name?: string){
        if(name && !secondaryEntries[name]){
            throw Error(`Can not find the secondary entry '${name}'. Referenced in template.py?`)
        }
        const deps = name ? secondaryEntries[name].loadDependencies : mainEntry.loadDependencies

        return deps.map( d => `${d}#${runTimeDependencies.externals[d]}`)
    }
}
