export interface History {
    id: number ;
    stockId: number ;
    history?: Record<string, number> ;
    minPrice: number ;
    maxPrice: number ;
    name: string;
  }