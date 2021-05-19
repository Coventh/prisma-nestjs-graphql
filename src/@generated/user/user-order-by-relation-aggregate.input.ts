import { Field, InputType } from '@nestjs/graphql';

import { SortOrder } from '../prisma/sort-order.enum';

@InputType()
export class UserOrderByRelationAggregateInput {
    @Field(() => SortOrder, { nullable: true })
    count?: SortOrder;
    @Field(() => SortOrder, { nullable: true })
    _count?: SortOrder;
}
