const bcrypt = require('bcrypt'); // นำเข้าโมดูล bcrypt เพื่อใช้เข้ารหัสรหัสผ่าน
const User = require('../models/User'); // นำเข้าโมเดล User ที่สร้างขึ้นมา

module.exports = (req, res) => { // สร้างฟังก์ชันสำหรับจัดการการร้องขอที่หน้า login
    const { email, password } = req.body; // ดึงค่า email และ password จาก req.body

    User.findOne({ email: email }).then((user) => { // ค้นหาผู้ใช้ในฐานข้อมูลที่มีอีเมลตรงกับที่ส่งมา
        console.log(user); // แสดงข้อมูลผู้ใช้ที่ค้นพบในคอนโซล
        if (user) { 
            let cmp = bcrypt.compare(password, user.password).then((match) => { // เปรียบเทียบรหัสผ่านที่กรอกกับรหัสผ่านที่เข้ารหัสในฐานข้อมูล โดยเทียบจาก password จาก form กับ user.password ที่เก็บในฐานข้อมูล
                if (match) {
                    console.log('Login successfully!'); // แสดงข้อความเมื่อเข้าสู่ระบบสำเร็จ
                    req.session.userID = user._id; // เก็บข้อมูลผู้ใช้ใน session ซึ่งจะสร้าง userID และดึง user._id จากโมเดล User ที่ค้นพบ ซึ่งเป็น ID ของผู้ใช้ในฐานข้อมูล เช่น objectId ที่ไม่ซ้ำกัน
                    return res.redirect('/home'); // เปลี่ยนเส้นทางไปยังหน้าแรกหลังจากเข้าสู่ระบบสำเร็จ
                } else {
                    req.flash('validationErrors', ['Invalid email or password']); // ถ้ารหัสผ่านไม่ถูกต้อง ให้เก็บข้อความแสดงข้อผิดพลาด
                    return res.redirect('/login'); // เปลี่ยนเส้นทางกลับไปยังหน้า login
                }
            });
        } else {
            req.flash('validationErrors', ['Invalid email or password']); // ถ้าไม่พบผู้ใช้ ให้เก็บข้อความแสดงข้อผิดพลาด
            return res.redirect('/login'); // เปลี่ยนเส้นทางกลับไปยังหน้า login
        }
    }); // ค้นหาผู้ใช้ที่มีอีเมลตรงกับที่ส่งมา
}