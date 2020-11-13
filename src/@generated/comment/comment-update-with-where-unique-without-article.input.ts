import { Field, InputType } from '@nestjs/graphql';

import { CommentUpdateWithoutArticleInput } from './comment-update-without-article.input';
import { CommentWhereUniqueInput } from './comment-where-unique.input';

@InputType()
export class CommentUpdateWithWhereUniqueWithoutArticleInput {
    @Field(() => CommentWhereUniqueInput, {
        nullable: true,
        description: undefined,
    })
    where?: CommentWhereUniqueInput;

    @Field(() => CommentUpdateWithoutArticleInput, {
        nullable: true,
        description: undefined,
    })
    data?: CommentUpdateWithoutArticleInput;
}
