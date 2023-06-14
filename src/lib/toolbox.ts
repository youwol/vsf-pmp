import { Modules, Projects } from '@youwol/vsf-core'
import { basePathDoc, urlModuleDoc } from './constants'
import { setup } from '../auto-generated'

type Modules = {
    'to-three': typeof import('./to-three.module')
    'from-three': typeof import('./from-three.module')
    'uniform-remeshing': typeof import('./uniform-remeshing.module')
    'adaptive-remeshing': typeof import('./adaptive-remeshing.module')
    'explicit-smoothing': typeof import('./explicit-smoothing.module')
    'implicit-smoothing': typeof import('./implicit-smoothing.module')
}

function getImplementationModule<T extends keyof Modules>(name: T): Modules[T] {
    const symbol = `${setup.name}/${name}_APIv${setup.apiVersion}`
    return window[symbol] as Modules[T]
}

export function toolbox(): Projects.ToolBox {
    return {
        name: 'PMP',
        uid: setup.name,
        origin: {
            packageName: setup.name,
            version: setup.version,
        },
        documentation: `${basePathDoc}.html`,
        icon: {
            svgString: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
<!-- Font Awesome Pro 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) -->
<path fill="darkslategrey" d="M488.6 250.2L392 214V105.5c0-15-9.3-28.4-23.4-33.7l-100-37.5c-8.1-3.1-17.1-3.1-25.3 0l-100 37.5c-14.1 5.3-23.4 18.7-23.4 33.7V214l-96.6 36.2C9.3 255.5 0 268.9 0 283.9V394c0 13.6 7.7 26.1 19.9 32.2l100 50c10.1 5.1 22.1 5.1 32.2 0l103.9-52 103.9 52c10.1 5.1 22.1 5.1 32.2 0l100-50c12.2-6.1 19.9-18.6 19.9-32.2V283.9c0-15-9.3-28.4-23.4-33.7zM358 214.8l-85 31.9v-68.2l85-37v73.3zM154 104.1l102-38.2 102 38.2v.6l-102 41.4-102-41.4v-.6zm84 291.1l-85 42.5v-79.1l85-38.8v75.4zm0-112l-102 41.4-102-41.4v-.6l102-38.2 102 38.2v.6zm240 112l-85 42.5v-79.1l85-38.8v75.4zm0-112l-102 41.4-102-41.4v-.6l102-38.2 102 38.2v.6z"/>
</svg>
`,
        },
        modules: [
            new Modules.Module({
                declaration: {
                    typeId: 'uniformRemeshing',
                    documentation: urlModuleDoc('UniformRemeshing'),
                    dependencies: {
                        modules: setup.getCdnDependencies('uniform-remeshing'),
                        scripts: [
                            `@youwol/vsf-pmp#${setup.version}~assets/pmp.js`,
                            `${setup.name}#${setup.version}~dist/${setup.name}/uniform-remeshing.js`,
                        ],
                    },
                },
                implementation: ({ fwdParams }) => {
                    return getImplementationModule('uniform-remeshing').module(
                        fwdParams,
                    )
                },
            }),
            new Modules.Module({
                declaration: {
                    typeId: 'adaptiveRemeshing',
                    documentation: urlModuleDoc('AdaptiveRemeshing'),
                    dependencies: {
                        modules: setup.getCdnDependencies('adaptive-remeshing'),
                        scripts: [
                            `@youwol/vsf-pmp#${setup.version}~assets/pmp.js`,
                            `${setup.name}#${setup.version}~dist/${setup.name}/adaptive-remeshing.js`,
                        ],
                    },
                },
                implementation: ({ fwdParams }) => {
                    return getImplementationModule('adaptive-remeshing').module(
                        fwdParams,
                    )
                },
            }),
            new Modules.Module({
                declaration: {
                    typeId: 'implicitSmoothing',
                    documentation: urlModuleDoc('ImplicitSmoothing'),
                    dependencies: {
                        modules: setup.getCdnDependencies('implicit-smoothing'),
                        scripts: [
                            `@youwol/vsf-pmp#${setup.version}~assets/pmp.js`,
                            `${setup.name}#${setup.version}~dist/${setup.name}/implicit-smoothing.js`,
                        ],
                    },
                },
                implementation: ({ fwdParams }) => {
                    return getImplementationModule('implicit-smoothing').module(
                        fwdParams,
                    )
                },
            }),
            new Modules.Module({
                declaration: {
                    typeId: 'explicitSmoothing',
                    documentation: urlModuleDoc('ExplicitSmoothing'),
                    dependencies: {
                        modules: setup.getCdnDependencies('explicit-smoothing'),
                        scripts: [
                            `@youwol/vsf-pmp#${setup.version}~assets/pmp.js`,
                            `${setup.name}#${setup.version}~dist/${setup.name}/explicit-smoothing.js`,
                        ],
                    },
                },
                implementation: ({ fwdParams }) => {
                    return getImplementationModule('explicit-smoothing').module(
                        fwdParams,
                    )
                },
            }),
            new Modules.Module({
                declaration: {
                    typeId: 'fromThree',
                    documentation: urlModuleDoc('FromThree'),
                    dependencies: {
                        modules: setup.getCdnDependencies('from-three'),
                        scripts: [
                            `${setup.name}#${setup.version}~dist/${setup.name}/from-three.js`,
                        ],
                    },
                },
                implementation: ({ fwdParams }) => {
                    return getImplementationModule('from-three').module(
                        fwdParams,
                    )
                },
            }),
            new Modules.Module({
                declaration: {
                    typeId: 'toThree',
                    documentation: urlModuleDoc('ToThree'),
                    dependencies: {
                        modules: setup.getCdnDependencies('to-three'),
                        scripts: [
                            `${setup.name}#${setup.version}~dist/${setup.name}/to-three.js`,
                        ],
                    },
                },
                implementation: ({ fwdParams }) => {
                    return getImplementationModule('to-three').module(fwdParams)
                },
            }),
        ],
    }
}
