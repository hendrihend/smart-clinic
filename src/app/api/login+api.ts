// app/api/login+api.ts

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validasi sederhana
    if (!email || !password) {
      return Response.json(
        { message: 'Email dan password wajib diisi' }, 
        { status: 400 }
      );
    }

    // Cek login admin
    if (email === 'admin@klinik.com') {
      return Response.json({
        status: 'success',
        role: 'admin',
        token: 'dummy-admin-token-123',
        user: { name: 'Administrator' }
      });
    }

    // Cek login pasien
    return Response.json({
      status: 'success',
      role: 'patient',
      token: 'dummy-patient-token-123',
      user: { name: 'Hendri Gunawan' }
    });

  } catch (error) {
    return Response.json({ message: 'Terjadi kesalahan server' }, { status: 500 });
  }
}
