import { Shape, Inputs, ValidationResult } from '../types';

// Helper untuk memeriksa kesamaan dengan toleransi kecil (untuk float point arithmetic)
const isAlmostEqual = (a: number, b: number, epsilon = 0.01) => Math.abs(a - b) < epsilon;

export const validateShape = async (shape: Shape, inputs: Inputs): Promise<ValidationResult> => {
  // Simulasi delay seolah-olah sedang "berpikir" agar UX lebih natural (opsional)
  await new Promise(resolve => setTimeout(resolve, 600));

  const numInputs: Record<string, number> = {};
  
  // Konversi input ke number
  for (const key in inputs) {
    const val = parseFloat(inputs[key]);
    if (isNaN(val) || val <= 0) {
      return {
        isValid: false,
        explanation: "Semua input harus berupa angka positif."
      };
    }
    numInputs[key] = val;
  }

  let isValid = false;
  let explanation = "";
  let keliling = 0;

  switch (shape) {
    case Shape.Square: {
      const { sisi1, sisi2, sisi3, sisi4 } = numInputs;
      // Validasi: Semua sisi harus sama
      isValid = isAlmostEqual(sisi1, sisi2) && isAlmostEqual(sisi2, sisi3) && isAlmostEqual(sisi3, sisi4);
      
      if (isValid) {
        keliling = sisi1 * 4;
        explanation = "Mantap, Anda dapat proyek! Semua sisi persegi sama panjang.";
      } else {
        explanation = "Ukuran tidak valid. Untuk membuat persegi yang benar, keempat sisinya harus memiliki panjang yang sama persis.";
      }
      break;
    }

    case Shape.Rectangle: {
      const { sisi1, sisi2, sisi3, sisi4 } = numInputs;
      // Validasi: Sisi berhadapan harus sama (1=3, 2=4)
      isValid = isAlmostEqual(sisi1, sisi3) && isAlmostEqual(sisi2, sisi4);
      
      if (isValid) {
        keliling = 2 * (sisi1 + sisi2);
        explanation = "Mantap, Anda dapat proyek! Sisi-sisi yang berhadapan sama panjang, membentuk persegi panjang yang sempurna.";
      } else {
        explanation = "Ukuran tidak valid. Pada persegi panjang, sisi atas harus sama dengan sisi bawah, dan sisi kiri harus sama dengan sisi kanan.";
      }
      break;
    }

    case Shape.RightTriangle: {
      const { a, b, c } = numInputs; // a=alas, b=tinggi, c=miring
      
      // Validasi: Pythagoras a² + b² = c²
      // Kita urutkan dulu untuk memastikan mana sisi terpanjang jika user salah input field
      const sides = [a, b, c].sort((x, y) => x - y);
      const [short1, short2, long] = sides;

      // Cek apakah input sesuai field yang dimaksud (c harus miring/terpanjang)
      if (c !== long) {
        return {
          isValid: false,
          explanation: "Ukuran tidak valid. Sisi miring (C) haruslah sisi yang paling panjang di antara ketiganya."
        };
      }

      isValid = isAlmostEqual(short1 ** 2 + short2 ** 2, long ** 2);

      if (isValid) {
        keliling = a + b + c;
        explanation = "Mantap, Anda dapat proyek! Ukuran ini memenuhi teorema Pythagoras, membentuk sudut siku-siku yang presisi.";
      } else {
        explanation = `Ukuran tidak valid. ${a}² + ${b}² (${(a**2 + b**2).toFixed(2)}) tidak sama dengan ${c}² (${(c**2).toFixed(2)}). Sudut siku-siku tidak akan terbentuk.`;
      }
      break;
    }

    case Shape.RightTrapezoid: {
      const { atas, bawah, tinggi, miring } = numInputs;
      
      // Validasi Trapesium Siku-Siku
      // Logika: Kita tarik garis lurus dari sisi atas ke bawah, membentuk segitiga siku-siku kecil.
      // Alas segitiga kecil itu adalah selisih (bawah - atas).
      // Maka: tinggi² + (bawah - atas)² = miring²
      
      if (bawah <= atas) {
         return {
          isValid: false,
          explanation: "Ukuran tidak valid. Untuk trapesium siku-siku pada umumnya, sisi bawah harus lebih panjang dari sisi atas."
        };
      }

      const alasSegitigaKecil = bawah - atas;
      const pythagorasCheck = (tinggi ** 2) + (alasSegitigaKecil ** 2);
      
      isValid = isAlmostEqual(pythagorasCheck, miring ** 2);

      if (isValid) {
        keliling = atas + bawah + tinggi + miring;
        explanation = "Mantap, Anda dapat proyek! Hubungan antara tinggi, selisih sisi sejajar, dan sisi miring sudah matematis dan benar.";
      } else {
        explanation = `Ukuran tidak valid. Sisi miring tidak sesuai dengan perhitungan geometri. Seharusnya sisi miring adalah akar dari (${tinggi}² + (${bawah}-${atas})²), yaitu sekitar ${Math.sqrt(pythagorasCheck).toFixed(2)}.`;
      }
      break;
    }
    
    default:
      return { isValid: false, explanation: "Bangun ruang tidak dikenali." };
  }

  return {
    isValid,
    explanation,
    keliling: isValid ? Number(keliling.toFixed(2)) : 0
  };
};