// app/api/history+api.ts

export async function GET(request: Request) {
  // Simulasi mengambil data riwayat dari database MySQL
  const history = [
    { id: '1', doctorName: 'dr. Anita Ratnasari', specialist: 'Spesialis Penyakit Dalam', date: 'Senin, 16 Nov 2026', time: '09:00 WIB', status: 'Menunggu' },
    { id: '2', doctorName: 'dr. Budi Santoso', specialist: 'Poli Umum', date: 'Rabu, 4 Nov 2026', time: '10:30 WIB', status: 'Selesai' },
    { id: '3', doctorName: 'dr. Sarah Amalia', specialist: 'Poli Gigi', date: 'Kamis, 15 Okt 2026', time: '13:00 WIB', status: 'Selesai' },
  ];

  return Response.json({
    status: 'success',
    data: history
  });
}