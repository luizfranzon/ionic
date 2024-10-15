export class Place {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public imageUrl: string,
    public price: number,
    public dateFrom: string,
    public dateTo: string,
    public userId: string
  ) {}
}
