import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { StringFieldUpdateOperationsInput } from '../prisma/string-field-update-operations.input';
import { ArticleUncheckedUpdateManyWithoutTagsNestedInput } from '../article/article-unchecked-update-many-without-tags-nested.input';

@InputType()
export class TagUncheckedUpdateInput {
  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  id?: StringFieldUpdateOperationsInput;

  @Field(() => StringFieldUpdateOperationsInput, { nullable: true })
  name?: StringFieldUpdateOperationsInput;

  @Field(() => ArticleUncheckedUpdateManyWithoutTagsNestedInput, { nullable: true })
  articles?: ArticleUncheckedUpdateManyWithoutTagsNestedInput;
}
