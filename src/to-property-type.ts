const patterns = new Map([
    [{ type: (type: string) => type === 'String', kind: 'scalar' }, () => 'string'],
    [{ type: (type: string) => type === 'DateTime', kind: 'scalar' }, () => 'string'],
    [{ type: (type: string) => type === 'Float', kind: 'scalar' }, () => 'number'],
    [{ type: (type: string) => type === 'Int', kind: 'scalar' }, () => 'number'],
    [{ type: (type: string) => type === 'Boolean', kind: 'scalar' }, () => 'boolean'],
    [{ type: (type: string) => type === 'Json', kind: 'scalar' }, () => 'object'],
    // [
    //     {
    //         type: (type: string) => ['StringFilter', 'NullableStringFilter'].includes(type),
    //         kind: 'object',
    //     },
    //     (field: { type: string }) => `string | ${field.type}`,
    // ],
    // [
    //     {
    //         type: (type: string) => ['IntFilter', 'NullableIntFilter'].includes(type),
    //         kind: 'object',
    //     },
    //     (field: { type: string }) => `number | ${field.type}`,
    // ],
    // [
    //     {
    //         type: (type: string) => ['BooleanFilter', 'NullableBooleanFilter'].includes(type),
    //         kind: 'object',
    //     },
    //     (field: { type: string }) => `boolean | ${field.type}`,
    // ],
    [{ type: () => true, kind: 'object' }, (field: { type: string }) => field.type],
    [{ type: () => true, kind: 'enum' }, (field: { type: string }) => field.type],
    [{ type: () => true, kind: 'scalar' }, (field: { type: string }) => field.type],
]);

/**
 * Returns typescript property type.
 */
export function toPropertyType(field: { type: string; kind: string }): string {
    for (const [key, result] of patterns.entries()) {
        if (key.kind === field.kind && key.type(field.type)) {
            return result(field);
        }
    }
    // console.log('field', field);
    throw new TypeError(`Cannot get type from ${field.kind}/${field.type}`);
}
