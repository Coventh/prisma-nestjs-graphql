import assert from 'assert';
import expect from 'expect';
import { Project, QuoteKind, SourceFile } from 'ts-morph';

import { generateModel } from '../generate-model';
import { generatorOptions, getImportDeclarations, stringContains } from '../testing';
import { createConfig } from '../utils';

describe('generate models', () => {
    let sourceFile: SourceFile;
    let sourceText: string;
    type GetResultArgs = {
        schema: string;
        sourceFileText?: string;
        options?: string[];
    };
    async function getResult({ schema, sourceFileText, options }: GetResultArgs) {
        const project = new Project({
            useInMemoryFileSystem: true,
            manipulationSettings: { quoteKind: QuoteKind.Single },
        });
        const {
            generator,
            prismaClientDmmf: {
                datamodel: { models },
            },
        } = await generatorOptions(schema, options);
        const [model] = models;
        sourceFile = project.createSourceFile('_.ts', sourceFileText);
        const config = createConfig(generator.config);
        generateModel({
            model,
            sourceFile,
            config,
            projectFilePath: () => '_.ts',
        });
    }

    it('model', async () => {
        await getResult({
            schema: `model User {
                id String @id
            }`,
        });
        assert(imports.find((x) => x.name === 'ObjectType' && x.specifier === '@nestjs/graphql'));
        assert(imports.find((x) => x.name === 'ID' && x.specifier === '@nestjs/graphql'));
        assert(imports.find((x) => x.name === 'Field' && x.specifier === '@nestjs/graphql'));

        const struct = sourceFile.getClass('User')?.getProperty('id')?.getStructure();
        assert(struct);
        expect(struct.hasExclamationToken).toBeTruthy();
        const fieldArgument = struct.decorators?.[0].arguments?.[1] as string;
        expect(fieldArgument).toContain('nullable: false');
        expect(fieldArgument).toContain('description: undefined');
    });

    it('field nullable', async () => {
        await getResult({
            schema: `model User {
                id Int @id
                image String?
            }`,
        });
        const sourceText = sourceFile.getText();
        stringContains(
            '@Field(() => String, { nullable: true, description: undefined })',
            sourceText,
        );
        expect(sourceText).toContain('image?: string');
    });

    it('default value', async () => {
        await getResult({
            schema: `model User {
                count Int @id @default(1)
            }`,
        });
        const struct = sourceFile.getClass('User')?.getProperty('count')?.getStructure();
        const args = struct?.decorators?.[0].arguments;
        expect(args?.[1]).toContain('nullable: false');
        expect(args?.[1]).toContain('defaultValue: 1');
        expect(args?.[1]).toContain('description: undefined');
        expect(args?.[0]).toEqual('() => ID');
    });

    it('self relation', async () => {
        await getResult({
            schema: `model User {
                id  String  @id
                following   User[]   @relation("UserFollows", references: [id])
                followers   User[]   @relation("UserFollows", references: [id])
            }`,
        });
        expect(sourceFile.getText()).not.toContain('import { User }');
    });

    it('extend existing class', async () => {
        await getResult({
            schema: `model User {
                id String @id
            }`,
            sourceFileText: `@ObjectType() export class User {}`,
        });
        sourceText = sourceFile.getText();
        expect(sourceText.match(/export class User/g)?.length).toEqual(1);
    });

    it('object type description', async () => {
        await getResult({
            schema: `/// User really
            model User {
                id Int @id
            }`,
        });

        const decoratorArgument = sourceFile.getClass('User')?.getDecorators()[0].getStructure()
            ?.arguments?.[0] as string | undefined;
        assert(decoratorArgument);
        expect(decoratorArgument).toContain(`description: "User really"`);
    });

    it('property description', async () => {
        await getResult({
            schema: `model User {
                /// user id
                id Int @id
            }`,
        });
        const struct = sourceFile.getClass('User')?.getProperty('id')?.getStructure();
        const args = struct?.decorators?.[0].arguments;
        stringContains('nullable: false', args?.[1]);
        stringContains('description: "user id"', args?.[1]);
        assert.strictEqual(args?.[0], '() => ID');
    });

    it('update description to undefined', async () => {
        await getResult({
            schema: `model User {
                id String @id
            }`,
            sourceFileText: `@ObjectType({ description: 'user description' }) export class User {}`,
        });
        sourceText = sourceFile.getText();
        stringContains(`@ObjectType({ description: undefined }) export class User`, sourceText);
    });

    it('model import scalar types', async () => {
        await getResult({
            schema: `model User {
                id String @id
                count Int
                money Float
                born DateTime
                humanoid Boolean
                // data Json
            }`,
        });
        const imports = new Set(
            sourceFile
                .getImportDeclarations()
                .flatMap((x) => x.getNamedImports())
                .map((x) => x.getName()),
        );
        stringContains(
            '@Field(() => Boolean, { nullable: false, description: undefined }) humanoid!: boolean',
            sourceText,
        );
        stringContains(
            '@Field(() => Float, { nullable: false, description: undefined }) money!: number',
            sourceText,
        );
        stringContains(
            '@Field(() => Int, { nullable: false, description: undefined }) count!: number',
            sourceText,
        );
        stringContains(
            '@Field(() => String, { nullable: false, description: undefined }) born!: Date | string',
            sourceText,
        );
        assert(imports.has('String') === false, 'Imports should not includes String');
        assert(imports.has('Boolean') === false, 'Imports should not includes Boolean');
        assert(imports.has('User') === false, 'Imports should not includes User');
        assert(imports.has('Int') === true, 'Imports should includes Int');
        assert(imports.has('Float') === true, 'Imports should includes Float');
    });

    it('model scalar json', async () => {
        await getResult({
            schema: `model User {
                id String @id
                data Json
            }`,
        });
        sourceText = sourceFile.getText();
        const propertyDeclaration = sourceFile.getClass('User')?.getProperty('data');
        assert(propertyDeclaration);
        stringContains(`@Field(() => GraphQLJSON`, propertyDeclaration.getText());

        const importDeclaration = sourceFile.getImportDeclaration(
            (d) => d.getModuleSpecifier().getLiteralValue() === 'graphql-type-json',
        );
        assert(importDeclaration, 'import graphql-type-json should exists');
        const importSpecifier = importDeclaration
            .getNamedImports()
            .find((x) => x.getName() === 'GraphQLJSON');
        assert(importSpecifier, 'const GraphQLJSON should be imported');
    });

    it('with related', async () => {
        await getResult({
            schema: `
            model User {
              id        Int      @id
              posts     Post[]
            }
            model Post {
              id        Int      @id
            }`,
        });
        sourceText = sourceFile.getText();
        const property = sourceFile.getClass('User')?.getProperty('posts');
        assert(property, 'Property posts should exists');
        assert.strictEqual(property.getStructure().type, 'Array<Post>');
    });

    it('custom language type', async () => {
        await getResult({
            schema: `
            model User {
              id String @id
              d Decimal
            }
            `,
            options: [
                `languageTypes_Decimal_name = MyDec`,
                `languageTypes_Decimal_specifier = "decimal.js"`,
            ],
        });
        const property = sourceFile.getClasses()[0]?.getProperty('d')?.getStructure();
        expect(property?.type).toEqual('MyDec');
        const imports = getImportDeclarations(sourceFile);
        expect(imports).toContainEqual({
            name: 'MyDec',
            specifier: 'decimal.js',
        });
    });
});