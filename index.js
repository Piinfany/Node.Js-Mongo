const express = require('express'); // นำเข้าโมดูล express >> เพื่อใช้สร้างแอปพลิเคชันเว็บ
const app = express(); // เรียกใช้งาน express เพื่อสร้างแอปพลิเคชัน 

const ejs = require('ejs'); // นำเข้าโมดูล ejs >> เพื่อใช้เป็น template engine หมายถึงการสร้าง HTML จากเทมเพลต
const mongoose = require('mongoose'); // นำเข้าโมดูล mongoose >> เพื่อใช้เชื่อมต่อกับ MongoDB
const expressSession = require('express-session'); // นำเข้าโมดูล express-session >> เพื่อใช้จัดการ session หมายถึงการเก็บข้อมูลผู้ใช้ที่ล็อกอินอยู่
const flash = require('connect-flash'); // นำเข้าโมดูล connect-flash >> เพื่อใช้แสดงข้อความแจ้งเตือนชั่วคราว เช่น ข้อความ error


// เชื่อมต่อกับ MongoDB
mongoose.connect('mongodb+srv://admin:1234@cluster0.iu2beqk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true, // ใช้ URL parser ใหม่ของ mongoose ตัวที่ใช้ "แปลงข้อความ → โครงสร้างข้อมูล" เพื่อให้ระบบเข้าใจและใช้งานได้ต่อ
});

// ประกาศว่า function นี้ สามารถใช้ทั้งในและนอก function ของตัวมันเอง
// กำหนดตัวแปร global.loggedIn เป็น null เพื่อใช้ตรวจสอบสถานะการล็อกอินของผู้ใช้
global.loggedIn = null;

// Controllers
const indexController = require('./controllers/indexController'); // นำเข้าโมดูล indexController >> เพื่อใช้จัดการการแสดงผลหน้าแรกของแอปพลิเคชัน
const loginController = require('./controllers/loginController'); // นำเข้าโมดูล loginController >> เพื่อใช้จัดการการล็อกอินของผู้ใช้
const registerController = require('./controllers/registerController'); // นำเข้าโมดูล registerController >> เพื่อใช้จัดการการลงทะเบียนของผู้ใช้ ซ่ึ่งเป็นกระบวนการแสดงฟอร์มลงทะเบียนและรับข้อมูลผู้ใช้ที่กรอกมา
const storeUserController = require('./controllers/storeUserController'); // นำเข้าโมดูล storeController >> เพื่อใช้จัดการการรับข้อมูลผู้ใช้ที่ลงทะเบียน ซึ่งเป็นกระบวนการบันทึกข้อมูลผู้ใช้ลงในฐานข้อมูล
const loginUserController = require('./controllers/loginUserController'); // นำเข้าโมดูล loginUserController >> เพื่อใช้จัดการการล็อกอินของผู้ใช้ ซึ่งเป็นกระบวนการตรวจสอบข้อมูลผู้ใช้ที่กรอกมาและเข้าสู่ระบบ
const logoutController = require('./controllers/logoutController'); // นำเข้าโมดูล logoutController >> เพื่อใช้จัดการการออกจากระบบของผู้ใช้
const homeController = require('./controllers/homeController'); // นำเข้าโมดูล homeController >> เพื่อใช้จัดการการแสดงผลหน้าแรกของแอปพลิเคชันหลังจากล็อกอินสำเร็จ

// กำหนดค่า middleware สำหรับ express
const redirectlfAuth = require('./middleware/redirectlfAuth'); // นำเข้าโมดูล redirectAuth >> เพื่อใช้ตรวจสอบสถานะการล็อกอินของผู้ใช้ก่อนเข้าถึงบางเส้นทาง
const authMiddleware = require('./middleware/authMiddleware'); // นำเข้าโมดูล authMiddleware >> เพื่อใช้ตรวจสอบสถานะการล็อกอินของผู้ใช้ก่อนเข้าถึงบางเส้นทาง

