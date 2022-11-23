export default class PagigateDto<T = any> {
  pageSize: number;
  pageIndex: number;
  totalCount: number | BigInt;
  data: T;

  constructor(data: T, totalCount: number | BigInt, pageSize: number, pageIndex: number) {
    this.data = data;
    this.totalCount = totalCount;
    this.pageSize = pageSize;
    this.pageIndex = pageIndex;
  }
}
