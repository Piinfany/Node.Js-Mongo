// controller สำหรับการรับข้อมูลมา หลังจากที่เรารับค่าจาก form มาก็จะเอาไปลงในฐานข้อมูล
const User = require('../models/User'); // นำเข้าโมเดล User ที่สร้างขึ้นมา

module.exports = (req, res) => { 
    User.create(req.body).then(() => {
        console.log('User register successfully!'); // แสดงข้อความเมื่อสร้างผู้ใช้สำเร็จ
        res.redirect('/login'); // เปลี่ยนเส้นทางไปยังหน้า login หลังจากลงทะเบียนสำเร็จ
        // ใช้โมเดล User เพื่อสร้างผู้ใช้ใหม่จากข้อมูลที่ส่งมาจากฟอร์ม โดยเมื่อกด register ค่า email และ password จะถูกส่งมาใน req.body
    }).catch(error => {
        // console.error(err.errors); // แสดงข้อผิดพลาดในกรณีที่เกิดปัญหาในการสร้างผู้ใช้ โดยที่ err.errors จะเก็บข้อมูลข้อผิดพลาดที่เกิดขึ้น
        // แสดงข้อความแสดงข้อผิดพลาดในหน้า register
        if (error) {
            const validationErrors = Object.keys(error.errors).map(key => error.errors[key].message); // แปลงข้อผิดพลาดเป็นข้อความที่อ่านได้
            req.flash('validationErrors', validationErrors); // ใช้ req.flash เพื่อเก็บข้อความแสดงข้อผิดพลาด
            req.flash('data', req.body); // เก็บข้อมูลที่กรอกในฟอร์มเพื่อแสดงในหน้า register
            return res.redirect('/register'); // เปลี่ยนเส้นทางกลับไปยังหน้า register พร้อมกับแสดงข้อผิดพลาด
        }
    });
}