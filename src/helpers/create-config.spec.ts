import expect from 'expect';

import { ReExport } from '../handlers/re-export';
import { createConfig } from './create-config';

describe('createConfig', () => {
    it('createConfig smoke', () => {
        expect(typeof createConfig).toEqual('function');
    });

    it('createConfig default', () => {
        const result = createConfig({});
        expect(result.combineScalarFilters).toEqual(false);
        expect(result.noAtomicOperations).toEqual(false);
        expect(result.$warnings).toEqual([]);
        expect(result.reExport).toEqual(ReExport.None);
    });

    it('filename with parent reference should be not valid', () => {
        const result = createConfig({
            outputFilePattern: '../../../{model}//{name}.{type}.ts/',
        });
        expect(result.outputFilePattern).toEqual('{model}/{name}.{type}.ts');
        expect(result.$warnings).toContainEqual(
            "Due to invalid filepath 'outputFilePattern' changed to '{model}/{name}.{type}.ts'",
        );
    });

    it('create config reExport', () => {
        const result = createConfig({ reExport: 'Single' });
        expect(result.reExport).toEqual(ReExport.Single);
    });

    it('createConfig useInputType 1', () => {
        const result = createConfig({
            useInputType_CreateInput_ALL: 'WhereInput',
            useInputType_CreateInput_author: 'WhereInput',
        });
        expect(result.useInputType).toEqual([
            {
                typeName: 'CreateInput',
                ALL: 'WhereInput',
                author: 'WhereInput',
            },
        ]);
    });

    it('create config decorate from array', () => {
        const result = createConfig({
            decorate_1_type: 'CreateOneUserArgs',
            decorate_1_field: 'data',
            decorate_1_name: 'ValidateNested',
            decorate_1_from: 'class-validator',
            decorate_1_arguments: '[]',
            decorate_2_type: 'CreateOneUserArgs',
            decorate_2_field: 'data',
            decorate_2_from: 'class-transformer',
            decorate_2_arguments: '[]',
            decorate_2_name: 'Type',
            decorate_2_namedImport: true,
        });
        expect(result.decorate).toBeInstanceOf(Array);
        expect(result.decorate).toHaveLength(2);
    });

    it('create config decorate from object', () => {
        const result = createConfig({
            decorate_a_type: 'CreateOneUserArgs',
            decorate_a_field: 'data',
            decorate_a_name: 'ValidateNested',
            decorate_a_from: 'class-validator',
            decorate_a_arguments: '[]',
            decorate_b_type: 'CreateOneUserArgs',
            decorate_b_field: 'data',
            decorate_b_from: 'class-transformer',
            decorate_b_arguments: '[]',
            decorate_b_name: 'Type',
            decorate_b_namedImport: true,
        });
        expect(result.decorate).toBeInstanceOf(Array);
        expect(result.decorate).toHaveLength(2);
    });
});
