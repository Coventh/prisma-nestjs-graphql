import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { StringFieldUpdateOperationsInput } from '../prisma/string-field-update-operations.input';
import { NullableStringFieldUpdateOperationsInput } from '../prisma/nullable-string-field-update-operations.input';
import { UserUpdateManyWithoutFollowingNestedInput } from './user-update-many-without-following-nested.input';
import { Type } from 'class-transformer';
import { ArticleUpdateManyWithoutFavoritedByNestedInput } from '../article/article-update-many-without-favorited-by-nested.input';
import { ArticleUpdateManyWithoutAuthorNestedInput } from '../article/article-update-many-without-author-nested.input';
import { CommentUpdateManyWithoutAuthorNestedInput } from '../comment/comment-update-many-without-author-nested.input';
import { NullableIntFieldUpdateOperationsInput } from '../prisma/nullable-int-field-update-operations.input';
import { NullableFloatFieldUpdateOperationsInput } from '../prisma/nullable-float-field-update-operations.input';
import { NullableDecimalFieldUpdateOperationsInput } from '../prisma/nullable-decimal-field-update-operations.input';
import { NullableEnumRoleFieldUpdateOperationsInput } from '../prisma/nullable-enum-role-field-update-operations.input';
import { ProfileUpdateOneWithoutUserNestedInput } from '../profile/profile-update-one-without-user-nested.input';

@InputType()
export class UserUpdateWithoutFollowingInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: StringFieldUpdateOperationsInput;

  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  email?: StringFieldUpdateOperationsInput;

  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  name?: StringFieldUpdateOperationsInput;

  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  password?: StringFieldUpdateOperationsInput;

  @Field(() => NullableStringFieldUpdateOperationsInput, { nullable: true })
  bio?: NullableStringFieldUpdateOperationsInput;

  @Field(() => NullableStringFieldUpdateOperationsInput, { nullable: true })
  image?: NullableStringFieldUpdateOperationsInput;

  @Field(() => UserUpdateManyWithoutFollowingNestedInput, { nullable: true })
  @Type(() => UserUpdateManyWithoutFollowingNestedInput)
  followers?: UserUpdateManyWithoutFollowingNestedInput;

  @Field(() => ArticleUpdateManyWithoutFavoritedByNestedInput, { nullable: true })
  favoriteArticles?: ArticleUpdateManyWithoutFavoritedByNestedInput;

  @Field(() => ArticleUpdateManyWithoutAuthorNestedInput, { nullable: true })
  articles?: ArticleUpdateManyWithoutAuthorNestedInput;

  @Field(() => CommentUpdateManyWithoutAuthorNestedInput, { nullable: true })
  comments?: CommentUpdateManyWithoutAuthorNestedInput;

  @Field(() => NullableIntFieldUpdateOperationsInput, { nullable: true })
  countComments?: NullableIntFieldUpdateOperationsInput;

  @Field(() => NullableFloatFieldUpdateOperationsInput, { nullable: true })
  rating?: NullableFloatFieldUpdateOperationsInput;

  @Field(() => NullableDecimalFieldUpdateOperationsInput, { nullable: true })
  @Type(() => NullableDecimalFieldUpdateOperationsInput)
  money?: NullableDecimalFieldUpdateOperationsInput;

  @Field(() => NullableEnumRoleFieldUpdateOperationsInput, { nullable: true })
  role?: NullableEnumRoleFieldUpdateOperationsInput;

  @Field(() => ProfileUpdateOneWithoutUserNestedInput, { nullable: true })
  profile?: ProfileUpdateOneWithoutUserNestedInput;
}
