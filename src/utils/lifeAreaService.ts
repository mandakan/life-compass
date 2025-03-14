import predefinedAreas from '../data/predefinedLifeAreas.json';
import { LifeArea } from '../components/LifeAreaCard';

export function getPredefinedLifeAreas(): LifeArea[] {
  return predefinedAreas;
}
```