app.use(express.static('public')); // กำหนดให้ express ใช้โฟลเดอร์ public เป็นที่เก็บไฟล์สถิติ เช่น CSS, JavaScript, รูปภาพ โดยใช้ method static ของ express
app.use(express.json()); // กำหนดให้ express ใช้ JSON เป็นรูปแบบข้อมูลที่รับส่งระหว่าง client และ server โดยใช้ method json ของ express
app.use(express.urlencoded()); // กำหนดให้ express ใช้ URL-encoded เป็นรูปแบบข้อมูลที่รับส่งระหว่าง client และ server โดยใช้ method urlencoded ของ express
app.use(flash()); // กำหนดให้ express ใช้ connect-flash เพื่อแสดงข้อความแจ้งเตือนชั่วคราว
app.use(expressSession({ // กำหนดให้ express ใช้ express-session เพื่อจัดการ session ของผู้ใช้
    secret: "node secret" // เป็น คีย์ลับ สำหรับ “เซ็น” session cookie (ป้องกันการถูกแก้ไขจากฝั่ง client)
})); 
app.use('/', (req, res, next) => { // กำหนด middleware ที่จะทำงานก่อนทุกเส้นทาง
    loggedIn = req.session.userID; // เก็บ userID จาก session ลงในตัวแปร global.loggedIn ซึ่งจะใช้ในการตรวจสอบสถานะการล็อกอินของผู้ใช้
    next(); // เรียกใช้ next() เพื่อดำเนินการต่อไปยัง middleware ถัดไป
}); // ใช้ middleware เพื่อเก็บ userID จาก session ลงในตัวแปร global.loggedIn ซึ่งจะใช้ในการตรวจสอบสถานะการล็อกอินของผู้ใช้
app.set('view engine', 'ejs'); // แอปนี้จะใช้ ejs (Embedded JavaScript) เป็น template engine ในการเรนเดอร์หน้าเว็บ

app.get('/', indexController); // กำหนดให้ express ใช้ indexController เพื่อจัดการการแสดงผลหน้าแรกของแอปพลิเคชัน โดยใช้ method get ของ express
app.get('/home', authMiddleware, homeController); // กำหนดให้ express ใช้ homeController เพื่อจัดการการแสดงผลหน้าแรกของแอปพลิเคชันหลังจากล็อกอินสำเร็จ โดยใช้ method get ของ express
app.get('/login', redirectlfAuth, loginController); // กำหนดให้ express ใช้ loginController เพื่อจัดการการล็อกอินของผู้ใช้ โดยใช้ method get ของ express
app.get('/register', redirectlfAuth, registerController); // กำหนดให้ express ใช้ registerController เพื่อจัดการการลงทะเบียนของผู้ใช้ โดยใช้ method get ของ express
app.post('/user/register', redirectlfAuth, storeUserController); // กำหนดให้ express ใช้ storeController เพื่อจัดการการรับข้อมูลผู้ใช้ที่ลงทะเบียน โดยใช้ method post ของ express
app.post('/user/login', redirectlfAuth, loginUserController); // กำหนดให้ express ใช้ loginUserController เพื่อจัดการการล็อกอินของผู้ใช้ โดยใช้ method post ของ express
app.get('/logout', logoutController); // กำหนดให้ express ใช้ logoutController เพื่อจัดการการออกจากระบบของผู้ใช้ โดยใช้ method get ของ express

app.listen(3000, () => { // เริ่มต้นเซิร์ฟเวอร์ที่พอร์ต 3000 และแสดงข้อความเมื่อเซิร์ฟเวอร์เริ่มทำงาน
  console.log('Server is running on http://localhost:3000'); // แสดงข้อความว่าเซิร์ฟเวอร์กำลังทำงานที่ URL นี้
});

// npm run start หรือ node index.js เพื่อรันแอปพลิเคชัน