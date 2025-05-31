const User = require('../models/User'); // นำเข้าโมเดล User

module.exports = async (req, res) => { // สร้างฟังก์ชันสำหรับจัดการการร้องขอที่หน้า home
    let UserData = await User.findById(req.session.userID); // ค้นหา user ในฐานข้อมูลโดยใช้ userID ที่เก็บไว้ใน session
    res.render('home', {
        UserData
    })
}