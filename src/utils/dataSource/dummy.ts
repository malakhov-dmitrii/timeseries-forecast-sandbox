export interface MockData {
  Period: string;
  Sales: number;
  predicted?: number;
}

export const mockData1: MockData[] = [
  { Period: "2018-Jan", Sales: 442.4 },
  { Period: "2018-Feb", Sales: 550.5 },
  { Period: "2018-Mar", Sales: 556.7 },
  { Period: "2018-Apr", Sales: 545.4 },
  { Period: "2018-May", Sales: 644.5 },
  { Period: "2018-Jun", Sales: 564.4 },
  { Period: "2018-Jul", Sales: 776.4 },
  { Period: "2018-Aug", Sales: 676 },
  { Period: "2018-Sep", Sales: 679.7 },
  { Period: "2018-Oct", Sales: 862.7 },
  { Period: "2018-Nov", Sales: 655.2 },
  { Period: "2018-Dec", Sales: 1001.6 },
  { Period: "2019-Jan", Sales: 632.4 },
  { Period: "2019-Feb", Sales: 960.5 },
  { Period: "2019-Mar", Sales: 796.7 },
  { Period: "2019-Apr", Sales: 915.4 },
  { Period: "2019-May", Sales: 844.5 },
  { Period: "2019-Jun", Sales: 474.4 },
  { Period: "2019-Jul", Sales: 446.4 },
  { Period: "2019-Aug", Sales: 366 },
  { Period: "2019-Sep", Sales: 439.7 },
  { Period: "2019-Oct", Sales: 472.7 },
  { Period: "2019-Nov", Sales: 635.2 },
  { Period: "2019-Dec", Sales: 1091.6 },
  { Period: "2020-Jan", Sales: 632.4 },
  { Period: "2020-Feb", Sales: 460.5 },
  { Period: "2020-Mar", Sales: 396.7 },
  { Period: "2020-Apr", Sales: 515.4 },
  { Period: "2020-May", Sales: 644.5 },
  { Period: "2020-Jun", Sales: 574.4 },
];

export const mockData2: MockData[] = [
  { Period: "2019-Jan", Sales: 632.4 },
  { Period: "2019-Feb", Sales: 960.5 },
  { Period: "2019-Mar", Sales: 796.7 },
  { Period: "2019-Apr", Sales: 915.4 },
  { Period: "2019-May", Sales: 844.5 },
  { Period: "2019-Jun", Sales: 474.4 },
  { Period: "2019-Jul", Sales: 446.4 },
  { Period: "2019-Aug", Sales: 366 },
  { Period: "2019-Sep", Sales: 439.7 },
  { Period: "2019-Oct", Sales: 472.7 },
  { Period: "2019-Nov", Sales: 635.2 },
  { Period: "2019-Dec", Sales: 1091.6 },
  { Period: "2020-Jan", Sales: 632.4 },
  { Period: "2020-Feb", Sales: 460.5 },
  { Period: "2020-Mar", Sales: 396.7 },
  { Period: "2020-Apr", Sales: 515.4 },
  { Period: "2020-May", Sales: 644.5 },
  { Period: "2020-Jun", Sales: 574.4 },
];

export const mockData3 = [
  { Period: "2020-Jan", Sales: 632.4 },
  { Period: "2020-Feb", Sales: 460.5 },
  { Period: "2020-Mar", Sales: 396.7 },
  { Period: "2020-Apr", Sales: 515.4 },
  { Period: "2020-May", Sales: 644.5 },
  { Period: "2020-Jun", Sales: 574.4 },
];

export const growingGeneral: {
  p: number;
  sales: number | null;
  predicted?: number | null;
}[] = [
  { p: 1, sales: 500 },
  { p: 2, sales: 561 },
  { p: 3, sales: 612 },
  { p: 4, sales: 663 },
  { p: 5, sales: 728 },
  { p: 6, sales: 810 },
  { p: 7, sales: 880 },
  { p: 8, sales: 850 },
  { p: 9, sales: 918 },
  { p: 10, sales: 1026 },
  { p: 11, sales: 1060 },
  { p: 12, sales: 1155 },
  { p: 1, sales: 530 },
  { p: 2, sales: 572 },
  { p: 3, sales: 660 },
  { p: 4, sales: 663 },
  { p: 5, sales: 756 },
  { p: 6, sales: 795 },
  { p: 7, sales: 816 },
  { p: 8, sales: 935 },
  { p: 9, sales: 954 },
  { p: 10, sales: 1007 },
  { p: 11, sales: 1020 },
  { p: 12, sales: 1071 },
  { p: 1, sales: 530 },
  { p: 2, sales: 561 },
  { p: 3, sales: 648 },
  { p: 4, sales: 689 },
  { p: 5, sales: 700 },
  { p: 6, sales: 795 },
];
