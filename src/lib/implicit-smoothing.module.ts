/**
 * This module wrap the [implicit smoothing](https://www.pmp-library.org/group__algorithms.html#ga2684547522a7393bef76db5ffe543684)
 * function of [PMP](https://www.pmp-library.org/).
 *
 * @module
 */

import { Modules } from '@youwol/vsf-core'
import { map, mergeMap } from 'rxjs/operators'
import { ensurePmpInitialized, reMeshInput } from './utils'
import { from } from 'rxjs'
import { implicitSmoothing } from './standalone.functions'

export const configuration = {
    schema: {
        timestep: Modules.floatAttribute({ value: 0.001, min: 0 }),
        useUniformLaplace: Modules.booleanAttribute({ value: false }),
        rescale: Modules.booleanAttribute({ value: true }),
    },
}

export const inputs = reMeshInput

export const outputs = (
    arg: Modules.OutputMapperArg<typeof configuration.schema, typeof inputs>,
) => ({
    output$: arg.inputs.input$.pipe(
        ensurePmpInitialized(),
        mergeMap(({ pmp, configuration, data, context }) => {
            return from(
                implicitSmoothing({ mesh: data, configuration, pmp }),
            ).pipe(
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
