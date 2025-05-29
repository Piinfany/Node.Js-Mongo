// check form ว่า user ต้องกรอกข้อมูลอะไรบ้าง

const mongoose = require('mongoose'); // นำเข้าโมดูล mongoose เพื่อใช้เชื่อมต่อกับ MongoDB
const Schema = mongoose.Schema; // นำเข้า Schema จาก mongoose เพื่อใช้สร้าง schema ของโมเดล
const bcrypt = require('bcrypt'); // นำเข้าโมดูล bcrypt เพื่อใช้เข้ารหัสรหัสผ่าน

// สร้าง schema สำหรับโมเดล User
const UserSchema = new Schema ({ // ชื่อ schema คือ User
    // กำหนด fields ของโมเดล User
    email: {
        type: String, // กำหนดประเภทข้อมูลเป็น String
        required: [true, 'Please provide email!!'] // กำหนดให้ field นี้เป็น required หมายถึงต้องกรอกข้อมูล และระบุข้อความแสดงข้อผิดพลาดเมื่อไม่กรอก
    },
    password: {
        type: String, // กำหนดประเภทข้อมูลเป็น String
        required: [true, 'Please provide password!!'] // กำหนดให้ field นี้เป็น required หมายถึงต้องกรอกข้อมูล และระบุข้อความแสดงข้อผิดพลาดเมื่อไม่กรอก
    }
})

UserSchema.pre('save', function(next) {
    // ใช้ bcrypt เข้ารหัสรหัสผ่านก่อนบันทึกข้อมูลลงฐานข้อมูล
    const user = this; // กำหนดตัวแปร user เป็น this เพื่อเข้าถึงโมเดลปัจจุบัน
    if (!user.isModified('password')) return next(); // ถ้ารหัสผ่านไม่ถูกแก้ไข ให้ข้ามไปยัง middleware ถัดไป 
    // ถ้ารหัสผ่าน ไม่ได้ถูกเปลี่ยนแปลง (เช่น บันทึกข้อมูลใหม่ แต่รหัสผ่านเดิม) → ข้ามการเข้ารหัส
    // ป้องกันการเข้ารหัสรหัสผ่านซ้ำทุกครั้งที่ save() ซึ่งจะทำให้รหัสผ่านใช้ไม่ได้

    // เข้ารหัสรหัสผ่านด้วย bcrypt โดย hashing รหัสผ่านด้วยรอบการเข้ารหัส 10 รอบ
    bcrypt.hash(user.password, 10).then(hash => { // 10 คือจำนวนรอบในการเข้ารหัส 
        user.password = hash; // กำหนดรหัสผ่านที่เข้ารหัสแล้วให้กับ user ถ้าได้รหัสใหม่มา จะนำไปแทนที่ user.password ตัวเดิม
        next(); // เรียกใช้ next() เพื่อดำเนินการต่อไปยัง middleware ถัดไป
    }).catch(err => { // จัดการข้อผิดพลาดในการเข้ารหัสรหัสผ่าน
        console.error(err); // แสดงข้อผิดพลาดในกรณีที่เกิดปัญหาในการเข้ารหัสรหัสผ่าน
    })
})

// สร้างโมเดล User โดยใช้ schema ที่สร้างขึ้น
const User = mongoose.model('User', UserSchema); // สร้างโมเดล User โดยใช้ schema UserSchema
module.exports = User; // ส่งออกโมเดล User เพื่อให้สามารถนำไปใช้ในไฟล์อื่น ๆ ได้

// โมเดลนี้จะใช้สำหรับจัดการข้อมูลผู้ใช้ในฐานข้อมูล MongoDB โดยมีฟิลด์ email และ password ที่ต้องกรอก
// และมีการเข้ารหัสรหัสผ่านก่อนบันทึกข้อมูลลงฐานข้อมูล
// นอกจากนี้ยังมีการตรวจสอบว่ารหัสผ่านถูกแก้ไขหรือไม่ก่อนที่จะเข้ารหัส

