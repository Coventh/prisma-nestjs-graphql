import { ClassDeclaration, SourceFile } from 'ts-morph';

import { DecoratorPropertyType, generateClass, generateClassProperty } from '../generate-class';
import { generateDecorator } from '../generate-decorator';
import { generateGraphqlImport } from '../generate-graphql-import';
import { generateProjectImport } from '../generate-project-import';
import { PrismaDMMF } from '../types';
import { toGraphqlImportType, toPropertyType } from '../utils';
import { getMatchingInputType } from './get-matching-input-type';

type GenerateInputArgs = {
    inputType: PrismaDMMF.InputType;
    sourceFile: SourceFile;
    model: PrismaDMMF.Model | undefined;
    projectFilePath(data: { name: string; type: string }): string;
    decorator: DecoratorPropertyType;
};

export function generateInput(args: GenerateInputArgs) {
    const { inputType, sourceFile, projectFilePath, decorator } = args;
    const className = inputType.name;
    const classDeclaration = generateClass({
        sourceFile,
        decorator,
        name: className,
    });
    generateGraphqlImport({ name: 'Field', sourceFile, moduleSpecifier: '@nestjs/graphql' });
    for (const field of inputType.fields) {
        const inputType = getMatchingInputType(field.inputTypes);
        const propertyType = getPropertyType(field.inputTypes);
        // Additional import all objects
        const inputTypes = field.inputTypes.filter(
            (x) => ['object', 'enum'].includes(x.kind) && x.type !== className,
        );
        for (const inputType of inputTypes) {
            generateProjectImport({
                name: String(inputType.type),
                type: inputType.kind === 'object' ? 'input' : inputType.kind,
                sourceFile,
                projectFilePath,
            });
        }
        generateInputProperty({
            inputType,
            propertyType,
            classDeclaration,
            sourceFile,
            projectFilePath,
            className,
            name: field.name,
        });
    }
}

type GenerateInputPropertyArgs = {
    name: string;
    inputType: PrismaDMMF.SchemaArgInputType;
    sourceFile: SourceFile;
    projectFilePath(data: { name: string; type: string }): string;
    className: string;
    classDeclaration: ClassDeclaration;
    propertyType: string;
};

function generateInputProperty(args: GenerateInputPropertyArgs) {
    const { inputType, sourceFile, className, classDeclaration, projectFilePath } = args;
    const propertyDeclaration = generateClassProperty({
        name: args.name,
        type: args.propertyType,
        classDeclaration,
        isReadOnly: false,
        isRequired: false,
    });
    let fieldType = getFieldType(inputType);
    if (inputType.kind === 'scalar') {
        const importType = toGraphqlImportType({
            kind: inputType.kind,
            type: fieldType,
            isId: false,
        });
        // Override return field type value
        fieldType = importType.name;
        generateGraphqlImport({
            sourceFile,
            ...importType,
        });
    } else if (inputType.kind === 'object' && inputType.type !== className) {
        generateProjectImport({
            name: fieldType,
            type: 'input',
            sourceFile,
            projectFilePath,
        });
    } else if (inputType.kind === 'enum') {
        generateProjectImport({
            name: fieldType,
            type: 'enum',
            sourceFile,
            projectFilePath,
        });
    }
    generateDecorator({
        propertyDeclaration,
        fieldType: inputType.isList ? `[${fieldType}]` : fieldType,
        nullable: true,
    });
}

function getPropertyType(inputTypes: PrismaDMMF.SchemaArgInputType[]): string {
    const types: string[] = inputTypes.map((inputType) => {
        return toPropertyType({ ...inputType, type: String(inputType.type) });
    });
    types.sort((a, b) => {
        if (b === 'null') {
            return -2;
        }
        return 0;
    });
    return types.join(' | ');
}

function getFieldType(inputType: PrismaDMMF.SchemaArgInputType) {
    return String(inputType.type);
}
