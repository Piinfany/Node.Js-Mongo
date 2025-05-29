module.exports = (req, res) => { // สร้างฟังก์ชันสำหรับจัดการการร้องขอที่หน้า register

    let email = ""
    let password = ""
    let data = req.flash('data')[0] || {}; // ดึงข้อมูลที่เก็บไว้ใน session และใช้ค่าเริ่มต้นเป็นว่างเปล่า
    if (typeof data != "undefined") { // ถ้าชนิดของ data ไม่ใช่ undefined หรือ ข้อมูลมีอยู่
        email = data.email || ""; // ถ้ามีข้อมูล email ให้ใช้ ถ้าไม่มีกำหนดเป็นว่างเปล่า
        password = data.password || ""; // ถ้ามีข้อมูล password ให้ใช้ ถ้าไม่มีกำหนดเป็นว่างเปล่า
    }
    // Render หน้า register.ejs
    res.render('register', {
        errors: req.flash('validationErrors'), // ดึงข้อผิดพลาดที่เก็บไว้ใน session และส่งไปยัง view
        email: email, // ส่งค่า email ไปยัง view
        password: password // ส่งค่า password ไปยัง view
    }
    )
}