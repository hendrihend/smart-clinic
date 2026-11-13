export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;
    
    // Di sini Anda biasanya menjalankan query UPDATE MySQL.
    // Contoh: UPDATE patients SET status = 'Selesai' WHERE id = id;
    console.log(`Berhasil mengubah status pasien dengan ID ${id} menjadi Selesai`);

    return Response.json({
      status: 'success',
      message: 'Status antrian berhasil diperbarui menjadi selesai'
    });

  } catch (error) {
    return Response.json(
      { status: 'error', message: 'Gagal memproses perubahan status' }, 
      { status: 500 }
    );
  }
}