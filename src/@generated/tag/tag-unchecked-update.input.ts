import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class TagUncheckedUpdateInput {
    @Field(() => String, {
        nullable: true,
    })
    id?: string;

    @Field(() => String, {
        nullable: true,
    })
    name?: string;
}
