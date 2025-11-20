import { GoogleGenAI, Type } from "@google/genai";
import { Shape, Inputs, ValidationResult } from '../types';
import { SHAPE_CONFIGS } from '../constants';

// Schema response yang diharapkan
const responseSchema = {
  type: Type.OBJECT,
  properties: {
    isValid: {
      type: Type.BOOLEAN,
      description: 'Apakah ukurannya membentuk bangun yang valid.'
    },
    explanation: {
      type: Type.STRING,
      description: 'Penjelasan singkat tentang hasil validasi dalam Bahasa Indonesia.'
    },
    keliling: {
      type: Type.NUMBER,
      description: 'Keliling dari bangun ruang tersebut jika ukurannya valid. Jika tidak valid, nilainya harus 0.'
    }
  },
  required: ['isValid', 'explanation', 'keliling']
};

// Prompt Template yang digunakan baik di client (dev) maupun server (prod)
export const generatePrompt = (shapeLabel: string, numericInputs: Record<string, number>) => `
Anda adalah seorang ahli geometri. Seorang pengguna telah memberikan ukuran untuk bangun ruang tertentu.
Tugas Anda adalah memvalidasi apakah ukuran-ukuran ini dapat membentuk bangun ruang yang ditentukan DAN menghitung kelilingnya jika valid.

Bangun Ruang: ${shapeLabel}
Ukuran: ${JSON.stringify(numericInputs)}

Jawab dalam format JSON sesuai dengan skema yang diberikan.
- Jika ukurannya valid, 'explanation' HARUS berisi teks "Mantap, Anda dapat proyek!".
- Jika ukurannya tidak valid, 'explanation' harus berisi penjelasan singkat mengapa ukuran tersebut tidak valid dalam Bahasa Indonesia.

Berikut adalah aturan validasi:
- Untuk Persegi, verifikasi bahwa semua empat sisi (sisi1, sisi2, sisi3, sisi4) memiliki panjang yang sama dan positif. Jika valid, kelilingnya adalah 4 * sisi1.
- Untuk Persegi Panjang, verifikasi bahwa sisi yang berhadapan memiliki panjang yang sama (sisi1 sama dengan sisi3, dan sisi2 sama dengan sisi4) dan semua sisi positif. Jika valid, kelilingnya adalah 2 * (sisi1 + sisi2).
- Untuk Segitiga Siku-Siku, verifikasi teorema Pythagoras (a² + b² = c², dimana c adalah sisi terpanjang/miring). Jika valid, kelilingnya adalah a + b + c.
- Untuk Trapesium Siku-Siku, verifikasi hubungan pythagoras antara tinggi, selisih sisi sejajar, dan sisi miring (tinggi² + (bawah - atas)² = miring²). Pastikan juga sisi bawah lebih panjang dari sisi atas dan semua ukuran positif. Jika valid, kelilingnya adalah atas + bawah + tinggi + miring.
Pastikan sisi miring (hypotenuse) selalu sisi terpanjang untuk segitiga siku-siku.

Jika ukurannya TIDAK VALID, nilai 'keliling' harus 0.
`;

export const validateShape = async (shape: Shape, inputs: Inputs): Promise<ValidationResult> => {
  const shapeLabel = SHAPE_CONFIGS[shape].label;
  const numericInputs = Object.fromEntries(
    Object.entries(inputs).map(([key, value]) => [key, Number(value)])
  );

  // MODE PRODUCTION: Gunakan Netlify Function (Backend) untuk menyembunyikan API Key
  if (!process.env.API_KEY) {
    try {
      const response = await fetch('/.netlify/functions/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          shape, 
          inputs: numericInputs,
          shapeLabel // Kirim label agar backend tahu konteksnya
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Server Error: ${errorData}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error calling Netlify Function:", error);
      throw new Error("Gagal memvalidasi lewat server. Pastikan Anda terhubung ke internet.");
    }
  }

  // MODE DEVELOPMENT: Gunakan Client-side SDK (membutuhkan API Key di .env lokal)
  // Ini memudahkan testing di VS Code tanpa harus menjalankan 'netlify dev'
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = generatePrompt(shapeLabel, numericInputs);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("API mengembalikan respons kosong.");
    }
    
    const cleanedText = text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
    const parsedResult = JSON.parse(cleanedText) as ValidationResult;
    return parsedResult;

  } catch (error) {
    console.error("Error calling Gemini API (Local):", error);
    throw new Error("Gagal berkomunikasi dengan layanan AI (Local). Periksa API Key Anda.");
  }
};