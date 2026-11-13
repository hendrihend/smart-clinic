// app/api/doctors+api.ts

export async function GET(request: Request) {
  // Simulasi data dari database
  const doctors = [
    { id: '1', name: 'dr. Budi Santoso', spec: 'Poli Umum' },
    { id: '2', name: 'dr. Anita Ratnasari', spec: 'Spesialis Penyakit Dalam' },
    { id: '3', name: 'dr. Sarah Amalia', spec: 'Poli Gigi' }
  ];

  const timeSlots = ['09:00', '10:30', '13:00', '15:30', '19:00'];

  return Response.json({
    status: 'success',
    doctors: doctors,
    time_slots: timeSlots
  });
}
