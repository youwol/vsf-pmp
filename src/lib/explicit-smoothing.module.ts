/**
 * This module wrap the [explicit smoothing](https://www.pmp-library.org/group__algorithms.html#gab458b6b05c82fb51fe5c0386559a384c)
 * function of [PMP](https://www.pmp-library.org/).
 *
 * @module
 */

import { Modules, Configurations } from '@youwol/vsf-core'
import { map, mergeMap } from 'rxjs/operators'
import { ensurePmpInitialized, reMeshInput } from './utils'
import { from } from 'rxjs'
import { explicitSmoothing } from './standalone.functions'

export const configuration = {
    schema: {
        iterationCount: new Configurations.Integer({ value: 10, min: 0 }),
        useUniformLaplace: new Configurations.Boolean({ value: false }),
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
                explicitSmoothing({ mesh: data, configuration, pmp }),
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
