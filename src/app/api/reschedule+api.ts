// app/api/reschedule+api.ts

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, date, time } = body;
    
    // Di sini query UPDATE database dieksekusi
    // Contoh: UPDATE patients SET date = date, time = time WHERE id = id;
    console.log(`Jadwal pasien ID ${id} diubah menjadi: ${date} jam ${time}`);

    return Response.json({
      status: 'success',
      message: 'Jadwal pasien berhasil diperbarui'
    });

  } catch (error) {
    return Response.json(
      { status: 'error', message: 'Gagal memproses perubahan jadwal' }, 
      { status: 500 }
    );
  }
}