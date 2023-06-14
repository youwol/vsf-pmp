import { BufferAttribute, BufferGeometry } from 'three'
import { from, Observable } from 'rxjs'
import { mergeMap } from 'rxjs/operators'
import { Modules } from '@youwol/vsf-core'

export interface PmpMeshTrait {
    position: ArrayBuffer
    index: ArrayBuffer
}

export function implementPmpMeshTrait(data: unknown): data is PmpMeshTrait {
    return (
        (data as PmpMeshTrait).position != undefined &&
        (data as PmpMeshTrait).index != undefined
    )
}

export function implementBufferGeometryTrait(d: unknown): d is BufferGeometry {
    return (d as BufferGeometry).isBufferGeometry
}

export const contractPmpGeom = Modules.expect.single<PmpMeshTrait>({
    when: Modules.expect.of({
        description: 'A PMP geometry',
        when: (data: unknown) => {
            return implementPmpMeshTrait(data)
        },
    }),
})

export function toMeshGeometry(surface: PmpMeshTrait): BufferGeometry {
    const geometry = new BufferGeometry()
    const vertices = new Float32Array(surface.position)

    const indexes = surface.index
    geometry.setAttribute('position', new BufferAttribute(vertices, 3))
    geometry.setIndex(indexes as unknown as BufferAttribute)

    geometry.computeVertexNormals()
    geometry.computeBoundingBox()
    geometry.computeBoundingSphere()

    return geometry
}

export function ensurePmpInitialized<TData, TConf>() {
    const pmp = window['PmpModule']
    return (obs: Observable<Modules.ProcessingMessage<TData, TConf>>) =>
        obs.pipe(
            mergeMap((message: Modules.ProcessingMessage<TData, TConf>) =>
                from(
                    new Promise<typeof message & { pmp }>((resolve) => {
                        if (pmp.buildSurface) {
                            resolve({ ...message, pmp })
                            return
                        }

                        if (pmp.onRuntimeInitialized) {
                            resolve({ ...message, pmp })
                            return
                        }
                        pmp.onRuntimeInitialized = () =>
                            resolve({ ...message, pmp })
                    }),
                ),
            ),
        )
}

export const reMeshInput = {
    input$: {
        description: 'The original geometry to remesh.',
        contract: contractPmpGeom,
    },
}
