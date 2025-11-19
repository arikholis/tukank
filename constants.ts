
import { Shape, ShapeConfig } from './types';
import SquareIcon from './components/icons/SquareIcon';
import RectangleIcon from './components/icons/RectangleIcon';
import TriangleIcon from './components/icons/TriangleIcon';
import TrapezoidIcon from './components/icons/TrapezoidIcon';

export const SHAPE_CONFIGS: Record<Shape, ShapeConfig> = {
  [Shape.Square]: {
    label: 'Persegi',
    icon: SquareIcon,
    inputs: [
      { name: 'sisi1', label: 'Sisi 1' },
      { name: 'sisi2', label: 'Sisi 2' },
      { name: 'sisi3', label: 'Sisi 3' },
      { name: 'sisi4', label: 'Sisi 4' },
    ],
  },
  [Shape.Rectangle]: {
    label: 'Persegi Panjang',
    icon: RectangleIcon,
    inputs: [
      { name: 'sisi1', label: 'Sisi 1' },
      { name: 'sisi2', label: 'Sisi 2' },
      { name: 'sisi3', label: 'Sisi 3' },
      { name: 'sisi4', label: 'Sisi 4' },
    ],
  },
  [Shape.RightTriangle]: {
    label: 'Segitiga Siku-Siku',
    icon: TriangleIcon,
    inputs: [
      { name: 'a', label: 'Sisi A (alas)' },
      { name: 'b', label: 'Sisi B (tinggi)' },
      { name: 'c', label: 'Sisi C (miring)' },
    ],
  },
  [Shape.RightTrapezoid]: {
    label: 'Trapesium Siku-Siku',
    icon: TrapezoidIcon,
    inputs: [
      { name: 'atas', label: 'Sisi Atas' },
      { name: 'bawah', label: 'Sisi Bawah' },
      { name: 'tinggi', label: 'Tinggi' },
      { name: 'miring', label: 'Sisi Miring' },
    ],
  },
};
