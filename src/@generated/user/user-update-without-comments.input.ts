import { Field, InputType } from '@nestjs/graphql';

import { ArticleUpdateManyWithoutAuthorInput } from '../article/article-update-many-without-author.input';
import { ArticleUpdateManyWithoutFavoritedByInput } from '../article/article-update-many-without-favorited-by.input';
import { NullableEnumRoleFieldUpdateOperationsInput } from '../prisma/nullable-enum-role-field-update-operations.input';
import { NullableFloatFieldUpdateOperationsInput } from '../prisma/nullable-float-field-update-operations.input';
import { NullableIntFieldUpdateOperationsInput } from '../prisma/nullable-int-field-update-operations.input';
import { NullableStringFieldUpdateOperationsInput } from '../prisma/nullable-string-field-update-operations.input';
import { StringFieldUpdateOperationsInput } from '../prisma/string-field-update-operations.input';
import { UserUpdateManyWithoutFollowersInput } from './user-update-many-without-followers.input';
import { UserUpdateManyWithoutFollowingInput } from './user-update-many-without-following.input';

@InputType()
export class UserUpdateWithoutCommentsInput {
    @Field(() => StringFieldUpdateOperationsInput, {
        nullable: true,
    })
    id?: StringFieldUpdateOperationsInput;

    @Field(() => StringFieldUpdateOperationsInput, {
        nullable: true,
    })
    email?: StringFieldUpdateOperationsInput;

    @Field(() => StringFieldUpdateOperationsInput, {
        nullable: true,
    })
    name?: StringFieldUpdateOperationsInput;

    @Field(() => StringFieldUpdateOperationsInput, {
        nullable: true,
    })
    password?: StringFieldUpdateOperationsInput;

    @Field(() => NullableStringFieldUpdateOperationsInput, {
        nullable: true,
    })
    bio?: NullableStringFieldUpdateOperationsInput;

    @Field(() => NullableStringFieldUpdateOperationsInput, {
        nullable: true,
    })
    image?: NullableStringFieldUpdateOperationsInput;

    @Field(() => NullableIntFieldUpdateOperationsInput, {
        nullable: true,
    })
    countComments?: NullableIntFieldUpdateOperationsInput;

    @Field(() => NullableFloatFieldUpdateOperationsInput, {
        nullable: true,
    })
    rating?: NullableFloatFieldUpdateOperationsInput;

    @Field(() => NullableEnumRoleFieldUpdateOperationsInput, {
        nullable: true,
    })
    role?: NullableEnumRoleFieldUpdateOperationsInput;

    @Field(() => UserUpdateManyWithoutFollowersInput, {
        nullable: true,
    })
    following?: UserUpdateManyWithoutFollowersInput;

    @Field(() => UserUpdateManyWithoutFollowingInput, {
        nullable: true,
    })
    followers?: UserUpdateManyWithoutFollowingInput;

    @Field(() => ArticleUpdateManyWithoutFavoritedByInput, {
        nullable: true,
    })
    favoriteArticles?: ArticleUpdateManyWithoutFavoritedByInput;

    @Field(() => ArticleUpdateManyWithoutAuthorInput, {
        nullable: true,
    })
    articles?: ArticleUpdateManyWithoutAuthorInput;
}
