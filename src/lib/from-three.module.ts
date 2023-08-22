/**
 This module converts Three.BufferGeometries to PMP geometries.
 * @module
 */

import { Modules, Contracts } from '@youwol/vsf-core'
import { map } from 'rxjs/operators'
import { BufferGeometry } from 'three'
import { implementBufferGeometryTrait } from './utils'

export const configuration = {
    schema: {},
}

export const inputs = {
    input$: {
        description: 'The three geometry to convert.',
        contract: Contracts.contract<{
            geometry: BufferGeometry
        }>({
            description: 'Be able to retrieve Three.BufferGeometry',
            requirements: {
                geometry: Contracts.single({
                    when: Contracts.of({
                        description: 'BufferGeometry',
                        when: implementBufferGeometryTrait,
                    }),
                }),
            },
        }),
    },
}
export const outputs = (
    arg: Modules.OutputMapperArg<typeof configuration.schema, typeof inputs>,
) => ({
    output$: arg.inputs.input$.pipe(
        map(({ data, context }) => {
            /**
             * It may be the case that Buffer geometries do not have index, in this case:
             * for (let i = 0; i < positions.length / 3; i += 3) {
             *   indices.push(i, i+1, i+2);
             * }
             * This is the case for instance for 'icosahedron' geometrie.
             */
            return {
                data: {
                    index: data.geometry.index.array,
                    position: data.geometry.attributes.position.array,
                },
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
