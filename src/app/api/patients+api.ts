// app/api/patients+api.ts

export async function GET(request: Request) {
  // Simulasi mengambil seluruh data pasien dari database
  const patients = [
    { id: '1', patientName: 'Hendri Gunawan', doctorName: 'dr. Anita Ratnasari', date: '16 Nov 2026', time: '09:00', status: 'Menunggu' },
    { id: '2', patientName: 'Budi Prakoso', doctorName: 'dr. Sarah Amalia', date: '16 Nov 2026', time: '10:30', status: 'Selesai' },
    { id: '3', patientName: 'Siti Aminah', doctorName: 'dr. Budi Santoso', date: '16 Nov 2026', time: '13:00', status: 'Menunggu' },
  ];

  return Response.json({
    status: 'success',
    data: patients
  });
}