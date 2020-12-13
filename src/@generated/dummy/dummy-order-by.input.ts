import { Field, InputType } from '@nestjs/graphql';

import { SortOrder } from '../prisma/sort-order.enum';

@InputType()
export class DummyOrderByInput {
  @Field(() => SortOrder, {
    nullable: true,
  })
  id?: SortOrder;

  @Field(() => SortOrder, {
    nullable: true,
  })
  bytes?: SortOrder;

  @Field(() => SortOrder, {
    nullable: true,
  })
  decimal?: SortOrder;

  @Field(() => SortOrder, {
    nullable: true,
  })
  bigInt?: SortOrder;

  @Field(() => SortOrder, {
    nullable: true,
  })
  json?: SortOrder;
}
