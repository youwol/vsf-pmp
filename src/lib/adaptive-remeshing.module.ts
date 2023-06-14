/**
 * This module wrap the [adaptive remeshing](https://www.pmp-library.org/group__algorithms.html#gaee81c99c293038da58ede01416bf8026)
 * function of [PMP](https://www.pmp-library.org/).
 *
 * @module
 */
import { Modules, Attributes } from '@youwol/vsf-core'
import { map, mergeMap } from 'rxjs/operators'
import { ensurePmpInitialized, reMeshInput } from './utils'
import { from } from 'rxjs'
import { adaptiveRemesh } from './standalone.functions'

export const configuration = {
    schema: {
        minEdgeFactor: new Attributes.Float({ value: 0.5, min: 0 }),
        maxEdgeFactor: new Attributes.Float({ value: 2, min: 0 }),
        approxError: new Attributes.Float({ value: 0.1, min: 0 }),
        iterationsCount: new Attributes.Integer({ value: 10 }),
        useProjection: new Attributes.Boolean({ value: true }),
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
                adaptiveRemesh({ mesh: data, configuration, pmp }),
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
