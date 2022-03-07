1. Re-entrancy kontrak terjadi ketika kontrak memanggil kontrak (eksternal) lain yang kembali memanggil kontrak panggilan. Re-entrancy yang berbahaya terjadi ketika kontrak dimasukkan kembali secara tidak terduga dan kontrak beroperasi pada keadaan internal yang tidak konsisten. Misalnya, Gambar 1 menunjukkan versi kontrak yang disederhanakan (terinspirasi oleh [10]), yang disebut Korban, yang menderita kerentanan masuk kembali. Korban melacak jumlah (a) dan menampilkan fungsi penarikan yang memungkinkan kontrak lain untuk menarik Ether (c). Fungsi penarikan harus melakukan tiga langkah: memeriksa apakah kontrak panggilan diizinkan untuk menarik jumlah Ether yang diminta, misalnya, memeriksa apakah A≤C, A mengirim jumlah Eter ke kontrak panggilan dan A memperbarui keadaan internal untuk mencerminkan jumlah baru, misalnya C − A. Perhatikan bahwa langkah dilakukan sebelum status diperbarui di A. Oleh karena itu, kontrak berbahaya, dapat masuk kembali ke kontrak dan penarikan panggilan berdasarkan kondisi dan jumlah yang sama seperti untuk permintaan pertama. Dengan demikian, penyerang dapat berulang kali masuk kembali ke Korban untuk mentransfer sejumlah besar Eter sampai Korban kehabisan Eter. Versi aman dari contoh sederhana kami memerlukan pertukaran baris 3 dan 4 untuk memastikan bahwa permintaan kedua dari Korban beroperasi pada keadaan yang konsisten dengan jumlah yang diperbarui.

2. Untuk Concat, saya berhasil membuat 2 function, yaitu no 1 dan no 2, untuk no 3, terdapat error pada bagian concat.

3 dan 4.  
Untuk Smart Contract, saya membuat sebuah token dinamakan TokenA, mempunyai fitur issuance, transfer dan redemption. 
Fitur Issuance digunakan untuk mint TokenA di alamat yang diinginkan.
Fitur Transfer digunakan untuk mengirim TokenA ke alamat yang diinginkan.
Fitur Redemption digunakan untuk menghancurkan TokenA di alamat yang diinginkan.
Saya mencoba run smart contract di dalam Rinkenby testnet dan sukses dijalankan. Bukti TX Hash dapat dilihat di:
Smart-Contract Token : 0x7eaa2be0297057cda6568240ea30f162b82555e67088b449f8e76a9d54e579d0
Smart-Contract dapps : 0x793b7dd7f44371cff458b6b448d637a9a344120809ab53987201a0efcf9cc159

Dikarenakan UI di remix IDE sulit digunakan, saya membuat sebuah sistem yang mencakup pertanyaan no 2-4. Sistem menggunakan Ganache, Truffle, Metamask, dan Web3. 
Codingan di github dapat diakses dengan cara :
1.Install depedencies yang dibutuhkan.
2.Run Ganache.
3.truffle compile.
4.truffle migrate.
5.cd cbdc-app
6.npm start
7.Import akun ganache kedalam Metamask.