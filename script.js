// ذاكرة مؤقتة بحالة النظام (State Management)
const state = {
    studentId: '',
    studentPhone: '',
    parentPhone: '',
    selectedTeacher: '',
    uploadedFile: null,
    gradesHistory: [
        { subject: 'فيزياء', teacher: 'مستر محمود صهيب', date: '2026-11-05', grade: '18 / 20', status: 'تم التصحيح' }
    ]
};

// عند تحميل الصفحة بالكامل
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initFileUpload();
    initGradingSystem();
    initWhatsAppIntegration();
    renderGradesTable();
});

// 1. التنقل الديناميكي بين التبويبات
function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const pages = document.querySelectorAll('.page');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetPage = btn.getAttribute('data-page');

            navButtons.forEach(b => b.classList.remove('active'));
            pages.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            document.getElementById(targetPage).classList.add('active');
        });
    });

    // زر الانتقال من الرئيسية لرفع الواجب
    document.getElementById('btn-to-upload').addEventListener('click', () => {
        saveStudentData();
        document.querySelector('[data-page="page-upload"]').click();
    });
}

// حفظ بيانات الطالب في الذاكرة
function saveStudentData() {
    state.studentId = document.getElementById('student-id').value.trim();
    state.studentPhone = document.getElementById('student-phone').value.trim();
    state.parentPhone = document.getElementById('parent-phone').value.trim();
    state.selectedTeacher = document.getElementById('teacher-select').value;
}

// 2. إدارة رفع الملفات
function initFileUpload() {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const fileLabel = document.getElementById('file-label');

    dropZone.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            state.uploadedFile = e.target.files[0];
            fileLabel.innerHTML = `✅ تم اختيار الملف: <strong>${state.uploadedFile.name}</strong>`;
        }
    });
}

// 3. نظام محاكاة تصحيح AI والتحريك
function initGradingSystem() {
    const btnStart = document.getElementById('btn-start-grading');
    const loader = document.getElementById('loader');
    const resultBox = document.getElementById('result-box');

    btnStart.addEventListener('click', () => {
        if (!state.uploadedFile) {
            alert('يرجى اختيار ملف الواجب أولاً!');
            return;
        }

        // إظهار انيميشن التحميل
        loader.style.display = 'block';
        resultBox.style.display = 'none';

        // محاكاة معالجة الـ AI بعد ثانيتين
        setTimeout(() => {
            loader.style.display = 'none';
            resultBox.style.display = 'block';

            // إضافة النتيجة لجدول الدرجات ديناميكياً
            const teacherName = state.selectedTeacher || 'مستر محمود صهيب';
            const today = new Date().toISOString().split('T')[0];
            
            state.gradesHistory.unshift({
                subject: teacherName.split('(')[1]?.replace(')', '') || 'واجب عام',
                teacher: teacherName.split('(')[0],
                date: today,
                grade: '19 / 20',
                status: 'تم التصحيح'
            });

            renderGradesTable();
        }, 2000);
    });
}

// 4. ربط إرسال الواتساب
function initWhatsAppIntegration() {
    document.getElementById('btn-wa-parent').addEventListener('click', () => sendWA(state.parentPhone || document.getElementById('par
