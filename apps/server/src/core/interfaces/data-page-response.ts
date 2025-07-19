import { ObjectLiteral } from 'typeorm';
import { PAGE_UNLIMITED } from '../../common/constants';

export class DataPageResponse<T extends ObjectLiteral> {
  public data: T[];
  public hasNextPage: boolean;

  constructor(data: T[], pageLimit: number) {
    this.data = data;
    this.hasNextPage = data.length > pageLimit && pageLimit !== PAGE_UNLIMITED;
    if (this.hasNextPage) {
      this.data.splice(-1);
    }
  }
}
