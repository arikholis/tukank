import React from 'react';

export enum Shape {
  Square = 'persegi',
  Rectangle = 'persegiPanjang',
  RightTriangle = 'segitigaSikuSiku',
  RightTrapezoid = 'trapesiumSikuSiku',
}

export interface ShapeConfig {
  label: string;
  // FIX: Added React import to resolve namespace error
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  inputs: { name: string; label: string }[];
}

export type Inputs = {
  [key: string]: string;
};

export interface ValidationResult {
  isValid: boolean;
  explanation: string;
  keliling?: number;
}