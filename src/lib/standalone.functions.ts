import { BufferGeometry } from 'three'
import {
    implementBufferGeometryTrait,
    implementPmpMeshTrait,
    PmpMeshTrait,
    toMeshGeometry,
} from './utils'
import { install } from '@youwol/cdn-client'
import { setup } from '../auto-generated'
import { Immutable } from '@youwol/vsf-core'

export interface PmpModule {
    buildSurface
    onRuntimeInitialized
}
export async function init(): Promise<PmpModule> {
    if (!window['PmpModule']) {
        await install({
            scripts: [`@youwol/vsf-pmp#${setup.version}~assets/pmp.js`],
        })
    }
    const pmp: PmpModule = window['PmpModule']
    return await new Promise((resolve) => {
        if (pmp.onRuntimeInitialized) {
            resolve(pmp)
            return
        }
        pmp.onRuntimeInitialized = () => resolve(pmp)
    })
}

export async function buildSurface({
    mesh,
    pmp,
}: {
    mesh: Immutable<BufferGeometry | PmpMeshTrait>
    pmp?: PmpModule
}) {
    pmp = pmp || (await init())
    if (implementBufferGeometryTrait(mesh)) {
        return pmp.buildSurface(
            mesh.attributes.position.array,
            mesh.index.array,
        )
    }
    if (implementPmpMeshTrait(mesh)) {
        return pmp.buildSurface(mesh.position, mesh.index)
    }
    console.error('Can not build PMP surface: unknown input type', {
        input: mesh,
    })
    throw Error('Can not build PMP surface: unknown input type')
}

export async function uniformRemesh({
    mesh,
    configuration,
    pmp,
}: {
    mesh: Immutable<BufferGeometry | PmpMeshTrait>
    configuration: { edgeFactor: number; iterationsCount?: number }
    pmp?: PmpModule
}) {
    const surface = await buildSurface({ mesh, pmp })
    const mean = surface.meanEdgeLength()
    surface.uniformRemesh(
        mean * configuration.edgeFactor,
        configuration.iterationsCount || 10,
        true,
    )
    if (implementBufferGeometryTrait(mesh)) {
        return toMeshGeometry(surface)
    }
    return { index: surface.index(), position: surface.position() }
}

export async function implicitSmoothing({
    mesh,
    configuration,
    pmp,
}: {
    mesh: Immutable<BufferGeometry | PmpMeshTrait>
    configuration: {
        timestep: number
        useUniformLaplace?: boolean
        rescale?: boolean
    }
    pmp?: PmpModule
}) {
    const surface = await buildSurface({ mesh, pmp })
    surface.implicitSmoothing(
        configuration.timestep,
        configuration.useUniformLaplace || false,
        configuration.rescale || true,
    )
    if (mesh instanceof BufferGeometry) {
        return toMeshGeometry(surface)
    }
    return surface
}

export async function explicitSmoothing({
    mesh,
    configuration,
    pmp,
}: {
    mesh: Immutable<BufferGeometry | PmpMeshTrait>
    configuration: {
        iterationCount: number
        useUniformLaplace?: boolean
    }
    pmp?: PmpModule
}) {
    const surface = await buildSurface({ mesh, pmp })
    surface.explicitSmoothing(
        configuration.iterationCount,
        configuration.useUniformLaplace,
    )
    if (mesh instanceof BufferGeometry) {
        return toMeshGeometry(surface)
    }
    return surface
}

export async function adaptiveRemesh({
    mesh,
    configuration,
    pmp,
}: {
    mesh: Immutable<BufferGeometry | PmpMeshTrait>
    configuration: {
        minEdgeFactor: number
        maxEdgeFactor: number
        approxError: number
        iterationsCount: number
        useProjection: boolean
    }
    pmp?: PmpModule
}) {
    const surface = await buildSurface({ mesh, pmp })
    const mean = surface.meanEdgeLength()
    surface.adaptiveRemesh(
        mean * configuration.minEdgeFactor,
        mean * configuration.maxEdgeFactor,
        configuration.approxError,
        configuration.iterationsCount,
        configuration.useProjection,
    )
    if (mesh instanceof BufferGeometry) {
        return toMeshGeometry(surface)
    }
    return surface
}
