class ResponseCode {
  constructor(code, message) {
    this.code = code;
    this.message = message;
  }

  // GLOBAL SUCCESS (200)
  static SUCCESS             = new ResponseCode('APP-20001', 'Success');
  
  // GLOBAL CLIENT ERRORS (400)
  static VALIDATION_ERROR    = new ResponseCode('APP-40001', 'Harap periksa kembali data yang Anda masukkan');
  
  // GLOBAL UNAUTHORIZED (401)
  static UNAUTHORIZED        = new ResponseCode('APP-40101', 'Anda tidak memiliki izin');
  static TOKEN_INVALID       = new ResponseCode('APP-40102', 'Token tidak valid atau sudah kadaluarsa');
  static TOKEN_USER_DELETED  = new ResponseCode('APP-40103', 'Pengguna untuk token ini sudah tidak ada');
  
  // GLOBAL FORBIDDEN (403)
  static FORBIDDEN           = new ResponseCode('APP-40301', 'Akses ditolak');

  // GLOBAL NOT FOUND (404)
  static NOT_FOUND_ENDPOINT  = new ResponseCode('APP-40401', 'Endpoint tidak ditemukan');

  // GLOBAL SERVER ERRORS (500)
  static INTERNAL_SERVER_ERROR = new ResponseCode('APP-50001', 'Terjadi kesalahan internal pada server');

  // AUTH MODULE
  static REGISTER_SUCCESS    = new ResponseCode('APP-20101', 'Registrasi berhasil');
  static LOGIN_SUCCESS       = new ResponseCode('APP-20002', 'Login berhasil');
  static PROFILE_RETRIEVED   = new ResponseCode('APP-20003', 'Profil berhasil diambil');
  static EMAIL_IN_USE        = new ResponseCode('APP-40002', 'Email sudah terdaftar');
  static INVALID_CREDENTIALS = new ResponseCode('APP-40104', 'Email atau Password salah');

  // USER MODULE
  static USERS_RETRIEVED     = new ResponseCode('APP-20004', 'Daftar pengguna berhasil diambil');
  static USER_RETRIEVED      = new ResponseCode('APP-20005', 'Data pengguna berhasil diambil');
  static USER_NOT_FOUND      = new ResponseCode('APP-40402', 'Pengguna tidak ditemukan');

  // BOOKING MODULE
  static BOOKING_CREATED         = new ResponseCode('APP-20102', 'Pemesanan berhasil dibuat');
  static MY_BOOKINGS_RETRIEVED   = new ResponseCode('APP-20006', 'Daftar pemesanan saya berhasil diambil');
  static ALL_BOOKINGS_RETRIEVED  = new ResponseCode('APP-20007', 'Seluruh daftar pemesanan berhasil diambil');
  static BOOKING_RETRIEVED       = new ResponseCode('APP-20008', 'Data pemesanan berhasil diambil');
  static BOOKING_APPROVED        = new ResponseCode('APP-20009', 'Pemesanan disetujui');
  static BOOKING_REJECTED        = new ResponseCode('APP-20010', 'Pemesanan ditolak');
  static BOOKING_NOT_FOUND       = new ResponseCode('APP-40403', 'Pemesanan tidak ditemukan');
  static NO_PERMISSION_BOOKING   = new ResponseCode('APP-40302', 'Anda tidak memiliki hak akses untuk pemesanan ini');
  static CONFLICT_BOOKING        = new ResponseCode('APP-40901', 'Jadwal lapangan bentrok dengan pemesanan lain');
  static CONFLICT_APPROVE        = new ResponseCode('APP-40902', 'Status pemesanan sudah tidak dapat diubah');
  static END_TIME_ERROR          = new ResponseCode('APP-40003', 'Waktu selesai harus lebih besar dari waktu mulai');

  // FIELD MODULE
  static FIELDS_RETRIEVED    = new ResponseCode('APP-20011', 'Daftar lapangan berhasil diambil');
  static FIELD_RETRIEVED     = new ResponseCode('APP-20012', 'Data lapangan berhasil diambil');
  static FIELD_CREATED       = new ResponseCode('APP-20103', 'Lapangan berhasil ditambahkan');
  static FIELD_UPDATED       = new ResponseCode('APP-20013', 'Lapangan berhasil diupdate');
  static FIELD_DELETED       = new ResponseCode('APP-20014', 'Lapangan berhasil dihapus');
  static FIELD_NOT_FOUND     = new ResponseCode('APP-40404', 'Lapangan tidak ditemukan');
  static FIELD_NOT_ACTIVE    = new ResponseCode('APP-40004', 'Lapangan sedang tidak aktif');

  // PAYMENT MODULE
  static PAYMENT_SUBMITTED   = new ResponseCode('APP-20104', 'Pembayaran berhasil disubmit');
  static PAYMENTS_RETRIEVED  = new ResponseCode('APP-20015', 'Daftar pembayaran berhasil diambil');
  static PAYMENT_VERIFIED    = new ResponseCode('APP-20016', 'Pembayaran berhasil diverifikasi');
  static PAYMENT_REJECTED    = new ResponseCode('APP-20017', 'Pembayaran ditolak');
  static PAYMENT_NOT_FOUND   = new ResponseCode('APP-40405', 'Pembayaran tidak ditemukan');
  static PAY_OWN_BOOKING     = new ResponseCode('APP-40303', 'Anda tidak dapat memverifikasi pembayaran Anda sendiri');
  static PAYMENT_EXISTS      = new ResponseCode('APP-40005', 'Pembayaran untuk pemesanan ini sudah ada');
}

module.exports = {
  ResponseCode
};
