// app/api/booking+api.ts

export async function POST(request: Request) {
  try {
    // Menerima data yang dikirim dari aplikasi UI
    const body = await request.json();
    
    // Nanti, di sinilah tempat Anda melakukan query INSERT ke tabel MySQL
    // Contoh melihat data yang masuk di terminal Node.js Anda:
    console.log("Menerima Data Booking Baru:", body);

    // Simulasi sukses menyimpan ke database
    return Response.json({
      status: 'success',
      message: 'Booking antrian berhasil dikonfirmasi dan disimpan.'
    });

  } catch (error) {
    return Response.json(
      { status: 'error', message: 'Gagal memproses data booking' }, 
      { status: 500 }
    );
  }
}