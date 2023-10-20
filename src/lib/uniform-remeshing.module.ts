/**
 * This module wrap the [uniform remeshing](https://www.pmp-library.org/group__algorithms.html#ga1ddecfc2d08f5dbf820863acc79ee3bc)
 * function of [PMP](https://www.pmp-library.org/).
 *
 * @module
 */

import { Modules } from '@youwol/vsf-core'
import { map, mergeMap } from 'rxjs/operators'
import { ensurePmpInitialized, reMeshInput } from './utils'
import { uniformRemesh } from './standalone.functions'
import { from } from 'rxjs'

export const configuration = {
    schema: {
        edgeFactor: Modules.floatAttribute({ value: 1, min: 0 }),
        iterationsCount: Modules.integerAttribute({ value: 10 }),
        useProjection: Modules.booleanAttribute({ value: true }),
    },
}

export const inputs = reMeshInput

export const outputs = (
    arg: Modules.OutputMapperArg<typeof configuration.schema, typeof inputs>,
) => ({
    output$: arg.inputs.input$.pipe(
        ensurePmpInitialized(),
        mergeMap(({ pmp, configuration, data, context }) => {
            return from(uniformRemesh({ mesh: data, configuration, pmp })).pipe(
                map((surface) => ({
                    data: surface,
                    context,
                })),
            )
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
