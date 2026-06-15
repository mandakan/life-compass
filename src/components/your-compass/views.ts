export type ViewId = 'map' | 'list' | 'today' | 'week';

export interface ViewDef {
  id: ViewId;
  labelKey: string;
  subKey: string;
}

export const VIEWS: ViewDef[] = [
  {
    id: 'map',
    labelKey: 'your_compass.views.map.label',
    subKey: 'your_compass.views.map.sub',
  },
  {
    id: 'list',
    labelKey: 'your_compass.views.list.label',
    subKey: 'your_compass.views.list.sub',
  },
  {
    id: 'today',
    labelKey: 'your_compass.views.today.label',
    subKey: 'your_compass.views.today.sub',
  },
  {
    id: 'week',
    labelKey: 'your_compass.views.week.label',
    subKey: 'your_compass.views.week.sub',
  },
];
