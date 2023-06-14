/**
 * This module converts PMP geometries to Three.BufferGeometries.
 * @module
 */

import { Modules, asMutable } from '@youwol/vsf-core'
import { map } from 'rxjs/operators'
import { toMeshGeometry, contractPmpGeom, PmpMeshTrait } from './utils'

export const configuration = {
    schema: {},
}

export const inputs = {
    input$: {
        description:
            'The PMP data structure to convert into Three.BufferGeometry.',
        contract: contractPmpGeom,
    },
}
export const outputs = (
    arg: Modules.OutputMapperArg<typeof configuration.schema, typeof inputs>,
) => ({
    output$: arg.inputs.input$.pipe(
        map(({ data, context }) => {
            // Array buffer will be share with the created Three.Mesh
            // It should be OK because the data emitted here are not supposed to be mutated afterward
            const pmpMesh = asMutable<PmpMeshTrait>(data)
            return {
                data: toMeshGeometry(pmpMesh),
                context,
            }
        }),
    ),
})

export function module(fwdParams) {
    return new Modules.Implementation(
        {
            configuration,
            inputs,
            outputs,
        },
        fwdParams,
    )
}
