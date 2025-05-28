// ตรวจสอบว่า user มีการ login เข้ามาแล้วหรือไม่
module.exports = (req, res, next) => {
    if (req.session.userID) { // ถ้ามี userID ใน session แสดงว่าผู้ใช้ได้เข้าสู่ระบบแล้ว
        return res.redirect('/'); // เปลี่ยนเส้นทางไปยังหน้าแรก
    }
    next(); // ถ้าไม่มี userID ใน session ให้เรียก next() เพื่อดำเนินการต่อไปยัง middleware ถัดไป
}