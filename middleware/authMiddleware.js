const User = require('../models/User'); // นำเข้าโมเดล User ที่สร้างขึ้นมา

module.exports = (req, res, next) => {
    User.findById(req.session.userID).then((user) => { // ค้นหา user ในฐานข้อมูลโดยใช้ userID ที่เก็บไว้ใน session
            if (!user) { // ถ้าไม่พบ user
                return res.redirect('/'); // เปลี่ยนเส้นทางไปยังหน้าแรก
            }
            console.log('User logged in successfully'); // แสดงข้อความเมื่อพบ user ที่เข้าสู่ระบบสำเร็จ
            next(); // ถ้าพบ user ให้เรียก next() เพื่อดำเนินการต่อไปยัง middleware ถัดไป
        }).catch((error) => {
            console.error('Error finding user:', error); // แสดงข้อผิดพลาดในกรณีที่เกิดปัญหาในการค้นหา user
        }
    );        
}