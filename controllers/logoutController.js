module.exports = (req, res) => { // สร้างฟังก์ชันสำหรับจัดการการร้องขอที่หน้า logout
    req.session.destroy(() => { // ทำลาย session ของผู้ใช้
        console.log('Logout successfully!'); // แสดงข้อความเมื่อออกจากระบบสำเร็จ
        res.redirect('/'); // เปลี่ยนเส้นทางไปยังหน้า login หลังจากออกจากระบบสำเร็จ
    });
}